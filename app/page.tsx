"use client";

import {
  ArrowRight,
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
  Users,
  Video,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Lang = "kk" | "ru";
type Theme = "light" | "dark";
type Role = "student" | "teacher" | "psychologist" | "admin";
type Section = "home" | "chat" | "lessons" | "test" | "library" | "progress" | "classes" | "observations" | "students" | "reports" | "cases" | "meetings" | "analytics" | "users" | "settings";
type DemoAccount = { login: string; password: string; role: Role; name: string; initials: string; meta: { ru: string; kk: string } };

const demoAccounts: DemoAccount[] = [
  { login: "student", password: "Student123!", role: "student", name: "Аян Серік", initials: "АС", meta: { ru: "7 «А» класс", kk: "7 «А» сынып" } },
  { login: "teacher", password: "Teacher123!", role: "teacher", name: "Данияр Қасымов", initials: "ДҚ", meta: { ru: "Классный руководитель · 7 «А»", kk: "Сынып жетекшісі · 7 «А»" } },
  { login: "psychologist", password: "Psycho123!", role: "psychologist", name: "Айгүл Омарова", initials: "АО", meta: { ru: "Школьный психолог", kk: "Мектеп психологы" } },
  { login: "admin", password: "Admin123!", role: "admin", name: "Гүлмира Әлиева", initials: "ГӘ", meta: { ru: "Администратор школы · завуч", kk: "Мектеп әкімшісі · директор орынбасары" } },
];

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

const lessons = [
  { age: "1–4", title: "Добрые и недобрые шутки", time: "6 мин", color: "coral" },
  { age: "5–7", title: "Как распознать буллинг", time: "9 мин", color: "lime" },
  { age: "8–11", title: "Личные границы онлайн", time: "12 мин", color: "blue" },
];

export default function QorgauAIApp() {
  const [lang, setLang] = useState<Lang>("ru");
  const [theme, setTheme] = useState<Theme>("light");
  const [loginOpen, setLoginOpen] = useState(false);
  const [activeAccount, setActiveAccount] = useState<DemoAccount | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [section, setSection] = useState<Section>("home");
  const [error, setError] = useState("");
  const t = copy[lang];

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = lang;
    localStorage.setItem("ss-theme", theme);
    localStorage.setItem("ss-lang", lang);
  }, [theme, lang]);

  function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const login = String(data.get("login") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    if (!login || !password) {
      setError(t.error);
      return;
    }
    const account = demoAccounts.find((item) => item.login === login && item.password === password);
    if (!account) {
      setError(lang === "ru" ? "Неверный логин или пароль." : "Логин немесе құпиясөз қате.");
      return;
    }
    setError("");
    setLoginOpen(false);
    setSection("home");
    setActiveAccount(account);
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
        onLogout={() => { setActiveAccount(null); setSection("home"); }}
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
            {featureData[lang].map(([Icon, title, text], index) => <article className={`feature-card feature-${index + 1}`} key={title}><div className="feature-icon"><Icon size={25} /></div><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><button aria-label={title}><ArrowRight size={18} /></button></article>)}
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
          <div className="lesson-grid">
            {lessons.map((lesson, index) => <article className="lesson-card" key={lesson.title}><div className={`lesson-cover ${lesson.color}`}><span>{lesson.age} {lang === "ru" ? "класс" : "сынып"}</span><button aria-label="Бейнені ойнату"><Play fill="currentColor" size={23} /></button><div className="cover-shape shape-a" /><div className="cover-shape shape-b" /></div><div className="lesson-body"><span>{lang === "ru" ? `Урок ${index + 1}` : `${index + 1}-сабақ`}</span><h3>{lang === "ru" ? lesson.title : ["Жақсы және жаман әзіл", "Буллингті қалай танимыз", "Интернеттегі жеке шекара"][index]}</h3><p><Clock3 size={15} />{lesson.time}</p></div></article>)}
          </div>
        </section>

        <section className="cta-section section-pad">
          <div className="cta-icon"><HeartHandshake size={36} /></div><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p></div><button className="primary-button light-button" onClick={() => setLoginOpen(true)}>{t.login}<ArrowRight size={19} /></button>
        </section>
      </main>

      <footer><a className="brand" href="#top"><span className="brand-mark"><ShieldCheck size={22} /></span><span>Qorgau AI</span></a><p>{t.footer}</p><div><a href="#about">{lang === "ru" ? "Конфиденциальность" : "Құпиялық"}</a><a href="#resources">{lang === "ru" ? "Материалы" : "Материалдар"}</a></div></footer>

      {loginOpen && <div className="modal-backdrop"><div className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title"><button className="modal-close" onClick={() => setLoginOpen(false)} aria-label="Жабу"><X size={21} /></button><div className="modal-brand"><span className="brand-mark"><ShieldCheck size={23} /></span><span>Qorgau AI</span></div><div className="modal-icon"><LockKeyhole size={26} /></div><h2 id="login-title">{t.modalTitle}</h2><p>{t.modalText}</p><form onSubmit={submitLogin}><label>{t.username}<input name="login" autoComplete="username" placeholder={lang === "ru" ? "Введите логин" : "Логинді енгізіңіз"} /></label><label>{t.password}<input name="password" type="password" autoComplete="current-password" placeholder="••••••••" /></label><div className="form-meta"><label className="checkbox"><input type="checkbox" />{t.remember}</label><a href="#help">{lang === "ru" ? "Нужна помощь?" : "Көмек керек пе?"}</a></div>{error && <div className="form-error" role="alert"><CircleHelp size={17} />{error}</div>}<button className="primary-button modal-submit" type="submit">{t.enter}<ArrowRight size={18} /></button></form><div className="modal-note"><ShieldCheck size={17} />{lang === "ru" ? "Защищённое соединение" : "Қорғалған байланыс"}</div></div></div>}
    </div>
  );
}

function Dashboard({ account, lang, theme, section, menuOpen, onSection, onMenu, onTheme, onLang, onLogout }: { account: DemoAccount; lang: Lang; theme: Theme; section: Section; menuOpen: boolean; onSection: (section: Section) => void; onMenu: () => void; onTheme: () => void; onLang: () => void; onLogout: () => void }) {
  const t = copy[lang];
  const roleNav: Record<Role, [Section, typeof LayoutDashboard, string, string][]> = {
    student: [["home", LayoutDashboard, "Главная", "Басты бет"], ["chat", MessageCircle, "Чат поддержки", "Қолдау чаты"], ["lessons", Video, "Видеоуроки", "Бейнесабақтар"], ["test", ClipboardCheck, "Тест о буллинге", "Буллинг тесті"], ["library", BookOpen, "База знаний", "Білім қоры"], ["progress", BarChart3, "Мой прогресс", "Менің үлгерімім"]],
    teacher: [["home", LayoutDashboard, "Обзор класса", "Сынып шолуы"], ["classes", School, "Мои классы", "Менің сыныптарым"], ["observations", FileWarning, "Новое наблюдение", "Жаңа бақылау"], ["students", Users, "Ученики", "Оқушылар"], ["library", BookOpen, "Материалы для класса", "Сынып материалдары"], ["reports", Bell, "Уведомления", "Хабарламалар"]],
    psychologist: [["home", LayoutDashboard, "Рабочий стол", "Жұмыс үстелі"], ["reports", FileWarning, "Инциденты", "Оқиғалар"], ["students", Users, "Ученики риска", "Тәуекелдегі оқушылар"], ["cases", FileCheck2, "Кейсы", "Кейстер"], ["meetings", CalendarDays, "Встречи", "Кездесулер"], ["analytics", BarChart3, "Аналитика", "Аналитика"]],
    admin: [["home", LayoutDashboard, "Обзор школы", "Мектеп шолуы"], ["analytics", PieChart, "Аналитика", "Аналитика"], ["classes", School, "Классы", "Сыныптар"], ["users", UserCog, "Пользователи", "Пайдаланушылар"], ["students", Users, "Ученики", "Оқушылар"], ["settings", Settings, "Настройки", "Баптаулар"]],
  };
  const nav = roleNav[account.role];
  const sidebarAction = account.role === "student"
    ? [lang === "ru" ? "Нужна срочная помощь?" : "Шұғыл көмек керек пе?", lang === "ru" ? "Сообщи школьному специалисту" : "Мектеп маманына белгі бер", lang === "ru" ? "Сообщить" : "Хабарлау"]
    : account.role === "psychologist"
      ? [lang === "ru" ? "Дежурная линия" : "Кезекші желі", lang === "ru" ? "3 сигнала требуют внимания" : "3 белгі назарды қажет етеді", lang === "ru" ? "Открыть" : "Ашу"]
      : [lang === "ru" ? "Центр поддержки" : "Қолдау орталығы", lang === "ru" ? "Правила и маршруты помощи" : "Ереже және көмек жолдары", lang === "ru" ? "Открыть" : "Ашу"];
  return <div className="dashboard-shell">
    <aside className={`dashboard-sidebar ${menuOpen ? "open" : ""}`}>
      <div className="sidebar-top"><button className="brand sidebar-brand" onClick={() => onSection("home")}><span className="brand-mark"><ShieldCheck size={22} /></span><span>Qorgau AI</span></button><button className="sidebar-close" onClick={onMenu}><X size={20} /></button></div>
      <div className="student-mini"><div className="avatar">{account.initials}</div><div><strong>{account.name}</strong><span>{account.meta[lang]}</span></div></div>
      <nav>{nav.map(([id, Icon, ru, kk]) => <button className={section === id ? "active" : ""} onClick={() => onSection(id)} key={id}><Icon size={19} /><span>{lang === "ru" ? ru : kk}</span>{((account.role === "student" && id === "chat") || (account.role === "psychologist" && id === "reports")) && <i>{account.role === "student" ? 2 : 3}</i>}</button>)}</nav>
      <div className="sidebar-support"><HeartHandshake size={23} /><strong>{sidebarAction[0]}</strong><span>{sidebarAction[1]}</span><button>{sidebarAction[2]}</button></div>
      <button className="logout-button" onClick={onLogout}><LogOut size={18} />{lang === "ru" ? "Выйти" : "Шығу"}</button>
    </aside>
    {menuOpen && <button className="sidebar-scrim" onClick={onMenu} aria-label="Мәзірді жабу" />}
    <div className="dashboard-main">
      <header className="dashboard-header"><button className="dash-menu" onClick={onMenu}><Menu size={21} /></button><div className="dash-search"><Search size={18} /><input placeholder={lang === "ru" ? "Поиск по кабинету..." : "Кабинеттен іздеу..."} /></div><div className="role-pill">{roleLabel(account.role, lang)}</div><div className="dash-actions"><button onClick={onLang}><Languages size={18} /><span>{lang === "ru" ? "RU" : "ҚАЗ"}</span></button><button onClick={onTheme}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><button><Bell size={18} /><i /></button><div className="dash-avatar">{account.initials}</div></div></header>
      <main className="dashboard-content">
        {section === "home" && (account.role === "student" ? <DashboardHome lang={lang} t={t} onSection={onSection} /> : <StaffDashboardHome account={account} lang={lang} onSection={onSection} />)}
        {account.role === "student" && section === "chat" && <ChatPanel lang={lang} />}
        {account.role === "student" && section === "lessons" && <LessonsPanel lang={lang} />}
        {account.role === "student" && section === "test" && <QuizPanel lang={lang} />}
        {section === "library" && <LibraryPanel lang={lang} />}
        {account.role === "student" && section === "progress" && <ProgressPanel lang={lang} />}
        {account.role !== "student" && section !== "home" && section !== "library" && <RoleWorkspace role={account.role} section={section} lang={lang} />}
      </main>
    </div>
  </div>;
}

function roleLabel(role: Role, lang: Lang) {
  const labels: Record<Role, { ru: string; kk: string }> = {
    student: { ru: "Ученик", kk: "Оқушы" }, teacher: { ru: "Учитель", kk: "Мұғалім" }, psychologist: { ru: "Психолог", kk: "Психолог" }, admin: { ru: "Администратор школы", kk: "Мектеп әкімшісі" },
  };
  return labels[role][lang];
}

function StaffDashboardHome({ account, lang, onSection }: { account: DemoAccount; lang: Lang; onSection: (section: Section) => void }) {
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
  }[account.role as "teacher" | "psychologist" | "admin"];
  return <>
    <section className={`staff-welcome role-${account.role}`}><div><span>{content.eyebrow}</span><h1>{content.title}</h1><p>{content.text}</p></div><div className="staff-hero-mark">{account.role === "teacher" ? <GraduationCap size={54} /> : account.role === "psychologist" ? <HeartHandshake size={54} /> : <School size={54} />}</div></section>
    <section className="staff-metrics">{content.metrics.map(([value, ru, kk, tone]) => <StaffMetric key={ru} value={value} label={lang === "ru" ? ru : kk} tone={tone} />)}</section>
    <section className="staff-actions">{content.actions.map(([section, Icon, ru, kk], index) => <button onClick={() => onSection(section)} key={section}><span className={`staff-action-icon a${index + 1}`}><Icon size={21} /></span><strong>{lang === "ru" ? ru : kk}</strong><ArrowRight size={18} /></button>)}</section>
    <StaffOverview role={account.role} lang={lang} onSection={onSection} />
  </>;
}

function StaffMetric({ value, label, tone }: { value: string; label: string; tone: string }) { return <article className={`staff-metric ${tone}`}><span>{label}</span><strong>{value}</strong><i /></article>; }

function StaffOverview({ role, lang, onSection }: { role: Role; lang: Lang; onSection: (section: Section) => void }) {
  const data = role === "teacher" ? {
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
  return <section className="panel-page role-workspace"><div className="page-title"><span>{roleLabel(role, lang)}</span><h1>{lang === "ru" ? title[0] : title[1]}</h1><p>{lang === "ru" ? title[2] : title[3]}</p></div>{section === "analytics" ? <AnalyticsWorkspace lang={lang} /> : section === "settings" ? <SettingsWorkspace lang={lang} /> : <div className="workspace-card"><div className="workspace-toolbar"><div className="dash-search"><Search size={18} /><input placeholder={lang === "ru" ? "Поиск..." : "Іздеу..."} /></div><button><Check size={17} />{lang === "ru" ? "Добавить" : "Қосу"}</button></div><div className="workspace-table">{rows.map(([a, b, c]) => <div key={`${a}-${b}`}><strong>{a}</strong><span>{b}</span><b>{c}</b><button aria-label="Ашу"><ArrowRight size={17} /></button></div>)}</div></div>}</section>;
}

function ObservationForm({ lang }: { lang: Lang }) { const [sent, setSent] = useState(false); return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Наблюдение учителя" : "Мұғалім бақылауы"}</span><h1>{lang === "ru" ? "Зафиксировать ситуацию" : "Жағдайды тіркеу"}</h1><p>{lang === "ru" ? "Опишите только факты, которые вы лично заметили. Психолог проверит информацию." : "Тек өзіңіз байқаған фактілерді сипаттаңыз. Психолог ақпаратты тексереді."}</p></div><form className="observation-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><label>{lang === "ru" ? "Класс" : "Сынып"}<select><option>7 «А»</option><option>6 «Б»</option><option>8 «В»</option></select></label><label>{lang === "ru" ? "Категория" : "Санат"}<select><option>{lang === "ru" ? "Конфликт" : "Қақтығыс"}</option><option>{lang === "ru" ? "Социальное исключение" : "Әлеуметтік шеттету"}</option><option>{lang === "ru" ? "Угроза" : "Қорқыту"}</option></select></label><label className="form-wide">{lang === "ru" ? "Что вы заметили?" : "Не байқадыңыз?"}<textarea rows={6} placeholder={lang === "ru" ? "Опишите место, время и наблюдаемые действия..." : "Орынды, уақытты және байқалған әрекеттерді сипаттаңыз..."} /></label>{sent && <div className="success-note"><Check size={18} />{lang === "ru" ? "Наблюдение передано психологу." : "Бақылау психологқа жіберілді."}</div>}<button className="primary-button" type="submit">{lang === "ru" ? "Передать специалисту" : "Маманға жіберу"}<ArrowRight size={18} /></button></form></section>; }

function AnalyticsWorkspace({ lang }: { lang: Lang }) { return <div className="analytics-workspace"><div className="analytics-kpis"><StaffMetric value="48" label={lang === "ru" ? "Обращений за месяц" : "Айлық өтініш"} tone="blue" /><StaffMetric value="89%" label={lang === "ru" ? "Решено вовремя" : "Уақтылы шешілді"} tone="lime" /><StaffMetric value="2,1 ч" label={lang === "ru" ? "Средний ответ" : "Орташа жауап"} tone="violet" /></div><article className="analytics-chart"><h2>{lang === "ru" ? "Динамика обращений" : "Өтініш динамикасы"}</h2><div>{[42, 55, 47, 68, 82, 60, 73, 52, 67, 88, 64, 72].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div></article></div>; }
function SettingsWorkspace({ lang }: { lang: Lang }) { return <div className="settings-card">{[["Уведомления о критических событиях", "Критикалық оқиға хабарламалары"], ["Еженедельный отчёт администрации", "Әкімшілікке апталық есеп"], ["Автоматическое назначение психолога", "Психологты автоматты тағайындау"], ["Двухъязычные материалы", "Екі тілдегі материалдар"]].map(([ru, kk], index) => <label key={ru}><span><strong>{lang === "ru" ? ru : kk}</strong><small>{lang === "ru" ? "Системная настройка Qorgau AI" : "Qorgau AI жүйелік баптауы"}</small></span><input type="checkbox" aria-label={lang === "ru" ? ru : kk} defaultChecked={index !== 2} /></label>)}</div>; }

function DashboardHome({ lang, t, onSection }: { lang: Lang; t: (typeof copy)[Lang]; onSection: (section: Section) => void }) {
  return <><section className="dash-welcome"><div><span>{lang === "ru" ? "Личный кабинет" : "Жеке кабинет"}</span><h1>{t.welcome}</h1><p>{t.welcomeText}</p></div><div className="mood-widget"><span>{lang === "ru" ? "Как ты сегодня?" : "Бүгін көңіл-күйің қалай?"}</span><div>{["😄", "🙂", "😐", "😕", "😔"].map((mood) => <button key={mood}>{mood}</button>)}</div></div></section><section className="quick-grid"><QuickCard icon={<MessageCircle />} title={lang === "ru" ? "Поговорить" : "Сөйлесу"} text={lang === "ru" ? "Безопасный чат поддержки" : "Қауіпсіз қолдау чаты"} onClick={() => onSection("chat")} tone="blue" /><QuickCard icon={<Play />} title={lang === "ru" ? "Продолжить урок" : "Сабақты жалғастыру"} text={lang === "ru" ? "Личные границы · 8 мин" : "Жеке шекара · 8 мин"} onClick={() => onSection("lessons")} tone="lime" /><QuickCard icon={<ClipboardCheck />} title={lang === "ru" ? "Пройти тест" : "Тест тапсыру"} text={lang === "ru" ? "Разберись в ситуации" : "Жағдайды түсініп ал"} onClick={() => onSection("test")} tone="coral" /></section><section className="dash-columns"><div className="dashboard-card"><div className="card-heading"><div><span>{lang === "ru" ? "Твой путь" : "Сенің жолың"}</span><h2>{lang === "ru" ? "Прогресс обучения" : "Оқу барысы"}</h2></div><button onClick={() => onSection("progress")}>{lang === "ru" ? "Подробнее" : "Толығырақ"}<ArrowRight size={16} /></button></div><div className="progress-list"><ProgressRow color="blue" title={lang === "ru" ? "Что такое буллинг" : "Буллинг деген не"} progress={100} /><ProgressRow color="lime" title={lang === "ru" ? "Личные границы" : "Жеке шекара"} progress={65} /><ProgressRow color="coral" title={lang === "ru" ? "Безопасность онлайн" : "Онлайн қауіпсіздік"} progress={20} /></div></div><div className="dashboard-card"><div className="card-heading"><div><span>{lang === "ru" ? "Рекомендация" : "Ұсыныс"}</span><h2>{lang === "ru" ? "Материал дня" : "Күн материалы"}</h2></div><Sparkles size={21} /></div><div className="daily-card"><div className="daily-icon"><ShieldCheck size={28} /></div><h3>{lang === "ru" ? "5 фраз, чтобы спокойно поставить границу" : "Шекара қоюға арналған 5 сөйлем"}</h3><p>4 {lang === "ru" ? "мин чтения" : "мин оқу"}</p><button onClick={() => onSection("library")}>{lang === "ru" ? "Открыть" : "Ашу"}<ArrowRight size={16} /></button></div></div></section></>;
}

function QuickCard({ icon, title, text, onClick, tone }: { icon: ReactNode; title: string; text: string; onClick: () => void; tone: string }) { return <button className={`quick-card ${tone}`} onClick={onClick}><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div><ArrowRight size={19} /></button>; }
function ProgressRow({ color, title, progress }: { color: string; title: string; progress: number }) { return <div className="progress-row"><span className={`progress-icon ${color}`}><BookOpen size={18} /></span><div><div><strong>{title}</strong><span>{progress}%</span></div><div className="progress-track"><i className={color} style={{ width: `${progress}%` }} /></div></div></div>; }

function ChatPanel({ lang }: { lang: Lang }) {
  const [messages, setMessages] = useState([{ from: "bot", text: lang === "ru" ? "Привет! Я помогу спокойно разобраться в ситуации. Что тебя беспокоит?" : "Сәлем! Жағдайды сабырмен түсінуге көмектесемін. Сені не мазалайды?" }]);
  const [draft, setDraft] = useState("");
  function send(event: FormEvent) { event.preventDefault(); if (!draft.trim()) return; const text = draft; setMessages((items) => [...items, { from: "user", text }, { from: "bot", text: lang === "ru" ? "Спасибо, что рассказал. Это важно. Давай уточним: такое происходило больше одного раза?" : "Айтқаның үшін рақмет. Бұл маңызды. Нақтылайық: бұл бірнеше рет қайталанды ма?" }]); setDraft(""); }
  return <section className="panel-page chat-page"><div className="page-title"><span>{lang === "ru" ? "Поддержка" : "Қолдау"}</span><h1>{lang === "ru" ? "Безопасный чат" : "Қауіпсіз чат"}</h1><p>{lang === "ru" ? "Здесь можно спокойно описать ситуацию и понять следующий шаг." : "Мұнда жағдайды сабырмен айтып, келесі қадамды білуге болады."}</p></div><div className="chat-layout"><div className="chat-box"><div className="chat-header"><div className="bot-avatar"><Bot size={22} /></div><div><strong>Qorgau AI Assistant</strong><span><i />{lang === "ru" ? "Готов помочь" : "Көмекке дайын"}</span></div><ShieldCheck size={20} /></div><div className="message-list">{messages.map((message, index) => <div className={`message ${message.from}`} key={`${index}-${message.text}`}><span>{message.text}</span></div>)}</div><form className="chat-input" onSubmit={send}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={lang === "ru" ? "Напиши сообщение..." : "Хабарлама жаз..."} /><button aria-label="Жіберу"><Send size={18} /></button></form></div><aside className="chat-tips"><ShieldCheck size={27} /><h3>{lang === "ru" ? "Важно знать" : "Білу маңызды"}</h3><ul><li>{lang === "ru" ? "Ты не виноват в чужой агрессии" : "Біреудің агрессиясына сен кінәлі емессің"}</li><li>{lang === "ru" ? "Не оставайся с угрозой один" : "Қауіппен жалғыз қалма"}</li><li>{lang === "ru" ? "При срочной опасности обратись к взрослому" : "Шұғыл қауіпте ересекке айт"}</li></ul></aside></div></section>;
}

function LessonsPanel({ lang }: { lang: Lang }) { const [active, setActive] = useState<number | null>(null); return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Учись защищать себя" : "Өзіңді қорғауды үйрен"}</span><h1>{lang === "ru" ? "Видеоуроки" : "Бейнесабақтар"}</h1><p>{lang === "ru" ? "Коротко, понятно и без страшных формулировок." : "Қысқа, түсінікті және қорқынышты сөздерсіз."}</p></div><div className="panel-lesson-grid">{[...lessons, { age: "5–11", title: "Как помочь другу", time: "7 мин", color: "violet" }, { age: "7–11", title: "Кибербуллинг", time: "11 мин", color: "blue" }, { age: "1–11", title: "К кому обратиться", time: "5 мин", color: "lime" }].map((lesson, index) => <article className="panel-lesson" key={`${lesson.title}-${index}`}><div className={`lesson-cover ${lesson.color}`}><span>{lesson.age}</span><button onClick={() => setActive(index)}><Play fill="currentColor" /></button>{active === index && <div className="playing"><span>{lang === "ru" ? "Урок открыт" : "Сабақ ашылды"}</span></div>}</div><div><span>{lang === "ru" ? `Модуль ${Math.floor(index / 2) + 1}` : `${Math.floor(index / 2) + 1}-модуль`}</span><h3>{lang === "ru" ? lesson.title : ["Жақсы және жаман әзіл", "Буллингті қалай танимыз", "Онлайн жеке шекара", "Досыңа қалай көмектесу керек", "Кибербуллинг", "Кімге айту керек"][index]}</h3><p><Clock3 size={14} />{lesson.time}</p></div></article>)}</div></section>; }

function QuizPanel({ lang }: { lang: Lang }) {
  const questions = useMemo(() => lang === "ru" ? ["Тебя регулярно дразнят или унижают?", "Тебе угрожают или требуют что-то отдать?", "Тебя намеренно исключают из общей компании?", "Ты боишься идти в школу из-за других учеников?"] : ["Сені үнемі мазақтай ма немесе кемсітеді ме?", "Саған қорқытып, бірдеңе беруді талап ете ме?", "Сені әдейі ортадан шеттете ме?", "Басқа оқушылардан қорқып мектепке барғың келмей ме?"], [lang]);
  const [step, setStep] = useState(0); const [yes, setYes] = useState(0); const [done, setDone] = useState(false);
  function answer(value: boolean) { if (value) setYes((n) => n + 1); if (step === questions.length - 1) setDone(true); else setStep((n) => n + 1); }
  function reset() { setStep(0); setYes(0); setDone(false); }
  return <section className="panel-page quiz-page"><div className="page-title"><span>{lang === "ru" ? "Самопроверка" : "Өзін-өзі тексеру"}</span><h1>{lang === "ru" ? "Это похоже на буллинг?" : "Бұл буллингке ұқсай ма?"}</h1><p>{lang === "ru" ? "Тест не ставит диагноз и не обвиняет. Он помогает понять, стоит ли обратиться за поддержкой." : "Тест диагноз қоймайды және айыптамайды. Ол қолдау сұрау қажет пе екенін түсінуге көмектеседі."}</p></div><div className="quiz-card">{!done ? <><div className="quiz-progress"><span>{step + 1} / {questions.length}</span><i><b style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></i></div><h2>{questions[step]}</h2><div className="quiz-actions"><button onClick={() => answer(true)}>{lang === "ru" ? "Да, такое бывает" : "Иә, болады"}</button><button onClick={() => answer(false)}>{lang === "ru" ? "Нет" : "Жоқ"}</button></div></> : <div className="quiz-result"><span className="result-icon"><HeartHandshake size={32} /></span><h2>{yes >= 2 ? (lang === "ru" ? "Стоит поговорить со взрослым" : "Ересекпен сөйлескен дұрыс") : (lang === "ru" ? "Сейчас явных признаков немного" : "Қазір айқын белгілер аз")}</h2><p>{lang === "ru" ? "Твои чувства всё равно важны. Если что-то беспокоит — расскажи взрослому, которому доверяешь." : "Сезімің бәрібір маңызды. Бір нәрсе мазаласа, сенетін ересекке айт."}</p><div><button className="primary-button" onClick={reset}>{lang === "ru" ? "Пройти снова" : "Қайта өту"}</button><button className="secondary-button">{lang === "ru" ? "Открыть чат" : "Чатты ашу"}</button></div></div>}</div></section>;
}

function LibraryPanel({ lang }: { lang: Lang }) { const items = lang === "ru" ? [["Как сказать «стоп» спокойно", "Личные границы"], ["Что сохранить при кибербуллинге", "Онлайн-безопасность"], ["Как поддержать друга", "Помощь рядом"], ["К кому можно обратиться в школе", "Маршрут помощи"]] : [["«Тоқта» деп сабырмен қалай айтуға болады", "Жеке шекара"], ["Кибербуллингте нені сақтау керек", "Онлайн қауіпсіздік"], ["Досыңа қалай қолдау көрсетуге болады", "Көмек қасыңда"], ["Мектепте кімге жүгінуге болады", "Көмек жолы"]]; return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Полезно знать" : "Білу пайдалы"}</span><h1>{lang === "ru" ? "База знаний" : "Білім қоры"}</h1><p>{lang === "ru" ? "Проверенные короткие инструкции для сложных ситуаций." : "Қиын жағдайларға арналған тексерілген қысқа нұсқаулықтар."}</p></div><div className="library-grid">{items.map(([title, category], index) => <article key={title}><span className={`library-number n${index + 1}`}>0{index + 1}</span><small>{category}</small><h3>{title}</h3><button>{lang === "ru" ? "Читать" : "Оқу"}<ArrowRight size={17} /></button></article>)}</div></section>; }
function ProgressPanel({ lang }: { lang: Lang }) { return <section className="panel-page"><div className="page-title"><span>{lang === "ru" ? "Твои результаты" : "Сенің нәтижең"}</span><h1>{lang === "ru" ? "Мой прогресс" : "Менің үлгерімім"}</h1><p>{lang === "ru" ? "Небольшие шаги тоже считаются." : "Кішкентай қадамдар да маңызды."}</p></div><div className="progress-overview"><article className="score-card"><div className="score-ring"><strong>68%</strong><span>{lang === "ru" ? "пройдено" : "аяқталды"}</span></div><div><h2>{lang === "ru" ? "Отличное начало" : "Керемет бастама"}</h2><p>{lang === "ru" ? "Ты завершил 7 из 10 материалов этого уровня." : "Осы деңгейдегі 10 материалдың 7-еуін аяқтадың."}</p></div></article><article className="stats-card"><div><BookOpen /><strong>7</strong><span>{lang === "ru" ? "уроков" : "сабақ"}</span></div><div><ClipboardCheck /><strong>3</strong><span>{lang === "ru" ? "теста" : "тест"}</span></div><div><Clock3 /><strong>48</strong><span>{lang === "ru" ? "минут" : "минут"}</span></div></article></div></section>; }
