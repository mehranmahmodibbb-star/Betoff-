import { Language } from "@/contexts/LanguageContext";

export const translations: Record<Language, Record<string, string>> = {
  fa: {
    // Header & Navigation
    "nav.home": "خانه",
    "nav.live": "زنده",
    "nav.preGame": "قبل بازی",
    "nav.casino": "کازینو",
    "nav.dashboard": "داشبورد",
    "nav.deposit": "واریز",
    "nav.withdrawal": "برداشت",
    "nav.support": "پشتیبانی",
    "nav.login": "ورود",
    "nav.logout": "خروج",
    "nav.account": "حساب",

    // Home Page
    "home.welcome": "به BetOff خوش آمدید",
    "home.subtitle": "شرط‌بندی بر روی رویدادهای ورزشی زنده و قبل از بازی",
    "home.placeBet": "ثبت شرط",

    // Sports
    "sports.football": "فوتبال",
    "sports.basketball": "بسکتبال",
    "sports.volleyball": "والیبال",
    "sports.tennis": "تنیس",
    "sports.cricket": "کریکت",
    "sports.formula1": "فرمول یک",
    "sports.hockey": "هاکی",
    "sports.ufc": "یو اف سی",
    "sports.boxing": "بوکس",

    // Betting Types
    "betting.live": "شرط‌بندی زنده",
    "betting.preGame": "قبل بازی",
    "betting.single": "تکی",
    "betting.parlay": "میکس",
    "betting.system": "سیستمی",

    // Wallet & Transactions
    "wallet.balance": "موجودی",
    "wallet.deposit": "واریز",
    "wallet.withdrawal": "برداشت",
    "wallet.currency": "ارز",
    "wallet.amount": "مبلغ",
    "wallet.address": "آدرس کیف پول",
    "wallet.submit": "ارسال درخواست",
    "wallet.usdtAddress": "آدرس تتر BEP20",

    // Common
    "common.loading": "در حال بارگذاری...",
    "common.error": "خطا",
    "common.success": "موفق",
    "common.cancel": "لغو",
    "common.save": "ذخیره",
    "common.delete": "حذف",
    "common.edit": "ویرایش",
    "common.back": "بازگشت",
  },

  ar: {
    // Header & Navigation
    "nav.home": "الرئيسية",
    "nav.live": "مباشر",
    "nav.preGame": "قبل المباراة",
    "nav.casino": "كازينو",
    "nav.dashboard": "لوحة التحكم",
    "nav.deposit": "إيداع",
    "nav.withdrawal": "سحب",
    "nav.support": "الدعم",
    "nav.login": "تسجيل الدخول",
    "nav.logout": "تسجيل الخروج",
    "nav.account": "الحساب",

    // Home Page
    "home.welcome": "مرحبا بك في BetOff",
    "home.subtitle": "ضع رهاناتك على الأحداث الرياضية المباشرة وقبل المباراة",
    "home.placeBet": "ضع رهانك",

    // Sports
    "sports.football": "كرة القدم",
    "sports.basketball": "كرة السلة",
    "sports.volleyball": "الكرة الطائرة",
    "sports.tennis": "التنس",
    "sports.cricket": "الكريكيت",
    "sports.formula1": "فورمولا 1",
    "sports.hockey": "الهوكي",
    "sports.ufc": "يو إف سي",
    "sports.boxing": "الملاكمة",

    // Betting Types
    "betting.live": "الرهان المباشر",
    "betting.preGame": "قبل المباراة",
    "betting.single": "رهان واحد",
    "betting.parlay": "رهان مركب",
    "betting.system": "رهان النظام",

    // Wallet & Transactions
    "wallet.balance": "الرصيد",
    "wallet.deposit": "إيداع",
    "wallet.withdrawal": "سحب",
    "wallet.currency": "العملة",
    "wallet.amount": "المبلغ",
    "wallet.address": "عنوان المحفظة",
    "wallet.submit": "إرسال الطلب",
    "wallet.usdtAddress": "عنوان USDT BEP20",

    // Common
    "common.loading": "جاري التحميل...",
    "common.error": "خطأ",
    "common.success": "نجح",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.delete": "حذف",
    "common.edit": "تعديل",
    "common.back": "رجوع",
  },

  en: {
    // Header & Navigation
    "nav.home": "Home",
    "nav.live": "Live",
    "nav.preGame": "Pre-Game",
    "nav.casino": "Casino",
    "nav.dashboard": "Dashboard",
    "nav.deposit": "Deposit",
    "nav.withdrawal": "Withdrawal",
    "nav.support": "Support",
    "nav.login": "Login",
    "nav.logout": "Logout",
    "nav.account": "Account",

    // Home Page
    "home.welcome": "Welcome to BetOff",
    "home.subtitle": "Place your bets on live and pre-game sporting events",
    "home.placeBet": "Place Bet",

    // Sports
    "sports.football": "Football",
    "sports.basketball": "Basketball",
    "sports.volleyball": "Volleyball",
    "sports.tennis": "Tennis",
    "sports.cricket": "Cricket",
    "sports.formula1": "Formula 1",
    "sports.hockey": "Hockey",
    "sports.ufc": "UFC",
    "sports.boxing": "Boxing",

    // Betting Types
    "betting.live": "Live Betting",
    "betting.preGame": "Pre-Game",
    "betting.single": "Single",
    "betting.parlay": "Parlay",
    "betting.system": "System",

    // Wallet & Transactions
    "wallet.balance": "Balance",
    "wallet.deposit": "Deposit",
    "wallet.withdrawal": "Withdrawal",
    "wallet.currency": "Currency",
    "wallet.amount": "Amount",
    "wallet.address": "Wallet Address",
    "wallet.submit": "Submit Request",
    "wallet.usdtAddress": "USDT BEP20 Address",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.back": "Back",
  },

  kk: {
    // Header & Navigation
    "nav.home": "Басты бет",
    "nav.live": "Тікелей",
    "nav.preGame": "Ойындан бұрын",
    "nav.casino": "Казино",
    "nav.dashboard": "Басқару панелі",
    "nav.deposit": "Депозит",
    "nav.withdrawal": "Ағымдау",
    "nav.support": "Қолдау",
    "nav.login": "Кіру",
    "nav.logout": "Шығу",
    "nav.account": "Есептік жазба",

    // Home Page
    "home.welcome": "BetOff-қа қош келдіңіз",
    "home.subtitle": "Тікелей және ойындан бұрынғы спорт оқиғаларына ставка қойыңыз",
    "home.placeBet": "Ставка қойыңыз",

    // Sports
    "sports.football": "Футбол",
    "sports.basketball": "Баскетбол",
    "sports.volleyball": "Волейбол",
    "sports.tennis": "Теннис",
    "sports.cricket": "Крикет",
    "sports.formula1": "Формула 1",
    "sports.hockey": "Хоккей",
    "sports.ufc": "UFC",
    "sports.boxing": "Бокс",

    // Betting Types
    "betting.live": "Тікелей ставка",
    "betting.preGame": "Ойындан бұрын",
    "betting.single": "Жеке",
    "betting.parlay": "Парлей",
    "betting.system": "Жүйе",

    // Wallet & Transactions
    "wallet.balance": "Баланс",
    "wallet.deposit": "Депозит",
    "wallet.withdrawal": "Ағымдау",
    "wallet.currency": "Валюта",
    "wallet.amount": "Сома",
    "wallet.address": "Әмияндық мекенжайы",
    "wallet.submit": "Өтінімді жіберіңіз",
    "wallet.usdtAddress": "USDT BEP20 мекенжайы",

    // Common
    "common.loading": "Жүктелуде...",
    "common.error": "Қате",
    "common.success": "Сәтті",
    "common.cancel": "Бас тарту",
    "common.save": "Сақтау",
    "common.delete": "Өшіру",
    "common.edit": "Өндеу",
    "common.back": "Артқа",
  },

  uz: {
    // Header & Navigation
    "nav.home": "Bosh sahifa",
    "nav.live": "Jonli",
    "nav.preGame": "O'yin oldin",
    "nav.casino": "Kazino",
    "nav.dashboard": "Boshqaruv paneli",
    "nav.deposit": "Depozit",
    "nav.withdrawal": "Yechish",
    "nav.support": "Qo'llab-quvvatlash",
    "nav.login": "Kirish",
    "nav.logout": "Chiqish",
    "nav.account": "Hisob",

    // Home Page
    "home.welcome": "BetOff-ga xush kelibsiz",
    "home.subtitle": "Jonli va o'yin oldingi sport tadbirlariga pul qo'ying",
    "home.placeBet": "Pul qo'ying",

    // Sports
    "sports.football": "Futbol",
    "sports.basketball": "Basketbol",
    "sports.volleyball": "Voleybol",
    "sports.tennis": "Tennis",
    "sports.cricket": "Kriket",
    "sports.formula1": "Formula 1",
    "sports.hockey": "Xokkey",
    "sports.ufc": "UFC",
    "sports.boxing": "Boks",

    // Betting Types
    "betting.live": "Jonli pul qo'yish",
    "betting.preGame": "O'yin oldin",
    "betting.single": "Yagona",
    "betting.parlay": "Parlay",
    "betting.system": "Tizim",

    // Wallet & Transactions
    "wallet.balance": "Balans",
    "wallet.deposit": "Depozit",
    "wallet.withdrawal": "Yechish",
    "wallet.currency": "Valyuta",
    "wallet.amount": "Summa",
    "wallet.address": "Hamyon manzili",
    "wallet.submit": "Ariza yuborish",
    "wallet.usdtAddress": "USDT BEP20 manzili",

    // Common
    "common.loading": "Yuklanmoqda...",
    "common.error": "Xato",
    "common.success": "Muvaffaqiyat",
    "common.cancel": "Bekor qilish",
    "common.save": "Saqlash",
    "common.delete": "O'chirish",
    "common.edit": "Tahrirlash",
    "common.back": "Orqaga",
  },

  zh: {
    // Header & Navigation
    "nav.home": "主页",
    "nav.live": "直播",
    "nav.preGame": "赛前",
    "nav.casino": "赌场",
    "nav.dashboard": "仪表板",
    "nav.deposit": "存款",
    "nav.withdrawal": "提款",
    "nav.support": "支持",
    "nav.login": "登录",
    "nav.logout": "登出",
    "nav.account": "账户",

    // Home Page
    "home.welcome": "欢迎来到 BetOff",
    "home.subtitle": "对直播和赛前体育赛事进行投注",
    "home.placeBet": "下注",

    // Sports
    "sports.football": "足球",
    "sports.basketball": "篮球",
    "sports.volleyball": "排球",
    "sports.tennis": "网球",
    "sports.cricket": "板球",
    "sports.formula1": "一级方程式",
    "sports.hockey": "冰球",
    "sports.ufc": "UFC",
    "sports.boxing": "拳击",

    // Betting Types
    "betting.live": "直播投注",
    "betting.preGame": "赛前",
    "betting.single": "单注",
    "betting.parlay": "串关",
    "betting.system": "系统",

    // Wallet & Transactions
    "wallet.balance": "余额",
    "wallet.deposit": "存款",
    "wallet.withdrawal": "提款",
    "wallet.currency": "货币",
    "wallet.amount": "金额",
    "wallet.address": "钱包地址",
    "wallet.submit": "提交请求",
    "wallet.usdtAddress": "USDT BEP20 地址",

    // Common
    "common.loading": "加载中...",
    "common.error": "错误",
    "common.success": "成功",
    "common.cancel": "取消",
    "common.save": "保存",
    "common.delete": "删除",
    "common.edit": "编辑",
    "common.back": "返回",
  },

  ko: {
    // Header & Navigation
    "nav.home": "홈",
    "nav.live": "라이브",
    "nav.preGame": "경기 전",
    "nav.casino": "카지노",
    "nav.dashboard": "대시보드",
    "nav.deposit": "입금",
    "nav.withdrawal": "출금",
    "nav.support": "지원",
    "nav.login": "로그인",
    "nav.logout": "로그아웃",
    "nav.account": "계정",

    // Home Page
    "home.welcome": "BetOff에 오신 것을 환영합니다",
    "home.subtitle": "라이브 및 경기 전 스포츠 이벤트에 베팅하세요",
    "home.placeBet": "베팅",

    // Sports
    "sports.football": "축구",
    "sports.basketball": "농구",
    "sports.volleyball": "배구",
    "sports.tennis": "테니스",
    "sports.cricket": "크리켓",
    "sports.formula1": "포뮬러 1",
    "sports.hockey": "하키",
    "sports.ufc": "UFC",
    "sports.boxing": "권투",

    // Betting Types
    "betting.live": "라이브 베팅",
    "betting.preGame": "경기 전",
    "betting.single": "단일",
    "betting.parlay": "파레이",
    "betting.system": "시스템",

    // Wallet & Transactions
    "wallet.balance": "잔액",
    "wallet.deposit": "입금",
    "wallet.withdrawal": "출금",
    "wallet.currency": "통화",
    "wallet.amount": "금액",
    "wallet.address": "지갑 주소",
    "wallet.submit": "요청 제출",
    "wallet.usdtAddress": "USDT BEP20 주소",

    // Common
    "common.loading": "로딩 중...",
    "common.error": "오류",
    "common.success": "성공",
    "common.cancel": "취소",
    "common.save": "저장",
    "common.delete": "삭제",
    "common.edit": "편집",
    "common.back": "뒤로",
  },
};

export function t(key: string, language: Language): string {
  return translations[language]?.[key] || key;
}
