import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, 
  FileText, ChevronDown, User, Tag, Navigation, Award, Calendar, Download,
  Coins, Gem, TrendingUp, Percent, Utensils, Pizza, Coffee, Flame, Heart
} from "lucide-react";

const LOGO_SRC = restaurantLogo;

// التصميم الجديد يعتمد على تباين لوني عصري ومريح للعين يحاكي الموقع المستهدف
const THEME = {
  bg: "#0B0F19",       // خلفية داكنة فاخرة وعميقة
  surface: "#111827",  // أسطح الكروت والقوائم
  surface2: "#1F2937", // أسطح الإدخال والتقسيمات الفرعية
  accent: "#F59E0B",   // اللون الذهبي/البرتقالي الجاذب للشهية
  accent2: "#EF4444",  // اللون الأحمر التنبيهي
  text: "#F9FAFB",     // النصوص الأساسية بيضاء ناصعة
  muted: "#9CA3AF"     // النصوص الثانوية الرمادية
};

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
  { code: "OFF10", discount: 10, limit: 100, used: 0 },
  { code: "DREAM", discount: 15, limit: 50, used: 0 }
];

const DEFAULT_MENU = [
  { id: "p1", cat: "البيتزا", name: "بيتزا مارجريتا", image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&q=80", desc: "صلصة طماطم غنية، جبنة موتزاريلّا فاخرة، وأوراق ريحان طازجة زيت زيتون.", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "بيتزا ميكس جبنة", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", desc: "تشكيلة غنية من الموتزاريلّا، الشيدر، الرومي، والجبنة الأزرق لطلب مميز.", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p3", cat: "البيتزا", name: "بيتزا خضار", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=500&q=80", desc: "فلفل ألوان، زيتون أسود، طماطم، عش الغراب، مع طبقة موتزاريلّا.", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "سندوتش كفتة مشوية", image: "https://images.unsplash.com/photo-1603052875302-d376b7c0638a?w=500&q=80", desc: "كفتة بلدي مشوية على الفحم مع طحينة وخضار فريش في خبز طازج.", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", image: "https://images.unsplash.com/photo-1628102476625-88c4493cd351?w=500&q=80", desc: "لحم مفروم متبل بخلطة دريم السحرية داخل خبز بلدي مقرمش.", price: 45 },
  { id: "d1", cat: "المشروبات", name: "بيبسي كانز", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80", price: 15 },
  { id: "d4", cat: "المشروبات", name: "مياة معدنية صغيرة", image: "https://images.unsplash.com/photo-1608885898957-a599fb1b468b?w=500&q=80", price: 6 }
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
  const [newPromoLimit, setNewPromoLimit] = useState("50");

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

  const [userPoints, setUserPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);
  
  const [pointsEarnRate, setPointsEarnRate] = useState(100); 
  const [pointValueInMoney, setPointValueInMoney] = useState(1); 

  const [scheduleType, setScheduleType] = useState("now"); 
  const [scheduleTime, setScheduleTime] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  
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

  const discountAmount = useMemo(() => {
    return Math.round((cartTotal * appliedDiscountPercent) / 100);
  }, [cartTotal, appliedDiscountPercent]);

  const pointsDiscountValue = useMemo(() => {
    if (!redeemPoints) return 0;
    const potentialDiscount = userPoints * pointValueInMoney;
    return Math.min(potentialDiscount, Math.max(0, cartTotal - discountAmount));
  }, [redeemPoints, userPoints, cartTotal, discountAmount, pointValueInMoney]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discountAmount - pointsDiscountValue) + activeDeliveryArea.price;
  }, [cartTotal, discountAmount, pointsDiscountValue, activeDeliveryArea]);

  const qrSrc = useMemo(() => {
    return "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=" + encodeURIComponent(menuUrl);
  }, [menuUrl]);

  // دالة مساعدة لربط كل قسم بأيقونة معبرة مثل الموقع المستهدف
  const getCategoryIcon = (catName) => {
    switch (catName) {
      case "البيتزا": return <Pizza size={16} />;
      case "السندوتشات": return <Utensils size={16} />;
      case "المشروبات": return <Coffee size={16} />;
      default: return <Flame size={16} />;
    }
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstallBanner(false);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

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
      const currentLimit = match.limit !== undefined ? match.limit : 9999;
      const currentUsed = match.used !== undefined ? match.used : 0;
      
      if (currentUsed >= currentLimit) {
        setAppliedDiscountPercent(0);
        setPromoError("عذراً، هذا الكوبون استنفد الحد الأقصى للمرات المتاحة له!");
        return;
      }
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
          if (d.pointsEarnRate !== undefined) setPointsEarnRate(Number(d.pointsEarnRate));
          if (d.pointValueInMoney !== undefined) setPointValueInMoney(Number(d.pointValueInMoney));
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
          vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, 
          pointsEarnRate, pointValueInMoney
        }));
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 500);
  }, [items, restaurantName, tagline, address, menuUrl, whatsappNumber, vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, pointsEarnRate, pointValueInMoney, loaded]);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin === adminPin) {
      setIsAdmin(true);
      setPinModalOpen(false);
      setPinError("");
      setEnteredPin("");
      setLogoClicks(0);
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
    setItems((its) => [...its, { id, cat: activeCat === "الكل" ? "أصناف جديدة" : activeCat, name: "صنف جديد", price: 20, desc: "", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" }]);
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
    const finalLimit = newPromoLimit.trim() ? Number(newPromoLimit) : 9999;
    setPromoCodes([...promoCodes, { 
      code: newPromoCode.trim().toUpperCase(), 
      discount: Number(newPromoDiscount),
      limit: finalLimit,
      used: 0
    }]);
    setNewPromoCode("");
    setNewPromoDiscount("");
    setNewPromoLimit("50");
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

    let updatedPromoCodes = promoCodes;
    if (appliedDiscountPercent > 0) {
      const codeClean = enteredPromo.trim().toUpperCase();
      updatedPromoCodes = promoCodes.map(p => {
        if (p.code.toUpperCase() === codeClean) {
          const currentUsed = p.used !== undefined ? p.used : 0;
          return { ...p, used: currentUsed + 1 };
        }
        return p;
      });
      setPromoCodes(updatedPromoCodes);
    }

    const newlyEarnedPoints = Math.floor(cartTotal / pointsEarnRate);
    let updatedPoints = userPoints;

    if (redeemPoints) {
      const pointsUsed = Math.ceil(pointsDiscountValue / pointValueInMoney);
      updatedPoints = Math.max(0, userPoints - pointsUsed);
    }
    updatedPoints += newlyEarnedPoints;

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("customer-name-cache", customerName.trim());
      localStorage.setItem("customer-phone-cache", customerPhone.trim());
      localStorage.setItem("customer-address-cache", customerAddress.trim());
      localStorage.setItem("customer-points-loyalty", updatedPoints.toString());
    }

    const lines = cartList.map((cartItem) => "• " + cartItem.label + " x" + cartItem.qty + " — " + money(cartItem.price * cartItem.qty));
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
      const pointsUsed = Math.ceil(pointsDiscountValue / pointValueInMoney);
      text += "🪙 خصم نقاط محفظة الولاء: -" + money(pointsDiscountValue) + " (تم خصم " + pointsUsed + " نقطة)\n";
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
    setPointsEarnRate(100);
    setPointValueInMoney(1);
    setShowResetConfirm(false);
  };

  const handleLogoClickLocal = () => {
    setLogoClicks((prev) => {
      const nextClicks = prev + 1;
      if (nextClicks >= 5) {
        setPinModalOpen(true);
        return 0;
      }
      return nextClicks;
    });
  };

  return (
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-28 select-none" style={{ background: THEME.bg, color: THEME.text, fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* ===================== PWA INSTALLATION BANNER ===================== */}
      {showInstallBanner && (
        <div className="fixed bottom-20 inset-x-0 z-50 px-4 py-3 mx-4 rounded-2xl flex items-center justify-between border shadow-2xl transition-all duration-500 animate-slide-up" style={{ background: THEME.surface, borderColor: THEME.accent + "30" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
              <img src={LOGO_SRC} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight" style={{ color: THEME.accent }}>ثبت منيو {restaurantName}</p>
              <p className="text-[10px] opacity-75 mt-0.5" style={{ color: THEME.muted }}>تصفح المنيو بدون إنترنت كأنه تطبيق موبايل!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleInstallApp} className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1" style={{ background: THEME.accent, color: THEME.bg }}>
              <Download size={12} /> تثبيت
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="p-1 rounded-full border border-dashed opacity-50" style={{ borderColor: THEME.muted }}><X size={12} /></button>
          </div>
        </div>
      )}

      {/* ===================== HEADER (تصميم انسيابي يحاكي هيدر الموقع المستهدف) ===================== */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: THEME.bg + "D9", borderColor: THEME.surface2 }}>
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div onClick={handleLogoClickLocal} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative group">
              <img src={LOGO_SRC} alt={restaurantName + " logo"} className="w-12 h-12 rounded-full object-contain border-2 border-amber-500/20 p-0.5" />
              {logoClicks > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold">{logoClicks}</span>}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black truncate flex items-center gap-1.5" style={{ color: THEME.text }}>
                {restaurantName}
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-ping" />
              </h1>
              <p className="text-[11px] truncate opacity-80 mt-0.5 font-medium" style={{ color: THEME.muted }}>{tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <>
                <button onClick={() => setQrOpen(true)} className="p-2 rounded-xl border transition-all bg-green-500/10 text-green-400 border-green-500/20" title="عرض QR"><QrCode size={17} /></button>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-xl border transition-all bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse" title="الإعدادات"><Settings size={17} /></button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-xl border transition-all bg-red-500/10 text-red-400 border-red-500/20" title="خروج"><LogOut size={15} /></button>
              </>
            ) : (
              <a href={"tel:" + whatsappNumber} className="p-2.5 rounded-xl border transition-all bg-slate-800/40 border-slate-700 hover:border-amber-500 text-amber-400" aria-label="اتصل بنا"><Phone size={16} /></a>
            )}
          </div>
        </div>
      </header>

      {/* ===================== CATEGORIES BAR WITH ICONS (تصميم الأقسام الاحترافي بالأيقونات) ===================== */}
      <div className="sticky top-[73px] z-20 backdrop-blur-md border-b py-3" style={{ background: THEME.bg + "F2", borderColor: THEME.surface2 }}>
        <div className="max-w-3xl mx-auto px-4 flex gap-2.5 overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => setActiveCat(c)} 
              className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all duration-300" 
              style={activeCat === c ? { background: THEME.accent, color: THEME.bg, borderColor: THEME.accent, boxShadow: `0 4px 12px ${THEME.accent}40` } : { borderColor: THEME.surface2, color: THEME.muted, background: THEME.surface }}
            >
              <span className={activeCat === c ? "text-current" : "text-amber-500"}>
                {c === "الكل" ? <Utensils size={15} /> : getCategoryIcon(c)}
              </span>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== SEARCH BAR ===================== */}
      <div className="max-w-3xl mx-auto px-4 pt-5">
        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن وجبتك المفضلة الآن..." className="w-full px-4 py-3.5 pr-11 rounded-xl text-xs border focus:outline-none transition-all" style={{ background: THEME.surface, borderColor: THEME.surface2, color: THEME.text }} />
          <Search size={16} className="absolute right-4 top-4" style={{ color: THEME.muted }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute left-3 top-3.5 p-1 rounded-full bg-slate-800 text-slate-400"><X size={12} /></button>}
        </div>
      </div>

      {/* ===================== MENU ITEMS LAYOUT (تصميم الكروت العمودية الفاخرة بالموقع المستهدف) ===================== */}
      <main className="max-w-3xl mx-auto px-4 pb-32 pt-6 space-y-8">
        {groups.map((group) => {
          const subcat = group[0];
          const list = group[1];
          return (
            <div key={subcat || "main"} className="space-y-4">
              {subcat && (
                <h2 className="text-xs font-black px-1 tracking-wide uppercase flex items-center gap-2 text-amber-500">
                  <span className="w-1 h-3 rounded-full bg-amber-500" />
                  {subcat}
                </h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map((item) => (
                  <div key={item.id} className="rounded-2xl border overflow-hidden transition-all duration-300 flex flex-col justify-between hover:border-amber-500/40 bg-slate-900/40" style={{ background: THEME.surface, borderColor: THEME.surface2 }}>
                    
                    {/* صورة الوجبة البارزة والمساحة التعريفية */}
                    <div className="relative w-full h-44 bg-slate-950 overflow-hidden group">
                      <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2 py-1 bg-slate-950/70 backdrop-blur-md text-[10px] rounded-lg border border-slate-800 text-amber-400 font-bold">{item.cat}</span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h3 className="font-bold text-base tracking-wide text-slate-100">{item.name}</h3>
                        {item.desc && <p className="text-xs opacity-80 leading-relaxed text-slate-400 line-clamp-2">{item.desc}</p>}
                      </div>

                      {/* قسم التحكم بالأسعار والأحجام المتعددة */}
                      <div className="pt-3 border-t border-slate-800/60">
                        {item.sizes ? (
                          <div className="space-y-2">
                            {item.sizes.map((sz) => {
                              const key = item.id + "::" + sz.label;
                              const qty = cart[key] || 0;
                              return (
                                <div key={sz.label} className="flex items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-xs bg-slate-950/40 border border-slate-800/40">
                                  <span className="font-bold text-slate-300">{sz.label}</span>
                                  <span className="font-extrabold text-amber-400">{money(sz.price)}</span>
                                  
                                  {qty > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <button onClick={() => addToCart(key, -1)} className="w-5 h-5 rounded-lg flex items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-400"><Minus size={10} /></button>
                                      <span className="w-3 text-center font-bold text-xs">{qty}</span>
                                      <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-lg flex items-center justify-center bg-amber-500 text-slate-950"><Plus size={10} /></button>
                                    </div>
                                  ) : (
                                    <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-lg flex items-center justify-center border border-slate-700 bg-slate-800 hover:border-amber-500 text-slate-200"><Plus size={10} /></button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-base font-black text-amber-400">{money(item.price)}</span>
                            {cart[item.id] > 0 ? (
                              <div className="flex items-center gap-2.5 rounded-xl px-2 py-1 bg-slate-950/40 border border-slate-800">
                                <button onClick={() => addToCart(item.id, -1)} className="w-6 h-6 rounded-lg flex items-center justify-center border border-amber-500/30 bg-amber-500/10 text-amber-400"><Minus size={12} /></button>
                                <span className="w-4 text-center font-bold text-xs text-slate-200">{cart[item.id]}</span>
                                <button onClick={() => addToCart(item.id, 1)} className="w-6 h-6 rounded-lg flex items-center justify-center bg-amber-500 text-slate-950"><Plus size={12} /></button>
                              </div>
                            ) : (
                              <button onClick={() => addToCart(item.id, 1)} className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 bg-amber-500 text-slate-950 transition-all active:scale-95"><ShoppingCart size={12} /> إضافة</button>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {visibleItems.length === 0 && (
          <div className="text-center py-16">
            <Sparkles size={36} className="mx-auto mb-3 opacity-40 text-amber-500" />
            <p className="text-sm text-slate-400">لا توجد وجبات تطابق بحثك حالياً.</p>
          </div>
        )}
      </main>

      {/* ===================== FOOTER INFO STRIP ===================== */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t px-4 py-3.5 flex items-center justify-center gap-4 text-xs font-semibold shadow-inner backdrop-blur-md" style={{ background: THEME.bg + "F2", borderColor: THEME.surface2, color: THEME.muted }}>
        <a href="https://fb.com/mr.3abkarino" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold tracking-wide text-amber-400 hover:underline">
          Mr3abkarino© <span className="text-red-500 text-sm animate-pulse">❤️</span>
        </a>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1 truncate min-w-0">
          <MapPin size={13} className="shrink-0 text-amber-500" /> 
          <span className="truncate opacity-90 text-slate-300">{address}</span>
        </span>
      </div>

      {/* ===================== FLOATING CART BUTTON ===================== */}
      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-35 flex items-center justify-between gap-6 px-6 py-4 rounded-xl shadow-2xl font-bold text-sm active:scale-95 transition-all w-[92%] max-w-[500px]" style={{ background: THEME.accent, color: THEME.bg }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold border border-amber-500">{cartCount}</span>
            </div>
            <span>عرض سلة الطلبات</span>
          </div>
          <span className="text-xs tracking-wide bg-slate-950/20 px-3 py-1 rounded-lg">الإجمالي: {money(cartTotal)}</span>
        </button>
      )}

      {/* ===================== CART DRAWER ===================== */}
      {cartOpen && (
        <Overlay onClose={() => setCartOpen(false)}>
          <Sheet title="سلة المشتريات" onClose={() => setCartOpen(false)}>
            {cartList.length === 0 ? <p className="text-center py-8 text-slate-400">السلة فارغة حالياً</p> : (
              <>
                <div className="space-y-3 max-h-[22vh] overflow-y-auto pr-1 border-b border-slate-800 pb-3">
                  {cartList.map((cartItem) => (
                    <div key={cartItem.key} className="flex items-center justify-between gap-2 py-1">
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate text-slate-100">{cartItem.label}</p>
                        <p className="text-xs text-amber-400 font-medium">{money(cartItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => addToCart(cartItem.key, -1)} className="w-7 h-7 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300"><Minus size={12} /></button>
                        <span className="w-4 text-center font-bold text-sm text-slate-100">{cartItem.qty}</span>
                        <button onClick={() => addToCart(cartItem.key, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500 text-slate-950"><Plus size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* نظام نقاط الولاء والمكافآت التفاعلي */}
                {userPoints > 0 && (
                  <div className="mt-3 p-3 rounded-xl border border-dashed border-amber-500/30 bg-slate-950/40 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                        <Coins size={15} />
                        <span>محفظتك الذهبية: {userPoints} نقطة</span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Gem size={12} className="text-green-500" /> تساوي {money(userPoints * pointValueInMoney)} خصم
                      </span>
                    </div>
                    <button 
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      className="w-full py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      style={redeemPoints ? { background: "#16a34a", color: "#fff" } : { background: THEME.accent, color: THEME.bg }}
                    >
                      {redeemPoints ? <Check size={13} /> : <Coins size={13} />}
                      {redeemPoints ? "تمت المزامنة وتطبيق خصم الكاش" : "اضغط لاستبدال نقاطك بخصم كاش فوري"}
                    </button>
                  </div>
                )}
                
                <div className="space-y-1.5 pt-3 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>حساب الوجبات الأصلي:</span>
                    <span className="text-slate-200 font-bold">{money(cartTotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-green-400 font-medium">
                      <span>خصم كوبون الخصم (-{appliedDiscountPercent}%):</span>
                      <span>-{money(discountAmount)}</span>
                    </div>
                  )}
                  {redeemPoints && pointsDiscountValue > 0 && (
                    <div className="flex items-center justify-between text-green-400 font-medium">
                      <span>خصم استبدال النقاط الذهبية:</span>
                      <span>-{money(pointsDiscountValue)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>توصيل لـ ({selectedAreaIndex >= 0 ? activeDeliveryArea.name : "لم يحدد"}):</span>
                    <span className="text-slate-200 font-bold">+{money(activeDeliveryArea.price)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 text-sm font-black border-t border-slate-800">
                    <span className="text-slate-300">الإجمالي النهائي المطلوب:</span>
                    <span className="text-base text-amber-400">{money(finalTotal)}</span>
                  </div>
                </div>

                {/* نظام كود الخصم المطور */}
                <div className="pt-3 flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" value={enteredPromo} onChange={(e) => setEnteredPromo(e.target.value)} placeholder="هل لديك كوبون خصم؟" className="w-full px-3 py-2.5 pr-8 rounded-xl text-xs border focus:outline-none bg-slate-950 border-slate-800 text-slate-200" />
                    <Tag size={13} className="absolute right-2.5 top-3 text-slate-500" />
                  </div>
                  <button onClick={handleApplyPromo} className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 bg-slate-800 border border-slate-700 text-amber-400 hover:bg-slate-700">
                    <Percent size={12} /> تطبيق
                  </button>
                </div>
                {promoError && <p className="text-[10px] font-bold text-red-400 mt-1 mr-1">{promoError}</p>}
                {appliedDiscountPercent > 0 && <p className="text-[10px] font-bold text-green-400 mt-1 mr-1">✓ تم تطبيق الكود بنجاح بخصم {appliedDiscountPercent}%</p>}

                {/* بيانات الشحن وعنوان التوصيل */}
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
                  <p className="text-[11px] font-bold text-amber-400">بيانات التوصيل والدليفري:</p>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <input type="text" placeholder="اكتب اسمك بالكامل هنا..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none" />
                      <User size={14} className="absolute right-3 top-3 text-slate-500" />
                    </div>

                    <div className="relative">
                      <select 
                        value={selectedAreaIndex}
                        onChange={(e) => setSelectedAreaIndex(Number(e.target.value))}
                        className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none appearance-none"
                      >
                        <option value={-1}>اختر منطقة أو قرية التوصيل...</option>
                        {deliveryAreas.map((area, idx) => (
                          <option key={idx} value={idx} className="bg-slate-900 text-slate-200">
                            {area.name} (+{money(area.price)})
                          </option>
                        ))}
                      </select>
                      <MapPin size={14} className="absolute right-3 top-3 text-slate-500" />
                      <ChevronDown size={14} className="absolute left-3 top-3.5 text-slate-500" />
                    </div>

                    {/* جدولة مواعيد الطلبات */}
                    <div className="p-3 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 space-y-2">
                      <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar size={13} /> تحديد موعد الاستلام المفضل:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button" 
                          onClick={() => setScheduleType("now")}
                          className="py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          style={scheduleType === "now" ? { background: THEME.accent, color: THEME.bg, borderColor: THEME.accent } : { borderColor: "rgba(255,255,255,0.08)", color: THEME.muted }}
                        >
                          ⚡ دليفري فوري (الآن)
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setScheduleType("later")}
                          className="py-1.5 rounded-lg text-[10px] font-bold border transition-all"
                          style={scheduleType === "later" ? { background: THEME.accent, color: THEME.bg, borderColor: THEME.accent } : { borderColor: "rgba(255,255,255,0.08)", color: THEME.muted }}
                        >
                          🕒 توصيل مجدول لاحقاً
                        </button>
                      </div>

                      {scheduleType === "later" && (
                        <div className="relative">
                          <input 
                            type="text" 
                            placeholder="مثال: الساعة 9:30 مساءً..." 
                            value={scheduleTime} 
                            onChange={(e) => setScheduleTime(e.target.value)} 
                            className="w-full px-3 py-2 pr-8 rounded-lg text-[10px] bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none" 
                          />
                          <Calendar size={12} className="absolute right-2.5 top-2.5 text-amber-500" />
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <input type="tel" placeholder="رقم الموبايل لتأكيد الأوردر..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none" />
                      <Phone size={14} className="absolute right-3 top-3 text-slate-500" />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" placeholder="العنوان بالتفصيل (الشارع والمنزل)..." value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none" />
                        <MapPin size={14} className="absolute right-3 top-3 text-slate-500" />
                      </div>
                      <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl border border-slate-700 bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center active:scale-95 shrink-0">
                        {geoLoading ? "..." : <Navigation size={14} className="animate-pulse" />}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea placeholder="أي ملاحظات إضافية؟ (بدون بصل، حار...)" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={1} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none resize-none" />
                      <FileText size={14} className="absolute right-3 top-3 text-slate-500" />
                    </div>
                  </div>
                  
                  {validationError && <p className="text-[10px] text-center font-bold text-red-400 bg-red-500/10 py-1.5 rounded-xl animate-pulse">{validationError}</p>}
                </div>

                <button onClick={sendWhatsApp} className="w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md bg-green-600 hover:bg-green-500 text-white"><MessageCircle size={17} />تأكيد الأوردر وإرسال عبر الواتساب</button>
                
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <p className="text-[11px] font-bold text-slate-400">طرق الدفع الكاش المباشر:</p>
                  <PayRow icon={<Phone size={15} />} label="فودافون كاش كود" value={vodafoneCash} onCopy={copyText} copied={copied} />
                  <PayRow icon={<CreditCard size={15} />} label="حساب InstaPay" value={instapay} onCopy={copyText} copied={copied} />
                </div>
              </>
            )}
          </Sheet>
        </Overlay>
      )}

      {/* ===================== MODAL OVERLAYS & SHEETS ===================== */}
      {orderSuccess && (
        <Overlay onClose={() => setOrderSuccess(false)}>
          <Sheet title="تم إرسال طلبك بنجاح! 🎉" onClose={() => setOrderSuccess(false)}>
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">✓</div>
              <p className="text-sm font-bold leading-relaxed text-slate-300">
                تم تجهيز الأوردر بنجاح. جاري الآن تحويلك إلى تطبيق واتساب لمتابعة التوصيل مع الكابتن وتأكيد الفاتورة!
              </p>
              <button onClick={() => setOrderSuccess(false)} className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950">موافق، شكراً لك</button>
            </div>
          </Sheet>
        </Overlay>
      )}

      {qrOpen && (
        <Overlay onClose={() => setQrOpen(false)}>
          <Sheet title="باركود المنيو للعملاء" onClose={() => setQrOpen(false)}>
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-2xl bg-white shadow-xl"><img src={qrSrc} alt="QR Code" width={200} height={200} /></div>
              <label className="w-full text-xs space-y-1.5">
                <span className="text-slate-400 font-medium">رابط موقع المنيو الحالي للمطعم:</span>
                <input value={menuUrl} onChange={(e) => setMenuUrl(e.target.value)} className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-center font-bold" dir="ltr" />
              </label>
            </div>
          </Sheet>
        </Overlay>
      )}

      {pinModalOpen && (
        <Overlay onClose={() => setPinModalOpen(false)}>
          <Sheet title="التحقق من هوية الإدارة" onClose={() => setPinModalOpen(false)}>
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="flex flex-col items-center justify-center py-2"><KeyRound size={36} className="mb-2 text-amber-500 animate-pulse" /><p className="text-xs text-slate-400 text-center">لوحة تحكم مشفرة ومحمية خاصة بالمدير فقط.</p></div>
              <label className="block text-xs space-y-1.5">
                <span className="font-bold text-slate-300">رمز الأمان PIN الحالي:</span>
                <input type="password" maxLength={12} value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="••••" className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-center text-lg font-bold tracking-widest focus:outline-none" required />
              </label>
              {pinError && <p className="text-xs text-center font-bold text-red-400 bg-red-500/10 py-2 rounded-xl">{pinError}</p>}
              <div className="flex gap-2"><button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-slate-950">تسجيل الدخول</button><button type="button" onClick={() => setPinModalOpen(false)} className="px-4 py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-xs font-bold text-slate-300">إلغاء</button></div>
            </form>
          </Sheet>
        </Overlay>
      )}

      {adminOpen && (
        <Overlay onClose={() => setAdminOpen(false)}>
          <Sheet title="لوحة التحكم والأسعار" onClose={() => setAdminOpen(false)}>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-slate-200">
              <Field label="اسم المطعم" value={restaurantName} onChange={setRestaurantName} />
              <Field label="الشعار الفرعي والتاغ لاين" value={tagline} onChange={setTagline} />
              <Field label="العنوان الجغرافي للمطعم" value={address} onChange={setAddress} />
              <Field label="رقم واتساب الاستقبال (دولي)" value={whatsappNumber} onChange={setWhatsappNumber} dir="ltr" hint="بالصيغة الدولية الكاملة مثال: +201006113627" />
              <Field label="رقم محفظة فودافون كاش" value={vodafoneCash} onChange={setVodafoneCash} dir="ltr" />
              <Field label="معرّف حساب InstaPay" value={instapay} onChange={setInstapay} dir="ltr" />
              <Field label="رمز الدخول المشفر للإدارة (PIN)" value={adminPin} onChange={setAdminPin} dir="ltr" />

              {/* إعدادات محفظة الولاء والنقاط الذهبية */}
              <div className="pt-4 border-t border-slate-800">
                <p className="font-bold text-xs mb-2 flex items-center gap-1.5 text-amber-400">
                  <Coins size={15} /> نقاط الولاء الذهبية للمطعم
                </p>
                <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <label className="block text-[11px] space-y-1">
                    <span className="text-slate-300 font-medium flex items-center gap-1"><TrendingUp size={12} /> معدل كسب النقاط</span>
                    <input type="number" value={pointsEarnRate} onChange={(e) => setPointsEarnRate(Math.max(1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                    <span className="text-[9px] text-slate-500 block">كل كم جنيه صرف يعطي نقطة؟</span>
                  </label>
                  <label className="block text-[11px] space-y-1">
                    <span className="text-slate-300 font-medium flex items-center gap-1"><Gem size={12} /> قيمة استبدال النقطة</span>
                    <input type="number" step="0.1" value={pointValueInMoney} onChange={(e) => setPointValueInMoney(Math.max(0.1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                    <span className="text-[9px] text-slate-500 block">النقطة تساوي كم جنيه كاش؟</span>
                  </label>
                </div>
              </div>

              {/* قرى ومناطق التوصيل وحساب الدليفري */}
              <div className="pt-4 border-t border-slate-800">
                <p className="font-bold text-xs mb-2 flex items-center gap-1 text-slate-300"><MapPin size={14} className="text-amber-500" /> إدارة مناطق وقرى التوصيل</p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 mb-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="اسم القرية" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                    <input type="number" placeholder="سعر التوصيل" value={newAreaPrice} onChange={(e) => setNewAreaPrice(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                  </div>
                  <button onClick={handleAddDeliveryArea} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={12}/>إضافة المنطقة</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {deliveryAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="font-medium text-slate-300">{area.name} · <span className="text-amber-400">{money(area.price)}</span></span>
                      <button onClick={() => handleRemoveDeliveryArea(idx)} className="p-1 rounded-full text-red-400 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* إدارة ومزامنة الكوبونات */}
              <div className="pt-4 border-t border-slate-800">
                <p className="font-bold text-xs mb-2 flex items-center gap-1 text-green-400">
                  <Tag size={14} /> الكوبونات والأكواد الترويجية (Promo Codes)
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 mb-3">
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="الكود" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs uppercase font-bold text-slate-200" />
                    <input type="number" placeholder="الخصم %" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                    <input type="number" placeholder="الحد" value={newPromoLimit} onChange={(e) => setNewPromoLimit(e.target.value)} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                  </div>
                  <button onClick={handleAddPromoCode} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={12}/>إضافة الكود الجديد</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {promoCodes.map((promo, idx) => {
                    const currentLimit = promo.limit !== undefined ? promo.limit : 9999;
                    const currentUsed = promo.used !== undefined ? promo.used : 0;
                    const remaining = Math.max(0, currentLimit - currentUsed);
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-green-400 flex items-center gap-1"><Tag size={11} /> {promo.code} · <span className="font-medium text-slate-200">خصم {promo.discount}%</span></span>
                          <span className="text-[10px] text-slate-500">
                            الاستخدام: {currentUsed} من {currentLimit === 9999 ? "∞" : currentLimit} ({currentLimit === 9999 ? "مفتوح" : `${remaining} متبقي`})
                          </span>
                        </div>
                        <button onClick={() => handleRemovePromoCode(idx)} className="p-1 rounded-full text-red-400 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* تعديل وإضافة وحذف وجبات المنيو */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-xs text-slate-300">قائمة الوجبات الحالية</p>
                  <button onClick={addNewItem} className="flex items-center gap-1 text-[11px] font-bold bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl"><PlusCircle size={13} /> إضافة وجبة</button>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="p-3 rounded-xl border bg-slate-950 border-slate-800">
                      {editingId === item.id ? (
                        <div className="space-y-2">
                          <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200" />
                          <input value={item.desc || ""} onChange={(e) => updateItem(item.id, { desc: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400" />
                          <input value={item.image || ""} onChange={(e) => updateItem(item.id, { image: e.target.value })} placeholder="رابط صورة الوجبة..." className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400" dir="ltr" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={item.cat} onChange={(e) => updateItem(item.id, { cat: e.target.value })} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                            <input value={item.subcat || ""} onChange={(e) => updateItem(item.id, { subcat: e.target.value })} className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                          </div>
                          <div className="flex justify-between items-center py-1">
                            {item.sizes ? (
                              <button type="button" onClick={() => updateItem(item.id, { sizes: undefined, price: item.sizes[0]?.price || 40 })} className="text-[10px] font-bold text-amber-400 underline">تحويل إلى سعر موحد</button>
                            ) : (
                              <button type="button" onClick={() => updateItem(item.id, { sizes: [{ label: "كبير", price: item.price || 90 }, { label: "وسط", price: item.price ? Math.max(20, item.price - 20) : 70 }, { label: "صغير", price: item.price ? Math.max(10, item.price - 40) : 45 }], price: undefined })} className="text-[10px] font-bold text-amber-400 underline">تحويل إلى أحجام متعددة</button>
                            )}
                          </div>
                          {item.sizes ? (
                            <div className="space-y-1.5">
                              {item.sizes.map((sz, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <input value={sz.label} onChange={(e) => updateSize(item.id, idx, { label: e.target.value })} className="w-16 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-center text-slate-200" />
                                  <input type="number" value={sz.price} onChange={(e) => updateSize(item.id, idx, { price: Number(e.target.value) })} className="flex-1 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <input type="number" value={item.price} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200" />
                          )}
                          <button onClick={() => setEditingId(null)} className="w-full py-2 bg-amber-500 text-slate-950 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow"><Save size={12} /> حفظ التعديلات</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0 flex items-center gap-2.5">
                            <img src={item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80"} alt="" className="w-9 h-9 object-cover rounded-lg bg-slate-900" />
                            <div className="min-w-0">
                              <p className="font-bold text-xs text-slate-200 truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{item.cat} · {item.sizes ? "أحجام متعددة" : money(item.price)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setEditingId(item.id)} className="p-2 border border-slate-800 bg-slate-900 rounded-lg text-slate-300"><Pencil size={12} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-2 border border-slate-800 bg-slate-900 rounded-lg text-red-400"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800">
                <button onClick={() => setShowResetConfirm(true)} className="w-full py-2.5 rounded-xl text-xs font-bold border border-red-500/20 bg-red-500/5 text-red-400 flex items-center justify-center gap-1.5"><RotateCcw size={13} /> استعادة منيو دريم كورنر الافتراضي الأول</button>
              </div>
            </div>
          </Sheet>
        </Overlay>
      )}

      {showResetConfirm && (
        <Overlay onClose={() => setShowResetConfirm(false)}>
          <Sheet title="تأكيد رغبة الإعادة" onClose={() => setShowResetConfirm(false)}>
            <div className="space-y-4 text-center py-2">
              <p className="text-xs text-slate-300 font-medium">هل أنت متأكد من رغبتك في مسح التغييرات الحالية واستعادة منيو دريم كورنر الافتراضي بالكامل؟</p>
              <div className="flex gap-2 justify-center">
                <button onClick={handleResetMenu} className="px-5 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">نعم، متأكد</button>
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 border border-slate-700 bg-slate-800 rounded-lg text-xs font-bold text-slate-300">إلغاء</button>
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      {children}
    </div>
  );
}

function Sheet({ title, onClose, children }) {
  return (
    <div className="relative z-10 w-full md:max-w-md max-h-[85vh] rounded-t-3xl md:rounded-2xl p-5 overflow-y-auto bg-slate-900 border-t border-x md:border border-slate-800 text-slate-100" dir="rtl">
      <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-slate-800">
        <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5">
          <Sparkles size={16} /> {title}
        </h2>
        <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400"><X size={13} /></button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, dir = "rtl", hint }) {
  return (
    <label className="block text-xs space-y-1.5">
      <span className="font-bold text-slate-300">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none" />
      {hint && <span className="block mt-1 text-[10px] text-slate-500 font-medium">{hint}</span>}
    </label>
  );
}

function PayRow({ icon, label, value, onCopy, copied }) {
  return (
    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800/60">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-amber-500">{icon}</span>
        <div className="min-w-0">
          <p className="text-[10px] text-slate-500">{label}</p>
          <p className="text-xs font-bold text-slate-300 truncate" dir="ltr">{value}</p>
        </div>
      </div>
      <button onClick={() => onCopy(label, value)} className="p-1.5 border border-slate-800 bg-slate-900 text-slate-400 rounded-lg transition-transform active:scale-95">
        {copied === label ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
      </button>
    </div>
  );
}
