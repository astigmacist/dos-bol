import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

function fallbackAnswer(text: string, lang: "ru" | "kk") {
  const value = text.toLowerCase();
  const urgent = /угрож|удар|бь[её]т|опас|оруж|қорқыт|ұрды|соғ|қауіп/.test(value);
  const online = /интернет|онлайн|аккаунт|сообщен|чат|кибер|скрин|желі|хабарлама/.test(value);

  if (urgent) {
    return lang === "ru"
      ? "Сейчас главное — твоя безопасность. Отойди туда, где есть взрослые, сразу расскажи учителю, родителю или психологу. Если опасность происходит прямо сейчас, звони 112."
      : "Қазір ең маңыздысы — сенің қауіпсіздігің. Ересектер бар жерге барып, мұғалімге, ата-анаға немесе психологқа бірден айт. Қауіп дәл қазір болып жатса, 112-ге қоңырау шал.";
  }
  if (online) {
    return lang === "ru"
      ? "Не отвечай обидчику и не пересылай сообщение. Сохрани скриншоты, заблокируй аккаунт и покажи всё взрослому, которому доверяешь."
      : "Ренжіткен адамға жауап берме және хабарламаны таратпа. Скриншоттарды сақтап, аккаунтты бұғатта да, сенетін ересекке көрсет.";
  }
  return lang === "ru"
    ? "Спасибо, что рассказал. Ты не обязан справляться с этим один. Расскажи доверенному взрослому, что произошло, где и как часто это повторяется."
    : "Айтқаның үшін рақмет. Мұнымен жалғыз күресуге міндетті емессің. Сенетін ересекке не болғанын, қай жерде және қаншалықты жиі қайталанатынын айт.";
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
    if (!latest) return NextResponse.json({ error: "empty_message" }, { status: 400 });

    const system = lang === "ru"
      ? "Ты бережный школьный помощник Dos Bol по теме буллинга. Отвечай по-русски, кратко, спокойно и по возрасту. Не обвиняй, не ставь диагноз и не проси личные данные. Дай 2–4 конкретных безопасных шага. Предлагай обратиться к доверенному взрослому или школьному психологу. При прямой угрозе советуй отойти в безопасное место, позвать взрослого и позвонить 112."
      : "Сен буллинг тақырыбындағы Dos Bol мектеп көмекшісісің. Қазақша, қысқа, сабырлы және жасына сай жауап бер. Айыптама, диагноз қойма және жеке дерек сұрама. 2–4 нақты қауіпсіз қадам ұсын. Сенімді ересекке немесе мектеп психологына жүгінуді ұсын. Тікелей қауіпте қауіпсіз жерге барып, ересекті шақырып, 112-ге қоңырау шалуды айт.";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "system", content: system }, ...messages],
          temperature: 0.35,
          max_tokens: 350,
          private: true,
        }),
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`AI provider returned ${response.status}`);
      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const rawAnswer = payload.choices?.[0]?.message?.content?.trim();
      if (!rawAnswer) throw new Error("AI provider returned an empty response");
      const answer = rawAnswer
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .slice(0, 2500);
      return NextResponse.json({ answer });
    } catch (error) {
      console.error("AI provider unavailable", error);
      return NextResponse.json({ answer: fallbackAnswer(latest, lang), fallback: true });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("AI chat request failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}
