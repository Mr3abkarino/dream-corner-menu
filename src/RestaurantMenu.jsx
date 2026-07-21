import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, ChevronDown, User, Tag, Navigation, Award, Calendar, DollarSign, Wallet, Flame, BarChart3, RefreshCw, Share2, TrendingUp, Download, PieChart, Crown, Clock, Bike, Utensils, Trophy, Users, Home, Box, ShieldAlert, Sparkle, AlertTriangle, Layers, LayoutGrid, CheckCircle2, ArrowUpRight, ArrowDownRight, Bell, Gauge
} from "lucide-react";

const LOGO_SRC = restaurantLogo;
const MENU_VERSION = "5.1"; // الإصدار v5.1: تحويل كل المؤشرات والرسومات إلى داتا حقيقية ومحسوبة 100%
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbybuw8CuUGV-hf_ecUyevpGB5YioMKCdeOP3PxSKKuzGgMmtcfbHyrd0F81eJg3Z_U/exec";

const THEMES = [
  { id: "brand", name: "هوية دريم كورنر", bg: "#0C0E14", surface: "#141721", surface2: "#1C202E", accent: "#E5A93C", accent2: "#8B1E1E", text: "#F3E9D8", muted: "#8A92A6", display: "'Tajawal', sans-serif" },
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
  { code: "OFF10", discount: 10, limit: 1, used: 0 },
  { code: "DREAM", discount: 15, limit: 1, used: 0 }
];

const DEFAULT_MENU = [
  { id: "p1", cat: "البيتزا", name: "بيتزا مارجريتا", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "بيتزا ميكس جبنة", isBestSeller: true, sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p3", cat: "البيتزا", name: "بيتزا خضروات", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p4", cat: "البيتزا", name: "بيتزا هوت دوج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p5", cat: "البيتزا", name: "بيتزا سجق", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "بيتزا لحمة مفرومة", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "p7", cat: "البيتزا", name: "بيتزا بيروني", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p8", cat: "البيتزا", name: "بيتزا سلامي", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p9", cat: "البيتزا", name: "بيتزا شاورما دجاج", isBestSeller: true, sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p10", cat: "البيتزا", name: "بيتزا دجاج رانش", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p11", cat: "البيتزا", name: "بيتزا دريم كورنر سبيشال", desc: "خلطة البيت الخاصة المميزة", isBestSeller: true, sizes: [{ label: "كبير", price: 170 }, { label: "وسط", price: 130 }, { label: "صغير", price: 90 }] },
  { id: "p12", cat: "البيتزا", name: "بيتزا كرانشي (حار أو بارد)", sizes: [{ label: "كبير", price: 130 }, { label: "وسط", price: 100 }, { label: "صغير", price: 80 }] },
  { id: "p13", cat: "البيتزا", name: "بيتزا ميكس دجاج", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 105 }, { label: "صغير", price: 85 }] },
  { id: "p14", cat: "البيتزا", name: "حشو الأطراف", desc: "إضافة أطراف محشوة لأي بيتزا", sizes: [{ label: "كبير", price: 35 }, { label: "وسط", price: 30 }, { label: "صغير", price: 25 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s2", cat: "السندوتشات", subcat: "اللحوم", name: "سجق مشوي", sizes: [{ label: "كبير", price: 70 }, { label: "وسط", price: 60 }] },
  { id: "s3", cat: "السندوتشات", subcat: "اللحوم", name: "كبدة إسكندراني", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s4", cat: "السندوتشات", subcat: "اللحوم", name: "ميكس لحوم (سجق+كبدة)", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", price: 45 },
  { id: "s6", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن بانية", sizes: [{ label: "كبير", price: 85 }, { label: "وسط", price: 70 }] },
  { id: "s7", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "زنجر سوبريم", isBestSeller: true, sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
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

const checkRestaurantStatus = () => {
  const now = new Date();
  const hours = now.getHours();
  const isOpen = hours >= 13 || hours < 3;
  return {
    isOpen,
    text: isOpen ? "مفتوح الآن 🟢" : "مغلق حالياً 🔴",
    timeText: "يومياً من 1:00 ظهراً لـ 3:00 صباحاً"
  };
};

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
  const [vodafoneCash, setVodafoneCash] = useState("01023590020");
  const [instapay, setInstapay] = useState("zxzwd@instapay");

  const [items, setItems] = useState(DEFAULT_MENU);
  const [activeCat, setActiveCat] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [qrOpen, setQrOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [copied, setCopied] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [closeNoticeOpen, setCloseNoticeOpen] = useState(false);

  const [deliveryAreas, setDeliveryAreas] = useState(DEFAULT_DELIVERY_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPrice, setNewAreaPrice] = useState("");
  
  const [promoCodes, setPromoCodes] = useState(DEFAULT_PROMO_CODES);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoDiscount, setNewPromoDiscount] = useState("");
  const [newPromoLimit, setNewPromoLimit] = useState("");

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
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [validationError, setValidationError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [userPoints, setUserPoints] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(false);

  const [scheduleType, setScheduleType] = useState("now"); 
  const [scheduleTime, setScheduleTime] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);

  // حالات التقارير الشاملة
  const [reportsData, setReportsData] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportDateFilter, setReportDateFilter] = useState("all");
  const [reportSearchQuery, setReportSearchQuery] = useState("");

  const saveTimer = useRef(null);
  const status = checkRestaurantStatus();
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
    return Math.min(userPoints, Math.max(0, cartTotal - discountAmount));
  }, [redeemPoints, userPoints, cartTotal, discountAmount]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discountAmount - pointsDiscountValue) + activeDeliveryArea.price;
  }, [cartTotal, discountAmount, pointsDiscountValue, activeDeliveryArea]);

  const qrSrc = useMemo(() => {
    return "https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=" + encodeURIComponent(menuUrl);
  }, [menuUrl]);

  const fetchReportsFromSheet = async () => {
    setReportsLoading(true);
    try {
      const res = await fetch(GOOGLE_SHEET_SCRIPT_URL + "?pin=" + adminPin);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReportsData(data);
      }
    } catch (e) {
      console.error("Failed to fetch reports", e);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (adminOpen) {
      fetchReportsFromSheet();
    }
  }, [adminOpen]);

  const filteredReportsData = useMemo(() => {
    if (!reportsData || reportsData.length === 0) return [];

    const now = new Date();
    const todayStr = now.toLocaleDateString("ar-EG");

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("ar-EG");

    return reportsData.filter(row => {
      const dateStr = row["التاريخ والوقت"] || "";
      
      let passesDate = true;
      if (reportDateFilter === "today") {
        passesDate = dateStr.includes(todayStr) || dateStr.startsWith(todayStr);
      } else if (reportDateFilter === "yesterday") {
        passesDate = dateStr.includes(yesterdayStr) || dateStr.startsWith(yesterdayStr);
      }

      let passesSearch = true;
      if (reportSearchQuery.trim()) {
        const q = reportSearchQuery.trim().toLowerCase();
        const name = (row["اسم العميل"] || "").toLowerCase();
        const phone = (row["رقم الموبايل"] || "").toLowerCase();
        const area = (row["المنطقة / القرية"] || "").toLowerCase();
        const itemsText = (row["تفاصيل الطلبات"] || "").toLowerCase();
        passesSearch = name.includes(q) || phone.includes(q) || area.includes(q) || itemsText.includes(q);
      }

      return passesDate && passesSearch;
    });
  }, [reportsData, reportDateFilter, reportSearchQuery]);

  // حساب الحسبات والمؤشرات الديناميكية الشغالة 100% v5.1
  const reportsAnalytics = useMemo(() => {
    if (!reportsData || reportsData.length === 0) {
      return {
        totalOrders: 0, totalSales: 0, totalDelivery: 0, netTotal: 0,
        cashSales: 0, electronicSales: 0, growthSalesPercent: 0, growthOrdersPercent: 0,
        topArea: "لا يوجد", goldenCustomer: null, allCustomersList: [], topItems: [], peakHours: [],
        sevenDaysChartData: []
      };
    }

    const now = new Date();
    const todayStr = now.toLocaleDateString("ar-EG");
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("ar-EG");

    let totalSales = 0;
    let totalDelivery = 0;
    let netTotal = 0;
    let cashSales = 0;
    let electronicSales = 0;

    let todayNetTotal = 0;
    let todayOrdersCount = 0;
    let yesterdayNetTotal = 0;
    let yesterdayOrdersCount = 0;

    const areasMap = {};
    const customersMap = {};
    const itemsMap = {};
    const hoursMap = {};
    const daysMap = {};

    // تجهيز مفاتيح آخر 7 أيام للرسم البياني الحي
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toLocaleDateString("ar-EG", { month: "short", day: "numeric" });
      daysMap[dStr] = 0;
    }

    filteredReportsData.forEach(row => {
      const cartVal = Number(row["حساب الأكل الأصلي"]) || 0;
      const delVal = Number(row["مصاريف التوصيل"]) || 0;
      const finalVal = Number(row["الإجمالي النهائي"]) || 0;
      const area = row["المنطقة / القرية"] || "غير محدد";
      const pay = row["طريقة الدفع"] || "";
      const custName = row["اسم العميل"] || "عميل بدون اسم";
      const custPhone = row["رقم الموبايل"] || "";
      const itemsText = row["تفاصيل الطلبات"] || "";
      const timestamp = row["التاريخ والوقت"] || "";

      totalSales += cartVal;
      totalDelivery += delVal;
      netTotal += finalVal;

      if (pay.includes("إلكتروني")) electronicSales += finalVal;
      else cashSales += finalVal;

      if (!areasMap[area]) areasMap[area] = { count: 0, deliveryFees: 0 };
      areasMap[area].count += 1;

      const custKey = custPhone ? custPhone.trim() : custName.trim();
      if (!customersMap[custKey]) {
        customersMap[custKey] = { name: custName, phone: custPhone, count: 0, spent: 0, lastArea: area };
      }
      customersMap[custKey].count += 1;
      customersMap[custKey].spent += finalVal;

      if (itemsText) {
        const parts = itemsText.split("|");
        parts.forEach(part => {
          const trimmed = part.trim();
          if (trimmed) {
            const match = trimmed.match(/(.+) x(\d+)/);
            if (match) {
              const itemName = match[1].trim();
              const qty = Number(match[2]) || 1;
              itemsMap[itemName] = (itemsMap[itemName] || 0) + qty;
            } else {
              itemsMap[trimmed] = (itemsMap[trimmed] || 0) + 1;
            }
          }
        });
      }

      if (timestamp) {
        const timeMatch = timestamp.match(/(\d{1,2}):\d{2}:\d{2}\s*(م|ص|AM|PM)?/i);
        if (timeMatch) {
          let hour = Number(timeMatch[1]);
          const period = timeMatch[2] ? timeMatch[2].toUpperCase() : "";
          if ((period === "م" || period === "PM") && hour < 12) hour += 12;
          if ((period === "ص" || period === "AM") && hour === 12) hour = 0;
          const hourLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} م` : `${hour === 0 ? 12 : hour} ص`;
          hoursMap[hourLabel] = (hoursMap[hourLabel] || 0) + 1;
        }
      }
    });

    // حساب نسب المقارنة التلقائية والنمو بين اليوم وأمس من كل الداتا
    reportsData.forEach(row => {
      const dateStr = row["التاريخ والوقت"] || "";
      const finalVal = Number(row["الإجمالي النهائي"]) || 0;

      if (dateStr.includes(todayStr) || dateStr.startsWith(todayStr)) {
        todayNetTotal += finalVal;
        todayOrdersCount++;
      } else if (dateStr.includes(yesterdayStr) || dateStr.startsWith(yesterdayStr)) {
        yesterdayNetTotal += finalVal;
        yesterdayOrdersCount++;
      }

      // تجميع رسم بياني لآخر 7 أيام حقيقي
      Object.keys(daysMap).forEach(dayKey => {
        if (dateStr.includes(dayKey)) {
          daysMap[dayKey] += finalVal;
        }
      });
    });

    // حساب نسبة النمو الحقيقية %
    const growthSalesPercent = yesterdayNetTotal > 0 ? Math.round(((todayNetTotal - yesterdayNetTotal) / yesterdayNetTotal) * 100) : (todayNetTotal > 0 ? 100 : 0);
    const growthOrdersPercent = yesterdayOrdersCount > 0 ? Math.round(((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100) : (todayOrdersCount > 0 ? 100 : 0);

    let topArea = "غير محدد";
    let maxCount = 0;
    Object.entries(areasMap).forEach(([a, data]) => {
      if (data.count > maxCount) {
        maxCount = data.count;
        topArea = a;
      }
    });

    const sortedCustomers = Object.values(customersMap).sort((a, b) => b.spent - a.spent);
    const goldenCustomer = sortedCustomers.length > 0 ? sortedCustomers[0] : null;

    const topItems = Object.entries(itemsMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    const peakHours = Object.entries(hoursMap)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    const maxChartVal = Math.max(...Object.values(daysMap), 1);
    const sevenDaysChartData = Object.entries(daysMap).map(([day, val]) => ({
      day,
      val,
      heightPercent: Math.max(10, Math.round((val / maxChartVal) * 100))
    }));

    return {
      totalOrders: filteredReportsData.length,
      totalSales,
      totalDelivery,
      netTotal,
      cashSales,
      electronicSales,
      growthSalesPercent,
      growthOrdersPercent,
      topArea: topArea + " (" + maxCount + " أوردر)",
      goldenCustomer,
      allCustomersList: sortedCustomers,
      topItems,
      peakHours,
      sevenDaysChartData
    };
  }, [filteredReportsData, reportsData]);

  const exportToCSV = () => {
    if (!filteredReportsData || filteredReportsData.length === 0) return;
    const headers = ["التاريخ والوقت", "اسم العميل", "رقم الموبايل", "المنطقة / القرية", "العنوان", "طريقة الدفع", "تفاصيل الطلبات", "الإجمالي النهائي"];
    const rows = filteredReportsData.map(r => [
      `"${r["التاريخ والوقت"] || ""}"`,
      `"${r["اسم العميل"] || ""}"`,
      `"${r["رقم الموبايل"] || ""}"`,
      `"${r["المنطقة / القرية"] || ""}"`,
      `"${r["العنوان بالتفصيل"] || ""}"`,
      `"${r["طريقة الدفع"] || ""}"`,
      `"${r["تفاصيل الطلبات"] || ""}"`,
      `"${r["الإجمالي النهائي"] || 0}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `تقارير_مبيعات_دريم_كورنر_${new Date().toLocaleDateString("ar-EG")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogoClickLocal = () => {
    setLogoClicks((prev) => {
      const nextClicks = prev + 1;
      if (nextClicks >= 3) {
        setPinModalOpen(true);
        return 0;
      }
      return nextClicks;
    });
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
      if (match.used >= match.limit) {
        setAppliedDiscountPercent(0);
        setPromoError("عذراً، تم استهلاك الحد الأقصى لاستخدام هذا الكوبون!");
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
        if (typeof window !== "undefined" && window.localStorage) {
          const savedVersion = localStorage.getItem("menu-version");
          if (savedVersion !== MENU_VERSION) {
            localStorage.removeItem("dream-corner-menu");
            localStorage.setItem("menu-version", MENU_VERSION);
            setItems(DEFAULT_MENU);
            setDeliveryAreas(DEFAULT_DELIVERY_AREAS);
            setPromoCodes(DEFAULT_PROMO_CODES);
            setLoaded(true);
            return;
          }
        }

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
  const bestSellerItems = useMemo(() => items.filter(item => item.isBestSeller), [items]);

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

  const sendWhatsApp = () => {
    const currentStatus = checkRestaurantStatus();
    if (!currentStatus.isOpen) {
      setCloseNoticeOpen(true);
      return;
    }

    if (cartList.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setValidationError("برجاء كتابة الاسم، ورقم الهاتف، وعنوان التوصيل أولاً لتأكيد طلبك!");
      return;
    }
    if (selectedAreaIndex === -1) {
      setValidationError("برجاء اختيار منطقة التوصيل لحساب إجمالي الأوردر بدقة!");
      return;
    }
    setValidationError("");

    const newlyEarnedPoints = Math.floor(cartTotal / 100);
    let updatedPoints = userPoints;

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

    const itemsSummary = cartList.map((cartItem) => cartItem.label + " x" + cartItem.qty).join(" | ");
    const lines = cartList.map((cartItem) => "• " + cartItem.label + " x" + cartItem.qty + " — " + money(cartItem.price * cartItem.qty));
    
    const deliveryTimeText = scheduleType === "now" ? "⚡ توصيل فوري (الآن)" : "🕒 مجدول للموعد: " + scheduleTime;
    const paymentText = paymentMethod === "cash" ? "💵 نقدي (كاش عند الاستلام)" : "📱 دفع إلكتروني (فودافون كاش / إنستا باي)";

    try {
      fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: new Date().toLocaleString("ar-EG"),
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          area: activeDeliveryArea.name,
          address: customerAddress.trim(),
          paymentMethod: paymentText,
          schedule: deliveryTimeText,
          itemsSummary: itemsSummary,
          cartTotal: cartTotal,
          couponDiscount: discountAmount,
          pointsDiscount: pointsDiscountValue,
          deliveryPrice: activeDeliveryArea.price,
          finalTotal: finalTotal
        })
      });
    } catch (e) {
      console.error("Sheet API Send Error:", e);
    }

    let text = "طلب جديد من منيو " + restaurantName + " 🍽\n\n" + 
               "👤 اسم العميل: " + customerName + "\n" +
               "📱 تليفون العميل: " + customerPhone + "\n" +
               "💳 طريقة الدفع: " + paymentText + "\n" +
               "📅 موعد التوصيل: " + deliveryTimeText + "\n" +
               "📍 المنطقة: " + activeDeliveryArea.name + "\n" +
               "🏠 العنوان بالتفصيل: " + customerAddress + "\n";
               
    if (geoLink) {
      text += "📍 لوكيشن خريطة العميل: " + geoLink + "\n";
    }
    
    text += "\nالطلبات:\n" + lines.join("\n") + "\n\n" +
            "💵 حساب الأكل الأصلي: " + money(cartTotal) + "\n" +
            "🛵 مصاريف التوصيل: " + money(activeDeliveryArea.price) + "\n" +
            "💰 الإجمالي النهائي المطلوب: " + money(finalTotal);
                 
    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(text), "_blank");

    setUserPoints(updatedPoints);
    setCartOpen(false);
    setCart({});
    setOrderSuccess(true);
  };

  const copyText = (label, value) => {
    const ok = copyTextToClipboard(value);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  const sendZReportToWhatsApp = () => {
    const zText = "📊 تقرير تقفيل الخزنة والوردية (Z-Report) - " + restaurantName + "\n\n" +
                  "🛒 إجمالي الأوردرات: " + reportsAnalytics.totalOrders + " أوردر\n" +
                  "💵 مبيعات المأكولات: " + money(reportsAnalytics.totalSales) + "\n" +
                  "🛵 إيرادات التوصيل: " + money(reportsAnalytics.totalDelivery) + "\n" +
                  "💰 صافي الدخل الكلي: " + money(reportsAnalytics.netTotal) + "\n\n" +
                  "🏆 العميل الذهبي المفضل: " + (reportsAnalytics.goldenCustomer ? reportsAnalytics.goldenCustomer.name + " (" + money(reportsAnalytics.goldenCustomer.spent) + ")" : "لا يوجد") + "\n" +
                  "✨ التقرير مستخرج أوتوماتيكياً عبر Google Sheets!";

    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(zText), "_blank");
  };

  const getCategoryIcon = (categoryName) => {
    switch (categoryName) {
      case "الكل": return "🍽";
      case "البيتزا": return "🍕";
      case "السندوتشات": return "🍔";
      case "الأصناف الجانبية": return "🍟";
      case "المشروبات": return "🥤";
      default: return "✨";
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full transition-colors duration-500 pb-28" style={{ background: theme.bg, color: theme.text, fontFamily: "'Tajawal', sans-serif" }}>
      {/* HEADER */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b" style={{ background: theme.bg + "D9", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div onClick={handleLogoClickLocal} className="cursor-pointer active:scale-95 transition-transform shrink-0 relative">
              <img src={LOGO_SRC} alt={restaurantName + " logo"} className="w-11 h-11 rounded-full object-contain border border-amber-500/20" style={{ padding: 1 }} />
              {logoClicks > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px] font-bold animate-ping">{logoClicks}</span>}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-black truncate leading-tight" style={{ color: theme.accent }}>{restaurantName}</h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 mt-0.5 text-[10px]">
                <span className="font-bold shrink-0 transition-colors" style={{ color: status.isOpen ? "#22c55e" : "#ef4444" }}>
                  {status.text}
                </span>
                <span className="hidden sm:inline opacity-40">|</span>
                <span className="truncate opacity-75" style={{ color: theme.muted }}>{status.timeText}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isAdmin && (
              <>
                <button onClick={() => setThemePickerOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-all hover:bg-green-500/10 active:scale-95" title="تغيير المظهر"><Palette size={18} /></button>
                <button onClick={() => setQrOpen(true)} className="p-2 rounded-full border border-green-500/30 text-green-500 bg-green-500/5 transition-all hover:bg-green-500/10 active:scale-95" title="عرض QR"><QrCode size={18} /></button>
                <button onClick={() => setAdminOpen(true)} className="p-2 rounded-full border border-amber-500/50 text-amber-400 bg-amber-500/10 transition-all hover:bg-amber-500/20 active:scale-95 animate-pulse flex items-center gap-1 px-3 text-xs font-bold" title="لوحة القيادة الإدارية">
                  <LayoutGrid size={16} />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </button>
                <button onClick={() => setIsAdmin(false)} className="p-2 rounded-full border border-red-500/30 text-red-500 bg-red-500/5 transition-all hover:bg-red-500/10 active:scale-95" title="خروج"><LogOut size={16} /></button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* SOCIAL MEDIA BAR */}
      <div className="w-full flex justify-center items-center py-3 border-b sticky top-[77px] z-20 backdrop-blur-md" style={{ background: theme.bg + "D9", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex items-center gap-4 px-4 py-1.5 rounded-full shadow-inner border" style={{ background: theme.surface2, borderColor: "rgba(255,255,255,0.08)" }}>
          <a href={"tel:" + whatsappNumber} className="inline-flex items-center justify-center p-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-md group" style={{ background: theme.accent, color: theme.bg }}>
            <Phone size={15} className="group-hover:scale-110 transition-transform" />
          </a>
          <span className="h-4 w-[1px]" style={{ background: "rgba(255,255,255,0.1)" }} />
          <a href={"https://wa.me/" + whatsappNumber.replace(/[^\d+]/g, "")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba5a] transition-all duration-200 active:scale-95 shadow-md group">
            <MessageCircle size={15} className="group-hover:scale-110 transition-transform" />
          </a>
          <a href="https://www.facebook.com/share/1E3Dx3c5Yh/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center p-2.5 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] transition-all duration-200 active:scale-95 shadow-md group">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* CATEGORIES BAR */}
      <div className="sticky top-[138px] z-10 backdrop-blur-md border-b py-3 shadow-sm" style={{ background: theme.bg + "F2", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-3xl mx-auto px-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {categories.map((c) => (
            <button 
              key={c} 
              onClick={() => { setActiveCat(c); }} 
              className="whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 flex items-center gap-1.5" 
              style={activeCat === c ? { background: theme.accent, color: "#000", borderColor: theme.accent, boxShadow: `0 4px 12px ${theme.accent}40` } : { borderColor: "rgba(255,255,255,0.08)", color: theme.muted, background: theme.surface }}
            >
              <span>{getCategoryIcon(c)}</span>
              <span>{c}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن بيتزا، سندوتش، مشروب..." className="w-full px-4 py-3 pr-10 rounded-2xl text-xs border focus:outline-none transition-all shadow-sm" style={{ background: theme.surface, borderColor: "rgba(255,255,255,0.08)", color: theme.text }} />
          <Search size={15} className="absolute right-3.5 top-3.5" style={{ color: theme.muted }} />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute left-3 top-2.5 p-1 rounded-full hover:bg-black/10 transition-colors" style={{ color: theme.muted }}><X size={14} /></button>}
        </div>
      </div>

      {/* BEST SELLERS SECTION */}
      {bestSellerItems.length > 0 && activeCat === "الكل" && !searchQuery.trim() && (
        <div className="max-w-3xl mx-auto px-4 pt-6">
          <div className="flex items-center gap-1.5 mb-3.5">
            <Flame size={16} className="text-red-500 animate-pulse" />
            <h2 className="text-sm font-black tracking-wide uppercase" style={{ color: theme.accent }}>الأكثر طلباً الآن 🔥</h2>
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar" style={{ scrollbarWidth: "none" }}>
            {bestSellerItems.map((item) => (
              <div key={item.id} className="w-[170px] sm:w-[200px] shrink-0 rounded-2xl p-3 border relative flex flex-col justify-between shadow-md transition-transform duration-300 hover:scale-[1.02]" style={{ background: theme.surface, borderColor: theme.accent + "30" }}>
                <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-md text-[8px] font-black text-white bg-gradient-to-r from-red-600 to-amber-500 shadow animate-bounce flex items-center gap-0.5">
                  ✨ الأكثر طلباً
                </span>

                <div className="space-y-1 mt-1">
                  <h3 className="font-bold text-xs leading-snug line-clamp-1">{item.name}</h3>
                  <p className="text-[9px] opacity-75 line-clamp-2 leading-relaxed" style={{ color: theme.muted }}>{item.desc || "الوجبة الأكثر طلباً وشهيرة من دريم كورنر!"}</p>
                </div>

                <div className="mt-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                  {item.sizes ? (
                    <div className="space-y-1">
                      {item.sizes.slice(0, 2).map((sz) => {
                        const key = item.id + "::" + sz.label;
                        const qty = cart[key] || 0;
                        return (
                          <div key={sz.label} className="flex items-center justify-between gap-1 rounded-lg px-1.5 py-0.5 text-[9px]" style={{ background: theme.surface2 }}>
                            <span className="font-bold opacity-70 truncate">{sz.label}</span>
                            {qty > 0 ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => addToCart(key, -1)} className="w-3.5 h-3.5 rounded-full flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={8} /></button>
                                <span className="font-bold">{qty}</span>
                                <button onClick={() => addToCart(key, 1)} className="w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={8} /></button>
                              </div>
                            ) : (
                              <button onClick={() => addToCart(key, 1)} className="font-extrabold" style={{ color: theme.accent }}>{money(sz.price)} +</button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black" style={{ color: theme.accent }}>{money(item.price)}</span>
                      {cart[item.id] > 0 ? (
                        <div className="flex items-center gap-1 rounded-full px-1.5 py-0.5" style={{ background: theme.surface2 }}>
                          <button onClick={() => addToCart(item.id, -1)} className="w-4 h-4 rounded-full flex items-center justify-center border" style={{ borderColor: theme.accent }}><Minus size={8} /></button>
                          <span className="text-[10px] font-bold px-1">{cart[item.id]}</span>
                          <button onClick={() => addToCart(item.id, 1)} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={8} /></button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(item.id, 1)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={10} /></button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MENU ITEMS */}
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
                  <div key={item.id} className="rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between hover:shadow-lg shadow-sm" style={{ background: theme.surface, borderColor: "rgba(255,255,255,0.06)" }}>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-sm leading-snug line-clamp-2">{item.name}</h3>
                      {item.desc && <p className="text-[10px] opacity-75 line-clamp-3 leading-relaxed" style={{ color: theme.muted }}>{item.desc}</p>}
                    </div>

                    <div className="mt-4 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
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
                                    <button onClick={() => addToCart(key, 1)} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={9} /></button>
                                  </div>
                                ) : (
                                  <button onClick={() => addToCart(key, 1)} className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={9} /></button>
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
                              <button onClick={() => addToCart(item.id, 1)} className="w-5.5 h-5.5 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={10} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item.id, 1)} className="w-6.5 h-6.5 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ background: theme.accent, color: "#000" }}><Plus size={13} /></button>
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
      </main>

      {/* FOOTER INFO STRIP */}
      <div className="fixed bottom-0 inset-x-0 z-20 border-t px-4 py-3.5 flex items-center justify-center gap-4 text-xs font-semibold shadow-inner" style={{ background: theme.bg + "F2", borderColor: "rgba(255,255,255,0.08)", color: theme.muted, backdropFilter: "blur(8px)" }}>
        <a href="https://fb.com/mr.3abkarino" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold tracking-wide shrink-0 cursor-pointer hover:underline" style={{ color: theme.accent }}>
          Mr3abkarino© <span className="text-red-500 text-sm animate-pulse">❤️</span>
        </a>
        <span className="opacity-40 shrink-0">|</span>
        <span className="flex items-center gap-1 truncate min-w-0">
          <MapPin size={13} className="shrink-0" /> 
          <span className="truncate opacity-90">{address}</span>
        </span>
      </div>

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <button onClick={() => setCartOpen(true)} className="fixed bottom-14 left-1/2 -translate-x-1/2 z-35 flex items-center justify-between gap-6 px-6 py-3.5 rounded-full shadow-2xl font-bold text-sm active:scale-95 transition-all" style={{ background: theme.accent, color: "#000", width: "90%", maxWidth: "450px" }}>
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

      {/* CART DRAWER */}
      {cartOpen && (
        <Overlay onClose={() => setCartOpen(false)}>
          <Sheet theme={theme} title="سلة المشتريات" onClose={() => setCartOpen(false)}>
            {cartList.length === 0 ? <p className="text-center py-8" style={{ color: theme.muted }}>العربة فارغة حالياً</p> : (
              <>
                <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                  {cartList.map((cartItem) => (
                    <div key={cartItem.key} className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{cartItem.label}</p>
                        <p className="text-xs" style={{ color: theme.muted }}>{money(cartItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => addToCart(cartItem.key, -1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: "rgba(255,255,255,0.2)" }}><Minus size={14} /></button>
                        <span className="w-4 text-center font-bold text-sm">{cartItem.qty}</span>
                        <button onClick={() => addToCart(cartItem.key, 1)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: theme.accent, color: "#000" }}><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-2 mt-2 border-t text-xs" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <div className="flex items-center justify-between opacity-80">
                    <span>حساب المأكولات:</span>
                    <span>{money(cartTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between opacity-80">
                    <span>توصيل لـ ({selectedAreaIndex >= 0 ? activeDeliveryArea.name : "لم تحدد"}):</span>
                    <span>{money(activeDeliveryArea.price)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 text-sm font-black border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                    <span style={{ color: theme.muted }}>الإجمالي الإجمالي:</span>
                    <span style={{ color: theme.accent }} className="text-base">{money(finalTotal)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t space-y-2" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <p className="text-[11px] font-bold" style={{ color: theme.accent }}>بيانات التوصيل والطلب (الدليفري):</p>
                  
                  <div className="space-y-2">
                    <div className="relative">
                      <input type="text" placeholder="اكتب اسمك الكريم هنا..." value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: "rgba(255,255,255,0.1)", color: theme.text }} />
                      <User size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="relative">
                      <select 
                        value={selectedAreaIndex}
                        onChange={(e) => setSelectedAreaIndex(Number(e.target.value))}
                        className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none appearance-none" 
                        style={{ background: theme.surface2, borderColor: "rgba(255,255,255,0.1)", color: theme.text }}
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

                    <div className="relative">
                      <input type="tel" placeholder="رقم تليفونك لتأكيد الطلب..." value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: "rgba(255,255,255,0.1)", color: theme.text }} />
                      <Phone size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                    </div>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input type="text" placeholder="العنوان بالتفصيل (البيت, الشارع)..." value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full px-3 py-2.5 pr-9 rounded-xl text-xs border focus:outline-none" style={{ background: theme.surface2, borderColor: "rgba(255,255,255,0.1)", color: theme.text }} />
                        <MapPin size={14} className="absolute right-3 top-3.5 opacity-60" style={{ color: theme.text }} />
                      </div>
                      <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl border font-bold text-xs flex items-center justify-center bg-black/10 transition-transform active:scale-95 shrink-0" style={{ borderColor: theme.accent, color: theme.accent }}>
                        {geoLoading ? "..." : <Navigation size={14} className="animate-pulse" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button onClick={sendWhatsApp} className="w-full mt-4 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg hover:opacity-90 text-sm" style={{ background: "#25D366", color: "#fff" }}><MessageCircle size={18} />تأكيد وإرسال عبر واتساب</button>
              </>
            )}
          </Sheet>
        </Overlay>
      )}

      {/* ENTERPRISE ADMIN DASHBOARD MODAL v5.1 DYNAMIC */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-6xl max-h-[96vh] rounded-3xl border border-amber-500/20 shadow-2xl flex flex-col overflow-hidden" style={{ background: "#0C0E14", color: "#F3E9D8" }}>
            
            {/* DASHBOARD HEADER */}
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#141721]">
              <div className="flex items-center gap-3">
                <img src={LOGO_SRC} alt="Dream Corner" className="w-9 h-9 rounded-xl border border-amber-500/30 p-0.5 object-contain" />
                <div>
                  <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5">
                    <span>الرئيسية | لوحة تحكم دريم كورنر</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Dynamic v5.1</span>
                  </h2>
                  <p className="text-[10px] text-gray-400">مرحباً بك في لوحة التحكّم والذكاء المالي 👋</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={fetchReportsFromSheet} className="px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-400 bg-amber-500/10 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 active:scale-95 transition-all">
                  <RefreshCw size={13} className={reportsLoading ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">تحديث البيانات</span>
                </button>
                <button onClick={() => setAdminOpen(false)} className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* DASHBOARD BODY (SIDEBAR + MAIN CONTENT) */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* SIDEBAR NAVIGATION */}
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-l border-white/10 p-3 bg-[#10121A] flex md:flex-col gap-1 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
                <button onClick={() => setAdminTab("dashboard")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "dashboard" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  <Home size={16} /> <span>الرئيسية والتقارير</span>
                </button>
                <button onClick={() => setAdminTab("items")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "items" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  <Utensils size={16} /> <span>المنيو والأسعار</span>
                </button>
                <button onClick={() => setAdminTab("customers")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "customers" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  <Users size={16} /> <span>العملاء والمكافآت</span>
                </button>
                <button onClick={() => setAdminTab("delivery")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "delivery" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  <Bike size={16} /> <span>مناطق الدليفري</span>
                </button>
                <button onClick={() => setAdminTab("settings")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "settings" ? "bg-amber-500 text-black shadow-md" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
                  <Settings size={16} /> <span>إعدادات المطعم</span>
                </button>

                <div className="mt-auto pt-4 hidden md:block border-t border-white/10 space-y-2">
                  <button onClick={sendZReportToWhatsApp} className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-600/30 transition-colors">
                    <Share2 size={13} /> <span>تصدير Z-Report</span>
                  </button>
                  <button onClick={exportToCSV} className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-colors">
                    <Download size={13} /> <span>تحميل Excel</span>
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#0C0E14]">
                
                {/* 1. TAB: ENTERPRISE DASHBOARD */}
                {adminTab === "dashboard" && (
                  <div className="space-y-5">
                    
                    {/* Top Filters Strip */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141721] p-3 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-1 bg-[#1C202E] p-1 rounded-xl w-full sm:w-auto text-xs font-bold">
                        <button onClick={() => setReportDateFilter("today")} className={`flex-1 sm:px-4 py-1.5 rounded-lg transition-all ${reportDateFilter === "today" ? "bg-amber-500 text-black" : "text-gray-400"}`}>اليوم</button>
                        <button onClick={() => setReportDateFilter("yesterday")} className={`flex-1 sm:px-4 py-1.5 rounded-lg transition-all ${reportDateFilter === "yesterday" ? "bg-amber-500 text-black" : "text-gray-400"}`}>أمس</button>
                        <button onClick={() => setReportDateFilter("all")} className={`flex-1 sm:px-4 py-1.5 rounded-lg transition-all ${reportDateFilter === "all" ? "bg-amber-500 text-black" : "text-gray-400"}`}>الكل</button>
                      </div>

                      <div className="relative w-full sm:w-64">
                        <input type="text" placeholder="بحث باسم العميل، الموبايل..." value={reportSearchQuery} onChange={(e) => setReportSearchQuery(e.target.value)} className="w-full px-3 py-1.5 pr-8 rounded-xl text-xs bg-[#1C202E] border border-white/10 text-white focus:outline-none" />
                        <Search size={13} className="absolute right-2.5 top-2.5 text-gray-400" />
                      </div>
                    </div>

                    {/* TOP KPI CARDS GRID WITH REAL CALCULATED GROWTH % */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Card 1: Total Sales */}
                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-amber-500/20 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs">
                          <span>إجمالي المبيعات</span>
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><DollarSign size={14} /></span>
                        </div>
                        <div className="my-2">
                          <span className="text-xl font-black text-amber-400">{money(reportsAnalytics.netTotal)}</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${reportsAnalytics.growthSalesPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {reportsAnalytics.growthSalesPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          <span>{reportsAnalytics.growthSalesPercent >= 0 ? `+${reportsAnalytics.growthSalesPercent}% عن أمس` : `${reportsAnalytics.growthSalesPercent}% عن أمس`}</span>
                        </div>
                      </div>

                      {/* Card 2: Food Sales */}
                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs">
                          <span>صافي المأكولات</span>
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Utensils size={14} /></span>
                        </div>
                        <div className="my-2">
                          <span className="text-xl font-black text-white">{money(reportsAnalytics.totalSales)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 size={12} />
                          <span>محسوب حقيقي من الشيت</span>
                        </div>
                      </div>

                      {/* Card 3: Total Orders */}
                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs">
                          <span>عدد الطلبات</span>
                          <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><ShoppingCart size={14} /></span>
                        </div>
                        <div className="my-2">
                          <span className="text-xl font-black text-white">{reportsAnalytics.totalOrders} <span className="text-xs font-normal text-gray-400">أوردر</span></span>
                        </div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${reportsAnalytics.growthOrdersPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {reportsAnalytics.growthOrdersPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          <span>{reportsAnalytics.growthOrdersPercent >= 0 ? `+${reportsAnalytics.growthOrdersPercent}% عن أمس` : `${reportsAnalytics.growthOrdersPercent}% عن أمس`}</span>
                        </div>
                      </div>

                      {/* Card 4: Delivery Fees */}
                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 relative overflow-hidden flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs">
                          <span>إيرادات الدليفري</span>
                          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><Bike size={14} /></span>
                        </div>
                        <div className="my-2">
                          <span className="text-xl font-black text-white">{money(reportsAnalytics.totalDelivery)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                          <CheckCircle2 size={12} />
                          <span>محسوب حقيقي من الشيت</span>
                        </div>
                      </div>
                    </div>

                    {/* MIDDLE GRID: REAL 7-DAY DYNAMIC CHART + TOP SELLING ITEMS */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      
                      {/* REAL DYNAMIC 7-DAY CHART */}
                      <div className="lg:col-span-2 p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                            <TrendingUp size={15} className="text-amber-400" />
                            <span>المبيعات الفعلية خلال آخر 7 أيام (ديناميكي حي)</span>
                          </h3>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">100% Real Sheet Data</span>
                        </div>

                        {/* Real Dynamic Visual Graph Bars */}
                        <div className="h-44 w-full pt-4 flex items-end justify-between gap-2 px-2 relative border-b border-white/10 pb-2">
                          {reportsAnalytics.sevenDaysChartData.map((pt, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 z-10 group h-full justify-end">
                              <span className="text-[8px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">{money(pt.val)}</span>
                              <div className="w-full bg-gradient-to-t from-amber-500/30 to-amber-400 group-hover:to-amber-300 transition-all rounded-t-lg relative" style={{ height: `${pt.heightPercent}%` }}>
                                <div className="w-2 h-2 rounded-full bg-amber-400 mx-auto -mt-1 shadow-md shadow-amber-500/50" />
                              </div>
                              <span className="text-[9px] text-gray-400 truncate mt-1">{pt.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top Selling Items Box */}
                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                          <Utensils size={15} className="text-amber-400" />
                          <span>أفضل الأصناف مبيعاً 🔥</span>
                        </h3>

                        <div className="space-y-2.5">
                          {reportsAnalytics.topItems.length > 0 ? reportsAnalytics.topItems.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-gray-200">{item.name}</span>
                                <span className="text-amber-400">{item.qty} وجبات</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full" style={{ width: `${Math.min(100, item.qty * 15)}%` }} />
                              </div>
                            </div>
                          )) : (
                            <p className="text-xs text-center py-8 text-gray-500">سيتم ترتيب الوجبات فور تسجيل طلبات حقيقية.</p>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* LOWER GRID: PAYMENT METHODS + PEAK HOURS HEATMAP + VIP CUSTOMER */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Payment Methods */}
                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                          <PieChart size={15} className="text-sky-400" />
                          <span>توزيع طرق الدفع</span>
                        </h3>
                        
                        <div className="flex items-center justify-around py-2">
                          <div className="relative w-20 h-20 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-8 border-amber-500 border-t-green-500" />
                            <span className="absolute text-[10px] font-bold text-amber-400">حقيقي</span>
                          </div>
                          <div className="text-xs space-y-2 font-bold">
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 💵 كاش: {money(reportsAnalytics.cashSales)}</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> 📱 إلكتروني: {money(reportsAnalytics.electronicSales)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Peak Hours Heatmap */}
                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                          <Clock size={15} className="text-purple-400" />
                          <span>ساعات الذروة والضغط</span>
                        </h3>

                        <div className="grid grid-cols-2 gap-2">
                          {reportsAnalytics.peakHours.length > 0 ? reportsAnalytics.peakHours.map((h, i) => (
                            <div key={i} className="p-2 rounded-xl bg-[#1C202E] border border-white/5 text-center">
                              <span className="text-[10px] text-gray-400 block">الفترة #{i+1}</span>
                              <span className="text-xs font-bold text-purple-300">{h.hour}</span>
                              <span className="block text-[9px] text-emerald-400 font-bold mt-0.5">{h.count} أوردر</span>
                            </div>
                          )) : (
                            <p className="text-xs text-center col-span-2 py-4 text-gray-500">جاري تحليل ساعات ورود الطلبات...</p>
                          )}
                        </div>
                      </div>

                      {/* Golden VIP Customer */}
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#141721] to-[#141721] border border-amber-500/30 space-y-2 relative overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                            <Trophy size={16} className="animate-bounce" />
                            <span>العميل الذهبي المفضل 👑</span>
                          </h3>
                          <span className="text-[8px] px-2 py-0.5 rounded bg-amber-400 text-black font-black">VIP #1</span>
                        </div>

                        {reportsAnalytics.goldenCustomer ? (
                          <div className="pt-2 space-y-1">
                            <p className="text-sm font-black text-white">{reportsAnalytics.goldenCustomer.name}</p>
                            <p className="text-[10px] text-gray-400">📱 {reportsAnalytics.goldenCustomer.phone}</p>
                            <div className="flex justify-between pt-2 text-xs border-t border-white/10">
                              <span className="text-gray-400">إجمالي المشتريات:</span>
                              <span className="font-bold text-emerald-400">{money(reportsAnalytics.goldenCustomer.spent)}</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-center py-6 text-gray-500">سيتم تحديد العميل الذهبي تلقائياً عند طلب الأوردرات.</p>
                        )}
                      </div>

                    </div>

                    {/* LIVE RECENT ORDERS TABLE */}
                    <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                          <ShoppingCart size={15} className="text-amber-400" />
                          <span>سجل وتفاصيل الطلبات الأخيرة ({filteredReportsData.length})</span>
                        </h3>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {filteredReportsData.length > 0 ? filteredReportsData.slice().reverse().map((row, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-[#1C202E] border border-white/5 text-xs flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:border-amber-500/30 transition-colors">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">{row["اسم العميل"] || "عميل بدون اسم"}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">{row["رقم الموبايل"]}</span>
                              </div>
                              <p className="text-[10px] text-gray-400">📍 {row["المنطقة / القرية"]} · 🕒 {row["التاريخ والوقت"]}</p>
                            </div>
                            <div className="text-left space-y-0.5">
                              <span className="text-sm font-black text-amber-400 block">{money(row["الإجمالي النهائي"])}</span>
                              <span className="text-[9px] text-gray-400 truncate block max-w-xs">{row["تفاصيل الطلبات"]}</span>
                            </div>
                          </div>
                        )) : (
                          <p className="text-xs text-center py-8 text-gray-500">لا توجد طلبات مسجلة طابق بحثك حالياً.</p>
                        )}
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. TAB: ITEMS EDITING */}
                {adminTab === "items" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-bold text-sm text-amber-400">إدارة أصناف المنيو والأسعار</p>
                      <button onClick={addNewItem} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 text-black shadow-md"><PlusCircle size={14} /> إضافة صنف جديد</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((item) => (
                        <div key={item.id} className="p-3 rounded-2xl border border-white/5 bg-[#141721]">
                          {editingId === item.id ? (
                            <div className="space-y-2">
                              <input value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-sm font-bold text-white" />
                              <input value={item.desc || ""} onChange={(e) => updateItem(item.id, { desc: e.target.value })} className="w-full px-2.5 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-gray-300" />
                              <div className="grid grid-cols-2 gap-2">
                                <input value={item.cat} onChange={(e) => updateItem(item.id, { cat: e.target.value })} className="px-2 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-white" />
                                <input value={item.subcat || ""} onChange={(e) => updateItem(item.id, { subcat: e.target.value })} className="px-2 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-white" />
                              </div>
                              {item.sizes ? (
                                <div className="space-y-1.5">
                                  {item.sizes.map((sz, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                      <input value={sz.label} onChange={(e) => updateSize(item.id, idx, { label: e.target.value })} className="w-20 px-2 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-center text-white" />
                                      <input type="number" value={sz.price} onChange={(e) => updateSize(item.id, idx, { price: Number(e.target.value) })} className="flex-1 px-2 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-white" />
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <input type="number" value={item.price} onChange={(e) => updateItem(item.id, { price: Number(e.target.value) })} className="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-[#1C202E] text-xs text-white" />
                              )}
                              <button onClick={() => setEditingId(null)} className="w-full py-2 rounded-lg font-bold text-xs bg-amber-500 text-black flex items-center justify-center gap-1 shadow"><Save size={13} /> حفظ التعديل</button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-white truncate">{item.name}</p>
                                <p className="text-xs text-gray-400">{item.cat}{item.subcat ? " · " + item.subcat : ""} · {item.sizes ? item.sizes.map((s) => s.label + ":" + money(s.price)).join(" / ") : money(item.price)}</p>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button onClick={() => setEditingId(item.id)} className="p-2 rounded-full border border-white/10 text-gray-300 hover:text-white"><Pencil size={13} /></button>
                                <button onClick={() => deleteItem(item.id)} className="p-2 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10"><Trash2 size={13} /></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. TAB: CUSTOMERS & LIFETIME VALUE */}
                {adminTab === "customers" && (
                  <div className="space-y-3">
                    <p className="font-bold text-sm text-amber-400 mb-2">سجل وقائمة حسابات جميع العملاء التراكمية</p>
                    <div className="space-y-2">
                      {reportsAnalytics.allCustomersList.length > 0 ? reportsAnalytics.allCustomersList.map((cust, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-[#141721] border border-white/5 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">{idx + 1}</span>
                            <div>
                              <p className="font-bold text-white text-sm">{cust.name}</p>
                              <p className="text-[10px] text-gray-400">📱 {cust.phone} · 📍 آخر منطقة: {cust.lastArea}</p>
                            </div>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-black text-emerald-400 block">{money(cust.spent)}</span>
                            <span className="text-[10px] text-gray-400">{cust.count} أوردرات إجمالية</span>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-center py-8 text-gray-500">لا يوجد حسابات مسجلة للعملاء حتى الآن.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. TAB: DELIVERY AREAS */}
                {adminTab === "delivery" && (
                  <div className="space-y-4">
                    <p className="font-bold text-sm text-amber-400 mb-2">إدارة مناطق وقرى التوصيل والدليفري</p>
                    
                    <div className="bg-[#141721] p-3.5 rounded-2xl border border-white/10 space-y-2">
                      <p className="text-xs font-bold text-gray-300">إضافة منطقة جديدة:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="اسم القرية" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="px-3 py-2 rounded-xl border border-white/10 bg-[#1C202E] text-xs text-white" />
                        <input type="number" placeholder="سعر التوصيل" value={newAreaPrice} onChange={(e) => setNewAreaPrice(e.target.value)} className="px-3 py-2 rounded-xl border border-white/10 bg-[#1C202E] text-xs text-white" />
                      </div>
                      <button onClick={handleAddDeliveryArea} className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-md"><PlusCircle size={14}/>إضافة المنطقة</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {deliveryAreas.map((area, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#141721] border border-white/5">
                          <span className="font-bold text-white">{area.name} · <span className="text-amber-400">{money(area.price)}</span></span>
                          <button onClick={() => handleRemoveDeliveryArea(idx)} className="p-1.5 rounded-full text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10"><Trash2 size={13}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. TAB: SETTINGS */}
                {adminTab === "settings" && (
                  <div className="space-y-4 max-w-xl mx-auto">
                    <p className="font-bold text-sm text-amber-400 mb-2">إعدادات الهوية والأمان للمطعم</p>
                    <Field label="اسم المطعم" value={restaurantName} onChange={setRestaurantName} theme={theme} />
                    <Field label="العنوان الجغرافي" value={address} onChange={setAddress} theme={theme} />
                    <Field label="رقم واتساب الاستقبال" value={whatsappNumber} onChange={setWhatsappNumber} theme={theme} dir="ltr" />
                    <Field label="رقم فودافون كاش" value={vodafoneCash} onChange={setVodafoneCash} theme={theme} dir="ltr" />
                    <Field label="حساب InstaPay" value={instapay} onChange={setInstapay} theme={theme} dir="ltr" />
                    <Field label="رمز الأمان PIN" value={adminPin} onChange={setAdminPin} theme={theme} dir="ltr" />

                    <div className="pt-4 border-t border-white/10">
                      <button onClick={() => setShowResetConfirm(true)} className="w-full py-2.5 rounded-xl text-xs font-bold border border-red-500/30 text-red-400 flex items-center justify-center gap-1.5 hover:bg-red-500/10"><RotateCcw size={14} /> إعادة تعيين منيو دريم كورنر الافتراضي</button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODALS */}
      {orderSuccess && (
        <Overlay onClose={() => setOrderSuccess(false)}>
          <Sheet theme={theme} title="تم إرسال طلبك بنجاح! 🎉" onClose={() => setOrderSuccess(false)}>
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">✓</div>
              <p className="text-sm font-bold leading-relaxed">
                تم تجهيز الأوردر وتصفير السلة بنجاح. <br/>
                جاري الآن تحويلك إلى تطبيق واتساب لإرسال الفاتورة وتأكيد التوصيل مع مطعم دريم كورنر!
              </p>
              <button onClick={() => setOrderSuccess(false)} className="px-6 py-2 rounded-xl text-xs font-bold" style={{ background: theme.accent, color: "#000" }}>فهمت، شكراً لك</button>
            </div>
          </Sheet>
        </Overlay>
      )}

      {closeNoticeOpen && (
        <Overlay onClose={() => setCloseNoticeOpen(false)}>
          <Sheet theme={theme} title="نورتنا يا غالي.. 👨‍🍳" onClose={() => setCloseNoticeOpen(false)}>
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto text-3xl animate-pulse">
                🍕
              </div>
              <div className="space-y-2 px-2">
                <h3 className="text-base font-black text-white">يا غالي، الأفران ريحت شوية..</h3>
                <p className="text-xs opacity-90 leading-relaxed max-w-xs mx-auto" style={{ color: theme.muted }}>
                  بنجهزلك حاجة فريش وطعم يفرّق بكرة! المنيو معاك لفّ فيه براحتك واختار كل اللي تحبه من دلوقتي، وأول ما نفتح هنكون جاهزين نولّع الدنيا! 🔥🚀
                </p>
              </div>
              <div className="p-3.5 rounded-2xl border text-center space-y-1" style={{ background: theme.surface2, borderColor: theme.accent + "20" }}>
                <p className="text-[10px] font-bold opacity-70" style={{ color: theme.muted }}>مواعيد استقبال الدليفري والطلبات:</p>
                <p className="text-sm font-black" style={{ color: theme.accent }}>{status.timeText}</p>
              </div>
              <button onClick={() => setCloseNoticeOpen(false)} className="w-full py-3 rounded-xl text-xs font-black shadow-md" style={{ background: theme.accent, color: "#000" }}>
                حبيبي، هتختار الأكل من دلوقتي واستعد لوقت الفتح! ✨
              </button>
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
                <input value={menuUrl} onChange={(e) => setMenuUrl(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg border bg-transparent text-sm font-semibold text-center" style={{ borderColor: "rgba(255,255,255,0.2)" }} dir="ltr" />
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
                <button key={t.id} onClick={() => { setTheme(t); setThemePickerOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl border text-right transition-colors hover:bg-black/5" style={{ borderColor: "rgba(255,255,255,0.1)", background: t.bg }}>
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
                <input type="password" maxLength={12} value={enteredPin} onChange={(e) => setEnteredPin(e.target.value)} placeholder="••••" className="w-full px-3 py-2.5 rounded-lg border bg-transparent text-center text-lg tracking-widest font-bold focus:outline-none" style={{ borderColor: "rgba(255,255,255,0.2)", color: theme.text }} required />
              </label>
              {pinError && <p className="text-xs text-center font-bold text-red-500 bg-red-500/10 py-1.5 rounded-lg">{pinError}</p>}
              <div className="flex gap-2"><button type="submit" className="flex-1 py-2 rounded-xl font-bold text-xs" style={{ background: theme.accent, color: "#000" }}>دخول الإدارة</button><button type="button" onClick={() => setPinModalOpen(false)} className="px-4 py-2 border rounded-xl text-xs font-bold" style={{ borderColor: "rgba(255,255,255,0.2)" }}>إلغاء</button></div>
            </form>
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
                <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 border rounded-lg text-xs font-bold" style={{ borderColor: "rgba(255,255,255,0.2)" }}>إلغاء</button>
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
    <div className="relative z-50 w-full md:max-w-md max-h-[88vh] rounded-t-3xl md:rounded-3xl p-5 overflow-y-auto" style={{ background: theme.bg, color: theme.text, border: "1px solid rgba(255,255,255,0.1)" }} dir="rtl">
      <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <h2 className="text-lg font-black" style={{ color: theme.accent }}>{title}</h2>
        <button onClick={onClose} className="p-1.5 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.2)" }}><X size={15} /></button>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, theme, dir = "rtl", hint }) {
  return (
    <label className="block text-sm space-y-1">
      <span className="font-bold opacity-90" style={{ color: theme.muted }}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2 rounded-lg border bg-transparent text-white" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
      {hint && <span className="block mt-1 text-xs opacity-70" style={{ color: theme.muted }}>{hint}</span>}
    </label>
  );
}
