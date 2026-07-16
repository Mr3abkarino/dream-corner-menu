import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, ChevronDown, User, Tag, Navigation, Award, Calendar
} from "lucide-react";

// --- الثوابت ---
const LOGO_SRC = restaurantLogo;

const THEMES = [
  { id: "brand", name: "هوية دريم كورنر", bg: "#0A0A0A", surface: "#141414", surface2: "#1F1F1F", accent: "#D4AF37", accent2: "#8B1E1E", text: "#F3E9D8", muted: "#A3A3A3", display: "'Tajawal', sans-serif" },
  { id: "night", name: "ليلي فاخر", bg: "#120E0D", surface: "#1E1816", surface2: "#2A211E", accent: "#D4A24C", accent2: "#A63D2F", text: "#F3E9D8", muted: "#B3A18C", display: "'Tajawal', sans-serif" },
  { id: "emerald", name: "شرقي فاخر", bg: "#081410", surface: "#10221C", surface2: "#19322A", accent: "#C9A24B", accent2: "#2F6E52", text: "#EFEAD9", muted: "#9DB0A6", display: "'Tajawal', sans-serif" },
  { id: "cafe", name: "كافيه دافئ", bg: "#F7F5F0", surface: "#FFFFFF", surface2: "#F0EAE1", accent: "#B5622E", accent2: "#6B4226", text: "#2B2118", muted: "#8A7A66", display: "'Tajawal', sans-serif", light: true }
];

const DEFAULT_DELIVERY_AREAS = [
  { name: "البرامون (داخل البلد)", price: 10 },
  { name: "البرامون (بر الترعة)", price: 20 },
  { name: "سرسو البرامون", price: 30 },
  { name: "البدالة", price: 40 },
  { name: "الخيارية", price: 50 },
  { name: "كفر البرامون", price: 40 },
  { name: "كفر بداوي", price: 50 },
  { name: "شربين", price: 80 }
];

const DEFAULT_PROMO_CODES = [
  { code: "OFF10", discount: 10 },
  { code: "DREAM", discount: 15 }
];

const DEFAULT_MENU = [
  { id: "p1", cat: "البيتزا", name: "بيتزا مارجريتا", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "بيتزا ميكس جبنة", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "d1", cat: "المشروبات", name: "بيبسي كانز", price: 15 }
];

const money = (n) => Number(n).toLocaleString("en-US") + " جنيه";

const safeStorage = {
  get: async (key) => {
    if (typeof window !== "undefined" && window.localStorage) {
      const local = localStorage.getItem(key);
      return local ? { value: local } : null;
    }
    return null;
  },
  set: async (key, val) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, val);
    }
  }
};

// --- المكون الرئيسي ---
export default function RestaurantMenu() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [restaurantName, setRestaurantName] = useState("دريم كورنر");
  const [tagline, setTagline] = useState("PIZZA & SANDWICHES — طعم يفرق");
  const [address, setAddress] = useState("البرامون، بجوار عيادة الدكتورة إلهام العشري");
  const [whatsappNumber, setWhatsappNumber] = useState("+201006113627");
  const [vodafoneCash, setVodafoneCash] = useState("+201023590020");
  const [instapay, setInstapay] = useState("zxzwd@instapay");

  const [items, setItems] = useState(DEFAULT_MENU);
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  
  // --- متغيرات الإدارة ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);

  // دالة التعامل مع الضغط على الشعار
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setPinModalOpen(true);
      setLogoClicks(0);
    }
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin === adminPin) {
      setIsAdmin(true);
      setPinModalOpen(false);
      setAdminOpen(true);
      setPinError("");
      setEnteredPin("");
    } else {
      setPinError("رمز الأمان غير صحيح!");
      setEnteredPin("");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen" style={{ background: theme.bg, color: theme.text }}>
      <header className="p-4 flex items-center justify-between border-b" style={{ borderColor: theme.muted + "20" }}>
        <div onClick={handleLogoClick} className="cursor-pointer relative">
          <img src={LOGO_SRC} alt="logo" className="w-12 h-12 rounded-full animate-pulse" />
          {logoClicks > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[10px] flex items-center justify-center">{logoClicks}</span>}
        </div>
        <h1 className="text-xl font-black">{restaurantName}</h1>
      </header>

      {/* هنا يتم وضع باقي هيكل المنيو والـ Modals كما في كودك الأصلي */}
      
      {/* نافذة التحقق من الـ PIN */}
      {pinModalOpen && (
        <Overlay onClose={() => setPinModalOpen(false)}>
          <Sheet theme={theme} title="دخول المدير" onClose={() => setPinModalOpen(false)}>
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input type="password" value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} className="w-full p-3 rounded-lg border text-center font-bold" placeholder="أدخل رمز الـ PIN" />
              {pinError && <p className="text-red-500 text-xs text-center">{pinError}</p>}
              <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-lg font-bold">دخول</button>
            </form>
          </Sheet>
        </Overlay>
      )}
    </div>
  );
}

// أضف هنا تعريفات Overlay و Sheet و Field و PayRow من ملفك الأصلي لضمان عمل الواجهات
