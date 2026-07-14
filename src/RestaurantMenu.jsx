import { useState, useEffect, useMemo, useRef } from "react";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, Truck
} from "lucide-react";

// شعار تفاعلي ذكي فائق الدقة والأداء لتجنب مشاكل تشويه النصوص المقتطعة أثناء النشر
const LOGO_SRC = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23D4AF37'/><text y='70' x='18' font-size='60'>🍕</text></svg>";

/* قائمة مناطق التوصيل وأسعار الشحن - يمكنك تعديل الأسعار والمناطق من هنا بسهولة */
const DELIVERY_AREAS = [
  { id: "area1", name: "البرامون", price: 10 },
  { id: "area2", name: "بر الترعة", price: 20 },
  { id: "area3", name: "سرسو البرامون", price: 35 },
   ];

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
    display: "'Lalezar', cursive"
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
    display: "'Lalezar', cursive"
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
    display: "'Aref Ruqaa', serif"
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
    light: true
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
    display: "'Lalezar', cursive"
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
    display: "'Lalezar', cursive"
  }
];

/* منيو دريم كورنر الافتراضي المستخرج من صور منيو دريم كورنر */
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
  { id: "s2", cat: "السندوتشات", subcat: "اللحوم", name: "سجق مشوي", sizes: [{ label: "كبير", price: 70 }, { label: "وسط", price: 60 }] },
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
  { id: "d1", cat: "المشروبات", name: "بيبسي كانز", price: 15 },
  { id: "d2", cat: "المشروبات", name: "سفن أب كانز", price: 15 },
  { id: "d3", cat: "المشروبات", name: "ميرندا برتقال", price: 15 },
  { id: "d4", cat: "المشروبات", name: "مياة معدنية صغيرة", price: 6 }
];

// دمج كلاسيكي بدون استخدام الـ backticks لضمان النجاح التام للبناء على Vercel
const money = (n) => Number(n).toLocaleString("ar-EG") + " ج.م";

// نظام حماية وحفظ ذكي متوافق بالكامل مع Vercel
const safeStorage = {
  get: async (key) => {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.get === "function") {
      try { return await window.storage.get(key, false); } catch (e) {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      const local = localStorage.getItem(key);
      return local ? { value: local } : null;
    }
    return null;
  },
  set: async (key, val) => {
    if (typeof window !== "undefined" && window.storage && typeof window.storage.set === "function") {
      try { return await window.storage.set(key, val, false); } catch (e) {}
    }
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, val);
    }
  }
};

const copyTextToClipboard = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  let success = false;
  try { success = document.execCommand("copy"); } catch (err) {}
  document.body.removeChild(textArea);
  return success;
};

function OrnamentDivider({ color }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 select-none" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 10 10" style={{ opacity: i === 4 ? 1 : 0.35 }}>
          <path d="M5 0 L6.5 3.5 L10 5 L6.5 6.5 L5 10 L3.5 6.5 L0 5 L3.5 3.5 Z" fill={color} />
        </svg>
      ))}
    </div>
  );
}

// التصدير الافتراضي المباشر والوحيد لمنع أي تعارضات مع Vite
export default function RestaurantMenu() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [restaurantName, setRestaurantName] = useState("دريم كورنر");
  const [tagline, setTagline] = useState("PIZZA & SANDWICHES — طعم يفرق .. جودة تليق بك");
  const [address, setAddress] = useState("البرامون، بجوار عيادة الدكتورة إلهام العشري");
  const [menuUrl, setMenuUrl] = useState("https://your-restaurant-menu.com");
  const [whatsappNumber, setWhatsappNumber] = useState("+201006113627");
  const [vodafoneCash, setVodafoneCash] = useState("+201023590020");
  const [instapay, setInstapay] = useState("");

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

  // خانات إدخال بيانات العميل لطلب الدليفري والملاحظات ومصاريف الشحن
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [selectedArea, setSelectedArea] = useState(DELIVERY_AREAS[0]);
  const [validationError, setValidationError] = useState("");

  // نظام حماية الإدارة
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  
  const saveTimer = useRef(null);

  // استدعاء وتحميل الخطوط بأمان بدون مخالفة قواعد الـ Hooks
  useEffect(() => {
    const id = "menu-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=Lalezar&family=Aref+Ruqaa:wght@400;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // استعادة البيانات مع رمز الأمان المشفر + استعادة بيانات العميل المحفوظة تلقائياً
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
            const t = THEMES.find((themeItem) => themeItem.id === d.themeId);
            if (t) setTheme(t);
          }
        }

        // استرجاع هاتف وعنوان العميل والمنطقة المحفوظة لتوفير وقت الكتابة عليه
        if (typeof window !== "undefined" && window.localStorage) {
          const savedPhone = localStorage.getItem("customer-phone-cache");
          const savedAddress = localStorage.getItem("customer-address-cache");
          const savedAreaId = localStorage.getItem("customer-area-id-cache");
          
          if (savedPhone) setCustomerPhone(savedPhone);
          if (savedAddress) setCustomerAddress(savedAddress);
          if (savedAreaId) {
            const area = DELIVERY_AREAS.find(a => a.id === savedAreaId);
            if (area) setSelectedArea(area);
          }
        }

      } catch (e) {
        console.error("خطأ أثناء استدعاء التخزين", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // تفعيل الإدارة تلقائياً عند وجود الرابط المخصص للمشرف
  useEffect(() => {
    if (
      window.location.search.toLowerCase().includes("admin") || 
      window.location.hash.toLowerCase().includes("admin")
    ) {
      setIsAdmin(true);
    }
  }, []);

  // الحفظ التلقائي متضمناً الـ PIN الجديد
  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await safeStorage.set("dream-corner-menu", JSON.stringify({
          items, restaurantName, tagline, address, menuUrl, whatsappNumber,
          vodafoneCash, instapay, adminPin, themeId: theme.id,
        }));
      } catch (e) {
        console.error("فشل الحفظ التلقائي", e);
      }
    }, 500);
  }, [items, restaurantName, tagline, address, menuUrl, whatsappNumber, vodafoneCash, instapay, adminPin, theme, loaded]);

  // آلية عد النقرات على اللوجو لفتح حوار حماية الإدارة
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
    window.logoClickTimeout = setTimeout(() => { setLogoClicks(0); }, 2500);
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

  // صياغة تفكيك آمنة للمتغيرات لحظر أي أخطاء تجميعية في Rollup
  const cartList = useMemo(() => {
    return Object.entries(cart)
      .filter((entry) => entry[1] > 0)
      .map((entry) => {
        const key = entry[0];
        const qty = entry[1];
        const parts = key.split("::");
        const id = parts[0];
        const sizeLabel = parts[1] || "";
        const item = findItem(id);
        if (!item) return null;
        const price = sizeLabel ? item.sizes.find((s) => s.label === sizeLabel)?.price ?? 0 : item.price;
        const label = sizeLabel ? item.name + " (" + sizeLabel + ")" : item.name;
        return { key, id, label, price, qty };
      })
      .filter(Boolean);
  }, [cart, items]);

  const cartCount = cartList.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartList.reduce((s, i) => s + i.qty * i.price, 0);
  
  // الإجمالي النهائي مع دمج سعر منطقة الدليفري
  const finalTotalWithDelivery = useMemo(() => {
    return cartTotal + (selectedArea ? selectedArea.price : 0);
  }, [cartTotal, selectedArea]);

  const addToCart = (key, delta) =>
    setCart((c) => {
      const nextCart = { ...c };
      nextCart[key] = Math.max(0, (c[key] || 0) + delta);
      return nextCart;
    });

  const updateItem = (id, patch) =>
    setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const updateSize = (id, sizeIdx, patch) =>
    setItems((its) => i.id === id ? { ...i, sizes: i.sizes.map((s, idx) => (idx === sizeIdx ? { ...s, ...patch } : s)) } : i);

  const deleteItem = (id) => setItems((its) => its.filter((i) => i.id !== id));

  const addNewItem = () => {
    const id = "n" + Date.now().toString();
    setItems((its) => [...its, { id, cat: activeCat === "الكل" ? "أصناف جديدة" : activeCat, name: "صنف جديد", price: 20, desc: "" }]);
    setEditingId(id);
  };

  const sendWhatsApp = () => {
    if (cartList.length === 0) return;
    
    // التحقق من إدخال البيانات الإلزامية أولاً
    if (!customerPhone.trim() || !customerAddress.trim() || !selectedArea) {
      setValidationError("برجاء كتابة الهاتف، العنوان، واختيار المنطقة لتأكيد طلبك!");
      return;
    }
    
    setValidationError("");

    // حفظ البيانات في كاش المتصفح لعدم تكرار الكتابة مستقبلاً
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("customer-phone-cache", customerPhone.trim());
      localStorage.setItem("customer-address-cache", customerAddress.trim());
      localStorage.setItem("customer-area-id-cache", selectedArea.id);
    }

    const lines = cartList.map((cartItem) => "• " + cartItem.label + " x" + cartItem.qty + " — " + money(cartItem.price * cartItem.qty));
    
    // صياغة الرسالة النهائية الاحترافية متضمنة تفصيل الشحن والتوصيل
    let text = "طلب جديد من منيو " + restaurantName + " 🍽️\n\n" + 
               "📱 تليفون العميل: " + customerPhone + "\n" +
               "📍 المنطقة: " + selectedArea.name + "\n" +
               "🏠 العنوان بالتفصيل: " + customerAddress + "\n";
               
    if (customerNotes.trim()) {
      text += "📝 ملاحظات العميل: " + customerNotes.trim() + "\n";
    }

    text += "\nالطلبات:\n" + lines.join("\n") + "\n\n" +
            "💵 حساب الأكل: " + money(cartTotal) + "\n" +
            "🛵 مصاريف التوصيل: " + money(selectedArea.price) + "\n" +
            "💰 الإجمالي النهائي: " + money(finalTotalWithDelivery);
                 
    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");
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

  const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=" + encodeURIComponent(menuUrl);

  return (
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-20" style={{ background: theme.bg, color: theme.text, fontFamily: "'Tajawal', sans-serif" }}>
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-30 backdrop-blur border-b" style={{ background: theme.bg + "E6", borderColor: (theme.muted || "#B3A18C") + "30" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div onClick={handleLogoClick} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative">
              <img src={LOGO_SRC} alt={restaurantName + " logo"} className="w-10 h-10 rounded-full object-contain border border-white/20" style={{ padding: 1 }} />
              {logoClicks > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold animate-ping">{logoClicks}</span>}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl truncate leading-tight" style={{ fontFamily: theme.display, color: theme.accent, letterSpacing: "0.5px" }}>{restaurantName}</h1>
              <p className="text-[11px] truncate opacity-85" style={{ color: theme.muted }}>{tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin ? (
              <>
                <button onClick={() => setThemePickerOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-transform active:scale-95" title="تغيير المظهر"><Palette size={18} /></button>
                <button onClick={() => setQrOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-transform active:scale-95" title="عرض QR"><QrCode size={18} /></button>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-full border border-green-500/50 text-green-500 bg-green-500/10 transition-transform active:scale-95 animate-pulse" title="إعدادات المنيو"><Settings size={18} /></button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 transition-transform active:scale-95" title="خروج من وضع الإدارة"><LogOut size={16} /></button>
              </>
            ) : (
              <a href={"tel:" + whatsappNumber} className="p-2 rounded-full border transition-transform active:scale-95" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }} aria-label="اتصل بنا"><Phone size={17} /></a>
            )}
          </div>
        </div>
        <OrnamentDivider color={theme.accent} />
      </header>

      {/* ===================== CATEGORY TABS & SEARCH ===================== */}
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button key={c} onClick={() => { setActiveCat(c); }} className="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-all" style={activeCat === c ? { background: theme.accent, color: theme.bg, borderColor: theme.accent } : { borderColor: (theme.muted || "#B3A18C") + "40", color: theme.muted }}>{c}</button>
          ))}
        </div>

        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن بيتزا، سجق، مشروب..." className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm border focus:outline-none transition-all" style={{ background: theme.surface, borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
          <Search size={16} className="absolute right-3.5 top-3.5" style={{ color: theme.muted }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute left-3 top-2.5 p-1 rounded-full hover:bg-black/10 transition-colors" style={{ color: theme.muted }}><X size={14} /></button>}
        </div>
      </div>

      {/* ===================== MENU ITEMS ===================== */}
      <main className="max-w-3xl mx-auto px-4 pb-32 pt-4 space-y-6">
        {groups.map((group) => {
          const subcat = group[0];
          const list = group[1];
          return (
            <div key={subcat || "main"}>
              {subcat && <h2 className="text-sm font-black mb-3 px-1 tracking-wide" style={{ color: theme.accent, fontFamily: theme.display }}>{subcat}</h2>}
              <div className="space-y-3">
                {list.map((item) => (
                  <div key={item.id} className="rounded-2xl p-4 border transition-all" style={{ background: theme.surface, borderColor: (theme.muted || "#B3A18C") + "25" }}>
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base truncate">{item.name}</h3>
                      {!item.sizes && <span className="font-black shrink-0" style={{ color: theme.accent }}>{money(item.price)}</span>}
                    </div>
                    {item.desc && <p className="text-sm mb-2 opacity-90" style={{ color: theme.muted }}>{item.desc}</p>}

                    {item.sizes ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.sizes.map((sz) => {
                          const key = item.id + "::" + sz.label;
                          const qty = cart[key] || 0;
                          return (
                            <div key={sz.label} className="flex items-center gap-2 rounded-full px-2.5 py-1.5 border transition-colors" style={{ borderColor: (theme.muted || "#B3A18C") + "30", background: theme.surface2 }}>
                              <span className="text-xs font-bold" style={{ color: theme.muted }}>{sz.label}</span>
                              <span className="text-xs font-black" style={{ color: theme.accent }}>{money(sz.price)}</span>
                              {qty > 0 ? (
                                <div className="flex items-center gap-1.5 mr-1.5">
                                  <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={11} /></button>
                                  <span className="w-3 text-center text-xs font-bold">{qty}</span>
                                  <button onClick={() => addToCart(key, -1)} className="w-5 h-5 rounded-full flex items-center justify-center border" style={{ borderColor: (theme.muted || "#B3A18C") + "50" }}><Minus size={11} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-full flex items-center justify-center mr-1.5 hover:scale-105 active:scale-95 transition-transform" style={{ background: theme.accent, color: theme.bg }} aria-label={"إضافة " + item.name + " " + sz.label}><Plus size={11} /></button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex justify-end -mt-6">
                        {cart[item.id] > 0 ? (
                          <div className="flex items-center gap-2 rounded-full px-1.5 py-1" style={{ background: theme.surface2 }}>
                            <button onClick={() => addToCart(item.id, 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={14} /></button>
                            <span className="w-4 text-center font-bold text-sm">{cart[item.id]}</span>
                            <button onClick={() => addToCart(item.id, -1)} className="w-7 h-7 rounded-full flex items-center justify-center border" style={{ borderColor: (theme.muted || "#B3A18C") + "50" }}><Minus size={14} /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item.id, 1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-105 active:scale-90 transition-transform" style={{ background: theme.accent, color: theme.bg }} aria-label={"إضافة " + item.name}><Plus size={18} /></button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {visibleItems.length === 0 && (
          <div className="text-center py-12">
            <Sparkles size={32} className="mx-auto mb-2 opacity-50" style={{ color: theme.accent }} />
            <p className="text-sm" style={{ color: theme.muted }}>لا تتوفر أصناف تطابق بحثك حاليًا.</p>
          </div>
        )}
      </main>

      {/* ===================== FOOTER INFO STRIP ===================== */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t px-4 py-3 flex items-center justify-center gap-5 text-xs font-semibold shadow-inner" style={{ background: theme.bg + "F5", borderColor: (theme.muted || "#B3A18C") + "25", color: theme.muted, backdropFilter: "blur(8px)" }}>
        <a href={"tel:" + whatsappNumber} className="flex items-center gap-1 hover:underline"><Phone size={13} /> {whatsappNumber}</a>
        <span className="flex items-center gap-1 truncate"><MapPin size={13} className="shrink-0" /> <span className="truncate">{address}</span></span>
      </div>

      {/* ===================== FLOATING CART BUTTON ===================== */}
      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl font-bold text-sm active:scale-95 transition-all" style={{ background: theme.accent2, color: "#fff" }}>
          <ShoppingCart size={18} />
          <span>{cartCount} طلبات</span>
          <span className="opacity-60">|</span>
          <span>{money(finalTotalWithDelivery)}</span>
        </button>
      )}

      {/* ===================== CART DRAWER ===================== */}
      {cartOpen && (
        <Overlay onClose={() => setCartOpen(false)}>
          <Sheet theme={theme} title="سلة المشتريات" onClose={() => setCartOpen(false)}>
            {cartList.length === 0 ? <p className="text-center py-8" style={{ color: theme.muted }}>العربة فارغة حالياً</p> : (
              <>
                {/* قائمة المنتجات مع تحديد الحجم الأقصى لضمان عدم خروج العناصر من الشاشة */}
                <div className="space-y-3 max-h-[25vh] overflow-y-auto pr-1">
                  {cartList.map((cartItem) => (
                    <div key={cartItem.key} className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{cartItem.label}</p>
                        <p className="text-xs" style={{ color: theme.muted }}>{money(cartItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => addToCart(cartItem.key, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: (theme.muted || "#B3A18C") + "50" }}><Minus size={14} /></button>
                        <span className="w-4 text-center font-bold text-sm">{cartItem.qty}</span>
                        <button onClick={() => addToCart(cartItem.key, 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* تفصيل الفاتورة وحساب التوصيل التلقائي */}
                <div className="pt-2 mt-2 border-t space-y-1 text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                  <div className="flex items-center justify-between opacity
