"use client";
/* eslint-disable @next/next/no-img-element */

import {
  ArrowRight,
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  Check,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  CalendarDays,
  FileCheck2,
  FileWarning,
  GraduationCap,
  HeartHandshake,
  Languages,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  PieChart,
  Moon,
  Play,
  Plus,
  Search,
  Send,
  Shield,
  ShieldCheck,
  School,
  Settings,
  Sparkles,
  Sun,
  UserRound,
  UserCog,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Lang = "kk" | "ru";
type Theme = "light" | "dark";
type Role = "student" | "teacher" | "psychologist" | "admin" | "site_admin";
type Section = "home" | "chat" | "lessons" | "test" | "library" | "progress" | "classes" | "observations" | "students" | "reports" | "cases" | "meetings" | "analytics" | "users" | "settings" | "accounts" | "support";
type Account = { id?: string; login: string; password?: string; role: Role; name: string; initials: string; meta: { ru: string; kk: string }; classNumber?: string; classLetter?: string };
declare global { interface Window { puter?: { ai: { chat: (messages: { role: string; content: string }[], options?: { model?: string }) => Promise<unknown> } }; } }

const demoAccounts: Account[] = [
  { login: "student", password: "Student123!", role: "student", name: "Аян Серік", initials: "АС", meta: { ru: "7 «А» класс", kk: "7 «А» сынып" } },
  { login: "teacher", password: "Teacher123!", role: "teacher", name: "Данияр Қасымов", initials: "ДҚ", meta: { ru: "Классный руководитель · 7 «А»", kk: "Сынып жетекшісі · 7 «А»" } },
  { login: "psychologist", password: "Psycho123!", role: "psychologist", name: "Айгүл Омарова", initials: "АО", meta: { ru: "Школьный психолог", kk: "Мектеп психологы" } },
  { login: "admin", password: "Admin123!", role: "admin", name: "Гүлмира Әлиева", initials: "ГӘ", meta: { ru: "Администратор школы · завуч", kk: "Мектеп әкімшісі · директор орынбасары" } },
  { login: "bolatbekovameruert@gmail.com", password: "Meruert2026!", role: "site_admin", name: "Меруерт Болатбекова", initials: "МБ", meta: { ru: "Учитель · администратор сайта", kk: "Мұғалім · сайт әкімшісі" } },
];

const ACCOUNTS_STORAGE_KEY = "qorgau-created-accounts-v1";
const LEGACY_ACCOUNTS_STORAGE_KEY = "qorgau-created-accounts";
const THEME_STORAGE_KEY = "ss-theme";
const LANG_STORAGE_KEY = "ss-lang";
const accountRoles: Role[] = ["student", "teacher", "psychologist", "admin", "site_admin"];

function readStoredAccounts(): Account[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY) ?? localStorage.getItem(LEGACY_ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const records: unknown = JSON.parse(raw);
    if (!Array.isArray(records)) return [];

    return records.flatMap((record): Account[] => {
      if (!record || typeof record !== "object") return [];
      const value = record as Partial<Account>;
      if (
        typeof value.login !== "string" ||
        typeof value.password !== "string" ||
        typeof value.name !== "string" ||
        !value.role ||
        !accountRoles.includes(value.role)
      ) return [];

      const initials = typeof value.initials === "string" && value.initials
        ? value.initials
        : value.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
      const fallbackMeta = value.role === "student"
        ? { ru: "Ученик", kk: "Оқушы" }
        : { ru: roleLabel(value.role, "ru"), kk: roleLabel(value.role, "kk") };
      const meta = value.meta && typeof value.meta.ru === "string" && typeof value.meta.kk === "string"
        ? value.meta
        : fallbackMeta;

      return [{
        id: typeof value.id === "string" ? value.id : crypto.randomUUID(),
        login: value.login.trim().toLowerCase(),
        password: value.password,
        role: value.role,
        name: value.name,
        initials,
        meta,
        classNumber: typeof value.classNumber === "string" ? value.classNumber : undefined,
        classLetter: typeof value.classLetter === "string" ? value.classLetter : undefined,
      }];
    });
  } catch {
    return [];
  }
}

function persistAccounts(accounts: Account[]) {
  const serialized = JSON.stringify(accounts);
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, serialized);
  localStorage.setItem(LEGACY_ACCOUNTS_STORAGE_KEY, serialized);
}

const copy = {
  kk: {
    nav: ["Жоба туралы", "Мүмкіндіктер", "Материалдар", "Қалай жұмыс істейді"],
    login: "Кабинетке кіру",
    eyebrow: "Мектептегі қауіпсіздік — ортақ міндет",
    hero: "Әр оқушы өзін қауіпсіз сезінуге лайық",
    heroText:
      "Qorgau AI — буллингтің алдын алуға, көмек сұрауға және мектеп қауымдастығында сенімді орта құруға арналған цифрлық кеңістік.",
    start: "Көмек алуды бастау",
    explore: "Жобамен танысу",
    trust: "Құпия әрі қауіпсіз",
    human: "Шешімді маман қабылдайды",
    grades: "1–11 сыныптарға арналған",
    problemEyebrow: "Неге Qorgau AI?",
    problemTitle: "Үндемей қалмауға көмектесетін жүйе",
    problemText:
      "Буллинг көбіне бір оқиғадан емес, қайталанатын қысымнан басталады. Біз оқушыға белгі беруді жеңілдетіп, мектеп мамандарына ертерек әрекет етуге көмектесеміз.",
    featuresTitle: "Қауіпсіздікке қажет құралдар — бір жерде",
    howTitle: "Қолдау жолы қарапайым",
    resourcesTitle: "Білім қорқынышты азайтады",
    ctaTitle: "Қауіпсіз мектепті бірге құрайық",
    ctaText: "Көмек сұрау — әлсіздік емес. Бұл өзіңе және өзгеге қамқорлық жасаудың батыл қадамы.",
    footer: "Оқушыны тыңдайтын цифрлық орта.",
    modalTitle: "Кабинетке кіру",
    modalText: "Жеке кабинетіңізге кіру үшін деректерді енгізіңіз.",
    username: "Логин",
    password: "Құпиясөз",
    remember: "Мені есте сақтау",
    enter: "Кіру",
    error: "Логин мен құпиясөзді толтырыңыз.",
    welcome: "Қайырлы күн, Аян!",
    welcomeText: "Бүгін өзің үшін пайдалы бір қадам жаса.",
  },
  ru: {
    nav: ["О проекте", "Возможности", "Материалы", "Как это работает"],
    login: "Войти в кабинет",
    eyebrow: "Безопасность в школе — общая задача",
    hero: "Каждый ученик достоин чувствовать себя в безопасности",
    heroText:
      "Qorgau AI — цифровое пространство для профилактики буллинга, безопасного обращения за помощью и создания доверительной школьной среды.",
    start: "Получить поддержку",
    explore: "Узнать о проекте",
    trust: "Конфиденциально и безопасно",
    human: "Решение принимает специалист",
    grades: "Для 1–11 классов",
    problemEyebrow: "Зачем нужен Qorgau AI?",
    problemTitle: "Система, которая помогает не молчать",
    problemText:
      "Буллинг часто начинается не с одного события, а с повторяющегося давления. Мы упрощаем обращение за помощью и помогаем школьным специалистам реагировать раньше.",
    featuresTitle: "Все инструменты безопасности — в одном месте",
    howTitle: "Путь к поддержке прост",
    resourcesTitle: "Знания уменьшают страх",
    ctaTitle: "Создадим безопасную школу вместе",
    ctaText: "Просить о помощи — не слабость. Это смелый шаг заботы о себе и других.",
    footer: "Цифровая среда, где слышат ученика.",
    modalTitle: "Вход в кабинет",
    modalText: "Введите данные, чтобы открыть личный кабинет.",
    username: "Логин",
    password: "Пароль",
    remember: "Запомнить меня",
    enter: "Войти",
    error: "Заполните логин и пароль.",
    welcome: "Добрый день, Аян!",
    welcomeText: "Сделай сегодня один полезный шаг для себя.",
  },
} as const;

const featureData = {
  kk: [
    [MessageCircle, "Қауіпсіз чат", "Мазалаған жағдайды чатта сипаттап, дұрыс әрекет ету жолын біл."],
    [Video, "Бейнесабақтар", "Буллингті тану, шекара қою және досыңа көмектесу туралы қысқа сабақтар."],
    [ClipboardCheck, "Өзін-өзі тексеру", "Жағдайды түсінуге көмектесетін жас ерекшелігіне сай тесттер."],
    [HeartHandshake, "Маман қолдауы", "Қажет болса, мектеп психологына қауіпсіз түрде белгі беру мүмкіндігі."],
  ],
  ru: [
    [MessageCircle, "Безопасный чат", "Опиши ситуацию и узнай, какие спокойные шаги можно сделать дальше."],
    [Video, "Видеоуроки", "Короткие уроки о буллинге, личных границах и помощи друзьям."],
    [ClipboardCheck, "Самопроверка", "Возрастные тесты, которые помогают лучше понять ситуацию."],
    [HeartHandshake, "Поддержка специалиста", "При необходимости можно безопасно обратиться к школьному психологу."],
  ],
} as const;

const youtubeLessons = [
  { id: "EW7vUc43N8E", title: "Буллингке қарсы бағытталған ролик", author: "Jastar Bilsin" },
  { id: "7bD9FQR3QkA", title: "«Менің сыныбым буллингке қарсы»", author: "Мир детства" },
  { id: "Sa1nK8yvIag", title: "Буллинг жасаған сынып", author: "БӘРІ ОСЫНДАЙ ВИДЕО" },
  { id: "RCA_wFW-mSo", title: "Әлімжеттік, буллинг туралы мағұлмат", author: "Мектеп өмірінен" },
].map((video) => ({ ...video, thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg` }));

export default function QorgauAIApp() {
  const [lang, setLang] = useState<Lang>("ru");
  const [theme, setTheme] = useState<Theme>("light");
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [createdAccounts, setCreatedAccounts] = useState<Account[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [activeVideo, setActiveVideo] = useState<(typeof youtubeLessons)[number] | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState<Section>("home");
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const t = copy[lang];

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
      if (savedLang === "ru" || savedLang === "kk") setLang(savedLang);

      void (async () => {
        try {
          const response = await fetch("/api/auth/session", { cache: "no-store" });
          const payload = await response.json() as { account?: Account | null };
          if (!cancelled && response.ok && payload.account) {
            setActiveAccount(payload.account);
            if (payload.account.role === "site_admin") {
              await migrateLegacyAccounts(readStoredAccounts());
              await loadCreatedAccounts();
            }
          }
        } finally {
          if (!cancelled) setStorageReady(true);
        }
      })();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    if (storageReady) {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  }, [theme, lang, storageReady]);

  async function loadCreatedAccounts() {
    const response = await fetch("/api/accounts", { cache: "no-store" });
    if (!response.ok) return false;
    const payload = await response.json() as { accounts: Account[] };
    setCreatedAccounts(payload.accounts);
    return true;
  }

  async function migrateLegacyAccounts(accounts: Account[]) {
    if (accounts.length === 0) return;
    let complete = true;
    for (const account of accounts) {
      const response = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(account),
      });
      if (!response.ok && response.status !== 409) complete = false;
    }
    if (complete) persistAccounts([]);
  }

  async function createServerAccount(account: Account & { password: string }) {
    const response = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({})) as { error?: string };
      if (payload.error === "login_exists") return lang === "ru" ? "Такой логин уже используется." : "Бұл логин қолданыста.";
      return lang === "ru" ? "Не удалось сохранить аккаунт. Попробуйте ещё раз." : "Аккаунт сақталмады. Қайта көріңіз.";
    }
    const payload = await response.json() as { account: Account };
    setCreatedAccounts((accounts) => [payload.account, ...accounts]);
    return null;
  }

  async function deleteServerAccount(account: Account) {
    if (!account.id) return false;
    const response = await fetch(`/api/accounts?id=${encodeURIComponent(account.id)}`, { method: "DELETE" });
    if (!response.ok) return false;
    setCreatedAccounts((accounts) => accounts.filter((item) => item.id !== account.id));
    return true;
  }

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = String(data.get("login") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    if (!login || !password) {
      setError(t.error);
      return;
    }
    setLoginLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });
      const payload = await response.json() as { account?: Account; error?: string };
      if (!response.ok || !payload.account) {
        setError(response.status === 503
          ? (lang === "ru" ? "Сервис входа временно недоступен. Попробуйте ещё раз." : "Кіру қызметі уақытша қолжетімсіз. Қайта көріңіз.")
          : (lang === "ru" ? "Неверный логин или пароль." : "Логин немесе құпиясөз қате."));
        return;
      }
      setError("");
      setLoginOpen(false);
      setSection("home");
      setActiveAccount(payload.account);
      if (payload.account.role === "site_admin") {
        await migrateLegacyAccounts(readStoredAccounts());
        await loadCreatedAccounts();
      }
    } finally {
      setLoginLoading(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) return;
      setActiveAccount(null);
      setCreatedAccounts([]);
      setSection("home");
      setMenuOpen(false);
    } catch {
      return;
    }
  }

  if (!storageReady) {
    return <div className="app-loading" role="status" aria-live="polite"><span className="brand-mark"><ShieldCheck size={25} /></span><strong>Qorgau AI</strong></div>;
  }

  if (activeAccount) {
    return (
      <Dashboard
        account={activeAccount}
        lang={lang}
        theme={theme}
        section={section}
        menuOpen={menuOpen}
        onSection={(value) => { setSection(value); setMenuOpen(false); }}
        onMenu={() => setMenuOpen((value) => !value)}
        onTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        onLang={() => setLang(lang === "ru" ? "kk" : "ru")}
        onLogout={logout}
        createdAccounts={createdAccounts}
        onCreateAccount={createServerAccount}
        onDeleteAccount={deleteServerAccount}
      />
    );
  }

  return (
    <div className="site-shell">
      <header className="landing-header">
        <a className="brand" href="#top" aria-label="Qorgau AI басты бет">
          <span className="brand-mark"><ShieldCheck size={22} /></span>
          <span>Qorgau AI</span>
        </a>
        <nav className="desktop-nav" aria-label="Негізгі навигация">
          {t.nav.map((label, index) => <a href={["#about", "#features", "#resources", "#how"][index]} key={label}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <button className="icon-control" onClick={() => setLang(lang === "ru" ? "kk" : "ru")} aria-label="Тілді ауыстыру"><Languages size={18} /><span>{lang === "ru" ? "RU" : "ҚАЗ"}</span></button>
          <button className="theme-control" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label="Тақырыпты ауыстыру">{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button>
          <button className="login-button" onClick={() => setLoginOpen(true)}><LogIn size={18} />{t.login}</button>
          <button className="mobile-menu" onClick={() => setMenuOpen((value) => !value)} aria-label="Мәзір"><Menu size={22} /></button>
        </div>
        {menuOpen && <div className="mobile-nav">{t.nav.map((label, index) => <a href={["#about", "#features", "#resources", "#how"][index]} onClick={() => setMenuOpen(false)} key={label}>{label}</a>)}<button onClick={() => { setLoginOpen(true); setMenuOpen(false); }}>{t.login}</button></div>}
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse-dot" />{t.eyebrow}</div>
            <h1>{t.hero}</h1>
            <p>{t.heroText}</p>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => setLoginOpen(true)}>{t.start}<ArrowRight size={19} /></button>
              <a className="secondary-button" href="#about">{t.explore}</a>
            </div>
            <div className="trust-row">
              <span><LockKeyhole size={17} />{t.trust}</span>
              <span><UserRound size={17} />{t.human}</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="Qorgau AI қолдау жүйесі">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-shield"><Shield size={82} strokeWidth={1.5} /><Sparkles className="shield-spark" size={25} /></div>
            <div className="floating-card card-help"><HeartHandshake size={21} /><span>{lang === "ru" ? "Помощь рядом" : "Көмек қасыңда"}</span></div>
            <div className="floating-card card-safe"><Check size={20} /><span>{lang === "ru" ? "Тебя услышат" : "Сені тыңдайды"}</span></div>
            <div className="floating-card card-grade"><GraduationCap size={21} /><span>{t.grades}</span></div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Жоба артықшылықтары">
          <div><strong>1–11</strong><span>{lang === "ru" ? "классы" : "сынып"}</span></div>
          <div><strong>2</strong><span>{lang === "ru" ? "языка" : "тіл"}</span></div>
          <div><strong>24/7</strong><span>{lang === "ru" ? "доступ к материалам" : "материалға қолжетімділік"}</span></div>
          <div><strong>100%</strong><span>{lang === "ru" ? "с фокусом на ребёнка" : "оқушыға бағытталған"}</span></div>
        </section>

        <section className="about-section section-pad" id="about">
          <div className="section-intro"><span>{t.problemEyebrow}</span><h2>{t.problemTitle}</h2><p>{t.problemText}</p></div>
          <div className="principles-grid">
            <div className="principle principle-dark"><Bot size={32} /><h3>AI ≠ Judge</h3><p>{lang === "ru" ? "Технология замечает сигналы, но никогда не выносит обвинений." : "Технология белгілерді байқайды, бірақ ешкімді кінәлі деп шешпейді."}</p></div>
            <div className="principle"><ShieldCheck size={32} /><h3>{lang === "ru" ? "Без слежки" : "Бақылаусыз"}</h3><p>{lang === "ru" ? "Никаких скрытых камер, микрофонов или чтения личных переписок." : "Жасырын камера, микрофон немесе жеке хаттарды оқу жоқ."}</p></div>
            <div className="principle"><Users size={32} /><h3>{lang === "ru" ? "Человек решает" : "Адам шешеді"}</h3><p>{lang === "ru" ? "Финальное решение всегда остаётся за школьным специалистом." : "Соңғы шешімді әрдайым мектеп маманы қабылдайды."}</p></div>
          </div>
        </section>

        <section className="features-section section-pad" id="features">
          <div className="section-heading"><div><span>{lang === "ru" ? "Возможности" : "Мүмкіндіктер"}</span><h2>{t.featuresTitle}</h2></div><p>{lang === "ru" ? "Разные форматы помощи — для разных ситуаций и возрастов." : "Әртүрлі жағдай мен жасқа арналған көмек форматтары."}</p></div>
          <div className="feature-grid">
            {featureData[lang].map(([Icon, title, text], index) => <article className={`feature-card feature-${index + 1}`} key={title}><div className="feature-icon"><Icon size={25} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><button aria-label={title} onClick={() => index === 1 ? document.querySelector("#resources")?.scrollIntoView({ behavior: "smooth" }) : setLoginOpen(true)}><ArrowRight size={18} /></button></article>)}
          </div>
        </section>

        <section className="how-section section-pad" id="how">
          <div className="section-intro light"><span>{lang === "ru" ? "Как это работает" : "Қалай жұмыс істейді"}</span><h2>{t.howTitle}</h2></div>
          <div className="steps-row">
            {[lang === "ru" ? "Зайди в кабинет" : "Кабинетке кір", lang === "ru" ? "Выбери формат помощи" : "Көмек форматын таңда", lang === "ru" ? "Расскажи или изучи" : "Айт немесе үйрен", lang === "ru" ? "Получи следующий шаг" : "Келесі қадамды ал"].map((label, index) => <div className="step" key={label}><span>{index + 1}</span><h3>{label}</h3>{index < 3 && <ArrowRight size={23} />}</div>)}
          </div>
        </section>

        <section className="resources-section section-pad" id="resources">
          <div className="section-heading"><div><span>{lang === "ru" ? "Видеотека" : "Бейнеқор"}</span><h2>{t.resourcesTitle}</h2></div><button className="text-button" onClick={() => setLoginOpen(true)}>{lang === "ru" ? "Все материалы" : "Барлық материал"}<ArrowRight size={18} /></button></div>
          <VideoCards videos={youtubeLessons} lang={lang} onPlay={setActiveVideo} />
        </section>

        <section className="cta-section section-pad">
          <div className="cta-icon"><HeartHandshake size={36} /></div><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><button className="primary-button light-button" onClick={() => setLoginOpen(true)}>{t.login}<ArrowRight size={19} /></button>
        </section>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={22} /></span><span>Qorgau AI</span></a><p>{t.footer}</p><div><a href="#about">{lang === "ru" ? "Конфиденциальность" : "Құпиялық"}</a><a href="#resources">{lang === "ru" ? "Материалы" : "Материалдар"}</a></div></footer>

      {loginOpen && <div className="modal-backdrop"><div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" onClick={() => setLoginOpen(false)} aria-label="Жабу"><X size={21} /></button><div className="modal-brand"><span className="brand-mark"><ShieldCheck size={23} /></span><span>Qorgau AI</span></div><div className="modal-icon"><LockKeyhole size={26} /></div><h2 id="login-title">{t.modalTitle}</h2><p>{t.modalText}</p><form onSubmit={submitLogin}><label>{t.username}<input name="login" autoComplete="username" disabled={loginLoading} placeholder={lang === "ru" ? "Введите логин" : "Логинді енгізіңіз"} /></label><label>{t.password}<input name="password" type="password" autoComplete="current-password" disabled={loginLoading} placeholder="••••••••" /></label><div className="form-meta"><span>{lang === "ru" ? "Вход работает на всех ваших устройствах" : "Кіру барлық құрылғыда жұмыс істейді"}</span><button type="button" onClick={() => setError(lang === "ru" ? "Обратитесь к администратору школы, чтобы восстановить доступ." : "Қолжетімділікті қалпына келтіру үшін мектеп әкімшісіне хабарласыңыз.")}>{lang === "ru" ? "Нужна помощь?" : "Көмек керек пе?"}</button></div>{error && <div className="form-error" role="alert"><CircleHelp size={17} />{error}</div>}<button className="primary-button modal-submit" type="submit" disabled={loginLoading}>{loginLoading ? (lang === "ru" ? "Входим..." : "Кіру...") : t.enter}<ArrowRight size={18} /></button></form><div className="modal-note"><ShieldCheck size={17} />{lang === "ru" ? "Пароль проверяется на защищённом сервере" : "Құпиясөз қорғалған серверде тексеріледі"}</div></div></div>}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

function VideoCards({ videos, lang, onPlay }: { videos: typeof youtubeLessons; lang: Lang; onPlay: (video: (typeof youtubeLessons)[number]) => void }) { return <div className="lesson-grid video-grid">{videos.map((video, index) => <article className="lesson-card video-card" key={video.id}><button className="video-cover" onClick={() => onPlay(video)} aria-label={`${lang === "ru" ? "Смотреть" : "Көру"}: ${video.title}`}><img src={video.thumbnail} alt="" /><span className="video-play"><Play fill="currentColor" size={24} /></span><small>{lang === "ru" ? "На казахском" : "Қазақ тілінде"}</small></button><div className="lesson-body"><span>{lang === "ru" ? `Видео ${index + 1}` : `${index + 1}-бейне`} · YouTube</span><h3>{video.title}</h3><p><Video size={15} />{video.author}</p><button className="watch-link" onClick={() => onPlay(video)}>{lang === "ru" ? "Смотреть" : "Көру"}<ArrowRight size={16} /></button></div></article>)}</div>; }
function VideoModal({ video, onClose }: { video: (typeof youtubeLessons)[number]; onClose: () => void }) { return <div className="modal-backdrop video-backdrop"><div className="video-modal" role="dialog" aria-modal="true" aria-label={video.title}><button className="modal-close" onClick={onClose} aria-label="Жабу"><X size={21} /></button><div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><h2>{video.title}</h2><p>{video.author} · YouTube</p></div></div>; }

function Dashboard({ account, lang, theme, section, menuOpen, onSection, onMenu, onTheme, onLang, onLogout, createdAccounts, onCreateAccount, onDeleteAccount }: { account: Account; lang: Lang; theme: Theme; section: Section; menuOpen: boolean; onSection: (section: Section) => void; onMenu: () => void; onTheme: () => void; onLang: () => void; onLogout: () => void; createdAccounts: Account[]; onCreateAccount: (account: Account & { password: string }) => Promise<string | null>; onDeleteAccount: (account: Account) => Promise<boolean> }) {
  const t = copy[lang];
  const [cabinetQuery, setCabinetQuery] = useState("");
  const roleNav: Record<Role, [Section, typeof LayoutDashboard, string, string][]> = {
    student: [["home", LayoutDashboard, "Главная", "Басты бет"], ["chat", MessageCircle, "Чат поддержки", "Қолдау чаты"], ["lessons", Video, "Видеоуроки", "Бейнесабақтар"], ["test", ClipboardCheck, "Тест о буллинге", "Буллинг тесті"], ["library", BookOpen, "База знаний", "Білім қоры"], ["progress", BarChart3, "Мой прогресс", "Менің үлгерімім"]],
    teacher: [["home", LayoutDashboard, "Обзор класса", "Сынып шолуы"], ["classes", School, "Мои классы", "Менің сыныптарым"], ["observations", FileWarning, "Новое наблюдение", "Жаңа бақылау"], ["students", Users, "Ученики", "Оқушылар"], ["library", BookOpen, "Материалы для класса", "Сынып материалдары"], ["reports", Bell, "Уведомления", "Хабарламалар"]],
    psychologist: [["home", LayoutDashboard, "Рабочий стол", "Жұмыс үстелі"], ["reports", FileWarning, "Инциденты", "Оқиғалар"], ["students", Users, "Ученики риска", "Тәуекелдегі оқушылар"], ["cases", FileCheck2, "Кейсы", "Кейстер"], ["meetings", CalendarDays, "Встречи", "Кездесулер"], ["analytics", BarChart3, "Аналитика", "Аналитика"]],
    admin: [["home", LayoutDashboard, "Обзор школы", "Мектеп шолуы"], ["analytics", PieChart, "Аналитика", "Аналитика"], ["classes", School, "Классы", "Сыныптар"], ["users", UserCog, "Пользователи", "Пайдаланушылар"], ["students", Users, "Ученики", "Оқушылар"], ["settings", Settings, "Настройки", "Баптаулар"]],
    site_admin: [["home", LayoutDashboard, "Обзор класса", "Сынып шолуы"], ["classes", School, "Мои классы", "Менің сыныптарым"], ["observations", FileWarning, "Новое наблюдение", "Жаңа бақылау"], ["students", Users, "Ученики", "Оқушылар"], ["library", BookOpen, "Материалы", "Материалдар"], ["reports", Bell, "Уведомления", "Хабарламалар"], ["accounts", UserPlus, "Создание аккаунтов", "Аккаунт ашу"]],
  };
  const nav = roleNav[account.role];
  function searchCabinet(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = cabinetQuery.trim().toLowerCase(); if (!value) return; const match = nav.find(([, , ru, kk]) => `${ru} ${kk}`.toLowerCase().includes(value)); if (match) { onSection(match[0]); setCabinetQuery(""); } }
  const sidebarAction = account.role === "student"
    ? [lang === "ru" ? "Нужна срочная помощь?" : "Шұғыл көмек керек пе?", lang === "ru" ? "Сообщи школьному специалисту" : "Мектеп маманына белгі бер", lang === "ru" ? "Сообщить" : "Хабарлау"]
    : account.role === "psychologist"
      ? [lang === "ru" ? "Дежурная линия" : "Кезекші желі", lang === "ru" ? "3 сигнала требуют внимания" : "3 белгі назарды қажет етеді", lang === "ru" ? "Открыть" : "Ашу"]
      : [lang === "ru" ? "Центр поддержки" : "Қолдау орталығы", lang === "ru" ? "Правила и маршруты помощи" : "Ереже және көмек жолдары", lang === "ru" ? "Открыть" : "Ашу"];
  return <div className="dashboard-shell">
    <aside className={`dashboard-sidebar ${menuOpen ? "open" : ""}`}>
      <div className="sidebar-top"><button className="brand sidebar-brand" onClick={() => onSection("home")}><span className="brand-mark"><ShieldCheck size={22} /></span><span>Qorgau AI</span></button><button className="sidebar-close" onClick={onMenu}><X size={20} /></button></div>
      <div className="student-mini"><div className="avatar">{account.initials}</div><div><strong>{account.name}</strong><span>{account.meta[lang]}</span></div></div>
      <nav>{nav.map(([id, Icon, ru, kk]) => <button className={section === id ? "active" : ""} onClick={() => onSection(id)} key={id}><Icon size={19} /><span>{lang === "ru" ? ru : kk}</span>{account.role === "psychologist" && id === "reports" && <i>3</i>}</button>)}</nav>
      <div className="sidebar-support"><HeartHandshake size={23} /><strong>{sidebarAction[0]}</strong><span>{sidebarAction[1]}</span><button onClick={() => onSection("support")}>{sidebarAction[2]}</button></div>
      <button className="logout-button" onClick={onLogout}><LogOut size={18} />{lang === "ru" ? "Выйти" : "Шығу"}</button>
    </aside>
    {menuOpen && <button className="sidebar-scrim" onClick={onMenu} aria-label="Мәзірді жабу" />}
    <div className="dashboard-main">
      <header className="dashboard-header"><button className="dash-menu" onClick={onMenu} aria-label={lang === "ru" ? "Открыть меню" : "Мәзірді ашу"}><Menu size={21} /></button><form className="dash-search" onSubmit={searchCabinet}><Search size={18} /><input value={cabinetQuery} onChange={(event) => setCabinetQuery(event.target.value)} aria-label={lang === "ru" ? "Поиск по кабинету" : "Кабинеттен іздеу"} placeholder={lang === "ru" ? "Поиск по кабинету..." : "Кабинеттен іздеу..."} /><button type="submit" aria-label={lang === "ru" ? "Найти раздел" : "Бөлімді табу"}><ArrowRight size={16} /></button></form><div className="role-pill">{roleLabel(account.role, lang)}</div><div className="dash-actions"><button onClick={onLang} aria-label={lang === "ru" ? "Переключить на казахский" : "Орыс тіліне ауысу"}><Languages size={18} /><span>{lang === "ru" ? "RU" : "ҚАЗ"}</span></button><button onClick={onTheme} aria-label={lang === "ru" ? "Переключить тему" : "Тақырыпты ауыстыру"}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><button onClick={() => onSection(account.role === "student" ? "support" : "reports")} aria-label={lang === "ru" ? "Открыть уведомления и поддержку" : "Хабарламалар мен қолдауды ашу"}><Bell size={18} />{account.role !== "student" && <i />}</button><div className="dash-avatar" aria-label={account.name}>{account.initials}</div></div></header>
      <main className="dashboard-content">
        {section === "home" && (account.role === "student" ? <DashboardHome account={account} lang={lang} t={t} onSection={onSection} /> : <StaffDashboardHome account={account} lang={lang} onSection={onSection} />)}
        {account.role === "student" && section === "chat" && <EnhancedChatPanel lang={lang} />}
        {account.role === "student" && section === "lessons" && <EnhancedLessonsPanel lang={lang} />}
        {account.role === "student" && section === "test" && <EnhancedQuizPanel lang={lang} onSection={onSection} />}
        {section === "library" && <EnhancedLibraryPanel lang={lang} />}
        {account.role === "student" && section === "progress" && <ProgressPanel lang={lang} />}
        {section === "support" && <SupportCenter account={account} lang={lang} onSection={onSection} />}
        {account.role === "site_admin" && section === "accounts" && <AccountManager lang={lang} accounts={createdAccounts} onCreate={onCreateAccount} onDelete={onDeleteAccount} />}
        {account.role !== "student" && section !== "home" && section !== "library" && section !== "support" && section !== "accounts" && <RoleWorkspace role={account.role} section={section} lang={lang} />}
      </main>
    </div>
  </div>;
}

function roleLabel(role: Role, lang: Lang) {
  const labels: Record<Role, { ru: string; kk: string }> = {
    student: { ru: "Ученик", kk: "Оқушы" }, teacher: { ru: "Учитель", kk: "Мұғалім" }, psychologist: { ru: "Психолог", kk: "Психолог" }, admin: { ru: "Завуч школы", kk: "Директор орынбасары" }, site_admin: { ru: "Учитель · администратор", kk: "Мұғалім · әкімші" },
  };
  return labels[role][lang];
}

function StaffDashboardHome({ account, lang, onSection }: { account: Account; lang: Lang; onSection: (section: Section) => void }) {
  const content = {
    teacher: {
      eyebrow: lang === "ru" ? "Кабинет учителя" : "Мұғалім кабинеті",
      title: lang === "ru" ? `Добрый день, ${account.name.split(" ")[0]}!` : `Қайырлы күн, ${account.name.split(" ")[0]}!`,
      text: lang === "ru" ? "Сегодня в ваших классах спокойно. Два наблюдения ожидают уточнения." : "Бүгін сыныптарыңызда жағдай тыныш. Екі бақылау нақтылауды күтуде.",
      metrics: [["3", "Мои классы", "Менің сыныптарым", "blue"], ["86", "Учеников", "Оқушы", "lime"], ["4", "Наблюдения", "Бақылау", "coral"], ["2", "Нужны действия", "Әрекет қажет", "violet"]],
      actions: [["observations", FileWarning, "Добавить наблюдение", "Бақылау қосу"], ["classes", School, "Открыть классы", "Сыныптарды ашу"], ["library", BookOpen, "Материал для урока", "Сабақ материалы"]] as [Section, typeof LayoutDashboard, string, string][],
    },
    psychologist: {
      eyebrow: lang === "ru" ? "Кабинет психолога" : "Психолог кабинеті",
      title: lang === "ru" ? `Добрый день, ${account.name.split(" ")[0]}!` : `Қайырлы күн, ${account.name.split(" ")[0]}!`,
      text: lang === "ru" ? "Три сигнала требуют первичного просмотра. Срочные события всегда находятся сверху." : "Үш белгі бастапқы тексеруді қажет етеді. Шұғыл оқиғалар әрдайым жоғарыда.",
      metrics: [["3", "Критических", "Критикалық", "coral"], ["12", "Высокий риск", "Жоғары тәуекел", "violet"], ["18", "Новых сообщений", "Жаңа хабарлама", "blue"], ["24", "Открытых кейса", "Ашық кейс", "lime"]],
      actions: [["reports", FileWarning, "Проверить сигналы", "Белгілерді тексеру"], ["cases", FileCheck2, "Открыть кейсы", "Кейстерді ашу"], ["meetings", CalendarDays, "Расписание встреч", "Кездесу кестесі"]] as [Section, typeof LayoutDashboard, string, string][],
    },
    admin: {
      eyebrow: lang === "ru" ? "Администрирование школы" : "Мектепті басқару",
      title: lang === "ru" ? `Добрый день, ${account.name.split(" ")[0]}!` : `Қайырлы күн, ${account.name.split(" ")[0]}!`,
      text: lang === "ru" ? "Общая обстановка стабильна. Конфиденциальные заметки психологов в этом кабинете не отображаются." : "Жалпы жағдай тұрақты. Бұл кабинетте психологтардың құпия жазбалары көрсетілмейді.",
      metrics: [["846", "Учеников", "Оқушы", "blue"], ["62", "Сотрудника", "Қызметкер", "lime"], ["31", "Класс", "Сынып", "violet"], ["89%", "Решено вовремя", "Уақтылы шешілді", "coral"]],
      actions: [["analytics", PieChart, "Аналитика школы", "Мектеп аналитикасы"], ["users", UserCog, "Пользователи", "Пайдаланушылар"], ["classes", School, "Управление классами", "Сыныптарды басқару"]] as [Section, typeof LayoutDashboard, string, string][],
    },
    site_admin: { eyebrow: lang === "ru" ? "Кабинет учителя и администратора" : "Мұғалім және әкімші кабинеті", title: lang === "ru" ? `Добрый день, ${account.name.split(" ")[0]}!` : `Қайырлы күн, ${account.name.split(" ")[0]}!`, text: lang === "ru" ? "Учебные инструменты и управление аккаунтами школы доступны в одном кабинете." : "Оқу құралдары мен мектеп аккаунттарын басқару бір кабинетте қолжетімді.", metrics: [["3", "Мои классы", "Менің сыныптарым", "blue"], ["86", "Учеников", "Оқушы", "lime"], ["4", "Наблюдения", "Бақылау", "coral"], ["+", "Создать аккаунт", "Аккаунт ашу", "violet"]], actions: [["accounts", UserPlus, "Создать аккаунт", "Аккаунт ашу"], ["classes", School, "Открыть классы", "Сыныптарды ашу"], ["observations", FileWarning, "Добавить наблюдение", "Бақылау қосу"]] as [Section, typeof LayoutDashboard, string, string][] },
  }[account.role as "teacher" | "psychologist" | "admin" | "site_admin"];
  return <>
    <section className={`staff-welcome role-${account.role}`}><div><span>{content.eyebrow}</span><h1>{content.title}</h1><p>{content.text}</p></div><div className="staff-hero-mark">{account.role === "teacher" || account.role === "site_admin" ? <GraduationCap size={54} /> : account.role === "psychologist" ? <HeartHandshake size={54} /> : <School size={54} />}</div></section>
    <section className="staff-metrics">{content.metrics.map(([value, ru, kk, tone]) => <StaffMetric key={ru} value={value} label={lang === "ru" ? ru : kk} tone={tone} />)}</section>
    <section className="staff-actions">{content.actions.map(([section, Icon, ru, kk], index) => <button onClick={() => onSection(section)} key={section}><span className={`staff-action-icon a${index + 1}`}><Icon size={21} /></span><strong>{lang === "ru" ? ru : kk}</strong><ArrowRight size={18} /></button>)}</section>
    <StaffOverview role={account.role} lang={lang} onSection={onSection} />
  </>;
}

function StaffMetric({ value, label, tone }: { value: string; label: string; tone: string }) { return <article className={`staff-metric ${tone}`}><span>{label}</span><strong>{value}</strong><i /></article>; }

function StaffOverview({ role, lang, onSection }: { role: Role; lang: Lang; onSection: (section: Section) => void }) {
  const data = role === "teacher" || role === "site_admin" ? {
    title: lang === "ru" ? "Последние наблюдения" : "Соңғы бақылаулар", action: "observations" as Section,
    rows: [["7 «А»", "Изменение настроения ученика", "Сегодня, 10:20", "На уточнении"], ["6 «Б»", "Конфликт на перемене", "Вчера, 14:45", "Передано"], ["8 «В»", "Исключение из группы", "12 авг., 12:10", "Новое"]],
  } : role === "psychologist" ? {
    title: lang === "ru" ? "Сигналы высокого приоритета" : "Жоғары басымдықты белгілер", action: "reports" as Section,
    rows: [["Аружан С. · 8 «Б»", "SOS-сигнал", "Сегодня, 10:32", "Критический"], ["Мирас А. · 9 «А»", "Повторяющиеся угрозы", "Сегодня, 09:18", "Высокий"], ["Әлихан Н. · 7 «В»", "Снижение настроения", "Вчера, 16:40", "Высокий"]],
  } : {
    title: lang === "ru" ? "Сводка по школе" : "Мектеп бойынша жиынтық", action: "analytics" as Section,
    rows: [["5–7 классы", "18 обращений", "Ответ: 2,4 часа", "Стабильно"], ["8–9 классы", "22 обращения", "Ответ: 1,8 часа", "Внимание"], ["10–11 классы", "8 обращений", "Ответ: 2,1 часа", "Стабильно"]],
  };
  return <section className="staff-overview"><article className="staff-table-card"><div className="card-heading"><div><span>{lang === "ru" ? "Актуально" : "Өзекті"}</span><h2>{data.title}</h2></div><button onClick={() => onSection(data.action)}>{lang === "ru" ? "Все записи" : "Барлық жазба"}<ArrowRight size={16} /></button></div><div className="staff-table">{data.rows.map(([name, event, time, status]) => <div className="staff-table-row" key={name}><div className="row-avatar">{name.slice(0, 2)}</div><div><strong>{name}</strong><span>{event}</span></div><time>{time}</time><b>{status}</b></div>)}</div></article><article className="staff-side-card"><div className="card-heading"><div><span>{lang === "ru" ? "Динамика" : "Динамика"}</span><h2>{lang === "ru" ? "Последние 7 дней" : "Соңғы 7 күн"}</h2></div><BarChart3 size={20} /></div><div className="mini-chart">{[48, 70, 42, 86, 62, 50, 74].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><p>{lang === "ru" ? "Среднее время первичного ответа сократилось на 18%." : "Алғашқы жауаптың орташа уақыты 18%-ға қысқарды."}</p></article></section>;
}

function RoleWorkspace({ role, section, lang }: { role: Role; section: Section; lang: Lang }) {
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [addedRows, setAddedRows] = useState<string[][]>([]);
  const [selected, setSelected] = useState<string[] | null>(null);
  const titles: Partial<Record<Section, [string, string, string, string]>> = {
    classes: ["Классы", "Сыныптар", "Управление классами и доступным учебным контекстом.", "Сыныптар мен қолжетімді оқу контекстін басқару."],
    observations: ["Новое наблюдение", "Жаңа бақылау", "Зафиксируйте замеченную ситуацию и передайте её специалисту.", "Байқалған жағдайды тіркеп, маманға жіберіңіз."],
    students: [role === "psychologist" ? "Ученики риска" : "Ученики", role === "psychologist" ? "Тәуекелдегі оқушылар" : "Оқушылар", "Доступ к информации ограничен вашей профессиональной ролью.", "Ақпаратқа қолжетімділік кәсіби рөліңізбен шектелген."],
    reports: [role === "psychologist" ? "Инциденты" : "Уведомления", role === "psychologist" ? "Оқиғалар" : "Хабарламалар", "Новые события и статусы по текущей работе.", "Жаңа оқиғалар мен ағымдағы жұмыс мәртебелері."],
    cases: ["Кейсы", "Кейстер", "Сопровождение случая от первичного просмотра до решения.", "Жағдайды алғашқы тексеруден шешімге дейін сүйемелдеу."],
    meetings: ["Встречи", "Кездесулер", "Планирование безопасных встреч с учениками.", "Оқушылармен қауіпсіз кездесулерді жоспарлау."],
    analytics: ["Аналитика", "Аналитика", "Агрегированные показатели без раскрытия конфиденциальных заметок.", "Құпия жазбаларды ашпайтын жинақталған көрсеткіштер."],
    users: ["Пользователи", "Пайдаланушылар", "Учётные записи, роли и доступ сотрудников школы.", "Мектеп қызметкерлерінің есептік жазбалары, рөлдері және қолжетімділігі."],
    settings: ["Настройки школы", "Мектеп баптаулары", "Параметры уведомлений, маршрутов помощи и системы.", "Хабарламалар, көмек жолдары және жүйе параметрлері."],
  };
  const title = titles[section] ?? ["Раздел", "Бөлім", "Рабочее пространство Qorgau AI.", "Qorgau AI жұмыс кеңістігі."];
  if (section === "observations") return <ObservationForm lang={lang} />;
  const rows = section === "users" ? [["Айгүл Омарова", "Психолог", "Активен"], ["Данияр Қасымов", "Учитель", "Активен"], ["Мөлдір Сапарова", "Психолог", "Активен"], ["Ерлан Нұрбек", "Учитель", "Приглашён"]] : section === "classes" ? [["7 «А»", "28 учеников", "Данияр Қасымов"], ["8 «Б»", "26 учеников", "Жанар Төлеген"], ["9 «А»", "30 учеников", "Ерлан Нұрбек"], ["6 «В»", "25 учеников", "Алина Серова"]] : section === "meetings" ? [["10:30", "Аружан С. · 8 «Б»", "Первичная встреча"], ["12:00", "Мирас А. · 9 «А»", "Повторная встреча"], ["15:20", "Родительская встреча", "Согласовано"]] : [["SS-0264", "Новое обращение", "Высокий"], ["SS-0261", "На проверке", "Средний"], ["SS-0258", "Назначен специалист", "Высокий"], ["SS-0249", "Работа завершена", "Низкий"]];
  const filteredRows = [...rows, ...addedRows].filter((row) => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  function addRow(event: FormEvent) { event.preventDefault(); if (!newName.trim()) return; setAddedRows((items) => [...items, [newName.trim(), lang === "ru" ? "Добавлено вручную" : "Қолмен қосылды", lang === "ru" ? "Новое" : "Жаңа"]]); setNewName(""); setAdding(false); }
  return <section className="panel-page role-workspace"><div className="page-title"><span>{roleLabel(role, lang)}</span><h1>{lang === "ru" ? title[0] : title[1]}</h1><p>{lang === "ru" ? title[2] : title[3]}</p></div>{section === "analytics" ? <AnalyticsWorkspace lang={lang} /> : section === "settings" ? <SettingsWorkspace lang={lang} /> : <div className="workspace-card"><div className="workspace-toolbar"><div className="dash-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={lang === "ru" ? "Поиск..." : "Іздеу..."} /></div><button onClick={() => setAdding((value) => !value)}><Plus size={17} />{lang === "ru" ? "Добавить" : "Қосу"}</button></div>{adding && <form className="quick-add" onSubmit={addRow}><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder={lang === "ru" ? "Название или имя" : "Атауы немесе аты"} /><button type="submit"><Check size={17} />{lang === "ru" ? "Сохранить" : "Сақтау"}</button></form>}{selected && <div className="workspace-detail"><div><strong>{selected[0]}</strong><span>{selected[1]} · {selected[2]}</span></div><button onClick={() => setSelected(null)}><X size={16} /></button></div>}<div className="workspace-table">{filteredRows.map(([a, b, c]) => <div key={`${a}-${b}`}><strong>{a}</strong><span>{b}</span><b>{c}</b><button onClick={() => setSelected([a, b, c])} aria-label="Ашу"><ArrowRight size={17} /></button></div>)}</div></div>}</section>;
}

function ObservationForm({ lang }: { lang: Lang }) { const [sent, setSent] = useState(false); return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Наблюдение учителя" : "Мұғалім бақылауы"}</span><h1>{lang === "ru" ? "Зафиксировать ситуацию" : "Жағдайды тіркеу"}</h1><p>{lang === "ru" ? "Опишите только факты, которые вы лично заметили. Психолог проверит информацию." : "Тек өзіңіз байқаған фактілерді сипаттаңыз. Психолог ақпаратты тексереді."}</p></div><form className="observation-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>{lang === "ru" ? "Класс" : "Сынып"}<select><option>7 «А»</option><option>6 «Б»</option><option>8 «В»</option></select></label><label>{lang === "ru" ? "Категория" : "Санат"}<select><option>{lang === "ru" ? "Конфликт" : "Қақтығыс"}</option><option>{lang === "ru" ? "Социальное исключение" : "Әлеуметтік шеттету"}</option><option>{lang === "ru" ? "Угроза" : "Қорқыту"}</option></select></label><label className="form-wide">{lang === "ru" ? "Что вы заметили?" : "Не байқадыңыз?"}<textarea rows={6} placeholder={lang === "ru" ? "Опишите место, время и наблюдаемые действия..." : "Орынды, уақытты және байқалған әрекеттерді сипаттаңыз..."} /></label>{sent && <div className="success-note"><Check size={18} />{lang === "ru" ? "Наблюдение передано психологу." : "Бақылау психологқа жіберілді."}</div>}<button className="primary-button" type="submit">{lang === "ru" ? "Передать специалисту" : "Маманға жіберу"}<ArrowRight size={18} /></button></form></section>; }

function AnalyticsWorkspace({ lang }: { lang: Lang }) { return <div className="analytics-workspace"><div className="analytics-kpis"><StaffMetric value="48" label={lang === "ru" ? "Обращений за месяц" : "Айлық өтініш"} tone="blue" /><StaffMetric value="89%" label={lang === "ru" ? "Решено вовремя" : "Уақтылы шешілді"} tone="lime" /><StaffMetric value="2,1 ч" label={lang === "ru" ? "Средний ответ" : "Орташа жауап"} tone="violet" /></div><article className="analytics-chart"><h2>{lang === "ru" ? "Динамика обращений" : "Өтініш динамикасы"}</h2><div>{[42, 55, 47, 68, 82, 60, 73, 52, 67, 88, 64, 72].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div></article></div>; }
function SettingsWorkspace({ lang }: { lang: Lang }) { return <div className="settings-card">{[["Уведомления о критических событиях", "Критикалық оқиға хабарламалары"], ["Еженедельный отчёт администрации", "Әкімшілікке апталық есеп"], ["Автоматическое назначение психолога", "Психологты автоматты тағайындау"], ["Двухъязычные материалы", "Екі тілдегі материалдар"]].map(([ru, kk], index) => <label key={ru}><span><strong>{lang === "ru" ? ru : kk}</strong><small>{lang === "ru" ? "Системная настройка Qorgau AI" : "Qorgau AI жүйелік баптауы"}</small></span><input type="checkbox" aria-label={lang === "ru" ? ru : kk} defaultChecked={index !== 2} /></label>)}</div>; }

function DashboardHome({ account, lang, t, onSection }: { account: Account; lang: Lang; t: (typeof copy)[Lang]; onSection: (section: Section) => void }) {
  const [mood, setMood] = useState("");
  const firstName = account.name.trim().split(/\s+/)[0] || account.name;
  return <><section className="dash-welcome"><div><span>{lang === "ru" ? "Личный кабинет" : "Жеке кабинет"}</span><h1>{lang === "ru" ? `Добрый день, ${firstName}!` : `Қайырлы күн, ${firstName}!`}</h1><p>{t.welcomeText}</p></div><div className="mood-widget"><span>{mood ? (lang === "ru" ? "Спасибо, настроение отмечено" : "Рақмет, көңіл-күй белгіленді") : (lang === "ru" ? "Как ты сегодня?" : "Бүгін көңіл-күйің қалай?")}</span><div>{["😄", "🙂", "😐", "😕", "😔"].map((item) => <button className={mood === item ? "selected" : ""} onClick={() => setMood(item)} aria-label={`${lang === "ru" ? "Настроение" : "Көңіл-күй"}: ${item}`} aria-pressed={mood === item} key={item}>{item}</button>)}</div></div></section><section className="quick-grid"><QuickCard icon={<MessageCircle />} title={lang === "ru" ? "Поговорить" : "Сөйлесу"} text={lang === "ru" ? "Безопасный чат поддержки" : "Қауіпсіз қолдау чаты"} onClick={() => onSection("chat")} tone="blue" /><QuickCard icon={<Play />} title={lang === "ru" ? "Смотреть урок" : "Сабақты көру"} text={lang === "ru" ? "Видео о буллинге на казахском" : "Буллинг туралы қазақша бейне"} onClick={() => onSection("lessons")} tone="lime" /><QuickCard icon={<ClipboardCheck />} title={lang === "ru" ? "Пройти тест" : "Тест тапсыру"} text={lang === "ru" ? "Разберись в ситуации" : "Жағдайды түсініп ал"} onClick={() => onSection("test")} tone="coral" /></section><section className="dash-columns"><div className="dashboard-card"><div className="card-heading"><div><span>{lang === "ru" ? "Твой путь" : "Сенің жолың"}</span><h2>{lang === "ru" ? "Прогресс обучения" : "Оқу барысы"}</h2></div><button onClick={() => onSection("progress")}>{lang === "ru" ? "Подробнее" : "Толығырақ"}<ArrowRight size={16} /></button></div><div className="progress-list"><ProgressRow color="blue" title={lang === "ru" ? "Что такое буллинг" : "Буллинг деген не"} progress={100} /><ProgressRow color="lime" title={lang === "ru" ? "Личные границы" : "Жеке шекара"} progress={65} /><ProgressRow color="coral" title={lang === "ru" ? "Безопасность онлайн" : "Онлайн қауіпсіздік"} progress={20} /></div></div><div className="dashboard-card"><div className="card-heading"><div><span>{lang === "ru" ? "Рекомендация" : "Ұсыныс"}</span><h2>{lang === "ru" ? "Материал дня" : "Күн материалы"}</h2></div><Sparkles size={21} /></div><div className="daily-card"><div className="daily-icon"><ShieldCheck size={28} /></div><h3>{lang === "ru" ? "5 фраз, чтобы спокойно поставить границу" : "Шекара қоюға арналған 5 сөйлем"}</h3><p>4 {lang === "ru" ? "мин чтения" : "мин оқу"}</p><button onClick={() => onSection("library")}>{lang === "ru" ? "Открыть" : "Ашу"}<ArrowRight size={16} /></button></div></div></section></>;
}

function QuickCard({ icon, title, text, onClick, tone }: { icon: ReactNode; title: string; text: string; onClick: () => void; tone: string }) { return <button className={`quick-card ${tone}`} onClick={onClick}><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div><ArrowRight size={19} /></button>; }
function ProgressRow({ color, title, progress }: { color: string; title: string; progress: number }) { return <div className="progress-row"><span className={`progress-icon ${color}`}><BookOpen size={18} /></span><div><div><strong>{title}</strong><span>{progress}%</span></div><div className="progress-track"><i className={color} style={{ width: `${progress}%` }} /></div></div></div>; }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ChatPanel({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState([{ from: "bot", text: lang === "ru" ? "Привет! Я помогу спокойно разобраться в ситуации. Что тебя беспокоит?" : "Сәлем! Жағдайды сабырмен түсінуге көмектесемін. Сені не мазалайды?" }]);
  const [draft, setDraft] = useState("");
  function send(event: FormEvent) { event.preventDefault(); if (!draft.trim()) return; const text = draft; setMessages((items) => [...items, { from: "user", text }, { from: "bot", text: lang === "ru" ? "Спасибо, что рассказал. Это важно. Давай уточним: такое происходило больше одного раза?" : "Айтқаның үшін рақмет. Бұл маңызды. Нақтылайық: бұл бірнеше рет қайталанды ма?" }]); setDraft(""); }
  return <section className="panel-page chat-page"><div className="page-title"><span>{lang === "ru" ? "Поддержка" : "Қолдау"}</span><h1>{lang === "ru" ? "Безопасный чат" : "Қауіпсіз чат"}</h1><p>{lang === "ru" ? "Здесь можно спокойно описать ситуацию и понять следующий шаг." : "Мұнда жағдайды сабырмен айтып, келесі қадамды білуге болады."}</p></div><div className="chat-layout"><div className="chat-box"><div className="chat-header"><div className="bot-avatar"><Bot size={22} /></div><div><strong>Qorgau AI Assistant</strong><span><i />{lang === "ru" ? "Готов помочь" : "Көмекке дайын"}</span></div><ShieldCheck size={20} /></div><div className="message-list">{messages.map((message, index) => <div className={`message ${message.from}`} key={`${index}-${message.text}`}><span>{message.text}</span></div>)}</div><form className="chat-input" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={lang === "ru" ? "Напиши сообщение..." : "Хабарлама жаз..."} /><button aria-label="Жіберу"><Send size={18} /></button></form></div><aside className="chat-tips"><ShieldCheck size={27} /><h3>{lang === "ru" ? "Важно знать" : "Білу маңызды"}</h3><ul><li>{lang === "ru" ? "Ты не виноват в чужой агрессии" : "Біреудің агрессиясына сен кінәлі емессің"}</li><li>{lang === "ru" ? "Не оставайся с угрозой один" : "Қауіппен жалғыз қалма"}</li><li>{lang === "ru" ? "При срочной опасности обратись к взрослому" : "Шұғыл қауіпте ересекке айт"}</li></ul></aside></div></section>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LessonsPanel({ lang }: { lang: Lang }) { return <section className="panel-page"><h1>{lang === "ru" ? "Видеоуроки" : "Бейнесабақтар"}</h1></section>; }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function QuizPanel({ lang }: { lang: Lang }) {
  const questions = useMemo(() => lang === "ru" ? ["Тебя регулярно дразнят или унижают?", "Тебе угрожают или требуют что-то отдать?", "Тебя намеренно исключают из общей компании?", "Ты боишься идти в школу из-за других учеников?"] : ["Сені үнемі мазақтай ма немесе кемсітеді ме?", "Саған қорқытып, бірдеңе беруді талап ете ме?", "Сені әдейі ортадан шеттете ме?", "Басқа оқушылардан қорқып мектепке барғың келмей ме?"], [lang]);
  const [step, setStep] = useState(0); const [yes, setYes] = useState(0); const [done, setDone] = useState(false);
  function answer(value: boolean) { if (value) setYes((n) => n + 1); if (step === questions.length - 1) setDone(true); else setStep((n) => n + 1); }
  function reset() { setStep(0); setYes(0); setDone(false); }
  return <section className="panel-page quiz-page"><div className="page-title"><span>{lang === "ru" ? "Самопроверка" : "Өзін-өзі тексеру"}</span><h1>{lang === "ru" ? "Это похоже на буллинг?" : "Бұл буллингке ұқсай ма?"}</h1><p>{lang === "ru" ? "Тест не ставит диагноз и не обвиняет. Он помогает понять, стоит ли обратиться за поддержкой." : "Тест диагноз қоймайды және айыптамайды. Ол қолдау сұрау қажет пе екенін түсінуге көмектеседі."}</p></div><div className="quiz-card">{!done ? <><div className="quiz-progress"><span>{step + 1} / {questions.length}</span><i><b style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></i></div><h2>{questions[step]}</h2><div className="quiz-actions"><button onClick={() => answer(true)}>{lang === "ru" ? "Да, такое бывает" : "Иә, болады"}</button><button onClick={() => answer(false)}>{lang === "ru" ? "Нет" : "Жоқ"}</button></div></> : <div className="quiz-result"><span className="result-icon"><HeartHandshake size={32} /></span><h2>{yes >= 2 ? (lang === "ru" ? "Стоит поговорить со взрослым" : "Ересекпен сөйлескен дұрыс") : (lang === "ru" ? "Сейчас явных признаков немного" : "Қазір айқын белгілер аз")}</h2><p>{lang === "ru" ? "Твои чувства всё равно важны. Если что-то беспокоит — расскажи взрослому, которому доверяешь." : "Сезімің бәрібір маңызды. Бір нәрсе мазаласа, сенетін ересекке айт."}</p><div><button className="primary-button" onClick={reset}>{lang === "ru" ? "Пройти снова" : "Қайта өту"}</button><button className="secondary-button">{lang === "ru" ? "Открыть чат" : "Чатты ашу"}</button></div></div>}</div></section>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LibraryPanel({ lang }: { lang: Lang }) { return <div>{lang}</div>; }
function EnhancedChatPanel({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState([{ from: "bot", text: lang === "ru" ? "Привет! Расскажи, что тебя беспокоит. Я помогу выбрать спокойный следующий шаг." : "Сәлем! Сені не мазалайтынын айт. Мен қауіпсіз келесі қадамды таңдауға көмектесемін." }]); const [draft, setDraft] = useState(""); const [loading, setLoading] = useState(false);
  async function send(event: FormEvent) { event.preventDefault(); const text = draft.trim(); if (!text || loading) return; const next = [...messages, { from: "user", text }]; setMessages(next); setDraft(""); setLoading(true); try { if (!window.puter?.ai) throw new Error(); const system = lang === "ru" ? "Ты бережный школьный помощник Qorgau AI по теме буллинга. Отвечай кратко и по возрасту. Не обвиняй, не ставь диагноз, не проси личные данные. Предлагай обратиться к доверенному взрослому или психологу. При прямой угрозе советуй безопасное место, взрослого и 112." : "Сен буллинг тақырыбындағы Qorgau AI мектеп көмекшісісің. Қысқа әрі жасына сай жауап бер. Айыптама, диагноз қойма, жеке дерек сұрама. Сенімді ересекке не психологқа айтуды ұсын. Тікелей қауіпте қауіпсіз жерге барып, ересекті шақырып, 112-ге қоңырау шалуды айт."; const response = await Promise.race([window.puter.ai.chat([{ role: "system", content: system }, ...next.map((item) => ({ role: item.from === "bot" ? "assistant" : "user", content: item.text }))], { model: "gemini-3.1-flash-lite" }), new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("AI timeout")), 15000))]); const data = response as { message?: { content?: string | { text?: string }[] }; text?: string }; const content = data?.message?.content; const answer = typeof response === "string" ? response : typeof content === "string" ? content : Array.isArray(content) ? content.map((part) => part.text || "").join("") : data?.text; setMessages((items) => [...items, { from: "bot", text: answer || (lang === "ru" ? "Я рядом. Расскажи немного подробнее." : "Мен осындамын. Толығырақ айтып берші.") }]); } catch { setMessages((items) => [...items, { from: "bot", text: lang === "ru" ? "AI сейчас не ответил. Попробуй снова. При срочной опасности позови взрослого или звони 112." : "AI қазір жауап бермеді. Қайта көр. Шұғыл қауіпте ересекті шақыр немесе 112-ге қоңырау шал." }]); } finally { setLoading(false); } }
  return <section className="panel-page chat-page"><div className="page-title"><span>{lang === "ru" ? "Поддержка" : "Қолдау"}</span><h1>{lang === "ru" ? "Безопасный AI-чат" : "Қауіпсіз AI-чат"}</h1><p>{lang === "ru" ? "AI помогает сориентироваться, но не заменяет взрослого или специалиста." : "AI бағыт береді, бірақ ересекті не маманды алмастырмайды."}</p></div><div className="chat-layout"><div className="chat-box"><div className="chat-header"><div className="bot-avatar"><Bot size={22} /></div><div><strong>Qorgau AI Assistant</strong><span><i />{loading ? (lang === "ru" ? "Думает..." : "Ойланып жатыр...") : (lang === "ru" ? "Готов помочь" : "Көмекке дайын")}</span></div><ShieldCheck size={20} /></div><div className="message-list">{messages.map((message, index) => <div className={`message ${message.from}`} key={`${index}-${message.text}`}><span>{message.text}</span></div>)}{loading && <div className="message bot"><span className="typing">•••</span></div>}</div><form className="chat-input" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} disabled={loading} aria-label={lang === "ru" ? "Сообщение для AI" : "AI-ға хабарлама"} placeholder={lang === "ru" ? "Напиши сообщение..." : "Хабарлама жаз..."} /><button disabled={loading} aria-label={lang === "ru" ? "Отправить сообщение" : "Хабарламаны жіберу"}><Send size={18} /></button></form></div><aside className="chat-tips"><ShieldCheck size={27} /><h3>{lang === "ru" ? "Важно" : "Маңызды"}</h3><ul><li>{lang === "ru" ? "Не отправляй личные данные" : "Жеке деректерді жіберме"}</li><li>{lang === "ru" ? "Расскажи доверенному взрослому" : "Сенімді ересекке айт"}</li><li>{lang === "ru" ? "При срочной опасности — 112" : "Шұғыл қауіпте — 112"}</li></ul></aside></div></section>;
}

function EnhancedLessonsPanel({ lang }: { lang: Lang }) { const [active, setActive] = useState<(typeof youtubeLessons)[number] | null>(null); return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Учись защищать себя" : "Өзіңді қорғауды үйрен"}</span><h1>{lang === "ru" ? "Видеоуроки на казахском" : "Қазақ тіліндегі бейнесабақтар"}</h1><p>{lang === "ru" ? "Четыре видео о буллинге от авторов на YouTube." : "YouTube авторларының буллинг туралы төрт бейнесі."}</p></div><VideoCards videos={youtubeLessons} lang={lang} onPlay={setActive} />{active && <VideoModal video={active} onClose={() => setActive(null)} />}</section>; }

function EnhancedQuizPanel({ lang, onSection }: { lang: Lang; onSection: (section: Section) => void }) { const questions = lang === "ru" ? ["Тебя регулярно дразнят или унижают?", "Тебе угрожают?", "Тебя намеренно исключают из компании?", "Ты боишься идти в школу из-за других учеников?"] : ["Сені үнемі мазақтай ма?", "Саған қорқыта ма?", "Сені әдейі ортадан шеттете ме?", "Басқа оқушылардан қорқып мектепке барғың келмей ме?"]; const [step,setStep]=useState(0); const [yes,setYes]=useState(0); const done=step>=questions.length; function answer(value:boolean){if(value)setYes((n)=>n+1);setStep((n)=>n+1);} return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Самопроверка" : "Өзін-өзі тексеру"}</span><h1>{lang === "ru" ? "Это похоже на буллинг?" : "Бұл буллингке ұқсай ма?"}</h1><p>{lang === "ru" ? "Тест не ставит диагноз и не обвиняет." : "Тест диагноз қоймайды және айыптамайды."}</p></div><div className="quiz-card">{!done?<><div className="quiz-progress"><span>{step+1} / {questions.length}</span><i><b style={{width:`${((step+1)/questions.length)*100}%`}} /></i></div><h2>{questions[step]}</h2><div className="quiz-actions"><button onClick={()=>answer(true)}>{lang === "ru" ? "Да" : "Иә"}</button><button onClick={()=>answer(false)}>{lang === "ru" ? "Нет" : "Жоқ"}</button></div></>:<div className="quiz-result"><span className="result-icon"><HeartHandshake size={32}/></span><h2>{yes>=2?(lang === "ru" ? "Стоит поговорить со взрослым" : "Ересекпен сөйлескен дұрыс"):(lang === "ru" ? "Явных признаков немного" : "Айқын белгілер аз")}</h2><p>{lang === "ru" ? "Твои чувства важны. Если что-то беспокоит — расскажи взрослому." : "Сезімің маңызды. Бір нәрсе мазаласа, ересекке айт."}</p><div><button className="primary-button" onClick={()=>{setStep(0);setYes(0);}}>{lang === "ru" ? "Снова" : "Қайта"}</button><button className="secondary-button" onClick={()=>onSection("chat")}>{lang === "ru" ? "Открыть чат" : "Чатты ашу"}</button></div></div>}</div></section>; }

function EnhancedLibraryPanel({ lang }: { lang: Lang }) { const [open,setOpen]=useState<number|null>(null); const items=lang === "ru" ? [["Как сказать «стоп» спокойно","Скажи: «Мне это не нравится. Остановись». Отойди к людям и расскажи взрослому."],["Что сохранить при кибербуллинге","Сохрани скриншоты, ссылки, дату и имя аккаунта. Заблокируй отправителя и покажи взрослому."],["Как поддержать друга","Выслушай, скажи «я тебе верю» и предложи вместе обратиться к взрослому."],["К кому обратиться в школе","Классный руководитель, психолог, завуч или доверенный взрослый. При прямой угрозе — 112."]] : [["«Тоқта» деп қалай айтуға болады","«Маған бұл ұнамайды. Тоқтат» де. Адамдар бар жерге барып, ересекке айт."],["Кибербуллингте нені сақтау керек","Скриншот, сілтеме, күн және аккаунт атын сақта. Жіберушіні бұғаттап, ересекке көрсет."],["Досыңа қалай қолдау көрсетуге болады","Тыңда, «мен саған сенемін» де және ересекке бірге баруды ұсын."],["Мектепте кімге жүгінуге болады","Сынып жетекшісі, психолог, директор орынбасары немесе сенімді ересек. Тікелей қауіпте — 112."]]; return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Полезно знать" : "Білу пайдалы"}</span><h1>{lang === "ru" ? "База знаний" : "Білім қоры"}</h1></div><div className="library-grid">{items.map(([title,body],index)=><article className={open===index?"expanded":""} key={title}><span className={`library-number n${index+1}`}>0{index+1}</span><small>Qorgau AI</small><h3>{title}</h3>{open===index&&<p className="library-copy">{body}</p>}<button onClick={()=>setOpen(open===index?null:index)}>{open===index?(lang === "ru" ? "Свернуть" : "Жабу"):(lang === "ru" ? "Читать" : "Оқу")}<ArrowRight size={17}/></button></article>)}</div></section>; }

function AccountManager({ lang, accounts, onCreate, onDelete }: {
  lang: Lang;
  accounts: Account[];
  onCreate: (account: Account & { password: string }) => Promise<string | null>;
  onDelete: (account: Account) => Promise<boolean>;
}) {
  const [role, setRole] = useState<Exclude<Role, "site_admin">>("student");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const first = String(data.get("firstName") || "").trim();
    const last = String(data.get("lastName") || "").trim();
    const login = String(data.get("login") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    const grade = String(data.get("classNumber") || "");
    const letter = String(data.get("classLetter") || "").trim().toUpperCase();

    if (!first || !last || !login || password.length < 6 || (role === "student" && (!grade || !letter))) {
      setNotice(lang === "ru" ? "Заполните все поля; пароль — минимум 6 символов." : "Барлық өрісті толтырыңыз; құпиясөз кемінде 6 таңба.");
      return;
    }
    if ([...demoAccounts, ...accounts].some((item) => item.login.toLowerCase() === login)) {
      setNotice(lang === "ru" ? "Такой логин уже используется." : "Бұл логин қолданыста.");
      return;
    }

    const metas = {
      student: { ru: `${grade} «${letter}» класс`, kk: `${grade} «${letter}» сынып` },
      teacher: { ru: "Учитель", kk: "Мұғалім" },
      psychologist: { ru: "Школьный психолог", kk: "Мектеп психологы" },
      admin: { ru: "Завуч школы", kk: "Директор орынбасары" },
    };

    setSubmitting(true);
    const saveError = await onCreate({
      login,
      password,
      role,
      name: `${first} ${last}`,
      initials: `${first[0]}${last[0]}`.toUpperCase(),
      meta: metas[role],
      classNumber: grade || undefined,
      classLetter: letter || undefined,
    });
    setSubmitting(false);
    if (saveError) {
      setNotice(saveError);
      return;
    }

    setNotice(`${lang === "ru" ? "Аккаунт создан" : "Аккаунт ашылды"}: ${login} / ${password}`);
    form.reset();
    setRole("student");
  }

  async function remove(account: Account) {
    setDeletingId(account.id || account.login);
    const deleted = await onDelete(account);
    setDeletingId("");
    if (!deleted) setNotice(lang === "ru" ? "Не удалось удалить аккаунт." : "Аккаунт жойылмады.");
  }

  return <section className="panel-page">
    <div className="page-title">
      <span>{lang === "ru" ? "Только для администратора" : "Тек әкімшіге"}</span>
      <h1>{lang === "ru" ? "Создание аккаунтов" : "Аккаунт ашу"}</h1>
      <p>{lang === "ru" ? "Аккаунты сохраняются на защищённом сервере и работают на любом устройстве." : "Аккаунттар қорғалған серверде сақталып, барлық құрылғыда жұмыс істейді."}</p>
    </div>
    <div className="account-layout">
      <form className="account-form" onSubmit={create}>
        <div className="account-form-heading"><UserPlus size={25}/><h2>{lang === "ru" ? "Новый пользователь" : "Жаңа пайдаланушы"}</h2></div>
        <div className="form-grid">
          <label>{lang === "ru" ? "Имя" : "Аты"}<input name="firstName" disabled={submitting}/></label>
          <label>{lang === "ru" ? "Фамилия" : "Тегі"}<input name="lastName" disabled={submitting}/></label>
          <label>{lang === "ru" ? "Роль" : "Рөлі"}<select value={role} disabled={submitting} onChange={(event) => setRole(event.target.value as Exclude<Role, "site_admin">)}><option value="student">{lang === "ru" ? "Ученик" : "Оқушы"}</option><option value="teacher">{lang === "ru" ? "Учитель" : "Мұғалім"}</option><option value="psychologist">Психолог</option><option value="admin">{lang === "ru" ? "Завуч" : "Директор орынбасары"}</option></select></label>
          <label>{lang === "ru" ? "Логин" : "Логин"}<input name="login" autoComplete="off" disabled={submitting}/></label>
          <label className="form-wide">{lang === "ru" ? "Пароль" : "Құпиясөз"}<input name="password" type="text" autoComplete="new-password" disabled={submitting}/></label>
          {role === "student" && <>
            <label>{lang === "ru" ? "Класс" : "Сынып"}<select name="classNumber" defaultValue="" disabled={submitting}><option value="" disabled>1–11</option>{Array.from({ length: 11 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
            <label>{lang === "ru" ? "Литера" : "Әрпі"}<input name="classLetter" maxLength={2} disabled={submitting}/></label>
          </>}
        </div>
        {notice && <div className="account-notice"><Check size={18}/>{notice}</div>}
        <button className="primary-button" type="submit" disabled={submitting}><Plus size={18}/>{submitting ? (lang === "ru" ? "Сохраняем..." : "Сақталуда...") : (lang === "ru" ? "Создать" : "Ашу")}</button>
      </form>
      <div className="account-list">
        <h2>{lang === "ru" ? "Созданные аккаунты" : "Ашылған аккаунттар"}</h2>
        <p>{lang === "ru" ? "Доступны на всех устройствах" : "Барлық құрылғыда қолжетімді"}</p>
        {accounts.length === 0
          ? <div className="empty-state"><Users size={30}/>{lang === "ru" ? "Пока пусто" : "Әзірге бос"}</div>
          : accounts.map((item) => <div className="account-row" key={item.id}>
              <span className="row-avatar">{item.initials}</span>
              <div><strong>{item.name}</strong><small>{item.login} · {roleLabel(item.role, lang)}</small></div>
              <button type="button" disabled={deletingId === (item.id || item.login)} onClick={() => void remove(item)} aria-label={`${lang === "ru" ? "Удалить аккаунт" : "Аккаунтты жою"}: ${item.name}`}><X size={17}/></button>
            </div>)}
      </div>
    </div>
  </section>;
}

function SupportCenter({ account, lang, onSection }: { account: Account; lang: Lang; onSection: (section: Section) => void }) { const [sent,setSent]=useState(false); function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();const data=new FormData(event.currentTarget);const records=JSON.parse(localStorage.getItem("qorgau-sos-signals")||"[]");records.push({id:crypto.randomUUID(),category:data.get("category"),details:data.get("details"),createdAt:new Date().toISOString(),account:account.login});localStorage.setItem("qorgau-sos-signals",JSON.stringify(records));setSent(true);} return <section className="panel-page support-page"><div className="page-title"><span>SOS · Qorgau AI</span><h1>{lang === "ru" ? "Центр поддержки" : "Қолдау орталығы"}</h1></div><div className="emergency-card"><span className="emergency-icon"><AlertTriangle size={31}/></span><div><strong>{lang === "ru" ? "Есть непосредственная угроза жизни или здоровью?" : "Өмірге немесе денсаулыққа тікелей қауіп бар ма?"}</strong><p>{lang === "ru" ? "Отойди в безопасное место, позови взрослого и позвони в экстренную службу." : "Қауіпсіз жерге барып, ересекті шақыр және жедел қызметке қоңырау шал."}</p></div><a href="tel:112">112</a></div>{account.role==="student"?<div className="support-layout">{sent?<div className="signal-success"><ShieldCheck size={42}/><h2>{lang === "ru" ? "Сигнал сохранён" : "Белгі сақталды"}</h2><p>{lang === "ru" ? "Покажи экран доверенному взрослому. Запись сохранена на этом устройстве." : "Экранды сенімді ересекке көрсет. Жазба осы құрылғыда сақталды."}</p><button className="primary-button" onClick={()=>onSection("chat")}>{lang === "ru" ? "Открыть AI-чат" : "AI-чатты ашу"}</button></div>:<form className="support-form" onSubmit={submit}><h2>{lang === "ru" ? "Сообщить о ситуации" : "Жағдай туралы хабарлау"}</h2><label>{lang === "ru" ? "Что происходит?" : "Не болып жатыр?"}<select name="category"><option>{lang === "ru" ? "Насмешки или оскорбления" : "Мазақ немесе қорлау"}</option><option>{lang === "ru" ? "Угрозы или агрессия" : "Қорқыту немесе агрессия"}</option><option>Кибербуллинг</option></select></label><label>{lang === "ru" ? "Описание" : "Сипаттама"}<textarea name="details" rows={5}/></label><button className="sos-button" type="submit"><AlertTriangle size={20}/>{lang === "ru" ? "Отправить SOS-сигнал" : "SOS белгісін жіберу"}</button></form>}<aside className="support-routes"><h2>{lang === "ru" ? "Кому сказать" : "Кімге айту"}</h2>{[lang === "ru" ? "Классному руководителю" : "Сынып жетекшісіне",lang === "ru" ? "Школьному психологу" : "Мектеп психологына",lang === "ru" ? "Завучу или родителю" : "Директор орынбасарына не ата-анаға"].map((text,index)=><div key={text}><span>{index+1}</span>{text}</div>)}</aside></div>:<div className="support-staff"><HeartHandshake size={38}/><h2>{lang === "ru" ? "Маршрут помощи" : "Көмек жолы"}</h2><p>{lang === "ru" ? "Зафиксируйте факты, обеспечьте безопасность ребёнка и подключите психолога. При срочной угрозе звоните 112." : "Фактілерді тіркеп, баланың қауіпсіздігін қамтамасыз етіңіз және психологты қосыңыз. Шұғыл қауіпте 112-ге қоңырау шалыңыз."}</p><button className="primary-button" onClick={()=>onSection(account.role==="psychologist"?"reports":"observations")}>{lang === "ru" ? "Перейти к работе" : "Жұмысқа өту"}</button></div>}</section>; }

function ProgressPanel({ lang }: { lang: Lang }) { return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Твои результаты" : "Сенің нәтижең"}</span><h1>{lang === "ru" ? "Мой прогресс" : "Менің үлгерімім"}</h1><p>{lang === "ru" ? "Небольшие шаги тоже считаются." : "Кішкентай қадамдар да маңызды."}</p></div><div className="progress-overview"><article className="score-card"><div className="score-ring"><strong>68%</strong><span>{lang === "ru" ? "пройдено" : "аяқталды"}</span></div><div><h2>{lang === "ru" ? "Отличное начало" : "Керемет бастама"}</h2><p>{lang === "ru" ? "Ты завершил 7 из 10 материалов этого уровня." : "Осы деңгейдегі 10 материалдың 7-еуін аяқтадың."}</p></div></article><article className="stats-card"><div><BookOpen /><strong>7</strong><span>{lang === "ru" ? "уроков" : "сабақ"}</span></div><div><ClipboardCheck /><strong>3</strong><span>{lang === "ru" ? "теста" : "тест"}</span></div><div><Clock3 /><strong>48</strong><span>{lang === "ru" ? "минут" : "минут"}</span></div></article></div></section>; }
