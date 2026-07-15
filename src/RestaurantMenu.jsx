import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, ChevronDown, User, Tag, Navigation, Award, Calendar
} from "lucide-react";

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
  { id: "p3", cat: "البيتزا", name: "بيتزا خضار", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p4", cat: "البيتزا", name: "بيتزا هوت دوج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p5", cat: "البيتزا", name: "بيتزا سجق", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "بيتزا لحمة مفرومة", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "p7", cat: "البيتزا", name: "بيتزا بيروني", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p8", cat: "البيتزا", name: "بيتزا سلامي", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p9", cat: "البيتزا", name: "بيتزا شاورما دجاج", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p10", cat: "البيتزا", name: "بيتزا دجاج رانش", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p11", cat: "البيتزا", name: "بيتزا دريم كورنر سبيشال", desc: "خلطة البيت الخاصة المميزة", sizes: [{ label: "كبير", price: 170 }, { label: "وسط", price: 130 }, { label: "صغير", price: 90 }] },
  { id: "p12", cat: "البيتزا", name: "بيتزا كرانشي (حار أو بارد)", sizes: [{ label: "كبير", price: 130 }, { label: "وسط", price: 100 }, { label: "صغير", price: 80 }] },
  { id: "p13", cat: "البيتزا", name: "بيتزا ميكس دجاج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 105 }, { label: "صغير", price: 85 }] },
  { id: "p14", cat: "البيتزا", name: "حشو الأطراف", desc: "إضافة أطراف محشوة لأي بيتزا", sizes: [{ label: "كبير", price: 35 }, { label: "وسط", price: 30 }, { label: "صغير", price: 25 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s2", cat: "السندوتشات", subcat: "اللحوم", name: "سجق مشوي", sizes: [{ label: "كبير", price: 70 }, { label: "وسط", price: 60 }] },
  { id: "s3", cat: "السندوتشات", subcat: "اللحوم", name: "كبدة إسكندراني", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s4", cat: "السندوتشات", subcat: "اللحوم", name: "ميكس لحوم (سجق+كبدة)", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", price: 45 },
  { id: "s6", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن بانية", sizes: [{ label: "كبير", price: 85 }, { label: "وسط", price: 70 }] },
  { id: "s7", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "زنجر سوبريم", sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
  { id: "s8", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "سوبر كرانشي", sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
  { id: "s9", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "شيش طاووق", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 75 }] },
  { id: "s10", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن رانش", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 75 }] },
  { id: "s11", cat: "السندوتشات", subcat: "البرجر", name: "كلاسيك برجر", sizes: [{ label: "كبير", price: 65 }, { label: "وسط", price: 55 }] },
  { id: "s12", cat: "السندوتشات", subcat: "البرجر", name: "تشيز برجر ليدر", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s13", cat: "السندوتشات", subcat: "البرجر", name: "تشكن برجر مقرمش", sizes: [{ label: "كبير", price: 65 }, { label: "وسط", price: 50 }] },
  { id: "s14", cat: "السندوتشات", subcat: "التوست", name: "ميكس توست جبن", price: 60 },
  { id: "sd1", cat: "الأصناف الجانبية", name: "بطاطس مقلية ذهبية", price: 35 },
  { id: "sd2", cat: "الأصناف الجانبية", name: "بطاطس بالجبنة الشيدر", price: 45 },
  { id: "sd3", cat: "الأصناف الجانبية", name: "صوص رانش هوم ميد", price: 10 },
  { id: "d1", cat: "المشروبات", name: "بيبسي كانز", price: 15 },
  { id: "d2", cat: "المشروبات", name: "سفن أب كانز", price: 15 },
  { id: "d3", cat: "المشروبات", name: "ميرندا برتقال كانز", price: 15 },
  { id: "d4", cat: "المشروبات", name: "مياة معدنية صغيرة", price: 6 }
];

const money = (n) => Number(n).toLocaleString("en-US") + " جنيه";

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
  if (typeof document === "undefined") return false;
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

export default function RestaurantMenu() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [restaurantName, setRestaurantName] = useState("دريم كورنر");
  const [tagline, setTagline] = useState("PIZZA & SANDWICHES — طعم يفرق .. جودة تليق بك");
  const [address, setAddress] = useState("البرامون، بجوار عيادة الدكتورة إلهام العشري");
  const [menuUrl, setMenuUrl] = useState("https://dream-corner-menu-4nfj.vercel.app");
  const [whatsappNumber, setWhatsappNumber] = useState("+201006113627");
  const [vodafoneCash, setVodafoneCash] = useState("+201023590020");
  const [instapay, setInstapay] = useState("zxzwd@instapay");

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

  const [deliveryAreas, setDeliveryAreas] = useState(DEFAULT_DELIVERY_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPrice, setNewAreaPrice] = useState("");
  
  const [promoCodes, setPromoCodes] = useState(DEFAULT_PROMO_CODES);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [geoLink, setGeoLink] = useState("");
  const [geoLoading, setGeoLinkLoading] = useState(false);
  
  const [enteredPromo, setEnteredPromo] = useState("");
  const [appliedDiscountPercent, setAppliedDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  
  const [selectedAreaIndex, setSelectedAreaIndex] = useState(-1);
  const [validationError, setValidationError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // إعدادات الولاء ومحفظة النقاط الذكية
  const [userPoints, setUserPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);

  // إعدادات جدولة المواعيد
  const [scheduleType, setScheduleType] = useState("now"); // "now" or "later"
  const [scheduleTime, setScheduleTime] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);
  
  const saveTimer = useRef(null);

  const findItem = (id) => items.find((i) => i.id === id);

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

  const cartCount = useMemo(() => cartList.reduce((s, i) => s + i.qty, 0), [cartList]);
  const cartTotal = useMemo(() => cartList.reduce((s, i) => s + i.qty * i.price, 0), [cartList]);

  const activeDeliveryArea = useMemo(() => {
    if (selectedAreaIndex >= 0 && selectedAreaIndex < deliveryAreas.length) {
      return deliveryAreas[selectedAreaIndex];
    }
    return { name: "اختر منطقة التوصيل...", price: 0 };
  }, [selectedAreaIndex, deliveryAreas]);

  // حساب إجمالي الخصومات (خصم الكوبون + خصم النقاط)
  const discountAmount = useMemo(() => {
    return Math.round((cartTotal * appliedDiscountPercent) / 100);
  }, [cartTotal, appliedDiscountPercent]);

  // حساب قيمة خصم نقاط الولاء (كل نقطة تساوى 1 جنيه خصم)
  const pointsDiscountValue = useMemo(() => {
    if (!redeemPoints) return 0;
    return Math.min(userPoints, Math.max(0, cartTotal - discountAmount));
  }, [redeemPoints, userPoints, cartTotal, discountAmount]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discountAmount - pointsDiscountValue) + activeDeliveryArea.price;
  }, [cartTotal, discountAmount, pointsDiscountValue, activeDeliveryArea]);

  const qrSrc = useMemo(() => {
    return "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=" + encodeURIComponent(menuUrl);
  }, [menuUrl]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setValidationError("متصفحك لا يدعم تحديد الموقع تلقائياً.");
      return;
    }
    setGeoLinkLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setGeoLink("http://maps.google.com/?q=" + lat + "," + lon);
        setCustomerAddress(prev => prev + " [تم تحديد اللوكيشن بـ GPS 📍]");
        setGeoLinkLoading(false);
      },
      () => {
        setValidationError("فشل تحديد الموقع، برجاء تفعيل الـ GPS في موبايلك.");
        setGeoLinkLoading(false);
      }
    );
  };

  const handleApplyPromo = () => {
    const codeClean = enteredPromo.trim().toUpperCase();
    if (!codeClean) return;
    const match = promoCodes.find(p => p.code.toUpperCase() === codeClean);
    if (match) {
      setAppliedDiscountPercent(match.discount);
      setPromoError("");
    } else {
      setAppliedDiscountPercent(0);
      setPromoError("كود الخصم غير صحيح أو منتهي الصلاحية!");
    }
  };

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
          if (d.deliveryAreas) setDeliveryAreas(d.deliveryAreas);
          if (d.promoCodes) setPromoCodes(d.promoCodes);
          if (d.themeId) {
            const t = THEMES.find((themeItem) => themeItem.id === d.themeId);
            if (t) setTheme(t);
          }
        }
        if (typeof window !== "undefined" && window.localStorage) {
          const savedName = localStorage.getItem("customer-name-cache");
          const savedPhone = localStorage.getItem("customer-phone-cache");
          const savedAddress = localStorage.getItem("customer-address-cache");
          const savedPoints = localStorage.getItem("customer-points-loyalty");
          if (savedName) setCustomerName(savedName);
          if (savedPhone) setCustomerPhone(savedPhone);
          if (savedAddress) setCustomerAddress(savedAddress);
          if (savedPoints) setUserPoints(Number(savedPoints));
        }
      } catch (e) {
        console.error("Storage error", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await safeStorage.set("dream-corner-menu", JSON.stringify({
          items, restaurantName, tagline, address, menuUrl, whatsappNumber,
          vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, themeId: theme.id,
        }));
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 500);
  }, [items, restaurantName, tagline, address, menuUrl, whatsappNumber, vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, theme, loaded]);

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

  const addToCart = (key, delta) =>
    setCart((c) => {
      const nextCart = { ...c };
      nextCart[key] = Math.max(0, (c[key] || 0) + delta);
      return nextCart;
    });

  const updateItem = (id, patch) =>
    setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const updateSize = (id, sizeIdx, patch) =>
    setItems((its) => its.map((i) => i.id === id ? { ...i, sizes: i.sizes.map((s, idx) => (idx === sizeIdx ? { ...s, ...patch } : s)) } : i));

  const deleteItem = (id) => setItems((its) => its.filter((i) => i.id !== id));

  const addNewItem = () => {
    const id = "n" + Date.now().toString();
    setItems((its) => [...its, { id, cat: activeCat === "الكل" ? "أصناف جديدة" : activeCat, name: "صنف جديد", price: 20, desc: "" }]);
    setEditingId(id);
  };

  const handleAddDeliveryArea = () => {
    if (!newAreaName.trim() || !newAreaPrice.trim()) return;
    setDeliveryAreas([...deliveryAreas, { name: newAreaName.trim(), price: Number(newAreaPrice) }]);
    setNewAreaName("");
    setNewAreaPrice("");
  };

  const handleRemoveDeliveryArea = (index) => {
    setDeliveryAreas(deliveryAreas.filter((_, idx) => idx !== index));
    setSelectedAreaIndex(-1);
  };

  const handleAddPromoCode = () => {
    if (!newPromoCode.trim() || !newPromoDiscount.trim()) return;
    setPromoCodes([...promoCodes, { code: newPromoCode.trim().toUpperCase(), discount: Number(newPromoDiscount) }]);
    setNewPromoCode("");
    setNewPromoDiscount("");
  };

  const handleRemovePromoCode = (index) => {
    setPromoCodes(promoCodes.filter((_, idx) => idx !== index));
  };

  const sendWhatsApp = () => {
    if (cartList.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setValidationError("برجاء كتابة الاسم، ورقم الهاتف، وعنوان التوصيل أولاً لتأكيد طلبك!");
      return;
    }
    if (selectedAreaIndex === -1) {
      setValidationError("برجاء اختيار منطقة التوصيل لحساب إجمالي الأوردر بدقة!");
      return;
    }
    if (scheduleType === "later" && !scheduleTime) {
      setValidationError("برجاء اختيار وقت وموعد التوصيل المطلق!");
      return;
    }
    setValidationError("");

    // حساب النقاط الجديدة المكتسبة من هذا الطلب (نقطة لكل 10 جنيه)
    const newlyEarnedPoints = Math.floor(cartTotal / 100);
    let updatedPoints = userPoints;

    // خصم النقاط المستخدمة وإضافة النقاط الجديدة للمحفظة
    if (redeemPoints) {
      updatedPoints = Math.max(0, userPoints - pointsDiscountValue);
    }
    updatedPoints += newlyEarnedPoints;

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("customer-name-cache", customerName.trim());
      localStorage.setItem("customer-phone-cache", customerPhone.trim());
      localStorage.setItem("customer-address-cache", customerAddress.trim());
      localStorage.setItem("customer-points-loyalty", updatedPoints.toString());
    }

    const lines = cartList.map((cartItem) => "• " + cartItem.label + " x" + cartItem.qty + " — " + money(cartItem.price * cartItem.qty));
    
    // إعداد تفاصيل وقت التوصيل المجدول
    const deliveryTimeText = scheduleType === "now" ? "⚡ توصيل فوري (الآن)" : "🕒 مجدول للموعد: " + scheduleTime;

    let text = "طلب جديد من منيو " + restaurantName + " 🍽️\n\n" + 
               "👤 اسم العميل: " + customerName + "\n" +
               "📱 تليفون العميل: " + customerPhone + "\n" +
               "📅 موعد التوصيل: " + deliveryTimeText + "\n" +
               "📍 المنطقة: " + activeDeliveryArea.name + "\n" +
               "🏠 العنوان بالتفصيل: " + customerAddress + "\n";
               
    if (geoLink) {
      text += "📍 لوكيشن خريطة العميل: " + geoLink + "\n";
    }
    if (customerNotes.trim()) {
      text += "📝 ملاحظات العميل: " + customerNotes.trim() + "\n";
    }
    
    text += "\nالطلبات:\n" + lines.join("\n") + "\n\n" +
            "💵 حساب الأكل الأصلي: " + money(cartTotal) + "\n";
            
    if (discountAmount > 0) {
      text += "🏷️ كود الخصم المطبق: " + enteredPromo.toUpperCase() + " (-" + appliedDiscountPercent + "%)\n" +
              "📉 قيمة الخصم: " + money(discountAmount) + "\n";
    }

    if (redeemPoints && pointsDiscountValue > 0) {
      text += "🪙 خصم نقاط محفظة الولاء: -" + money(pointsDiscountValue) + " (تم خصم " + pointsDiscountValue + " نقطة)\n";
    }

    text += "✨ نقاط مستحقة من هذا الأوردر: +" + newlyEarnedPoints + " نقطة ذهبية\n" +
            "🛵 مصاريف التوصيل: " + money(activeDeliveryArea.price) + "\n" +
            "💰 الإجمالي النهائي المطلوب: " + money(finalTotal);
                 
    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");

    setUserPoints(updatedPoints);
    setCartOpen(false);
    setCart({});
    setOrderSuccess(true);
    setAppliedDiscountPercent(0);
    setEnteredPromo("");
    setGeoLink("");
    setRedeemPoints(false);
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
    setDeliveryAreas(DEFAULT_DELIVERY_AREAS);
    setPromoCodes(DEFAULT_PROMO_CODES);
    setShowResetConfirm(false);
  };

  const handleLogoClickLocal = () => {
    handleLogoClick();
  };

  return (
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-28" style={{ background: theme.bg, color: theme.text, fontFamily: "'Tajawal', sans-serif" }}>
      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: theme.bg + "D9", borderColor: (theme.muted || "#B3A18C") + "20" }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div onClick={handleLogoClickLocal} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative">
              <img src={LOGO_SRC} alt={restaurantName + " logo"} className="w-11 h-11 rounded-full object-contain border border-white/10 animate-pulse" style={{ padding: 1, animationDuration: '3s' }} />
              {logoClicks > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold animate-ping">{logoClicks}</span>}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black truncate leading-tight" style={{ color: theme.accent }}>{restaurantName}</h1>
              <p className="text-[11px] truncate opacity-75 mt-0.5" style={{ color: theme.muted }}>{tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <>
                <button onClick={() => setThemePickerOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-all hover:bg-green-500/10 active:scale-95" title="تغيير المظهر"><Palette size={18} /></button>
                <button onClick={() => setQrOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-all hover:bg-green-500/10 active:scale-95" title="عرض QR"><QrCode size={18} /></button>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-full border border-green-500/50 text-green-500 bg-green-500/10 transition-all hover:bg-green-500/20 active:scale-95 animate-pulse" title="إعدادات المنيو والأسعار"><Settings size={18} /></button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 transition-all hover:bg-red-500/10 active:scale-95" title="خروج من وضع الإدارة"><LogOut size={16} /></button>
              </>
            ) : (
              <a href={"tel:" + whatsappNumber} className="p-2 rounded-full border transition-transform active:scale-95" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }} aria-label="اتصل بنا"><Phone size={17} /></a>
            )}
          </div>
        </div>
      </header>

      {/* ===================== CATEGORIES BAR ===================== */}
      <div className="sticky top-[77px] z-20 backdrop-blur-md border-b py-3 shadow-sm" style={{ background: theme.bg + "F2", borderColor: (theme.muted || "#B3A18C") + "15" }}>
        <div className="max-w-3xl mx-auto px-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => { setActiveCat(c); }} 
              className="whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold border transition-all duration-300" 
              style={activeCat === c ? { background: theme.accent, color: theme.bg, borderColor: theme.accent, boxShadow: `0 4px 10px ${theme.accent}30` } : { borderColor: (theme.muted || "#B3A18C") + "20", color: theme.muted, background: theme.surface }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== SEARCH ===================== */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن بيتزا، سندوتش، مشروب..." className="w-full px-4 py-3 pr-10 rounded-2xl text-xs border focus:outline-none transition-all shadow-sm" style={{ background: theme.surface, borderColor: (theme.muted || "#B3A18C") + "25", color: theme.text }} />
          <Search size={15} className="absolute right-3.5 top-3.5" style={{ color: theme.muted }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute left-3 top-2.5 p-1 rounded-full hover:bg-black/10 transition-colors" style={{ color: theme.muted }}><X size={14} /></button>}
        </div>
      </div>

      {/* ===================== MENU ITEMS ===================== */}
      <main className="max-w-3xl mx-auto px-4 pb-32 pt-5 space-y-8">
        {groups.map((group) => {
          const subcat = group[0];
          const list = group[1];
          return (
            <div key={subcat || "main"}>
              {subcat && (
                <h2 className="text-xs font-black mb-4 px-1 tracking-wide uppercase flex items-center gap-2" style={{ color: theme.accent }}>
                  <span className="w-1.5 h-3.5 rounded-full" style={{ background: theme.accent }} />
                  {subcat}
                </h2>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {list.map((item) => (
                  <div key={item.id} className="rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg shadow-sm" style={{ background: theme.surface, borderColor: (theme.muted || "#B3A18C") + "15" }}>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.name}</h3>
                      {item.desc && <p className="text-[10px] opacity-75 line-clamp-3 leading-relaxed" style={{ color: theme.muted }}>{item.desc}</p>}
                    </div>

                    <div className="mt-4 pt-2 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "10" }}>
                      {item.sizes ? (
                        <div className="space-y-1.5">
                          {item.sizes.map((sz) => {
                            const key = item.id + "::" + sz.label;
                            const qty = cart[key] || 0;
                            return (
                              <div key={sz.label} className="flex items-center justify-between gap-1 rounded-lg px-2 py-1 text-[10px]" style={{ background: theme.surface2 }}>
                                <span className="font-bold opacity-80">{sz.label}</span>
                                <span className="font-extrabold" style={{ color: theme.accent }}>{money(sz.price)}</span>
                                {qty > 0 ? (
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => addToCart(key, -1)} className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={9} /></button>
                                    <span className="w-2.5 text-center font-bold">{qty}</span>
                                    <button onClick={() => addToCart(key, 1)} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={9} /></button>
                                  </div>
                                ) : (
                                  <button onClick={() => addToCart(key, 1)} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={9} /></button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black" style={{ color: theme.accent }}>{money(item.price)}</span>
                          {cart[item.id] > 0 ? (
                            <div className="flex items-center gap-1.5 rounded-full px-1.5 py-0.5" style={{ background: theme.surface2 }}>
                              <button onClick={() => addToCart(item.id, -1)} className="w-5.5 h-5.5 rounded-full flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={10} /></button>
                              <span className="w-3 text-center font-bold text-xs">{cart[item.id]}</span>
                              <button onClick={() => addToCart(item.id, 1)} className="w-5.5 h-5.5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={10} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item.id, 1)} className="w-6.5 h-6.5 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ background: theme.accent, color: theme.bg }}><Plus size={13} /></button>
                          )}
                        </div>
                      )}
                    </div>
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
      <div className="fixed bottom-0 inset-x-0 z-20 border-t px-4 py-3.5 flex items-center justify-center gap-4 text-xs font-semibold shadow-inner" style={{ background: theme.bg + "F2", borderColor: (theme.muted || "#B3A18C") + "20" , color: theme.muted, backdropFilter: "blur(8px)" }}>
        <a href="https://fb.com/mr.3abkarino" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold tracking-wide shrink-0 cursor-pointer hover:underline" style={{ color: theme.accent }}>
          Mr3abkarino© <span className="text-red-500 text-sm animate-pulse">❤️</span>
        </a>
        <span className="opacity-40 shrink-0">|</span>
        <span className="flex items-center gap-1 truncate min-w-0">
          <MapPin size={13} className="shrink-0" /> 
          <span className="truncate opacity-90">{address}</span>
        </span>
      </div>

      {/* ===================== FLOATING CART BUTTON ===================== */}
      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-35 flex items-center justify-between gap-6 px-6 py-3.5 rounded-full shadow-2xl font-bold text-sm active:scale-95 transition-all" style={{ background: theme.accent, color: theme.bg, width: "90%", maxWidth: "450px" }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-2.5 -right-2 w-4.5 h-4.5 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            </div>
            <span>عرض الطلبات</span>
          </div>
          <span className="text-xs tracking-wide">الإجمالي: {money(cartTotal)}</span>
        </button>
      )}

      {/* ===================== CART DRAWER ===================== */}
      {cartOpen && (
        <Overlay onClose={() => setCartOpen(false)}>
          <Sheet theme={theme} title="سلة المشتريات" onClose={() => setCartOpen(false)}>
            {cartList.length === 0 ? <p className="text-center py-8" style={{ color: theme.muted }}>العربة فارغة حالياً</p> : (
              <>
                <div className="space-y-3 max-h-[15vh] overflow-y-auto pr-1">
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

                {/* نظام نقاط الولاء والمكافآت (Loyalty Points Box) */}
                {userPoints > 0 && (
                  <div className="mt-3 p-3 rounded-xl border border-dashed flex flex-col gap-2" style={{ borderColor: theme.accent + "40", background: theme.surface2 }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.accent }}>
                        <Award size={15} className="animate-bounce" />
                        <span>محفظة النقاط الذهبية: لديك {userPoints} نقطة</span>
                      </div>
                      <span className="text-[10px] opacity-80" style={{ color: theme.muted }}>تساوي {money(userPoints)} خصم</span>
                    </div>
                    <button 
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      className="w-full py-1.5 rounded-lg text-[11px] font-black transition-all active:scale-95 flex items-center justify-center gap-1"
                      style={redeemPoints ? { background: "#15803d", color: "#fff" } : { background: theme.accent, color: theme.bg }}
                    >
                      {redeemPoints ? "✓ تم تطبيق خصم النقاط الذهبية" : "🪙 اضغط هنا لاستبدال النقاط بخصم فوري"}
                    </button>
                  </div>
                )}
                
                <div className="space-y-1 pt-2 mt-2 border-t text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                  <div className="flex items-center justify-between opacity-80">
                    <span>حساب المأكولات:</span>
                    <span>{money(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-green-500 font-medium">
                      <span>خصم الكوبون (-{appliedDiscountPercent}%):</span>
                      <span>-{money(discountAmount)}</span>
                    </div>
                  )}
                  {redeemPoints && pointsDiscountValue > 0 && (
                    <div className="flex items-center justify-between text-green-500 font-medium animate-pulse">
                      <span>خصم استبدال النقاط:</span>
                      <span>-{money(pointsDiscountValue)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between opacity-80">
                    <span>توصيل لـ ({selectedAreaIndex >= 0 ? activeDeliveryArea.name : "لم تحدد"}):</span>
                    <span>{money(activeDeliveryArea.price)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm font-black border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "15" }}>
                    <span style={{ color: theme.muted }}>الإجمالي الإجمالي:</span>
                    <span style={{ color: theme.accent }} className="text-base">{money(finalTotal)}</span>
                  </div>
                </div>

                {/* نظام كود الخصم */}
                <div className="pt-2.5 flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" placeholder="هل لديك كوبون خصم؟" value={enteredPromo} onChange={(e) => setEnteredPromo(e.target.value)} className="w-full px-3 py-2 pr-8 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "25", color: theme.text }} />
                    <Tag size={13} className="absolute right-2.5 top-2.5 opacity-60" style={{ color: theme.text }} />
                  </div>
                  <button onClick={handleApplyPromo} className="px-4 py-2 rounded-xl font-bold text-xs shadow-sm" style={{ background: theme.surface2, color: theme.accent, border: "1px solid " + theme.accent + "40" }}>تطبيق</button>
                </div>
                {promoError && <p className="text-[10px] font-bold text-red-500 mr-1">{promoError}</p>}
                {appliedDiscountPercent > 0 && <p className="text-[10px] font-bold text-green-500 mr-1">✓ تم تطبيق الخصم بنجاح بنسبة {appliedDiscountPercent}%</p>}

                {/* بيانات العميل والتوصيل والملاحظات */}
                <div className="mt-3 pt-2 border-t space-y-2" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                  <p className="text-[11px] font-bold" style={{ color: theme.accent }}>بيانات التوصيل والطلب (الدليفري):</p>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <input type="text" placeholder="اكتب اسمك الكريم هنا..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                      <User size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="relative">
                      <select 
                        value={selectedAreaIndex}
                        onChange={(e) => setSelectedAreaIndex(Number(e.target.value))}
                        className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none appearance-none" 
                        style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }}
                      >
                        <option value={-1}>اختر منطقة التوصيل...</option>
                        {deliveryAreas.map((area, idx) => (
                          <option key={idx} value={idx} style={{ background: theme.surface, color: theme.text }}>
                            {area.name} (+{money(area.price)})
                          </option>
                        ))}
                      </select>
                      <MapPin size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                      <ChevronDown size={14} className="absolute left-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    {/* خيارات جدولة مواعيد التوصيل (Order Scheduling Box) */}
                    <div className="p-3 rounded-xl border border-dotted space-y-2.5" style={{ borderColor: (theme.muted || "#B3A18C") + "30", background: theme.surface2 }}>
                      <p className="text-[10px] font-bold opacity-80 flex items-center gap-1" style={{ color: theme.muted }}>
                        <Calendar size={13} />
                        <span>تحديد موعد التوصيل المطلق:</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button" 
                          onClick={() => setScheduleType("now")}
                          className="py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          style={scheduleType === "now" ? { background: theme.accent, color: theme.bg, borderColor: theme.accent } : { borderColor: theme.muted + "20" }}
                        >
                          ⚡ دليفري فوري (الآن)
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setScheduleType("later")}
                          className="py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          style={scheduleType === "later" ? { background: theme.accent, color: theme.bg, borderColor: theme.accent } : { borderColor: theme.muted + "20" }}
                        >
                          🕒 توصيل مجدول لاحقاً
                        </button>
                      </div>

                      {scheduleType === "later" && (
                        <div className="relative animate-pulse">
                          <input 
                            type="text" 
                            placeholder="اكتب الموعد المفضل (مثال: الساعة 9:30 مساءً)..." 
                            value={scheduleTime} 
                            onChange={(e) => setScheduleTime(e.target.value)} 
                            className="w-full px-3 py-2 pr-8 rounded-lg text-[10px] border focus:outline-none" 
                            style={{ background: theme.surface, borderColor: theme.accent + "40", color: theme.text }} 
                          />
                          <Calendar size={12} className="absolute right-2.5 top-2.5" style={{ color: theme.accent }} />
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input type="tel" placeholder="رقم تليفونك لتأكيد الطلب..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                      <Phone size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" placeholder="العنوان بالتفصيل (البيت، الشارع)..." value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                        <MapPin size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                      </div>
                      <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl border font-bold text-xs flex items-center justify-center bg-black/10 transition-transform active:scale-95 shrink-0" style={{ borderColor: theme.accent, color: theme.accent }}>
                        {geoLoading ? "..." : <Navigation size={14} className="animate-pulse" />}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea placeholder="أي ملاحظات إضافية على الأكل؟ (مثال: بدون بصل، الكرانشي حار...)" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={1} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none resize-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                      <FileText size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                    </div>
                  </div>
                  
                  {validationError && <p className="text-[10px] text-center font-bold text-red-500 bg-red-500/10 py-1 rounded-lg animate-pulse">{validationError}</p>}
                </div>

                <button onClick={sendWhatsApp} className="w-full mt-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md hover:opacity-90" style={{ background: "#25D366", color: "#fff" }}><MessageCircle size={18} />تأكيد وإرسال عبر واتساب</button>
                
                <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                  <p className="text-xs font-bold" style={{ color: theme.muted }}>خيارات الدفع الإلكتروني المباشر</p>
                  <PayRow icon={<Phone size={16} />} label="فودافون كاش كود" value={vodafoneCash} theme={theme} onCopy={copyText} copied={copied} />
                  <PayRow icon={<CreditCard size={16} />} label="حساب InstaPay" value={instapay} theme={theme} onCopy={copyText} copied={copied} />
                </div>
              </>
            )}
          </Sheet>
        </Overlay>
      )}

      {orderSuccess && (
        <Overlay onClose={() => setOrderSuccess(false)}>
          <Sheet theme={theme} title="تم إرسال طلبك بنجاح! 🎉" onClose={() => setOrderSuccess(false)}>
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">✓</div>
              <p className="text-sm font-bold leading-relaxed">
                تم تجهيز الأوردر وتصفير السلة بنجاح. <br/>
                جاري الآن تحويلك إلى تطبيق واتساب لإرسال الفاتورة وتأكيد التوصيل مع الكابتن!
              </p>
              <button onClick={() => setOrderSuccess(false)} className="px-6 py-2 rounded-xl text-xs font-bold" style={{ background: theme.accent, color: theme.bg }}>فهمت، شكراً لك</button>
            </div>
          </Sheet>
        </Overlay>
      )}

      {qrOpen && (
        <Overlay onClose={() => setQrOpen(false)}>
          <Sheet theme={theme} title="بار كود المنيو للعملاء" onClose={() => setQrOpen(false)}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-md"><img src={qrSrc} alt="QR Code للمنيو" width={220} height={220} /></div>
              <label className="w-full text-sm">
                <span style={{ color: theme.muted }}>رابط موقع المنيو الحالي</span>
                <input value={menuUrl} onChange={(e) => setMenuUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent text-sm font-semibold text-center" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }} dir="ltr" />
              </label>
            </div>
          </Sheet>
        </Overlay>
      )}

      {themePickerOpen && (
        <Overlay onClose={() => setThemePickerOpen(false)}>
          <Sheet theme={theme} title="اختر هوية مطعمك البصرية" onClose={() => setThemePickerOpen(false)}>
            <div className="grid grid-cols-1 gap-2.5">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => { setTheme(t); setThemePickerOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl border text-right transition-colors hover:bg-black/5" style={{ borderColor: (theme.muted || "#B3A18C") + "30", background: t.bg }}>
                  <div className="flex gap-1 shrink-0"><span className="w-6 h-6 rounded-full border border-white/20" style={{ background: t.accent }} /><span className="w-6 h-6 rounded-full border border-white/20" style={{ background: t.accent2 }} /></div>
                  <span className="text-base font-bold" style={{ color: t.text }}>{t.name}</span>
                  {t.id === theme.id && <Check size={16} className="mr-auto" style={{ color: t.accent }} />}
                </button>
              ))}
            </div>
          </Sheet>
        </Overlay>
      )}

      {pinModalOpen && (
        <Overlay onClose={() => setPinModalOpen(false)}>
          <Sheet theme={theme} title="التحقق من هوية المدير" onClose={() => setPinModalOpen(false)}>
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="flex flex-col items-center justify-center py-2"><KeyRound size={40} className="mb-2" style={{ color: theme.accent }} /><p className="text-xs text-center" style={{ color: theme.muted }}>هذه المنطقة مخصصة لإدارة المطعم فقط.</p></div>
              <label className="block text-sm space-y-1">
                <span className="font-bold opacity-90" style={{ color: theme.muted }}>رمز الأمان الحالي</span>
                <input type="password" maxLength={12} value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-lg border bg-transparent text-center text-lg tracking-widest font-bold focus:outline-none" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} required />
              </label>
              {pinError && <p className="text-xs text-center font-bold text-red-500 bg-red-500/10 py-1.5 rounded-lg">{pinError}</p>}
              <div className="flex gap-2"><button type="submit" className="flex-1 py-2 rounded-xl font-bold text-xs" style={{ background: theme.accent, color: theme.bg }}>دخول الإدارة</button><button type="button" onClick={() => setPinModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}>إلغاء</button></div>
            </form>
          </Sheet>
        </Overlay>
      )}

      {adminOpen && (
        <Overlay onClose={() => setAdminOpen(false)}>
          <Sheet theme={theme} title="إعدادات الإدارة والأسعار" onClose={() => setAdminOpen(false)}>
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              <Field label="اسم المطعم" value={restaurantName} onChange={setRestaurantName} theme={theme} />
              <Field label="الشعار الفرعي للمنيو" value={tagline} onChange={setTagline} theme={theme} />
              <Field label="العنوان الجغرافي" value={address} onChange={setAddress} theme={theme} />
              <Field label="رقم واتساب الاستقبال" value={whatsappNumber} onChange={setWhatsappNumber} theme={theme} dir="ltr" hint="بالصيغة الدولية مثال: +201006113627" />
              <Field label="رقم فودافون كاش" value={vodafoneCash} onChange={setVodafoneCash} theme={theme} dir="ltr" />
              <Field label="حساب InstaPay" value={instapay} onChange={setInstapay} theme={theme} dir="ltr" />
              <Field label="رمز الأمان للإدارة (PIN)" value={adminPin} onChange={setAdminPin} theme={theme} dir="ltr" />

              <div className="pt-4 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <p className="font-bold text-sm mb-2">إدارة قرى ومناطق التوصيل (الدليفري)</p>
                <div className="bg-black/20 p-3 rounded-xl border border-[#1F1F1F] space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="اسم القرية" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                    <input type="number" placeholder="سعر التوصيل" value={newAreaPrice} onChange={(e) => setNewAreaPrice(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                  </div>
                  <button onClick={handleAddDeliveryArea} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={13}/>إضافة المنطقة</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {deliveryAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/10 border border-[#1F1F1F]">
                      <span className="font-medium">{area.name} · <span style={{ color: theme.accent }}>{money(area.price)}</span></span>
                      <button onClick={() => handleRemoveDeliveryArea(idx)} className="p-1 rounded-full text-red-500 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <p className="font-bold text-sm mb-2">إدارة كوبونات الخصم (Promo Codes)</p>
                <div className="bg-black/20 p-3 rounded-xl border border-[#1F1F1F] space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="الكود" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs uppercase" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                    <input type="number" placeholder="الخصم %" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                  </div>
                  <button onClick={handleAddPromoCode} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={13}/>إضافة الكود</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {promoCodes.map((promo, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/10 border border-[#1F1F1F]">
                      <span className="font-bold text-green-500">{promo.code} · <span className="font-medium text-white">خصم {promo.discount}%</span></span>
                      <button onClick={() => handleRemovePromoCode(idx)} className="p-1 rounded-full text-red-500 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm">قائمة المأكولات والأصناف</p>
                  <button onClick={addNewItem} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: theme.accent, color: theme.bg }}><PlusCircle size={14} /> إضافة صنف</button>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border" style={{ borderColor: (theme.muted || "#B3A18C") + "25", background: theme.surface }}>
                      {editingId === item.id ? (
                        <div className="space-y-2">
                          <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent text-sm font-bold" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                          <input value={item.desc || ""} onChange={(e) => updateItem(item.id, { desc: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={item.cat} onChange={(e) => updateItem(item.id, { cat: e.target.value })} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                            <input value={item.subcat || ""} onChange={(e) => updateItem(item.id, { subcat: e.target.value })} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                          </div>
                          <div className="flex justify-between items-center py-1">
                            {item.sizes ? (
                              <button type="button" onClick={() => updateItem(item.id, { sizes: undefined, price: item.sizes[0]?.price || 40 })} className="text-[11px] font-bold underline" style={{ color: theme.accent }}>تحويل إلى سعر موحد</button>
                            ) : (
                              <button type="button" onClick={() => updateItem(item.id, { sizes: [{ label: "كبير", price: item.price || 90 }, { label: "وسط", price: item.price ? Math.max(20, item.price - 20) : 70 }, { label: "صغير", price: item.price ? Math.max(10, item.price - 40) : 45 }], price: undefined })} className="text-[11px] font-bold underline" style={{ color: theme.accent }}>تحويل إلى أحجام متعددة</button>
                            )}
                          </div>
                          {item.sizes ? (
                            <div className="space-y-1.5">
                              {item.sizes.map((sz, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input value={sz.label} onChange={(e) => updateSize(item.id, idx, { label: e.target.value })} className="w-20 px-2 py-1.5 rounded-lg border bg-transparent text-xs text-center" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                                  <input type="number" value={sz.price} onChange={(e) => updateSize(item.id, idx, { price: Number(e.target.value) })} className="flex-1 px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <input type="number" value={item.price} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} className="w-full px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
                          )}
                          <button onClick={() => setEditingId(null)} className="w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow" style={{ background: theme.accent, color: theme.bg }}><Save size={13} /> حفظ التعديل</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-sm truncate">{item.name}</p>
                            <p className="text-xs opacity-80" style={{ color: theme.muted }}>{item.cat}{item.subcat ? " · " + item.subcat : ""} · {item.sizes ? item.sizes.map((s) => s.label + ":" + money(s.price)).join(" / ") : money(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditingId(item.id)} className="p-2 rounded-full border" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}><Pencil size={13} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-2 rounded-full border" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}><Trash2 size={13} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 mt-2 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <button onClick={() => setShowResetConfirm(true)} className="w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 text-red-500 border-red-500/30"><RotateCcw size={14} /> إعادة تعيين منيو دريم كورنر الافتراضي</button>
              </div>
            </div>
          </Sheet>
        </Overlay>
      )}

      {showResetConfirm && (
        <Overlay onClose={() => setShowResetConfirm(false)}>
          <Sheet theme={theme} title="تأكيد إعادة التعيين" onClose={() => setShowResetConfirm(false)}>
            <div className="space-y-4 text-center">
              <p className="text-sm">هل أنت متأكد من رغبتك في استعادة منيو دريم كورنر الأصلي؟</p>
              <div className="flex gap-2 justify-center">
                <button onClick={handleResetMenu} className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">نعم</button>
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 border rounded-lg text-xs font-bold" style={{ borderColor: theme.muted + "40" }}>إلغاء</button>
              </div>
            </div>
          </Sheet>
        </Overlay>
      )}
    </div>
  );
}

function Overlay({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      {children}
    </div>
  );
}

function Sheet({ theme, title, onClose, children }) {
  return (
    <div className="relative z-10 w-full md:max-w-md max-h-[85vh] rounded-t-3xl md:rounded-3xl p-5 overflow-y-auto" style={{ background: theme.bg, color: theme.text, border: "1px solid " + (theme.muted || "#B3A18C") + "30" }} dir="rtl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
        <h2 className="text-lg font-black" style={{ color: theme.accent }}>{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full border" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}><X size={15} /></button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, theme, dir = "rtl", hint }) {
  return (
    <label className="block text-sm space-y-1">
      <span className="font-bold opacity-90" style={{ color: theme.muted }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2 rounded-lg border bg-transparent" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />
      {hint && <span className="block mt-1 text-xs opacity-70" style={{ color: theme.muted }}>{hint}</span>}
    </label>
  );
}

function PayRow({ icon, label, value, theme, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg" style={{ background: theme.surface2 }}>
      <div className="flex items-center gap-2 min-w-0">
        <span style={{ color: theme.accent }}>{icon}</span>
        <div className="min-w-0">
          <p className="text-xs" style={{ color: theme.muted }}>{label}</p>
          <p className="text-sm font-bold truncate" dir="ltr">{value}</p>
        </div>
      </div>
      <button onClick={() => onCopy(label, value)} className="p-1.5 rounded-full border shrink-0 transition-transform active:scale-95" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}>
        {copied === label ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
      </button>
    </div>
  );
}
