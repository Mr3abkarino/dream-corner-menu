```react
import { useState, useEffect, useMemo, useRef } from "react";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut
} from "lucide-react";

// شعار المطعم الأصلي بصيغة Base64 ليعمل محلياً وسحابياً بدون روابط خارجية
const LOGO_SRC = "data:image/png;base64,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";

/* الهويات البصرية المتاحة لصاحب المطعم للتعديل السريع للمظهر */
const THEMES = [
  {
    id: "brand",
    name: "هوية دريم كورنر",
    bg: "#0E0C0B",
    surface: "#1A1613",
    surface2: "#241E19",
    accent: "#D4AF37",
    accent2: "#8B1E1E",
    text: "#F3E9D8",
    muted: "#B3A18C",
    display: "'Lalezar', cursive",
  },
  {
    id: "night",
    name: "ليلي فاخر",
    bg: "#181110",
    surface: "#241A17",
    surface2: "#2E211D",
    accent: "#D4A24C",
    accent2: "#A63D2F",
    text: "#F3E9D8",
    muted: "#B3A18C",
    display: "'Lalezar', cursive",
  },
  {
    id: "emerald",
    name: "شرقي فاخر",
    bg: "#0E1A16",
    surface: "#152620",
    surface2: "#1B2F27",
    accent: "#C9A24B",
    accent2: "#2F6E52",
    text: "#EFEAD9",
    muted: "#9DB0A6",
    display: "'Aref Ruqaa', serif",
  },
  {
    id: "cafe",
    name: "كافيه دافئ",
    bg: "#F5EFE3",
    surface: "#FFFFFF",
    surface2: "#EFE4CE",
    accent: "#B5622E",
    accent2: "#6B4226",
    text: "#2B2118",
    muted: "#8A7A66",
    display: "'Aref Ruqaa', serif",
    light: true,
  },
  {
    id: "street",
    name: "ستريت فود",
    bg: "#111111",
    surface: "#1C1C1C",
    surface2: "#242424",
    accent: "#FF5A1F",
    accent2: "#FFC93C",
    text: "#F5F5F5",
    muted: "#9A9A9A",
    display: "'Lalezar', cursive",
  },
  {
    id: "marine",
    name: "بحري منعش",
    bg: "#0B1E2A",
    surface: "#122B3A",
    surface2: "#173547",
    accent: "#4FC3C0",
    accent2: "#E7B45C",
    text: "#EAF4F4",
    muted: "#8CA9B3",
    display: "'Lalezar', cursive",
  },
];

/* المنيو الافتراضي الأصيل المستخرج من صور منيو دريم كورنر */
const DEFAULT_MENU = [
  // البيتزا
  { id: "p1", cat: "البيتزا", name: "مارجريتا", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "ميكس جبنة", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p3", cat: "البيتزا", name: "خضار", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p4", cat: "البيتزا", name: "هوت دوج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p5", cat: "البيتزا", name: "سجق", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "لحمة مفرومة", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "p7", cat: "البيتزا", name: "بيروني", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p8", cat: "البيتزا", name: "سلامي", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p9", cat: "البيتزا", name: "شاورما دجاج", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p10", cat: "البيتزا", name: "دجاج رانش", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p11", cat: "البيتزا", name: "دريم كورنر سبيشال", desc: "خلطة البيت الخاصة المميزة", sizes: [{ label: "كبير", price: 170 }, { label: "وسط", price: 130 }, { label: "صغير", price: 90 }] },
  { id: "p12", cat: "البيتزا", name: "كرانشي (حار أو بارد)", sizes: [{ label: "كبير", price: 130 }, { label: "وسط", price: 100 }, { label: "صغير", price: 80 }] },
  { id: "p13", cat: "البيتزا", name: "ميكس دجاج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 105 }, { label: "صغير", price: 85 }] },
  { id: "p14", cat: "البيتزا", name: "حشو الأطراف", desc: "إضافة أطراف محشوة لأي بيتزا", sizes: [{ label: "كبير", price: 35 }, { label: "وسط", price: 30 }, { label: "صغير", price: 25 }] },

  // السندوتشات - اللحوم
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s2", cat: "السندوتشات", subcat: "اللحوم", name: "سجق مقلي", sizes: [{ label: "كبير", price: 70 }, { label: "وسط", price: 60 }] },
  { id: "s3", cat: "السندوتشات", subcat: "اللحوم", name: "كبدة إسكندراني", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s4", cat: "السندوتشات", subcat: "اللحوم", name: "ميكس لحوم (سجق+كبدة)", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", price: 45 },

  // السندوتشات - ساندوتشات الدجاج
  { id: "s6", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن بانية", sizes: [{ label: "كبير", price: 85 }, { label: "وسط", price: 70 }] },
  { id: "s7", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "زنجر سوبريم", sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
  { id: "s8", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "سوبر كرانشي", sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
  { id: "s9", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "شيش طاووق", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 75 }] },
  { id: "s10", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن رانش", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 75 }] },

  // السندوتشات - البرجر
  { id: "s11", cat: "السندوتشات", subcat: "البرجر", name: "كلاسيك برجر", sizes: [{ label: "كبير", price: 65 }, { label: "وسط", price: 55 }] },
  { id: "s12", cat: "السندوتشات", subcat: "البرجر", name: "تشيز برجر ليدر", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s13", cat: "السندوتشات", subcat: "البرجر", name: "تشكن برجر مقرمش", sizes: [{ label: "كبير", price: 65 }, { label: "وسط", price: 50 }] },

  // السندوتشات - التوست
  { id: "s14", cat: "السندوتشات", subcat: "التوست", name: "ميكس توست جبن", price: 60 },

  // الأصناف الجانبية
  { id: "sd1", cat: "الأصناف الجانبية", name: "بطاطس مقلية ذهبية", price: 25 },
  { id: "sd2", cat: "الأصناف الجانبية", name: "بطاطس بالجبنة الشيدر", price: 40 },
  { id: "sd3", cat: "الأصناف الجانبية", name: "صوص رانش هوم ميد", price: 15 },

  // المشروبات
  { id: "d1", cat: "المشروبات", name: "بيبسي علب", price: 15 },
  { id: "d2", cat: "المشروبات", name: "سفن أب علب", price: 15 },
  { id: "d3", cat: "المشروبات", name: "ميرندا برتقال", price: 15 },
  { id: "d4", cat: "المشروبات", name: "مياة معدنية صغيرة", price: 8 },
];

const money = (n) => `${Number(n).toLocaleString("ar-EG")} ج.م`;

// نظام حماية وحفظ ذكي سحابي / محلي متوافق مع Vercel
const safeStorage = {
  get: async (key) => {
    if (window.storage && typeof window.storage.get === "function") {
      try {
        return await window.storage.get(key);
      } catch (e) {
        console.warn("تعذر الوصول لـ Storage API، الانتقال للتخزين المحلي", e);
      }
    }
    const local = localStorage.getItem(key);
    return local ? { value: local } : null;
  },
  set: async (key, val) => {
    if (window.storage && typeof window.storage.set === "function") {
      try {
        return await window.storage.set(key, val);
      } catch (e) {
        console.warn("تعذر الإرسال لـ Storage API، الانتقال للتخزين المحلي", e);
      }
    }
    localStorage.setItem(key, val);
  }
};

// نسخ النص بنظام محمي ومتوافق مع شاشات تصفح الهواتف المتنوعة
const copyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (err) {
    console.error("خطأ أثناء عملية النسخ", err);
  }
  document.body.removeChild(textArea);
  return success;
};

export default function App() {
  useFonts();

  const [theme, setTheme] = useState(THEMES[0]);
  const [restaurantName, setRestaurantName] = useState("دريم كورنر");
  const [tagline, setTagline] = useState("PIZZA & SANDWICHES — طعم يفرق .. جودة تليق بيك");
  const [address, setAddress] = useState("البيبرامون، بجوار عيادة الدكتورة إلهام العشري");
  const [menuUrl, setMenuUrl] = useState("https://your-restaurant-menu.com");
  const [whatsappNumber, setWhatsappNumber] = useState("+201006113627");
  const [vodafoneCash, setVodafoneCash] = useState("+201006113627");
  const [instapay, setInstapay] = useState("dreamcorner@instapay");

  const [items, setItems] = useState(DEFAULT_MENU);
  const [activeCat, setActiveCat] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // نظام حماية الإدارة
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  
  const saveTimer = useRef(null);

  // استيراد الخطوط العربية الفاخرة للويب
  function useFonts() {
    useEffect(() => {
      const id = "menu-fonts";
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Lalezar&family=Aref+Ruqaa:wght@400;700&display=swap";
      document.head.appendChild(link);
    }, []);
  }

  // مزامنة واستدعاء البيانات المخزنة مسبقاً
  useEffect(() => {
    (async () => {
      try {
        const res = await safeStorage.get("dream-corner-menu");
        if (res && res.value) {
          const d = JSON.parse(res.value);
          if (d.items) setItems(d.items);
          if (d.restaurantName) setRestaurantName(d.restaurantName);
          if (d.tagline) setTagline(d.tagline);
          if (d.address) setAddress(d.address);
          if (d.menuUrl) setMenuUrl(d.menuUrl);
          if (d.whatsappNumber) setWhatsappNumber(d.whatsappNumber);
          if (d.vodafoneCash) setVodafoneCash(d.vodafoneCash);
          if (d.instapay) setInstapay(d.instapay);
          if (d.adminPin) setAdminPin(d.adminPin);
          if (d.themeId) {
            const t = THEMES.find((t) => t.id === d.themeId);
            if (t) setTheme(t);
          }
        }
      } catch (e) {
        console.error("خطأ أثناء استدعاء التخزين", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // التحقق التلقائي من رابط المدير السري المباشر
  useEffect(() => {
    if (
      window.location.search.toLowerCase().includes("admin") || 
      window.location.hash.toLowerCase().includes("admin")
    ) {
      setIsAdmin(true);
    }
  }, []);

  // الحفظ التلقائي الفوري لكافة التحديثات والأسعار ورمز الأمان
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await safeStorage.set(
          "dream-corner-menu",
          JSON.stringify({
            items, restaurantName, tagline, address, menuUrl, whatsappNumber,
            vodafoneCash, instapay, adminPin, themeId: theme.id,
          })
        );
      } catch (e) {
        console.error("فشل الحفظ التلقائي", e);
      }
    }, 500);
  }, [items, restaurantName, tagline, address, menuUrl, whatsappNumber, vodafoneCash, instapay, adminPin, theme, loaded]);

  // آلية التقاط النقرات الخمس السريعة على الشعار لدخول الإدارة
  const handleLogoClick = () => {
    if (isAdmin) return;
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setPinModalOpen(true);
        setEnteredPin("");
        setPinError("");
        return 0;
      }
      return next;
    });

    clearTimeout(window.logoClickTimeout);
    window.logoClickTimeout = setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin === adminPin) {
      setIsAdmin(true);
      setPinModalOpen(false);
      setPinError("");
      setEnteredPin("");
    } else {
      setPinError("رمز الأمان PIN غير صحيح! يرجى إعادة المحاولة.");
      setEnteredPin("");
    }
  };

  const categories = useMemo(() => ["الكل", ...new Set(items.map((i) => i.cat))], [items]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCat === "الكل" || item.cat === activeCat;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;

      return matchesCategory && (
        item.name.toLowerCase().includes(cleanQuery) ||
        (item.desc && item.desc.toLowerCase().includes(cleanQuery)) ||
        item.cat.toLowerCase().includes(cleanQuery) ||
        (item.subcat && item.subcat.toLowerCase().includes(cleanQuery))
      );
    });
  }, [items, activeCat, searchQuery]);

  const groups = useMemo(() => {
    const map = new Map();
    visibleItems.forEach((it) => {
      const key = it.subcat || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    });
    return Array.from(map.entries());
  }, [visibleItems]);

  const findItem = (id) => items.find((i) => i.id === id);

  const cartList = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([key, qty]) => {
        const [id, sizeLabel] = key.split("::");
        const item = findItem(id);
        if (!item) return null;
        const price = sizeLabel ? item.sizes.find((s) => s.label === sizeLabel)?.price ?? 0 : item.price;
        const label = sizeLabel ? `${item.name} (${sizeLabel})` : item.name;
        return { key, id, label, price, qty };
      })
      .filter(Boolean);
  }, [cart, items]);

  const cartCount = cartList.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartList.reduce((s, i) => s + i.qty * i.price, 0);

  const addToCart = (key, delta) =>
    setCart((c) => ({ ...c, [key]: Math.max(0, (c[key] || 0) + delta) }));

  const updateItem = (id, patch) =>
    setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const updateSize = (id, sizeIdx, patch) =>
    setItems((its) =>
      its.map((i) =>
        i.id === id ? { ...i, sizes: i.sizes.map((s, idx) => (idx === sizeIdx ? { ...s, ...patch } : s)) } : i
      )
    );

  const deleteItem = (id) => setItems((its) => its.filter((i) => i.id !== id));

  const addNewItem = () => {
    const id = "n" + Date.now().toString();
    setItems((its) => [
      ...its,
      { id, cat: activeCat === "الكل" ? "أصناف جديدة" : activeCat, name: "صنف جديد", price: 20, desc: "" },
    ]);
    setEditingId(id);
  };

  const sendWhatsApp = () => {
    if (cartList.length === 0) return;
    const lines = cartList.map((i) => `• ${i.label} x${i.qty} — ${money(i.price * i.qty)}`);
    const text =
      `طلب جديد من منيو ${restaurantName} 🍽️\n\n` +
      lines.join("\n") +
      `\n\nالإجمالي النهائي: ${money(cartTotal)}\nالعنوان المطلوب: ${address}`;
    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const copyText = (label, value) => {
    const ok = copyTextToClipboard(value);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  const handleResetMenu = () => {
    setItems(DEFAULT_MENU);
    setShowResetConfirm(false);
  };

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${encodeURIComponent(menuUrl)}`;

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full transition-colors duration-500 pb-20"
      style={{ background: theme.bg, color: theme.text, fontFamily: "'Tajawal', sans-serif" }}
    >
      {/* ===================== HEADER ===================== */}
      <header
        className="sticky top-0 z-30 backdrop-blur border-b"
        style={{ background: `${theme.bg}E6`, borderColor: `${theme.muted}30` }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* اللوجو التفاعلي لتسجيل دخول المدير سرياً */}
            <div onClick={handleLogoClick} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative">
              <img
                src={LOGO_SRC}
                alt={`${restaurantName} logo`}
                className="w-10 h-10 rounded-full object-contain"
                style={{ background: theme.light ? "#111" : "#fff", padding: 3 }}
              />
              {logoClicks > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {logoClicks}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h1
                className="text-xl md:text-2xl truncate leading-tight"
                style={{ fontFamily: theme.display, color: theme.accent, letterSpacing: "0.5px" }}
              >
                {restaurantName}
              </h1>
              <p className="text-[11px] truncate opacity-85" style={{ color: theme.muted }}>{tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {/* تظهر عناصر التحكم فقط عند تفعيل وضع الإدارة */}
            {isAdmin ? (
              <>
                <button onClick={() => setThemePickerOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-transform active:scale-95" title="تغيير المظهر">
                  <Palette size={18} />
                </button>
                <button onClick={() => setQrOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-transform active:scale-95" title="عرض QR">
                  <QrCode size={18} />
                </button>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-full border border-green-500/50 text-green-500 bg-green-500/10 transition-transform active:scale-95 animate-pulse" title="إعدادات المنيو">
                  <Settings size={18} />
                </button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 transition-transform active:scale-95" title="خروج من وضع الإدارة">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <a href={`tel:${whatsappNumber}`} className="p-2 rounded-full border transition-transform active:scale-95" style={{ borderColor: `${theme.muted}40` }} aria-label="اتصل بنا">
                <Phone size={17} />
              </a>
            )}
          </div>
        </div>
        <OrnamentDivider color={theme.accent} />
      </header>

      {/* ===================== CATEGORY TABS & SEARCH ===================== */}
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setActiveCat(c); }}
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
              style={
                activeCat === c
                  ? { background: theme.accent, color: theme.bg, borderColor: theme.accent }
                  : { borderColor: `${theme.muted}40`, color: theme.muted }
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن بيتزا، سجق، مشروب..."
            className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm border focus:outline-none transition-all"
            style={{
              background: theme.surface,
              borderColor: `${theme.muted}40`,
              color: theme.text,
            }}
          />
          <Search size={16} className="absolute right-3.5 top-3.5" style={{ color: theme.muted }} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute left-3 top-2.5 p-1 rounded-full hover:bg-black/10 transition-colors"
              style={{ color: theme.muted }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ===================== MENU ITEMS ===================== */}
      <main className="max-w-3xl mx-auto px-4 pb-32 pt-4 space-y-6">
        {groups.map(([subcat, list]) => (
          <div key={subcat || "main"}>
            {subcat && (
              <h2 className="text-sm font-black mb-3 px-1 tracking-wide" style={{ color: theme.accent, fontFamily: theme.display }}>
                {subcat}
              </h2>
            )}
            <div className="space-y-3">
              {list.map((item) => (
                <div key={item.id} className="rounded-2xl p-4 border transition-all" style={{ background: theme.surface, borderColor: `${theme.muted}25` }}>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h3 className="font-bold text-base truncate">{item.name}</h3>
                    {!item.sizes && (
                      <span className="font-black shrink-0" style={{ color: theme.accent }}>{money(item.price)}</span>
                    )}
                  </div>
                  {item.desc && <p className="text-sm mb-2 opacity-90" style={{ color: theme.muted }}>{item.desc}</p>}

                  {item.sizes ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.sizes.map((sz) => {
                        const key = `${item.id}::${sz.label}`;
                        const qty = cart[key] || 0;
                        return (
                          <div
                            key={sz.label}
                            className="flex items-center gap-2 rounded-full px-2.5 py-1.5 border transition-colors"
                            style={{ borderColor: `${theme.muted}30`, background: theme.surface2 }}
                          >
                            <span className="text-xs font-bold" style={{ color: theme.muted }}>{sz.label}</span>
                            <span className="text-xs font-black" style={{ color: theme.accent }}>{money(sz.price)}</span>
                            {qty > 0 ? (
                              <div className="flex items-center gap-1.5 mr-1.5">
                                <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}>
                                  <Plus size={11} />
                                </button>
                                <span className="w-3 text-center text-xs font-bold">{qty}</span>
                                <button onClick={() => addToCart(key, -1)} className="w-5 h-5 rounded-full flex items-center justify-center border" style={{ borderColor: `${theme.muted

```
