import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, 
  FileText, ChevronDown, User, Tag, Navigation, Award, Calendar, Download,
  Coins, Gem, TrendingUp, Percent, Utensils, Pizza, Sandwich, CupSoda, Beef, Key
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
  { code: "OFF10", discount: 10, limit: 100, used: 0 },
  { code: "DREAM", discount: 15, limit: 50, used: 0 }
];

const DEFAULT_MENU = [
  { id: "p1", cat: "البيتزا", name: "بيتزا مارجريتا", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "بيتزا ميكس جبنة", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p3", cat: "البيتزا", name: "بيتزا خضار", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p4", cat: "البيتزا", name: "بيتزا هوت دوج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p5", cat: "البيتزا", name: "بيتزا سجق", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "بيتزا لحمة مفرومة", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", price: 45 },
  { id: "d1", cat: "المشروبات", name: "بيبسي كانز", price: 15 },
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

const getCategoryIcon = (categoryName, size = 14) => {
  switch (categoryName) {
    case "الكل": return <Utensils size={size} />;
    case "البيتزا": return <Pizza size={size} />;
    case "السندوتشات": return <Sandwich size={size} />;
    case "المشروبات": return <CupSoda size={size} />;
    case "الأصناف الجانبية": return <Beef size={size} />;
    default: return <Sparkles size={size} />;
  }
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

  const [generatedBurnCode, setGeneratedBurnCode] = useState("");
  const [burnPointsAmount, setBurnPointsAmount] = useState(10);

  const [generatedClaimCode, setGeneratedClaimCode] = useState("");
  const [pointsToEarnPending, setPointsToEarnPending] = useState(0);
  const [userEnteredClaimCode, setUserEnteredClaimCode] = useState("");
  const [claimCodeError, setClaimCodeError] = useState("");
  const [claimCodeSuccess, setClaimCodeSuccess] = useState(false);

  const [savedOrders, setSavedOrders] = useState([]);
  
  // حفظ الحجم المختار افتراضياً لكل صنف ذو أحجام متعددة منعاً لأي كراش
  const [selectedSizesCache, setSelectedSizesCache] = useState({});

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
    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }
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

    if (generatedBurnCode && codeClean === generatedBurnCode.toUpperCase()) {
      const updatedPoints = Math.max(0, userPoints - burnPointsAmount);
      setUserPoints(updatedPoints);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("customer-points-loyalty", updatedPoints.toString());
      }
      setEnteredPromo("");
      setAppliedDiscountPercent(0);
      setPromoError(`✓ أوتوماتيك: تم تحديث السيستم بنجاح وإلغاء فاعلية ${burnPointsAmount} نقطة ملغاة.`);
      setGeneratedBurnCode(""); 
      return;
    }

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
          if (d.generatedBurnCode) setGeneratedBurnCode(d.generatedBurnCode);
          if (d.burnPointsAmount) setBurnPointsAmount(Number(d.burnPointsAmount));
          if (d.savedOrders) setSavedOrders(d.savedOrders);
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
          vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, 
          pointsEarnRate, pointValueInMoney, generatedBurnCode, burnPointsAmount, savedOrders, themeId: theme.id,
        }));
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 500);
  }, [items, restaurantName, tagline, address, menuUrl, whatsappNumber, vodafoneCash, instapay, adminPin, deliveryAreas, promoCodes, pointsEarnRate, pointValueInMoney, generatedBurnCode, burnPointsAmount, savedOrders, theme, loaded]);

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

  const deleteSavedOrder = (index) => {
    setSavedOrders((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearAllOrders = () => {
    if (window.confirm("هل أنت متأكد من مسح جميع الطلبات المخزنة نهائياً؟")) {
      setSavedOrders([]);
    }
  };

  const exportOrdersToCSV = () => {
    if (savedOrders.length === 0) {
      alert("لا توجد طلبات مسجلة لتصديرها حالياً!");
      return;
    }
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += "التاريخ والوقت,اسم العميل,رقم الهاتف,المنطقة,العنوان بالتفصيل,الطلبات,الإجمالي\n";

    savedOrders.forEach((order) => {
      const cleanItems = order.itemsDescription.replace(/,/g, " - "); 
      const cleanAddress = order.address.replace(/,/g, " - ");
      csvContent += `"${order.date}","${order.name}","${order.phone}","${order.area}","${cleanAddress}","${cleanItems}","${order.total}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `طلبات_عملاء_${restaurantName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleGenerateBurnCodeAction = () => {
    const randomSecret = Math.floor(1000 + Math.random() * 9000);
    setGeneratedBurnCode(`BURN-${burnPointsAmount}-${randomSecret}`);
  };

  const handleClaimPointsWithCode = () => {
    if (userEnteredClaimCode.trim() === generatedClaimCode) {
      let updatedPoints = userPoints + pointsToEarnPending;
      setUserPoints(updatedPoints);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("customer-points-loyalty", updatedPoints.toString());
      }
      setClaimCodeSuccess(true);
      setClaimCodeError("");
      setPointsToEarnPending(0);
    } else {
      setClaimCodeError("كود الهدية غير صحيح! يرجى نسخه بالكامل من نهاية رسالة الواتساب الحقيقية.");
      setClaimCodeSuccess(false);
    }
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

    const randomSecret = Math.floor(1000 + Math.random() * 9000);
    const secretCode = `DCGC-${randomSecret}`;
    setGeneratedClaimCode(secretCode);
    setClaimCodeSuccess(false);
    setClaimCodeError("");

    const newlyEarnedPoints = Math.floor(cartTotal / pointsEarnRate);
    setPointsToEarnPending(newlyEarnedPoints);

    const itemsSummary = cartList.map(i => `${i.label} (x${i.qty})`).join(" | ");
    const newOrderRecord = {
      date: new Date().toLocaleString("ar-EG"),
      name: customerName.trim(),
      phone: customerPhone.trim(),
      area: activeDeliveryArea.name,
      address: customerAddress.trim(),
      itemsDescription: itemsSummary,
      total: finalTotal
    };
    setSavedOrders((prev) => [newOrderRecord, ...prev]);

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

    let updatedPoints = userPoints;
    if (redeemPoints) {
      const pointsUsed = Math.ceil(pointsDiscountValue / pointValueInMoney);
      updatedPoints = Math.max(0, userPoints - pointsUsed);
    }

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
               
    if (geoLink) text += "📍 لوكيشن خريطة العميل: " + geoLink + "\n";
    if (customerNotes.trim()) text += "📝 ملاحظات العميل: " + customerNotes.trim() + "\n";
    
    text += "\nالطلبات:\n" + lines.join("\n") + "\n\n" + "💵 حساب الأكل الأصلي: " + money(cartTotal) + "\n";
            
    if (discountAmount > 0) {
      text += "🏷️ كود الخصم المطبق: " + enteredPromo.toUpperCase() + " (-" + appliedDiscountPercent + "%)\n" + "📉 قيمة الخصم: " + money(discountAmount) + "\n";
    }
    if (redeemPoints && pointsDiscountValue > 0) {
      const pointsUsed = Math.ceil(pointsDiscountValue / pointValueInMoney);
      text += "🪙 خصم نقاط محفظة الولاء: -" + money(pointsDiscountValue) + " (تم خصم " + pointsUsed + " نقطة)\n";
    }

    text += "✨ نقاط مستحقة من هذا الأوردر: +" + newlyEarnedPoints + " نقطة ذهبية\n" + "🛵 مصاريف التوصيل: " + money(activeDeliveryArea.price) + "\n" + "💰 الإجمالي النهائي المطلوب: " + money(finalTotal) + "\n\n" + "🔑 كود تفعيل هدية النقاط الذكي (انسخه وألصقه في المنيو بعد الإرسال): " + secretCode;
                 
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
    setGeneratedBurnCode("");
    setSavedOrders([]);
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
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-28" style={{ background: theme.bg, color: theme.text, fontFamily: "'Tajawal', sans-serif" }}>
      
      {/* ===================== PWA INSTALLATION BANNER ===================== */}
      {showInstallBanner && (
        <div className="fixed bottom-16 inset-x-0 z-50 px-4 py-3 mx-4 my-2 rounded-2xl flex items-center justify-between border shadow-2xl transition-all duration-500" style={{ background: theme.surface, borderColor: theme.accent + "30" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
              <img src={LOGO_SRC} alt="logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight" style={{ color: theme.accent }}>ثبت منيو {restaurantName}</p>
              <p className="text-[10px] opacity-75 mt-0.5" style={{ color: theme.muted }}>تصفح المنيو بدون إنترنت كأنه تطبيق موبايل!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleInstallApp} className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1" style={{ background: theme.accent, color: theme.bg }}>
              <Download size={12} /> تثبيت
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="p-1 rounded-full border border-dashed opacity-50" style={{ borderColor: theme.muted }}><X size={12} /></button>
          </div>
        </div>
      )}

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

      {/* ===================== CATEGORIES BAR WITH ICONS ===================== */}
      <div className="sticky top-[77px] z-20 backdrop-blur-md border-b py-3 shadow-sm" style={{ background: theme.bg + "F2", borderColor: (theme.muted || "#B3A18C") + "15" }}>
        <div className="max-w-3xl mx-auto px-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => { setActiveCat(c); }} 
              className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 shadow-sm" 
              style={activeCat === c ? { background: theme.accent, color: theme.bg, borderColor: theme.accent, boxShadow: `0 4px 10px ${theme.accent}30` } : { borderColor: (theme.muted || "#B3A18C") + "20", color: theme.muted, background: theme.surface }}
            >
              {getCategoryIcon(c, 14)}
              <span>{c}</span>
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

      {/* ===================== MENU ITEMS (APP-LIKE UI ROW STYLE) ===================== */}
      <main className="max-w-3xl mx-auto px-4 pb-32 pt-5 space-y-6">
        {groups.map((group) => {
          const subcat = group[0];
          const list = group[1];
          return (
            <div key={subcat || "main"} className="space-y-2.5">
              {subcat && (
                <h2 className="text-xs font-black px-1 tracking-wide text-gray-400 uppercase flex items-center gap-1.5 pt-2">
                  <span className="w-1 h-3 rounded-full" style={{ background: theme.accent }} />
                  {subcat}
                </h2>
              )}
              <div className="flex flex-col gap-2">
                {list.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl border transition-all flex items-center justify-between gap-3 shadow-sm hover:translate-y-[-1px]" style={{ background: theme.surface, borderColor: (theme.muted || "#B3A18C") + "15" }}>
                    
                    {/* الجانب الأيمن: الاسم والوصف واختيار الحجم */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-sm leading-snug truncate">{item.name}</h3>
                      {item.desc && <p className="text-[10px] opacity-75 line-clamp-1 leading-relaxed" style={{ color: theme.muted }}>{item.desc}</p>}
                      
                      {/* لو الصنف ليه أحجام، بتظهر كـ Badges أفقية نظيفة بنفس ستايل تطبيق المحمول */}
                      {item.sizes && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.sizes.map((sz) => {
                            const currentSelectedSize = selectedSizesCache[item.id] || item.sizes[0].label;
                            const isSelected = currentSelectedSize === sz.label;
                            return (
                              <button
                                key={sz.label}
                                onClick={() => setSelectedSizesCache(prev => ({ ...prev, [item.id]: sz.label }))}
                                className="px-2.5 py-0.5 text-[9px] rounded-md font-bold transition-all border"
                                style={isSelected ? { background: theme.accent + "20", color: theme.accent, borderColor: theme.accent } : { background: theme.surface2, color: theme.muted, borderColor: "transparent" }}
                              >
                                {sz.label} ({sz.price}ج)
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* الجانب الأيسر: السعر والتحكم في الكميات وعربة المشتريات */}
                    <div className="shrink-0 flex items-center gap-2.5">
                      {item.sizes ? (
                        (() => {
                          const chosenLabel = selectedSizesCache[item.id] || item.sizes[0].label;
                          const key = `${item.id}::${chosenLabel}`;
                          const qty = cart[key] || 0;
                          return (
                            <div className="flex items-center gap-2">
                              {qty > 0 ? (
                                <div className="flex items-center gap-1.5 rounded-lg p-0.5 border" style={{ borderColor: theme.accent + "30", background: theme.surface2 }}>
                                  <button onClick={() => addToCart(key, -1)} className="w-6 h-6 rounded-md flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={10} /></button>
                                  <span className="w-3 text-center text-xs font-black">{qty}</span>
                                  <button onClick={() => addToCart(key, 1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={10} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="px-3 py-1.5 rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1" style={{ background: theme.accent, color: theme.bg }}>
                                  <Plus size={10} /> إضافة
                                </button>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black" style={{ color: theme.accent }}>{money(item.price)}</span>
                          {cart[item.id] > 0 ? (
                            <div className="flex items-center gap-1.5 rounded-lg p-0.5 border" style={{ borderColor: theme.accent + "30", background: theme.surface2 }}>
                              <button onClick={() => addToCart(item.id, -1)} className="w-6 h-6 rounded-md flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={10} /></button>
                              <span className="w-3 text-center text-xs font-black">{cart[item.id]}</span>
                              <button onClick={() => addToCart(item.id, 1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: theme.accent, color: theme.bg }}><Plus size={10} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item.id, 1)} className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform active:scale-95" style={{ background: theme.accent, color: theme.bg }}>
                              <Plus size={12} />
                            </button>
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
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-35 flex items-center justify-between gap-6 px-6 py-3.5 rounded-full shadow-2xl font-bold text-sm active:scale-95 transition-all hover:scale-[1.01]" style={{ background: theme.accent, color: theme.bg, width: "90%", maxWidth: "450px" }}>
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

                {/* نظام النقاط الذكي */}
                {userPoints > 0 && (
                  <div className="mt-3 p-3 rounded-xl border border-dashed flex flex-col gap-2" style={{ borderColor: theme.accent + "40", background: theme.surface2 }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: theme.accent }}>
                        <Coins size={15} className="animate-pulse" />
                        <span>محفظة النقاط الذهبية: لديك {userPoints} نقطة</span>
                      </div>
                      <span className="text-[10px] opacity-80 flex items-center gap-1" style={{ color: theme.muted }}>
                        <Gem size={12} className="text-green-500" /> تساوي {money(userPoints * pointValueInMoney)} خصم
                      </span>
                    </div>
                    <button 
                      onClick={() => setRedeemPoints(!redeemPoints)}
                      className="w-full py-2 rounded-lg text-[11px] font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                      style={redeemPoints ? { background: "#15803d", color: "#fff" } : { background: theme.accent, color: theme.bg }}
                    >
                      {redeemPoints ? <Check size={13} /> : <Coins size={13} />}
                      {redeemPoints ? "تم تطبيق خصم النقاط الذهبية بنجاح" : "اضغط هنا لاستبدال النقاط بخصم فوري كاش"}
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
                    <span style={{ color: theme.muted }}>الإجمالي النهائي:</span>
                    <span style={{ color: theme.accent }} className="text-base">{money(finalTotal)}</span>
                  </div>
                </div>

                {/* كود الخصم */}
                <div className="pt-2.5 flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" value={enteredPromo} onChange={(e) => setEnteredPromo(e.target.value)} placeholder="هل لديك كوبون خصم؟" className="w-full px-3 py-2 pr-8 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "25", color: theme.text }} />
                    <Tag size={13} className="absolute right-2.5 top-2.5 opacity-60" style={{ color: theme.text }} />
                  </div>
                  <button onClick={handleApplyPromo} className="px-4 py-2 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1 border transition-colors" style={{ background: theme.surface2, color: theme.accent, borderColor: theme.accent + "40" }}>
                    <Percent size={12} /> تطبيق
                  </button>
                </div>
                {promoError && <p className="text-[10px] font-bold text-red-500 bg-black/10 p-1.5 rounded mr-1">{promoError}</p>}
                {appliedDiscountPercent > 0 && <p className="text-[10px] font-bold text-green-500 mr-1">✓ تم تطبيق الخصم بنجاح بنسبة {appliedDiscountPercent}%</p>}

                {/* بيانات الدليفري */}
                <div className="mt-3 pt-2 border-t space-y-2" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                  <p className="text-[11px] font-bold" style={{ color: theme.accent }}>بيانات التوصيل والطلب (الدليفري):</p>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <input type="text" placeholder="اكتب اسمك الكريم هنا..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                      <User size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="relative">
                      <select value={selectedAreaIndex} onChange={(e) => setSelectedAreaIndex(Number(e.target.value))} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none appearance-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }}>
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

                    <div className="p-3 rounded-xl border border-dotted space-y-2.5" style={{ borderColor: (theme.muted || "#B3A18C") + "30", background: theme.surface2 }}>
                      <p className="text-[10px] font-bold opacity-80 flex items-center gap-1" style={{ color: theme.muted }}>
                        <Calendar size={13} />
                        <span>تحديد موعد التوصيل المطلوب:</span>
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setScheduleType("now")} className="py-1.5 rounded-lg text-[10px] font-bold border transition-all" style={scheduleType === "now" ? { background: theme.accent, color: theme.bg, borderColor: theme.accent } : { borderColor: theme.muted + "20" }}>⚡ دليفري فوري (الآن)</button>
                        <button type="button" onClick={() => setScheduleType("later")} className="py-1.5 rounded-lg text-[10px] font-bold border transition-all" style={scheduleType === "later" ? { background: theme.accent, color: theme.bg, borderColor: theme.accent } : { borderColor: theme.muted + "20" }}>🕒 توصيل مجدول لاحقاً</button>
                      </div>
                      {scheduleType === "later" && (
                        <div className="relative animate-pulse">
                          <input type="text" placeholder="اكتب الموعد المفضل (مثال: الساعة 9:30 مساءً)..." value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 pr-8 rounded-lg text-[10px] border focus:outline-none" style={{ background: theme.surface, borderColor: theme.accent + "40", color: theme.text }} />
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
                        <input type="text" placeholder="العنوان بالتفصيل (البيت, الشارع)..." value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                        <MapPin size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                      </div>
                      <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl border font-bold text-xs flex items-center justify-center bg-black/10 transition-transform active:scale-95 shrink-0" style={{ borderColor: theme.accent, color: theme.accent }}>
                        {geoLoading ? "..." : <Navigation size={14} className="animate-pulse" />}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea placeholder="أي ملاحظات إضافية على الأكل؟" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={1} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none resize-none" style={{ background: theme.surface2, borderColor: (theme.muted || "#B3A18C") + "30", color: theme.text }} />
                      <FileText size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                    </div>
                  </div>
                  {validationError && <p className="text-[10px] text-center font-bold text-red-500 bg-red-500/10 py-1 rounded-lg animate-pulse">{validationError}</p>}
                </div>

                <button onClick={sendWhatsApp} className="w-full mt-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md hover:opacity-90" style={{ background: "#25D366", color: "#fff" }}><MessageCircle size={18} />تأكيد وإرسال عبر واتساب</button>
              </>
            )}
          </Sheet>
        </Overlay>
      )}

      {/* بوب أب تأكيد كود الهدية العكسي عند العميل */}
      {orderSuccess && (
        <Overlay onClose={() => setOrderSuccess(false)}>
          <Sheet theme={theme} title="جاري تأكيد طلبك... 🕒" onClose={() => setOrderSuccess(false)}>
            <div className="space-y-4 text-center py-2">
              <div className="w-14 h-14 bg-yellow-500/10 text-yellow-500 rounded-full flex items-center justify-center mx-auto"><MessageCircle size={28} className="animate-pulse" /></div>
              
              <div className="text-xs leading-relaxed space-y-2 px-1 text-right">
                <p className="font-bold text-sm text-center" style={{ color: theme.accent }}>خطوة واحدة لتفعيل نقاطك الذهبية! 🌟</p>
                <p>1. تم توجيهك للواتساب، يرجى **إرسال الرسالة** لتأكيد الأكل مع المطبخ.</p>
                <p>2. بعد الإرسال، ستجد في **نهاية الرسالة** سطر مكتوب فيه كود الهدية (مثل: CLAIM-XXXX).</p>
                <p>3. **انسخ الكود** وضعه في الخانة بالأسفل واضغط تفعيل لتنزل النقاط في محفظتك فوراً!</p>
              </div>

              {!claimCodeSuccess ? (
                <div className="p-3 rounded-xl border border-dashed space-y-2.5 mt-2" style={{ borderColor: theme.accent + "30", background: theme.surface2 }}>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="أدخل كود الهدية من محادثة الواتساب..." 
                      value={userEnteredClaimCode} 
                      onChange={(e) => setUserEnteredClaimCode(e.target.value)} 
                      className="w-full px-3 py-2 rounded-lg text-xs border text-center font-bold uppercase focus:outline-none" 
                      style={{ background: theme.surface, borderColor: theme.accent + "40", color: theme.text }} 
                    />
                    <Key size={13} className="absolute right-2.5 top-2.5 opacity-60" />
                  </div>
                  {claimCodeError && <p className="text-[10px] font-bold text-red-500 bg-red-500/5 py-1 rounded">{claimCodeError}</p>}
                  
                  <button 
                    onClick={handleClaimPointsWithCode} 
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Award size={13} /> تفعيل هدية النقاط الذهبية فوراً
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-xs font-bold text-green-500 space-y-1">
                  <p className="text-sm">✓ تم تفعيل الهدية بنجاح! 🎉</p>
                  <p>نزلت النقاط الذهبية الجديدة في محفظتك أوتوماتيكياً.</p>
                </div>
              )}

              <button onClick={() => setOrderSuccess(false)} className="w-full py-2 border rounded-xl text-xs font-bold mt-2" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>إغلاق النافذة</button>
            </div>
          </Sheet>
        </Overlay>
      )}

      {/* باقي البوب أبس الافتراضية (QR, Themes, PIN) */}
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

      {/* لوحة الإدارة الكاملة */}
      {adminOpen && (
        <Overlay onClose={() => setAdminOpen(false)}>
          <Sheet theme={theme} title="إعدادات الإدارة وقاعدة البيانات" onClose={() => setAdminOpen(false)}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* سجل الطلبات والعملاء */}
              <div className="pt-2 border-b pb-4" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}>
                <p className="font-bold text-sm mb-2 flex items-center justify-between text-blue-500">
                  <span className="flex items-center gap-1"><FileText size={16} /> سجل الطلبات وداتا العملاء ({savedOrders.length})</span>
                  {savedOrders.length > 0 && (
                    <button onClick={clearAllOrders} className="text-[10px] text-red-400 border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5">مسح السجل</button>
                  )}
                </p>

                {savedOrders.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 py-4">لا توجد طلبات مسجلة بعد.</p>
                ) : (
                  <div className="space-y-2">
                    <button onClick={exportOrdersToCSV} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md">
                      <Download size={14} /> تصدير الداتا بالكامل لملف Excel 📊
                    </button>

                    <div className="space-y-2 max-h-[25vh] overflow-y-auto mt-2 pr-1">
                      {savedOrders.map((order, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border text-[11px] bg-black/20 space-y-1 relative" style={{ borderColor: theme.muted + "20" }}>
                          <button onClick={() => deleteSavedOrder(idx)} className="absolute top-2 left-2 text-red-400 p-1"><Trash2 size={12} /></button>
                          <p className="font-bold text-xs" style={{ color: theme.accent }}>👤 {order.name} ({order.phone})</p>
                          <p className="text-gray-300">📍 {order.area} - {order.address}</p>
                          <p className="text-gray-400 bg-black/30 p-1 rounded mt-1">🛒 {order.itemsDescription}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-gray-800 mt-1 opacity-80 text-[10px]">
                            <span>🕒 {order.date}</span>
                            <span className="font-bold text-green-400 text-xs">💰 {money(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Field label="اسم المطعم" value={restaurantName} onChange={setRestaurantName} theme={theme} />
              <Field label="الشعار الفرعي للمنيو" value={tagline} onChange={setTagline} theme={theme} />
              <Field label="العنوان الجغرافي" value={address} onChange={setAddress} theme={theme} />
              <Field label="رقم واتساب الاستقبال" value={whatsappNumber} onChange={setWhatsappNumber} theme={theme} dir="ltr" />
              <Field label="رقم فودافون كاش" value={vodafoneCash} onChange={setVodafoneCash} theme={theme} dir="ltr" />
              <Field label="حساب InstaPay" value={instapay} onChange={setInstapay} theme={theme} dir="ltr" />
              <Field label="رمز الأمان للإدارة (PIN)" value={adminPin} onChange={setAdminPin} theme={theme} dir="ltr" />

              {/* لوحة إلغاء وسحب النقاط العكسية */}
              <div className="pt-4 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <p className="font-bold text-sm mb-1.5 flex items-center gap-1.5 text-red-500">
                  <RotateCcw size={16} /> لوحة إلغاء وسحب النقاط (ثغرة الإلغاء)
                </p>
                <div className="bg-red-950/20 p-3 rounded-xl border border-red-500/20 space-y-2.5">
                  <div className="flex gap-2 items-center justify-between">
                    <span className="text-xs text-gray-300">عدد النقاط المراد سحبها:</span>
                    <input type="number" value={burnPointsAmount} onChange={(e) => setBurnPointsAmount(Math.max(1, Number(e.target.value)))} className="w-24 px-2 py-1 rounded border bg-transparent text-xs text-center" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                  </div>
                  <button onClick={handleGenerateBurnCodeAction} className="w-full py-1.5 bg-red-700 text-white rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow"><PlusCircle size={13} /> توليد كود سحب النقاط أوتوماتيكياً</button>
                  {generatedBurnCode && (
                    <div className="p-2 bg-black/40 rounded border border-red-500/30 text-center select-all">
                      <p className="text-[10px] text-gray-400">ارسله للعميل ليلغي نقاط الفاتورة التالفة فوراً:</p>
                      <p className="text-xs font-black tracking-widest text-red-400 mt-1">{generatedBurnCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* إعدادات النقاط */}
              <div className="pt-4 border-t" style={{ borderColor: (theme.muted || "#B3A18C") + "30" }}>
                <p className="font-bold text-sm mb-2 flex items-center gap-1.5 text-yellow-500">
                  <Coins size={16} /> إعدادات نقاط الولاء الذهبية (DCGC)
                </p>
                <div className="grid grid-cols-2 gap-3 bg-black/20 p-3 rounded-xl border border-[#1F1F1F]">
                  <label className="block text-xs space-y-1">
                    <span className="opacity-90 font-medium flex items-center gap-1"><TrendingUp size={12} /> معدل كسب النقاط</span>
                    <input type="number" value={pointsEarnRate} onChange={(e) => setPointsEarnRate(Math.max(1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                  </label>
                  <label className="block text-xs space-y-1">
                    <span className="opacity-90 font-medium flex items-center gap-1"><Gem size={12} /> قيمة استبدال النقطة</span>
                    <input type="number" step="0.1" value={pointValueInMoney} onChange={(e) => setPointValueInMoney(Math.max(0.1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.muted + "40", color: theme.text }} />
                  </label>
                </div>
              </div>

            </div>
          </Sheet>
        </Overlay>
      )}

    </div>
  );
}

// المكونات الفرعية (Overlay, Sheet, Field, PayRow)
function Overlay({ children, onClose }) { return <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-0 md:p-4"><div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />{children}</div>; }
function Sheet({ theme, title, onClose, children }) { return <div className="relative z-10 w-full md:max-w-md max-h-[85vh] rounded-t-3xl md:rounded-3xl p-5 overflow-y-auto" style={{ background: theme.bg, color: theme.text, border: "1px solid " + (theme.muted || "#B3A18C") + "30" }} dir="rtl"><div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: (theme.muted || "#B3A18C") + "20" }}><h2 className="text-lg font-black" style={{ color: theme.accent }}>{title}</h2><button onClick={onClose} className="p-1.5 rounded-full border" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}><X size={15} /></button></div>{children}</div>; }
function Field({ label, value, onChange, theme, dir = "rtl", hint }) { return <label className="block text-sm space-y-1"><span className="font-bold opacity-90" style={{ color: theme.muted }}>{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2 rounded-lg border bg-transparent" style={{ borderColor: (theme.muted || "#B3A18C") + "40", color: theme.text }} />{hint && <span className="block mt-1 text-xs opacity-70" style={{ color: theme.muted }}>{hint}</span>}</label>; }
function PayRow({ icon, label, value, theme, onCopy, copied }) { return <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg" style={{ background: theme.surface2 }}><div className="flex items-center gap-2 min-w-0"><span style={{ color: theme.accent }}>{icon}</span><div className="min-w-0"><p className="text-xs" style={{ color: theme.muted }}>{label}</p><p className="text-sm font-bold truncate" dir="ltr">{value}</p></div></div><button onClick={() => onCopy(label, value)} className="p-1.5 rounded-full border shrink-0 transition-transform active:scale-95" style={{ borderColor: (theme.muted || "#B3A18C") + "40" }}>{copied === label ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}</button></div>; }
