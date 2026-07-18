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
  { id: "brand", name: "هوية دريم كورنر", bg: "#FFF9F0", surface: "#FFFFFF", surface2: "#FFF1E0", accent: "#D62828", accent2: "#FFB703", text: "#241C15", muted: "#7A6E67", display: "'Cairo', sans-serif" },
  { id: "night", name: "ليلي فاخر", bg: "#1C1B1A", surface: "#262523", surface2: "#33312E", accent: "#D62828", accent2: "#FFB703", text: "#FFF9F0", muted: "#A39992", display: "'Cairo', sans-serif" },
  { id: "emerald", name: "شرقي فاخر", bg: "#081410", surface: "#10221C", surface2: "#19322A", accent: "#C9A24B", accent2: "#2F6E52", text: "#EFEAD9", muted: "#9DB0A6", display: "'Cairo', sans-serif" }
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
  const [tagline, setTagline] = useState("وجبات سريعة ولذيثة — طعم يفرق .. جودة تليق بك");
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
  const [selectedSizesCache, setSelectedSizesCache] = useState({});

  const saveTimer = useRef(null);
  const findItem = (id) => items.find((i) => i.id === id);

  // تحديث لوجيك قراءة الـ cart لتفادي مشكلة الـ الكي الموحد والمختفي[span_2](start_span)[span_2](end_span)
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
        const price = sizeLabel && sizeLabel !== "موحد" ? item.sizes.find((s) => s.label === sizeLabel)?.price ?? 0 : item.price;
        const label = sizeLabel && sizeLabel !== "موحد" ? item.name + " (" + sizeLabel + ")" : item.name;
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
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
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
        setGeoLink(`http://maps.google.com/?q=${lat},${lon}`);
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
      setPromoError(`✓ أوتوماتيك: تم سحب وإلغاء فاعلية ${burnPointsAmount} نقطة بنجاح.`);
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
      setAdminOpen(true);
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

  const addToCart = (key, delta) =>
    setCart((c) => {
      const nextCart = { ...c };
      nextCart[key] = Math.max(0, (c[key] || 0) + delta);
      return nextCart;
    });

  const updateItem = (id, patch) =>
    setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const deleteItem = (id) => setItems((its) => its.filter((i) => i.id !== id));

  const addNewItem = () => {
    const id = "n" + Date.now().toString();
    setItems((its) => [...its, { id, cat: activeCat === "الكل" ? "بيتزا جديدة" : activeCat, name: "صنف جديد", price: 50, desc: "" }]);
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

  const categories = useMemo(() => ["الكل", ...new Set(items.map((i) => i.cat))], [items]);
  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCat === "الكل" || item.cat === activeCat;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;
      return matchesCategory && (
        item.name.toLowerCase().includes(cleanQuery) ||
        (item.desc && item.desc.toLowerCase().includes(cleanQuery)) ||
        item.cat.toLowerCase().includes(cleanQuery)
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

  return (
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-28 font-sans" style={{ background: theme.bg, color: theme.text }}>
      
      {/* ===================== PWA BANNER ===================== */}
      {showInstallBanner && (
        <div className="fixed bottom-16 inset-x-0 z-50 px-4 py-3 mx-4 my-2 rounded-2xl flex items-center justify-between border shadow-2xl" style={{ background: theme.surface, borderColor: theme.accent + "30" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
              <span className="text-xl">🔥</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight" style={{ color: theme.accent }}>ثبت منيو {restaurantName}</p>
              <p className="text-[10px] opacity-75 mt-0.5" style={{ color: theme.muted }}>تصفح المنيو بدون إنترنت كأنه تطبيق موبايل!</p>
            </div>
          </div>
          <button onClick={handleInstallApp} className="px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1" style={{ background: theme.accent, color: "#fff" }}>
            <Download size={12} /> تثبيت
          </button>
        </div>
      )}

      {/* ===================== HEADER ===================== */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: theme.bg + "D9", borderColor: theme.accent + "20" }}>
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div onClick={handleLogoClickLocal} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-md bg-gradient-to-br from-red-500 to-amber-500">🔥</div>
              {logoClicks > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold animate-pulse">{logoClicks}</span>}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-black truncate leading-tight" style={{ color: theme.accent }}>{restaurantName}</h1>
              <p className="text-[11px] truncate opacity-75 mt-0.5 font-bold uppercase tracking-wider" style={{ color: theme.accent2 }}>{tagline}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme.id === "brand" ? THEMES[1] : THEMES[0])} className="p-2 rounded-full bg-black/5 dark:bg-white/10 text-sm">🌙</button>
            {/* ضبط إخفاء أيقونة الترس عن العامة وعرض زر السلة المناسب */}
            {isAdmin && (
              <>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-full border text-green-500 bg-green-500/10 active:scale-95 animate-pulse"><Settings size={16} /></button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-full border text-red-500 bg-red-500/5"><LogOut size={14} /></button>
              </>
            )}
            <button onClick={() => setCartOpen(true)} className="relative p-2.5 rounded-full text-white shadow-md bg-gradient-to-r from-red-500 to-red-600">
              <ShoppingCart size={16} />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* البحث السريع */}
        <div className="max-w-3xl mx-auto px-4 pb-3">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن برجر، بيتزا، سندوتش كفتة، كنز..." className="w-full px-4 py-2 pr-9 rounded-full text-xs border focus:outline-none transition-all shadow-sm" style={{ background: theme.surface, borderColor: theme.accent + "20", color: theme.text }} />
            <Search size={14} className="absolute right-3.5 top-3 top-2.5 opacity-60" />
          </div>
        </div>

        {/* شريط الفئات والأقسام */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => setActiveCat(c)} 
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-1.5 shadow-sm" 
              style={activeCat === c ? { background: theme.accent, color: "#fff", borderColor: theme.accent, boxShadow: `0 4px 14px ${theme.accent}50` } : { borderColor: theme.accent + "15", color: theme.muted, background: theme.surface }}
            >
              {getCategoryIcon(c, 14)}
              <span>{c}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ===================== HERO SIZZLE BANNER ===================== */}
      <section className="max-w-3xl mx-auto px-4 pt-4">
        <div className="rounded-2xl text-white p-5 relative overflow-hidden shadow-md bg-gradient-to-br from-red-600 to-amber-600">
          <div className="absolute -left-4 -bottom-6 text-7xl opacity-20 select-none">🍔</div>
          <p className="uppercase tracking-widest text-[10px] font-black text-amber-300 mb-1">اطلب خلال ثوانٍ معدودة</p>
          <h2 className="text-lg font-black max-w-md leading-tight">جهّز طلبك على طريقتك، واستلمه فريش وطازج من المطبخ</h2>
          <div className="w-12 h-1 bg-amber-400 rounded-full mt-2"></div>
        </div>
      </section>

      {/* ===================== MENU ITEMS ROW UI ===================== */}
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
                  <div key={item.id} className="p-3 rounded-xl border transition-all flex items-center justify-between gap-3 shadow-sm hover:translate-y-[-1px]" style={{ background: theme.surface, borderColor: theme.accent + "10" }}>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-bold text-sm leading-snug truncate">{item.name}</h3>
                      {item.desc && <p className="text-[11px] opacity-75 line-clamp-1 leading-relaxed" style={{ color: theme.muted }}>{item.desc}</p>}
                      
                      {item.sizes && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {item.sizes.map((sz) => {
                            const currentSelectedSize = selectedSizesCache[item.id] || item.sizes[0].label;
                            const isSelected = currentSelectedSize === sz.label;
                            return (
                              <button
                                key={sz.label}
                                onClick={() => setSelectedSizesCache(prev => ({ ...prev, [item.id]: sz.label }))}
                                className="px-2.5 py-0.5 text-[10px] rounded-md font-bold transition-all border"
                                style={isSelected ? { background: theme.accent + "20", color: theme.accent, borderColor: theme.accent } : { background: theme.surface2, color: theme.muted, borderColor: "transparent" }}
                              >
                                {sz.label} ({sz.price}ج)
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

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
                                  <button onClick={() => addToCart(key, 1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: theme.accent, color: "#fff" }}><Plus size={10} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="px-3 py-1 rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1 text-white" style={{ background: theme.accent }}>
                                  <Plus size={10} /> إضافة
                                </button>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        (() => {
                          const key = `${item.id}::موحد`; 
                          const qty = cart[key] || 0;
                          return (
                            <div className="flex items-center gap-3">
                              {qty > 0 ? (
                                <div className="flex items-center gap-1.5 rounded-lg p-0.5 border" style={{ borderColor: theme.accent + "30", background: theme.surface2 }}>
                                  <button onClick={() => addToCart(key, -1)} className="w-6 h-6 rounded-md flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={10} /></button>
                                  <span className="w-3 text-center text-xs font-black">{qty}</span>
                                  <button onClick={() => addToCart(key, 1)} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: theme.accent, color: "#fff" }}><Plus size={10} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="px-3 py-1 rounded-lg text-[10px] font-black shadow-sm flex items-center gap-1 text-white" style={{ background: theme.accent }}>
                                  <Plus size={10} /> إضافة
                                </button>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* ===================== FOOTER INFO STRIP ===================== */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t px-4 py-3 flex items-center justify-center gap-4 text-xs font-semibold shadow-inner" style={{ background: theme.bg + "F2", borderColor: theme.accent + "15" , color: theme.muted, backdropFilter: "blur(8px)" }}>
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
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-35 flex items-center justify-between gap-6 px-6 py-3.5 rounded-full shadow-2xl font-bold text-sm active:scale-95 transition-all text-white animate-bounce" style={{ background: theme.accent, width: "90%", maxWidth: "450px" }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={18} />
              <span className="absolute -top-2.5 -right-2 w-4.5 h-4.5 bg-amber-500 text-black text-[9px] rounded-full flex items-center justify-center font-bold">{cartCount}</span>
            </div>
            <span>عرض الطلبات الحالية</span>
          </div>
          <span className="text-xs tracking-wide">الإجمالي: {money(cartTotal)}</span>
        </button>
      )}

      {/* ===================== CART DRAWER ===================== */}
      {cartOpen && (
        <Overlay onClose={() => setCartOpen(false)}>
          <Sheet theme={theme} title="إيصال سلة المشتريات" onClose={() => setCartOpen(false)}>
            {cartList.length === 0 ? <p className="text-center py-8" style={{ color: theme.muted }}>العربة فارغة حالياً</p> : (
              <>
                <div className="border-2 border-dashed p-3 rounded-xl bg-white dark:bg-zinc-900 shadow-inner max-h-[25vh] overflow-y-auto space-y-2.5" style={{ borderColor: theme.accent + "30" }}>
                  {cartList.map((cartItem) => (
                    <div key={cartItem.key} className="flex items-center justify-between gap-2 border-b border-dashed pb-2 text-xs" style={{ borderColor: theme.accent + "15" }}>
                      <div className="min-w-0">
                        <p className="font-bold truncate">{cartItem.label}</p>
                        <p className="text-[10px]" style={{ color: theme.muted }}>{money(cartItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => addToCart(cartItem.key, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: theme.accent + "40" }}><Minus size={11} /></button>
                        <span className="w-3 text-center font-bold">{cartItem.qty}</span>
                        <button onClick={() => addToCart(cartItem.key, 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ background: theme.accent }}><Plus size={11} /></button>
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
                      className="w-full py-1.5 rounded-lg text-[11px] font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-sm text-white"
                      style={redeemPoints ? { background: "#15803d" } : { background: theme.accent }}
                    >
                      {redeemPoints ? <Check size={13} /> : <Coins size={13} />}
                      {redeemPoints ? "تم تطبيق خصم النقاط الذهبية بنجاح" : "اضغط هنا لاستبدال النقاط بخصم فوري كاش"}
                    </button>
                  </div>
                )}
                
                <div className="space-y-1 pt-2 mt-2 text-xs">
                  <div className="flex items-center justify-between opacity-80">
                    <span>إجمالي الأصناف:</span>
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
                  <div className="flex items-center justify-between pt-2 text-sm font-black border-t border-dashed" style={{ borderColor: theme.accent + "40" }}>
                    <span style={{ color: theme.muted }}>الإجمالي النهائي للطلب:</span>
                    <span style={{ color: theme.accent }} className="text-base">{money(finalTotal)}</span>
                  </div>
                </div>

                {/* نظام كود الخصم */}
                <div className="pt-2 flex gap-2">
                  <div className="relative flex-1">
                    <input type="text" value={enteredPromo} onChange={(e) => setEnteredPromo(e.target.value)} placeholder="هل لديك كوبون خصم؟" className="w-full px-3 py-2 pr-8 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: theme.accent + "25", color: theme.text }} />
                    <Tag size={13} className="absolute right-2.5 top-2.5 opacity-60" style={{ color: theme.text }} />
                  </div>
                  <button onClick={handleApplyPromo} className="px-4 py-2 rounded-xl font-bold text-xs shadow-sm flex items-center gap-1 border transition-colors text-white" style={{ background: theme.accent, borderColor: theme.accent }}>
                    <Percent size={12} /> تطبيق
                  </button>
                </div>
                {promoError && <p className="text-[10px] font-bold text-red-500 bg-black/5 dark:bg-white/5 p-1.5 rounded mr-1 mt-1">{promoError}</p>}

                {/* بيانات الدليفري */}
                <div className="mt-3 pt-2 border-t border-dashed space-y-2" style={{ borderColor: theme.accent + "30" }}>
                  <p className="text-[11px] font-bold" style={{ color: theme.accent }}>بيانات التوصيل والدليفري المطلوبة:</p>
                  <div className="space-y-2">
                    <div className="relative">
                      <input type="text" placeholder="اكتب اسمك الكريم هنا..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: theme.accent + "30", color: theme.text }} />
                      <User size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="relative">
                      <select value={selectedAreaIndex} onChange={(e) => setSelectedAreaIndex(Number(e.target.value))} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none appearance-none" style={{ background: theme.surface2, borderColor: theme.accent + "30", color: theme.text }}>
                        <option value={-1}>اختر قرية / منطقة التوصيل التابع لها...</option>
                        {deliveryAreas.map((area, idx) => (
                          <option key={idx} value={idx} style={{ background: theme.surface, color: theme.text }}>
                            {area.name} (+{money(area.price)})
                          </option>
                        ))}
                      </select>
                      <MapPin size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                      <ChevronDown size={14} className="absolute left-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="relative">
                      <input type="tel" placeholder="رقم الموبايل لتأكيد الكابتن معك..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: theme.accent + "30", color: theme.text }} />
                      <Phone size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" placeholder="العنوان بالتفصيل الممل (البيت, الشارع)..." value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: theme.accent + "30", color: theme.text }} />
                        <MapPin size={14} className="absolute right-3 top-2.5 opacity-60" style={{ color: theme.text }} />
                      </div>
                      <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl border font-bold text-xs flex items-center justify-center bg-black/10 transition-transform active:scale-95 shrink-0" style={{ borderColor: theme.accent, color: theme.accent }}>
                        {geoLoading ? "..." : <Navigation size={14} className="animate-pulse" />}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea placeholder="أي ملاحظات إضافية على الأكل؟" value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} rows={1} className="w-full px-3 py-2 pr-9 rounded-xl text-xs border focus:outline-none resize-none" style={{ background: theme.surface2, borderColor: theme.accent + "30", color: theme.text }} />
                      <FileText size={14} className="absolute right-3 top-2 opacity-60" style={{ color: theme.text }} />
                    </div>
                  </div>
                  {validationError && <p className="text-[10px] text-center font-bold text-red-500 bg-red-500/10 py-1 rounded-lg animate-pulse">{validationError}</p>}
                </div>

                <button onClick={sendWhatsApp} className="w-full mt-3 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-md bg-[#25D366] hover:bg-[#1ebe5b]"><MessageCircle size={18} />إرسال الطلب عبر واتساب</button>
              </>
            )}
          </Sheet>
        </Overlay>
      )}

      {/* بوب أب التحقق العكسي من الـ CLAIM كود */}
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
                    <input type="text" placeholder="أدخل كود الهدية من محادثة الواتساب..." value={userEnteredClaimCode} onChange={(e) => setUserEnteredClaimCode(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs border text-center font-bold uppercase focus:outline-none" style={{ background: theme.surface, borderColor: theme.accent + "40", color: theme.text }} />
                    <Key size={13} className="absolute right-2.5 top-2.5 opacity-60" />
                  </div>
                  {claimCodeError && <p className="text-[10px] font-bold text-red-500 bg-red-500/5 py-1 rounded">{claimCodeError}</p>}
                  
                  <button onClick={handleClaimPointsWithCode} className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1">
                    <Award size={13} /> تفعيل هدية النقاط الذهبية فوراً
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-xs font-bold text-green-500 space-y-1">
                  <p className="text-sm">✓ تم تفعيل الهدية بنجاح! 🎉</p>
                  <p>نزلت النقاط الذهبية الجديدة في محفظتك أوتوماتيكياً.</p>
                </div>
              )}
              <button onClick={() => setOrderSuccess(false)} className="w-full py-2 border rounded-xl text-xs font-bold mt-2" style={{ borderColor: theme.accent + "30" }}>إغلاق النافذة</button>
            </div>
          </Sheet>
        </Overlay>
      )}

      {/* بوب أب التحقق من الـ PIN للإدارة */}
      {pinModalOpen && (
        <Overlay onClose={() => setPinModalOpen(false)}>
          <Sheet theme={theme} title="التحقق من هوية المدير" onClose={() => setPinModalOpen(false)}>
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="flex flex-col items-center justify-center py-2"><KeyRound size={40} className="mb-2" style={{ color: theme.accent }} /><p className="text-xs text-center" style={{ color: theme.muted }}>هذه المنطقة مخصصة لإدارة كافيه المنيو فقط.</p></div>
              <label className="block text-sm space-y-1">
                <span className="font-bold opacity-90" style={{ color: theme.muted }}>رمز الأمان الحالي للمدير</span>
                <input type="password" maxLength={12} value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-lg border bg-transparent text-center text-lg tracking-widest font-bold focus:outline-none" style={{ borderColor: theme.accent + "40", color: theme.text }} required />
              </label>
              {pinError && <p className="text-xs text-center font-bold text-red-500 bg-red-500/10 py-1.5 rounded-lg">{pinError}</p>}
              <button type="submit" className="w-full py-2 rounded-xl font-bold text-xs text-white" style={{ background: theme.accent }}>دخول الإدارة</button>
            </form>
          </Sheet>
        </Overlay>
      )}

      {/* ===================== لوحة التحكم الشاملة للمدير ===================== */}
      {adminOpen && (
        <Overlay onClose={() => setAdminOpen(false)}>
          <Sheet theme={theme} title="لوحة كاشير وإدارة الطلبات والأسعار" onClose={() => setAdminOpen(false)}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* سجل قاعدة البيانات والعملاء وتصدير الإكسيل */}
              <div className="pt-2 border-b pb-4" style={{ borderColor: theme.accent + "20" }}>
                <p className="font-bold text-sm mb-2 flex items-center justify-between text-blue-500">
                  <span className="flex items-center gap-1"><FileText size={16} /> سجل الطلبات وداتا العملاء حية ({savedOrders.length})</span>
                  {savedOrders.length > 0 && <button onClick={clearAllOrders} className="text-[10px] text-red-400 border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5">مسح السجل</button>}
                </p>

                {savedOrders.length === 0 ? (
                  <p className="text-xs text-center text-gray-500 py-4">لا توجد طلبات مسجلة بعد. أي طلب هيعمله الزبون هيتحفظ هنا بالكامل!</p>
                ) : (
                  <div className="space-y-2">
                    <button onClick={exportOrdersToCSV} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md">
                      <Download size={14} /> تصدير كل داتا الزباين لملف Excel 📊
                    </button>

                    <div className="space-y-2 max-h-[25vh] overflow-y-auto mt-2 pr-1">
                      {savedOrders.map((order, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl border text-[11px] bg-black/10 dark:bg-white/5 border-dashed relative" style={{ borderColor: theme.accent + "20" }}>
                          <button onClick={() => deleteSavedOrder(idx)} className="absolute top-2 left-2 text-red-400 p-1"><Trash2 size={12} /></button>
                          <p className="font-bold text-xs" style={{ color: theme.accent }}>👤 {order.name} ({order.phone})</p>
                          <p className="opacity-80">📍 {order.area} - {order.address}</p>
                          <p className="p-1 rounded mt-1 bg-black/10 dark:bg-white/5">🛒 {order.itemsDescription}</p>
                          <div className="flex items-center justify-between pt-1 border-t border-dashed mt-1 opacity-80 text-[10px]" style={{ borderColor: theme.accent + "20" }}>
                            <span>🕒 {order.date}</span>
                            <span className="font-bold text-green-500 text-xs">💰 {money(order.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* قسم تعديل المنيو والأصناف */}
              <div className="pt-2 border-b pb-4" style={{ borderColor: theme.accent + "20" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-sm text-amber-500 flex items-center gap-1"><Utensils size={15} /> قائمة المأكولات والأصناف</p>
                  <button onClick={addNewItem} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full text-white bg-green-600"><PlusCircle size={14} /> إضافة صنف للمنيو</button>
                </div>
                <div className="space-y-2 max-h-[25vh] overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="p-2 rounded-xl border text-xs flex items-center justify-between" style={{ background: theme.surface, borderColor: theme.accent + "20" }}>
                      {editingId === item.id ? (
                        <div className="w-full space-y-2">
                          <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="w-full p-1 border rounded bg-transparent font-bold" />
                          <div className="grid grid-cols-2 gap-1">
                            <input value={item.cat} onChange={(e) => updateItem(item.id, { cat: e.target.value })} className="p-1 border rounded bg-transparent" placeholder="القسم" />
                            <input type="number" value={item.price || ""} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} className="p-1 border rounded bg-transparent" placeholder="السعر" />
                          </div>
                          <button onClick={() => setEditingId(null)} className="w-full py-1 bg-green-600 text-white rounded font-bold">حفظ الكارت</button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="opacity-70 text-[10px]">{item.cat} · {item.sizes ? "أحجام متعددة" : `${item.price} ج`}</p>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => setEditingId(item.id)} className="p-1.5 border rounded-full"><Pencil size={11} /></button>
                            <button onClick={() => deleteItem(item.id)} className="p-1.5 border rounded-full text-red-500"><Trash2 size={11} /></button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Field label="اسم البراند الحالي" value={restaurantName} onChange={setRestaurantName} theme={theme} />
              <Field label="الشعار الفرعي للمنيو" value={tagline} onChange={setTagline} theme={theme} />
              <Field label="العنوان الجغرافي للمحل" value={address} onChange={setAddress} theme={theme} />
              <Field label="رقم واتساب الاستقبال الحقيقي" value={whatsappNumber} onChange={setWhatsappNumber} theme={theme} dir="ltr" />
              <Field label="رقم محفظة فودافون كاش للمحل" value={vodafoneCash} onChange={setVodafoneCash} theme={theme} dir="ltr" />
              <Field label="حساب InstaPay المباشر" value={instapay} onChange={setInstapay} theme={theme} dir="ltr" />
              <Field label="رمز الأمان لفتح الإدارة (PIN)" value={adminPin} onChange={setAdminPin} theme={theme} dir="ltr" />

              {/* لوحة إلغاء وسحب النقاط العكسية */}
              <div className="pt-4 border-t" style={{ borderColor: theme.accent + "20" }}>
                <p className="font-bold text-sm mb-1.5 flex items-center gap-1.5 text-red-500">
                  <RotateCcw size={16} /> لوحة إلغاء وسحب النقاط (ثغرة الإلغاء)
                </p>
                <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/20 space-y-2.5">
                  <div className="flex gap-2 items-center justify-between">
                    <span className="text-xs opacity-90">عدد النقاط المراد سحبها من محفظة العميل:</span>
                    <input type="number" value={burnPointsAmount} onChange={(e) => setBurnPointsAmount(Math.max(1, Number(e.target.value)))} className="w-24 px-2 py-1 rounded border bg-transparent text-xs text-center" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                  </div>
                  <button onClick={handleGenerateBurnCodeAction} className="w-full py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1 shadow"><PlusCircle size={13} /> توليد كود سحب وإلغاء النقاط فوراً</button>
                  {generatedBurnCode && (
                    <div className="p-2 bg-black/10 dark:bg-white/5 rounded border border-red-500/30 text-center select-all">
                      <p className="text-[10px] opacity-75">انسخ الكود وأرسله للشخص في محادثة الواتساب:</p>
                      <p className="text-xs font-black tracking-widest text-red-500 mt-1">{generatedBurnCode}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* إعدادات النقاط */}
              <div className="pt-4 border-t" style={{ borderColor: theme.accent + "20" }}>
                <p className="font-bold text-sm mb-2 flex items-center gap-1.5 text-amber-500">
                  <Coins size={16} /> إعدادات نقاط الولاء الذهبية (DCGC)
                </p>
                <div className="grid grid-cols-2 gap-3 bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-dashed" style={{ borderColor: theme.accent + "30" }}>
                  <label className="block text-xs space-y-1">
                    <span className="opacity-90 font-medium flex items-center gap-1"><TrendingUp size={12} /> معدل كسب النقاط</span>
                    <input type="number" value={pointsEarnRate} onChange={(e) => setPointsEarnRate(Math.max(1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "40", color: theme.text }} />
                  </label>
                  <label className="block text-xs space-y-1">
                    <span className="opacity-90 font-medium flex items-center gap-1"><Gem size={12} /> قيمة استبدال النقطة</span>
                    <input type="number" step="0.1" value={pointValueInMoney} onChange={(e) => setPointValueInMoney(Math.max(0.1, Number(e.target.value)))} className="w-full px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "40", color: theme.text }} />
                  </label>
                </div>
              </div>

              {/* خطوط الدليفري */}
              <div className="pt-4 border-t" style={{ borderColor: theme.accent + "20" }}>
                <p className="font-bold text-sm mb-2 flex items-center gap-1"><MapPin size={15} /> إدارة مناطق وقرى خطوط التوصيل</p>
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-dashed space-y-2 mb-3" style={{ borderColor: theme.accent + "30" }}>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="اسم القرية" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                    <input type="number" placeholder="سعر التوصيل" value={newAreaPrice} onChange={(e) => setNewAreaPrice(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                  </div>
                  <button onClick={handleAddDeliveryArea} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={13}/>إضافة خط المنطقة</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {deliveryAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/10 dark:bg-white/5 border border-dashed" style={{ borderColor: theme.accent + "15" }}>
                      <span className="font-medium">{area.name} · <span style={{ color: theme.accent }}>{money(area.price)}</span></span>
                      <button onClick={() => handleRemoveDeliveryArea(idx)} className="p-1 rounded-full text-red-500 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* الكوبونات */}
              <div className="pt-4 border-t" style={{ borderColor: theme.accent + "20" }}>
                <p className="font-bold text-sm mb-2 flex items-center gap-1 text-green-500"><Tag size={15} /> إدارة الكوبونات الفعالة</p>
                <div className="bg-black/5 dark:bg-white/5 p-3 rounded-xl border border-dashed space-y-2 mb-3" style={{ borderColor: theme.accent + "30" }}>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" placeholder="الكود" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs uppercase font-bold" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                    <input type="number" placeholder="الخصم %" value={newPromoDiscount} onChange={(e) => setNewPromoDiscount(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                    <input type="number" placeholder="حد الاستخدام" value={newPromoLimit} onChange={(e) => setNewPromoLimit(e.target.value)} className="px-2 py-1.5 rounded-lg border bg-transparent text-xs" style={{ borderColor: theme.accent + "30", color: theme.text }} />
                  </div>
                  <button onClick={handleAddPromoCode} className="w-full py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"><PlusCircle size={13}/>حفظ وإدراج الكود في السيستم</button>
                </div>
                <div className="space-y-1.5 max-h-[15vh] overflow-y-auto pr-1">
                  {promoCodes.map((promo, idx) => {
                    const currentLimit = promo.limit !== undefined ? promo.limit : 9999;
                    const currentUsed = promo.used !== undefined ? promo.used : 0;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-black/10 dark:bg-white/5 border border-dashed" style={{ borderColor: theme.accent + "15" }}>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-green-500 flex items-center gap-1"><Tag size={11} /> {promo.code} · <span className="font-medium text-white">خصم {promo.discount}%</span></span>
                          <span className="text-[10px]" style={{ color: theme.muted }}>الاستخدام الحالي: {currentUsed} من أصل {currentLimit} مرة</span>
                        </div>
                        <button onClick={() => handleRemovePromoCode(idx)} className="p-1 rounded-full text-red-500 border border-red-500/20 bg-red-500/5"><Trash2 size={12}/></button>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </Sheet>
        </Overlay>
      )}

      <div id="toast" className="fixed z-[60] left-1/2 -translate-x-1/2 bottom-24 bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-2 rounded-full text-xs font-semibold shadow-md opacity-0 pointer-events-none transition-opacity duration-300"></div>

    </div>
  );
}

function Overlay({ children, onClose }) { return <div className="fixed inset-0 z-40 flex items-end md:items-center justify-center p-0 md:p-4"><div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />{children}</div>; }
function Sheet({ theme, title, onClose, children }) { return <div className="relative z-10 w-full md:max-w-md max-h-[85vh] rounded-t-3xl md:rounded-3xl p-5 overflow-y-auto" style={{ background: theme.bg, color: theme.text, border: "1px solid " + theme.accent + "20" }} dir="rtl"><div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed" style={{ borderColor: theme.accent + "40" }}><h2 className="text-sm font-black" style={{ color: theme.accent }}>{title}</h2><button onClick={onClose} className="p-1.5 rounded-full border" style={{ borderColor: theme.accent + "30" }}><X size={13} /></button></div>{children}</div>; }
function Field({ label, value, onChange, theme, dir = "rtl", hint }) { return <label className="block text-xs space-y-1"><span className="font-bold opacity-90" style={{ color: theme.muted }}>{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2 rounded-lg border bg-transparent font-medium" style={{ borderColor: theme.accent + "40", color: theme.text }} />{hint && <span className="block mt-1 text-[10px] opacity-70" style={{ color: theme.muted }}>{hint}</span>}</label>; }
function PayRow({ icon, label, value, theme, onCopy, copied }) { return <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: theme.surface2 }}><div className="flex items-center gap-2 min-w-0"><span style={{ color: theme.accent }}>{icon}</span><div className="min-w-0"><p className="text-[10px]" style={{ color: theme.muted }}>{label}</p><p className="font-bold truncate" dir="ltr">{value}</p></div></div><button onClick={() => onCopy(label, value)} className="p-1.5 rounded-full border shrink-0 transition-transform active:scale-95" style={{ borderColor: theme.accent + "30" }}>{copied === label ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}</button></div>; }
