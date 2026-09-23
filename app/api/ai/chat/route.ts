import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

function fallbackAnswer(text: string, lang: "ru" | "kk", previousAssistant?: string) {
  const value = text.toLowerCase();
  const urgent = /угрож|удар|бь[её]т|опас|оруж|қорқыт|ұрды|соғ|қауіп/.test(value);
  const online = /интернет|онлайн|аккаунт|сообщен|чат|кибер|скрин|желі|хабарлама/.test(value);
  const exhausted = /устал|устала|сил нет|не могу больше|надоело|шарша|бәрінен|шыдай алмай/.test(value);
  const mocked = /обзыва|дразн|унижа|смеют|насмеш|мазақ|келемеж|кемсіт|күле/.test(value);
  const excluded = /игнор|исключ|не любят|не дружат|одиноко|жалғыз|елемей|ұнатпай|шеттет|дос емес/.test(value);
  const afraid = /боюсь|страшно|қорқам|қорқыныш/.test(value);

  let answer: string;

  if (urgent) {
    answer = lang === "ru"
      ? "Сейчас главное — твоя безопасность. Отойди туда, где есть взрослые, сразу расскажи учителю, родителю или психологу. Если опасность происходит прямо сейчас, звони 112."
      : "Қазір ең маңыздысы — сенің қауіпсіздігің. Ересектер бар жерге барып, мұғалімге, ата-анаға немесе психологқа бірден айт. Қауіп дәл қазір болып жатса, 112-ге қоңырау шал.";
  } else if (exhausted) {
    answer = lang === "ru"
      ? "Похоже, ты очень устал от этой ситуации. Не оставайся сейчас один: подойди к взрослому, которому доверяешь, и скажи прямо: «Мне тяжело, побудь со мной». Можно начать именно с этой одной фразы. Если появились мысли навредить себе или рядом есть опасность — сразу звони 112."
      : "Бұл жағдайдан қатты шаршағаның сезіліп тұр. Қазір жалғыз қалма: сенетін ересекке барып, «Маған өте қиын, қасымда болшы» деп айт. Әзірге осы бір сөйлемнен бастау жеткілікті. Өзіңе зиян келтіру ойы келсе немесе қауіп төнсе, бірден 112-ге хабарлас.";
  } else if (online) {
    answer = lang === "ru"
      ? "Не отвечай обидчику и не пересылай сообщение. Сохрани скриншоты, заблокируй аккаунт и покажи всё взрослому, которому доверяешь."
      : "Ренжіткен адамға жауап берме және хабарламаны таратпа. Скриншоттарды сақтап, аккаунтты бұғатта да, сенетін ересекке көрсет.";
  } else if (mocked) {
    answer = lang === "ru"
      ? "Обзывания — это не твоя вина и не норма. Запиши, кто, где и когда это делает, а сегодня покажи записи классному руководителю, родителю или психологу. Если это безопасно, спокойно скажи: «Мне неприятно. Прекрати» — и отойди к людям."
      : "Мазақтау — сенің кінәң емес және бұл қалыпты жағдай емес. Кім, қайда және қашан мазақтағанын жазып ал да, бүгін сынып жетекшісіне, ата-анаңа немесе психологқа көрсет. Қауіпсіз болса, «Маған бұл ұнамайды. Тоқтат» деп айтып, адамдар бар жерге бар.";
  } else if (excluded) {
    answer = lang === "ru"
      ? "Когда одноклассники отстраняются, это действительно больно. Выбери одного безопасного человека — учителя, психолога, родителя или спокойного одноклассника — и расскажи ему конкретный недавний случай. Вместе будет легче решить, как остановить исключение из компании."
      : "Сыныптастарың шеттеткенде, бұл шынымен ауыр тиеді. Бір сенімді адамды — мұғалімді, психологты, ата-ананы немесе сабырлы сыныптасты — таңдап, оған жақында болған нақты жағдайды айт. Бірге шеттетуді тоқтатудың жолын табу жеңілірек болады.";
  } else if (afraid) {
    answer = lang === "ru"
      ? "Я слышу, что тебе страшно. Сначала перейди туда, где есть люди и взрослые, затем позвони или напиши тому, кому доверяешь. Скажи, где ты и что именно тебя пугает; если угроза рядом — звони 112."
      : "Қорқып тұрғаныңды түсіндім. Алдымен адамдар мен ересектер бар жерге бар, содан кейін сенетін адамыңа қоңырау шал немесе жаз. Қайда екеніңді және неден қорқатыныңды айт; қауіп жақын болса, 112-ге хабарлас.";
  } else {
    answer = lang === "ru"
      ? "Я тебя слышу. Давай выберем один небольшой шаг: сегодня расскажи доверенному взрослому один конкретный случай — что произошло, где и кто был рядом. Если хочешь, напиши здесь подробнее, что случилось последним."
      : "Мен сені естіп тұрмын. Бір шағын қадам таңдайық: бүгін сенетін ересекке бір нақты жағдайды — не болғанын, қайда және кім болғанын — айт. Қаласаң, соңғы рет не болғанын осында толығырақ жаз.";
  }

  if (previousAssistant && previousAssistant.trim() === answer.trim()) {
    return lang === "ru"
      ? "Ситуация продолжается, поэтому нужен следующий шаг. Выбери взрослого, к которому можешь подойти прямо сегодня, и скажи: «Со мной это происходит не один раз, мне нужна помощь». Если хочешь, я помогу составить сообщение для него."
      : "Жағдай жалғасып жатыр, сондықтан келесі қадам керек. Бүгін-ақ сөйлесе алатын ересекті таңдап, «Бұл менімен бірнеше рет болды, маған көмек керек» деп айт. Қаласаң, оған жіберетін хабарламаны бірге құрастырамыз.";
  }
  return answer;
}

async function requestAI(system: string, messages: ChatMessage[]) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    try {
      const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "system", content: system }, ...messages],
          temperature: 0.45,
          max_tokens: 350,
          private: true,
        }),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const answer = payload.choices?.[0]?.message?.content?.trim();
      if (!answer) throw new Error("AI provider returned an empty response");
      return answer;
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError ?? new Error("AI provider unavailable");
}

export async function POST(request: Request) {
  try {
    const account = await currentAccount();
    if (!account) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = await request.json() as { lang?: string; messages?: unknown };
    const lang = body.lang === "kk" ? "kk" : "ru";
    const messages = Array.isArray(body.messages)
      ? body.messages.flatMap((item): ChatMessage[] => {
          if (!item || typeof item !== "object") return [];
          const value = item as Partial<ChatMessage>;
          if ((value.role !== "user" && value.role !== "assistant") || typeof value.content !== "string") return [];
          const content = value.content.trim().slice(0, 1200);
          return content ? [{ role: value.role, content }] : [];
        }).slice(-8)
      : [];

    const latest = [...messages].reverse().find((message) => message.role === "user")?.content;
    const previousAssistant = [...messages].reverse().find((message) => message.role === "assistant")?.content;
    if (!latest) return NextResponse.json({ error: "empty_message" }, { status: 400 });

    const system = lang === "ru"
      ? "Ты бережный школьный помощник Dos Bol по теме буллинга. Отвечай по-русски, кратко, спокойно и по возрасту. Всегда отвечай именно на последнюю реплику с учётом всей беседы; не повторяй дословно уже данный совет. Не обвиняй, не ставь диагноз и не проси личные данные. Дай 2–4 конкретных безопасных шага. Предлагай обратиться к доверенному взрослому или школьному психологу. При прямой угрозе советуй отойти в безопасное место, позвать взрослого и позвонить 112."
      : "Сен буллинг тақырыбындағы Dos Bol мектеп көмекшісісің. Қазақша, қысқа, сабырлы және жасына сай жауап бер. Әрқашан бүкіл әңгімені ескеріп, соңғы хабарламаға нақты жауап бер; бұрынғы кеңесті сөзбе-сөз қайталама. Айыптама, диагноз қойма және жеке дерек сұрама. 2–4 нақты қауіпсіз қадам ұсын. Сенімді ересекке немесе мектеп психологына жүгінуді ұсын. Тікелей қауіпте қауіпсіз жерге барып, ересекті шақырып, 112-ге қоңырау шалуды айт.";

    try {
      const rawAnswer = await requestAI(system, messages);
      const answer = rawAnswer
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .slice(0, 2500);
      return NextResponse.json({ answer });
    } catch (error) {
      console.error("AI provider unavailable", error);
      return NextResponse.json({ answer: fallbackAnswer(latest, lang, previousAssistant), fallback: true });
    }
  } catch (error) {
    console.error("AI chat request failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}
