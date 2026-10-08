"use client";

import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, SkipForward, Volume2, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { COMIC_FRAME_DURATION_MS, type ComicFrame, type VideoLesson } from "@/lib/video-lessons";

type Lang = "ru" | "kk";

function ComicPanel({ frame, poster, lang, running, onComplete }: {
  frame: ComicFrame;
  poster: string;
  lang: Lang;
  running: boolean;
  onComplete: () => void;
}) {
  const clipId = useId();
  const remaining = useRef(COMIC_FRAME_DURATION_MS);
  const [x, y, width, height] = frame.bounds;

  useEffect(() => {
    if (!running) return;
    const startedAt = performance.now();
    const timer = window.setTimeout(onComplete, remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt));
    };
  }, [running, onComplete]);

  return <>
    <svg className="comic-frame" viewBox={frame.bounds.join(" ")} role="img" aria-label={frame.description[lang]}>
      <defs><clipPath id={clipId}><rect x={x} y={y} width={width} height={height} /></clipPath></defs>
      <image href={poster} width="1280" height="720" clipPath={`url(#${clipId})`} />
    </svg>
    <div className="comic-timer" aria-hidden="true"><span style={{ animationDuration: `${COMIC_FRAME_DURATION_MS}ms`, animationPlayState: running ? "running" : "paused" }} /></div>
  </>;
}

export function VideoModal({ video, lang, onClose }: { video: VideoLesson; lang: Lang; onClose: () => void }) {
  const [phase, setPhase] = useState<"intro" | "video">("intro");
  const [frameIndex, setFrameIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => typeof document === "undefined" || !document.hidden);
  const [imageStatus, setImageStatus] = useState<"loading" | "ready" | "error">("loading");
  const [needsPlay, setNeedsPlay] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [playAttempt, setPlayAttempt] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef(onClose);
  const titleId = useId();
  const ru = lang === "ru";
  const frame = video.frames[frameIndex];

  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], video[controls]');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      document.body.style.overflow = oldOverflow;
      trigger?.focus();
    };
  }, []);

  const startVideo = useCallback(() => setPhase("video"), []);
  const advance = useCallback(() => {
    if (frameIndex === video.frames.length - 1) startVideo();
    else setFrameIndex(frameIndex + 1);
  }, [frameIndex, startVideo, video.frames.length]);

  useEffect(() => {
    if (phase !== "video") return;
    const player = videoRef.current;
    if (!player) return;
    let cancelled = false;
    // Mobile browsers may block sound after the slideshow's delayed transition.
    // Fall back to muted playback, with an explicit sound button in the player.
    void player.play().catch(async (error: unknown) => {
      if (cancelled || player.error) return;
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        player.muted = true;
        setMuted(true);
        try { await player.play(); }
        catch { if (!cancelled) setNeedsPlay(true); }
      } else {
        setNeedsPlay(true);
      }
    });
    return () => { cancelled = true; player.pause(); };
  }, [phase, playAttempt]);

  function playWithSound() {
    const player = videoRef.current;
    if (!player) return;
    player.muted = false;
    setMuted(false);
    void player.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true));
  }

  return <div className="modal-backdrop video-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={dialogRef} className={`video-modal story-modal ${phase === "intro" ? "is-intro" : "is-video"}`} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}>
      <header className="story-header">
        <div><span className="story-eyebrow">{phase === "intro" ? (ru ? "История в кадрах" : "Кадрлардағы оқиға") : (ru ? "Видеоурок" : "Бейнесабақ")}</span><h2 id={titleId}>{video.title}</h2></div>
        <button className="story-icon-button" onClick={onClose} aria-label={ru ? "Закрыть видео" : "Бейнені жабу"}><X size={22} /></button>
      </header>

      {phase === "intro" ? <>
        {/* The original image is displayed through a clipped SVG viewport, preserving every speech bubble. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img hidden src={video.thumbnail} alt="" onLoad={() => setImageStatus("ready")} onError={() => setImageStatus("error")} />
        <div className="comic-stage" aria-busy={imageStatus === "loading"}>
          {imageStatus === "ready" && <ComicPanel key={frameIndex} frame={frame} poster={video.thumbnail} lang={lang} running={!paused && pageVisible} onComplete={advance} />}
          {imageStatus !== "ready" && <p className="comic-loading" role="status">{imageStatus === "error" ? (ru ? "Не удалось загрузить комикс. Можно перейти к видео." : "Комикс жүктелмеді. Бейнеге өтуге болады.") : (ru ? "Загружаем историю…" : "Оқиға жүктеліп жатыр…")}</p>}
        </div>
        <div className="comic-caption"><span aria-live="polite">Кадр {frameIndex + 1} / {video.frames.length}</span><span>{ru ? "Затем начнётся видео" : "Содан кейін бейне басталады"}</span></div>
        <nav className="comic-steps" aria-label={ru ? "Кадры комикса" : "Комикс кадрлары"}>
          {video.frames.map((_, index) => <button key={index} className={index <= frameIndex ? "visited" : ""} aria-current={index === frameIndex ? "step" : undefined} aria-label={`${ru ? "Перейти к кадру" : "Кадрға өту"} ${index + 1}`} onClick={() => setFrameIndex(index)}><span /></button>)}
        </nav>
        <div className="comic-controls">
          <div className="comic-navigation">
            <button className="story-icon-button" disabled={frameIndex === 0} onClick={() => setFrameIndex(frameIndex - 1)} aria-label={ru ? "Предыдущий кадр" : "Алдыңғы кадр"}><ChevronLeft size={22} /></button>
            <button className="story-pause" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={18} /> : <Pause size={18} />}{paused ? (ru ? "Продолжить" : "Жалғастыру") : (ru ? "Пауза" : "Кідірту")}</button>
            <button className="story-icon-button" onClick={advance} aria-label={frameIndex === video.frames.length - 1 ? (ru ? "Начать видео" : "Бейнені бастау") : (ru ? "Следующий кадр" : "Келесі кадр")}><ChevronRight size={22} /></button>
          </div>
          <button className="story-skip" onClick={startVideo}>{ru ? "Пропустить интро" : "Кіріспені өткізу"}<SkipForward size={17} /></button>
        </div>
      </> : <>
        <div className="video-frame story-video-frame">
          <video key={playAttempt} ref={videoRef} src={video.src} poster={video.thumbnail} title={video.title} controls playsInline preload="metadata" onPlay={() => setNeedsPlay(false)} onVolumeChange={(event) => setMuted(event.currentTarget.muted)} onError={() => setVideoError(true)}>
            <track kind="captions" src={video.captions} srcLang="kk" label="Қазақша" default />
          </video>
          {needsPlay && !videoError && <button className="story-play-overlay" onClick={playWithSound}><Play size={30} fill="currentColor" />{ru ? "Включить видео" : "Бейнені қосу"}</button>}
        </div>
        {videoError ? <div className="story-video-error" role="alert"><p>{ru ? "Не удалось загрузить видео. Проверьте подключение и попробуйте ещё раз." : "Бейне жүктелмеді. Интернет байланысын тексеріп, қайталап көріңіз."}</p><button className="story-pause" onClick={() => { setVideoError(false); setNeedsPlay(false); setMuted(false); setPlayAttempt((value) => value + 1); }}>{ru ? "Повторить" : "Қайталау"}</button><a href={video.src} target="_blank" rel="noreferrer">{ru ? "Открыть отдельно" : "Бөлек ашу"}</a></div> : <div className="story-video-actions">
          <button className="story-pause" onClick={() => { setFrameIndex(0); setPaused(false); setPhase("intro"); setNeedsPlay(false); setMuted(false); }}><RotateCcw size={17} />{ru ? "Комикс сначала" : "Комиксті басынан көру"}</button>
          {muted && <button className="story-skip" onClick={playWithSound}><Volume2 size={18} />{ru ? "Включить звук" : "Дыбысты қосу"}</button>}
        </div>}
      </>}
    </div>
  </div>;
}
