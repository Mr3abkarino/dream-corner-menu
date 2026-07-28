import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart, Plus, Minus, X, Trash2, Check, Copy,
  Settings, Phone, CreditCard, Search, PlusCircle, MessageCircle,
  MapPin, KeyRound, Share2, TrendingUp, Download, PieChart,
  Crown, Clock, Bike, Utensils, Trophy, Users, Home, ChevronLeft,
  Star, Percent, ShieldCheck, Headphones, ArrowUpRight, ArrowDownRight,
  LayoutGrid, CheckCircle2, RefreshCw, DollarSign, Wallet, BarChart3
} from "lucide-react";

import restaurantLogo from "./assets/logo.png";

const LOGO_SRC = restaurantLogo;
const MENU_VERSION = "34.0";
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxoJBFVMk_jbmuLC5w59zQko5tYn9NvoZ9iWWPnLyyBMf4u-J6OfArH6JhIU8UK95o/exec";
const ADMIN_SECRET_KEY = "Adam";

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
  { code: "OFF10", discount: 10, limit: 0, used: 0 },
  { code: "DREAM", discount: 15, limit: 0, used: 0 }
];

const COMING_SOON_OFFERS = [
  { id: "off1", title: "انتظروا قريباً ⏳", desc: "أقوى العروض الحصرية قادمة لكم", tag: "عرض خاص", bg: "from-amber-900/60 to-red-950/80" },
  { id: "off2", title: "انتظروا قريباً ⏳", desc: "خصومات وكوبونات مميزة على جميع الطلبات", tag: "كوبون خصم", bg: "from-amber-800/60 to-amber-950/80" },
  { id: "off3", title: "انتظروا قريباً ⏳", desc: "مفاجآت وهدايا دريم كورنر الخاصة", tag: "هدية دريم", bg: "from-emerald-900/60 to-teal-950/80" }
];

const DEFAULT_MENU = [
  { id: "p1", cat: "البيتزا", name: "بيتزا مارجريتا", desc: "صلصة طماطم غنية - موزاريللا صافية - ريحان", sizes: [{ label: "كبير", price: 90 }, { label: "وسط", price: 70 }, { label: "صغير", price: 45 }] },
  { id: "p2", cat: "البيتزا", name: "بيتزا ميكس جبنة", desc: "تشكيلة أجبان فاخرة غرقانة موزاريللا وشيدر ورومي", isBestSeller: true, rank: 1, sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p3", cat: "البيتزا", name: "بيتزا خضروات", desc: "فلفل - بصل - زيتون - طماطم - مشروم فريش", sizes: [{ label: "كبير", price: 120 }, { label: "وسط", price: 90 }, { label: "صغير", price: 60 }] },
  { id: "p4", cat: "البيتزا", name: "بيتزا باربيكيو", desc: "قطع فراخ متبلة مع صلصة الباربيكيو والجبنة الموتزريلا", sizes: [{ label: "كبير", price: 160 }, { label: "وسط", price: 125 }, { label: "صغير", price: 85 }] },
  { id: "p5", cat: "البيتزا", name: "بيتزا هوت دوج", desc: "قطع هوت دوج فاخرة مع الصوص الخاص", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "بيتزا سجق", desc: "سجق مشوي بلدي طازج يومياً", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p7", cat: "البيتزا", name: "بيتزا لحمة مفرومة", desc: "لحم بقر مفروم مع التوابل الشرقية", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "p8", cat: "البيتزا", name: "بيتزا بيروني", desc: "شرائح بيبيروني إيطالية شهية", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p9", cat: "البيتزا", name: "بيتزا سلامي", desc: "شرائح سلامي مدخن ممتازة", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p10", cat: "البيتزا", name: "بيتزا شاورما دجاج", desc: "قطع شاورما دجاج متبلة بالخلطة السحرية", isBestSeller: true, rank: 2, sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p11", cat: "البيتزا", name: "بيتزا دجاج رانش", desc: "قطع دجاج مع صوص الرانش المفضل للجميع", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p12", cat: "البيتزا", name: "بيتزا دريم كورنر سبيشال", desc: "خلطة البيت الخاصة المميزة والمحشوة بالكامل", isBestSeller: true, rank: 3, sizes: [{ label: "كبير", price: 170 }, { label: "وسط", price: 130 }, { label: "صغير", price: 90 }] },
  { id: "p13", cat: "البيتزا", name: "بيتزا كرانشي (حار أو بارد)", desc: "قطع دجاج مقرمشة حارة أو عادية", sizes: [{ label: "كبير", price: 130 }, { label: "وسط", price: 100 }, { label: "صغير", price: 80 }] },
  { id: "p14", cat: "البيتزا", name: "بيتزا ميكس دجاج", desc: "توليفة دجاج كرانشي ورانش وشاورما", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 105 }, { label: "صغير", price: 85 }] },
  { id: "p15", cat: "البيتزا", name: "حشو الأطراف", desc: "إضافة أطراف محشوة لأي بيتزا", sizes: [{ label: "كبير", price: 35 }, { label: "وسط", price: 30 }, { label: "صغير", price: 25 }] },
  { id: "s1", cat: "السندوتشات", subcat: "اللحوم", name: "كفتة مشوية", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s2", cat: "السندوتشات", subcat: "اللحوم", name: "سجق مشوي", sizes: [{ label: "كبير", price: 70 }, { label: "وسط", price: 60 }] },
  { id: "s3", cat: "السندوتشات", subcat: "اللحوم", name: "كبدة إسكندراني", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s4", cat: "السندوتشات", subcat: "اللحوم", name: "ميكس لحوم (سجق+كبدة)", sizes: [{ label: "كبير", price: 75 }, { label: "وسط", price: 65 }] },
  { id: "s5", cat: "السندوتشات", subcat: "اللحوم", name: "حواوشي دبل طعم", price: 45 },
  { id: "s6", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "تشكن بانية", sizes: [{ label: "كبير", price: 85 }, { label: "وسط", price: 70 }] },
  { id: "s7", cat: "السندوتشات", subcat: "ساندوتشات الدجاج", name: "زنجر سوبريم", desc: "صدور دجاج حارة مقرمشة", isBestSeller: true, rank: 4, sizes: [{ label: "كبير", price: 95 }, { label: "وسط", price: 80 }] },
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

const money = (n) => Number(n || 0).toLocaleString("en-US") + " جنيه";

const checkRestaurantStatus = () => {
  const nowInEgypt = new Date(new Date().toLocaleString("en-US", { timeZone: "Africa/Cairo" }));
  const hours = nowInEgypt.getHours();
  const minutes = nowInEgypt.getMinutes();
  const currentMinutesTotal = hours * 60 + minutes;
  const openMinutes = 13 * 60; 
  const closeMinutes = 3 * 60; 
  const isOpen = currentMinutesTotal >= openMinutes || currentMinutesTotal < closeMinutes;

  return {
    isOpen,
    text: isOpen ? "مفتوح الآن 🟢" : "مغلق حالياً 🔴",
    timeText: "يومياً من 1:00 ظهراً لـ 3:00 صباحاً"
  };
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

const playSuccessBeep = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {}
};

export default function RestaurantMenu() {
  const [restaurantName, setRestaurantName] = useState("دريم كورنر");
  const [tagline, setTagline] = useState("PIZZA & SANDWICHES — طعم يفرق .. جودة تليق بك");
  const [address, setAddress] = useState("البرامون، بجوار عيادة الدكتورة إلهام العشري");
  const [whatsappNumber, setWhatsappNumber] = useState("+201006113627");
  const [vodafoneCash, setVodafoneCash] = useState("01023590020");
  const [instapay, setInstapay] = useState("zxzwd@instapay");

  const [items, setItems] = useState(DEFAULT_MENU);
  const [activeCat, setActiveCat] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedCart = localStorage.getItem("dream-corner-saved-cart");
      if (savedCart) {
        try { return JSON.parse(savedCart); } catch (e) {}
      }
    }
    return {};
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("dashboard");
  const [copied, setCopied] = useState("");
  const [closeNoticeOpen, setCloseNoticeOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [activeVisitors, setActiveVisitors] = useState(1);
  const [restaurantStatus, setRestaurantStatus] = useState(checkRestaurantStatus());

  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedOrderResult, setTrackedOrderResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  const [googleReviewModalOpen, setGoogleReviewModalOpen] = useState(false);
  const [deliveryAreas, setDeliveryAreas] = useState(DEFAULT_DELIVERY_AREAS);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaPrice, setNewAreaPrice] = useState("");

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
  const [lastCreatedOrderId, setLastCreatedOrderId] = useState("");

  const [scheduleType, setScheduleType] = useState("now"); 
  const [scheduleTime, setScheduleTime] = useState("");

  const [isAdmin, setIsAdmin] = useState(true); // مفعل مؤقتاً للتأكد من ظهور الأدمن وتجنب أي شاشات بيضا
  const [adminPin, setAdminPin] = useState("1234");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [logoClicks, setLogoClicks] = useState(0);

  const [reportsData, setReportsData] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportDateFilter, setReportDateFilter] = useState("all");
  const [reportSearchQuery, setReportSearchQuery] = useState("");

  const findItem = (id) => items.find((i) => i.id === id);

  useEffect(() => {
    const statusTimer = setInterval(() => {
      setRestaurantStatus(checkRestaurantStatus());
    }, 10000);

    let visitorId = localStorage.getItem("dc_visitor_id");
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("dc_visitor_id", visitorId);
    }

    const sendPing = async () => {
      try {
        await fetch(GOOGLE_SHEET_SCRIPT_URL, {
          method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "ping_visitor", visitorId })
        });
        const res = await fetch(GOOGLE_SHEET_SCRIPT_URL + "?type=visitors");
        const data = await res.json();
        if (data && data.activeVisitors) setActiveVisitors(data.activeVisitors);
      } catch (e) {}
    };

    sendPing();
    const visitorTimer = setInterval(sendPing, 30000);
    fetchReportsFromSheetSilent();

    return () => {
      clearInterval(statusTimer);
      clearInterval(visitorTimer);
    };
  }, []);

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
        const price = sizeLabel ? item.sizes?.find((s) => s.label === sizeLabel)?.price ?? 0 : item.price;
        const label = sizeLabel ? item.name + " (" + sizeLabel + ")" : item.name;
        return { key, id, label, price, qty };
      })
      .filter(Boolean);
  }, [cart, items]);

  const cartCount = useMemo(() => cartList.reduce((s, i) => s + i.qty, 0), [cartList]);
  const cartTotal = useMemo(() => cartList.reduce((s, i) => s + i.qty * i.price, 0), [cartList]);

  const addToCart = (key, delta) => {
    setCart((c) => {
      const nextCart = { ...c };
      nextCart[key] = Math.max(0, (c[key] || 0) + delta);
      return nextCart;
    });
  };

  const activeDeliveryArea = useMemo(() => {
    if (selectedAreaIndex >= 0 && selectedAreaIndex < deliveryAreas.length) {
      return deliveryAreas[selectedAreaIndex];
    }
    return { name: "اختر منطقة التوصيل...", price: 0 };
  }, [selectedAreaIndex, deliveryAreas]);

  const discountAmount = useMemo(() => Math.round((cartTotal * appliedDiscountPercent) / 100), [cartTotal, appliedDiscountPercent]);
  const finalTotal = useMemo(() => Math.max(0, cartTotal - discountAmount) + activeDeliveryArea.price, [cartTotal, discountAmount, activeDeliveryArea]);

  const fetchReportsFromSheet = async () => {
    setReportsLoading(true);
    try {
      const res = await fetch(GOOGLE_SHEET_SCRIPT_URL + "?action=orders&adminKey=" + ADMIN_SECRET_KEY);
      const data = await res.json();
      let rawOrders = [];
      if (Array.isArray(data)) rawOrders = data;
      else if (data && Array.isArray(data.orders)) rawOrders = data.orders;

      const normalizedOrders = rawOrders.map(row => ({
        "التاريخ والوقت": row["التاريخ والوقت"] || row["Timestamp"] || "",
        "رقم الأوردر": row["رقم الأوردر"] || row["رقم الطلب"] || row["Order ID"] || "",
        "اسم العميل": row["اسم العميل"] || row["Customer Name"] || "عميل",
        "رقم الموبايل": row["رقم الموبايل"] || row["Phone"] || "",
        "المنطقة / القرية": row["المنطقة / القرية"] || row["Area"] || "غير محدد",
        "العنوان بالتفصيل": row["العنوان بالتفصيل"] || row["Address"] || "",
        "طريقة الدفع": row["طريقة الدفع"] || row["Payment"] || "كاش",
        "تفاصيل الطلبات": row["تفاصيل الطلبات"] || row["Items"] || "",
        "الإجمالي النهائي": Number(row["الإجمالي النهائي"] || row["Final Total"] || row["Total"] || 0),
        "حساب الأكل الأصلي": Number(row["حساب الأكل الأصلي"] || 0),
        "مصاريف التوصيل": Number(row["مصاريف التوصيل"] || 0),
        "حالة الطلب": row["حالة الطلب"] || row["Status"] || "جديد"
      }));
      setReportsData(normalizedOrders);
    } catch (e) {
    } finally { setReportsLoading(false); }
  };

  const fetchReportsFromSheetSilent = async () => {
    try {
      const res = await fetch(GOOGLE_SHEET_SCRIPT_URL + "?action=orders&adminKey=" + ADMIN_SECRET_KEY);
      const data = await res.json();
      let rawOrders = [];
      if (Array.isArray(data)) rawOrders = data;
      else if (data && Array.isArray(data.orders)) rawOrders = data.orders;

      const normalizedOrders = rawOrders.map(row => ({
        "التاريخ والوقت": row["التاريخ والوقت"] || row["Timestamp"] || "",
        "رقم الأوردر": row["رقم الأوردر"] || row["رقم الطلب"] || row["Order ID"] || "",
        "اسم العميل": row["اسم العميل"] || row["Customer Name"] || "عميل",
        "رقم الموبايل": row["رقم الموبايل"] || row["Phone"] || "",
        "المنطقة / القرية": row["المنطقة / القرية"] || row["Area"] || "غير محدد",
        "العنوان بالتفصيل": row["العنوان بالتفصيل"] || row["Address"] || "",
        "طريقة الدفع": row["طريقة الدفع"] || row["Payment"] || "كاش",
        "تفاصيل الطلبات": row["تفاصيل الطلبات"] || row["Items"] || "",
        "الإجمالي النهائي": Number(row["الإجمالي النهائي"] || row["Final Total"] || row["Total"] || 0),
        "حساب الأكل الأصلي": Number(row["حساب الأكل الأصلي"] || 0),
        "مصاريف التوصيل": Number(row["مصاريف التوصيل"] || 0),
        "حالة الطلب": row["حالة الطلب"] || row["Status"] || "جديد"
      }));
      setReportsData(normalizedOrders);
    } catch (e) {}
  };

  useEffect(() => { if (adminOpen) fetchReportsFromSheet(); }, [adminOpen]);

  const filteredReportsData = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData) || reportsData.length === 0) return [];
    return reportsData;
  }, [reportsData]);

  const reportsAnalytics = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData) || reportsData.length === 0) {
      return { totalOrders: 0, totalSales: 0, totalDelivery: 0, netTotal: 0, cashSales: 0, electronicSales: 0, topItems: [], peakHours: [], sevenDaysChartData: [], allCustomersList: [] };
    }
    let totalSales = 0, totalDelivery = 0, netTotal = 0;
    reportsData.forEach(row => {
      if (!row) return;
      totalSales += Number(row["حساب الأكل الأصلي"]) || 0;
      totalDelivery += Number(row["مصاريف التوصيل"]) || 0;
      netTotal += Number(row["الإجمالي النهائي"]) || 0;
    });
    return { totalOrders: reportsData.length, totalSales, totalDelivery, netTotal, topItems: [], peakHours: [], sevenDaysChartData: [], allCustomersList: [] };
  }, [reportsData]);

  const dynamicBestSellers = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData) || reportsData.length === 0) return [];
    return [];
  }, [reportsData, items]);

  const categories = useMemo(() => ["الكل", ...new Set(items.map(i => i.cat))], [items]);
  const bestSellerItems = useMemo(() => items.filter(item => item.isBestSeller), [items]);

  const visibleItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = activeCat === "الكل" || item.cat === activeCat;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;
      return matchesCategory && (item.name.toLowerCase().includes(cleanQuery) || (item.desc && item.desc.toLowerCase().includes(cleanQuery)));
    });
  }, [items, activeCat, searchQuery]);

  const groups = useMemo(() => {
    const map = new Map();
    visibleItems.forEach(it => {
      const key = it.subcat || "";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(it);
    });
    return Array.from(map.entries());
  }, [visibleItems]);

  return (
    <div dir="rtl" className="min-h-screen bg-[#08090C] text-white font-['Tajawal'] pb-32">
      <header className="sticky top-0 z-30 bg-[#0C0E14]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div onClick={() => setLogoClicks(p => p + 1)} className="cursor-pointer flex items-center gap-2">
          <img src={LOGO_SRC} alt="Logo" className="w-9 h-9 object-contain border border-amber-500/20 rounded-full p-0.5" />
          <div className="text-right">
            <span className="text-sm font-black text-amber-400 tracking-wider block leading-none">{restaurantName}</span>
            <span className="text-[8px] text-amber-200/60 font-bold uppercase tracking-widest">DREAM CORNER</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setAdminOpen(true)} className="px-3 py-1.5 rounded-xl border border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs font-bold flex items-center gap-1 animate-pulse">
            <LayoutGrid size={15} /> <span>لوحة التحكم</span>
          </button>
          <button onClick={() => setCartOpen(true)} className="p-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 relative">
            <ShoppingCart size={16} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-7 space-y-6">
        <h2 className="text-sm font-bold text-amber-400">مرحباً بك في منيو {restaurantName} 🍕</h2>
      </main>

      {/* ADMIN DASHBOARD MODAL */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-5xl max-h-[96vh] rounded-3xl border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden bg-[#0C0E14] text-[#F3E9D8]">
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#141721]">
              <h2 className="text-base font-black text-amber-400">لوحة التحكم والتقارير (Enterprise v34.0)</h2>
              <button onClick={() => setAdminOpen(false)} className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-[#141721] border border-amber-500/20"><span className="text-gray-400 text-xs">إجمالي الطلبات</span><div className="my-2 text-xl font-black text-amber-400">{reportsAnalytics.totalOrders} أوردر</div></div>
                <div className="p-4 rounded-2xl bg-[#141721] border border-amber-500/20"><span className="text-gray-400 text-xs">إجمالي المبيعات</span><div className="my-2 text-xl font-black text-amber-400">{money(reportsAnalytics.netTotal)}</div></div>
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/5"><span className="text-gray-400 text-xs">مبيعات الأكل</span><div className="my-2 text-xl font-black text-white">{money(reportsAnalytics.totalSales)}</div></div>
                <div className="p-4 rounded-2xl bg-[#141721] border border-white/5"><span className="text-gray-400 text-xs">إيرادات التوصيل</span><div className="my-2 text-xl font-black text-white">{money(reportsAnalytics.totalDelivery)}</div></div>
              </div>

              <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                <div className="flex justify-between items-center"><h3 className="text-xs font-bold text-gray-300">سجل الطلبات الواردة ({filteredReportsData.length})</h3><button onClick={fetchReportsFromSheet} className="px-3 py-1 rounded bg-amber-500 text-black text-xs font-bold">تحديث البيانات</button></div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {filteredReportsData.length > 0 ? filteredReportsData.map((row, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[#1C202E] border border-white/10 text-xs flex justify-between items-center">
                      <div><span className="font-bold text-amber-400">{row["رقم الأوردر"]}</span> - <span className="text-white">{row["اسم العميل"]}</span> ({row["رقم الموبايل"]})</div>
                      <span className="font-bold text-emerald-400">{money(row["الإجمالي النهائي"])}</span>
                    </div>
                  )) : <p className="text-xs text-center py-6 text-gray-500">لا توجد أوردرات مسجلة حالياً في الشيت.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
