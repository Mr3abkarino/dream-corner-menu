import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, ChevronDown, User, Tag, Navigation, Award, Calendar, DollarSign, Wallet, Flame, BarChart3, RefreshCw, Share2, TrendingUp, Download, PieChart, Crown, Clock, Bike, Utensils, Trophy, Users, Home, ChevronLeft, Star, Percent, ShieldCheck, Headphones, ArrowUpRight, ArrowDownRight, LayoutGrid, CheckCircle2
} from "lucide-react";

const LOGO_SRC = restaurantLogo;
const MENU_VERSION = "23.0"; // v23.0: النسخة الكاملة النهائية (التتبع فوق الأقسام + أزرار تغيير الحالة للآدمن)
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwGoDcRBceQIL7-P8glbR4KxemKbvspbGBNWX7_zrTJXraKdYUeb7gxC7AE5MeNDBc/exec";
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
  { code: "OFF10", discount: 10, limit: 1, used: 0 },
  { code: "DREAM", discount: 15, limit: 1, used: 0 }
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
  { id: "p4", cat: "البيتزا", name: "بيتزا هوت دوج", desc: "قطع هوت دوج فاخرة مع الصوص الخاص", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p5", cat: "البيتزا", name: "بيتزا سجق", desc: "سجق مشوي بلدي طازج يومياً", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 100 }, { label: "صغير", price: 70 }] },
  { id: "p6", cat: "البيتزا", name: "بيتزا لحمة مفرومة", desc: "لحم بقر مفروم مع التوابل الشرقية", sizes: [{ label: "كبير", price: 145 }, { label: "وسط", price: 110 }, { label: "صغير", price: 75 }] },
  { id: "p7", cat: "البيتزا", name: "بيتزا بيروني", desc: "شرائح بيبيروني إيطالية شهية", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p8", cat: "البيتزا", name: "بيتزا سلامي", desc: "شرائح سلامي مدخن ممتازة", sizes: [{ label: "كبير", price: 110 }, { label: "وسط", price: 90 }, { label: "صغير", price: 70 }] },
  { id: "p9", cat: "البيتزا", name: "بيتزا شاورما دجاج", desc: "قطع شاورما دجاج متبلة بالخلطة السحرية", isBestSeller: true, rank: 2, sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p10", cat: "البيتزا", name: "بيتزا دجاج رانش", desc: "قطع دجاج مع صوص الرانش المفضل للجميع", sizes: [{ label: "كبير", price: 155 }, { label: "وسط", price: 120 }, { label: "صغير", price: 80 }] },
  { id: "p11", cat: "البيتزا", name: "بيتزا دريم كورنر سبيشال", desc: "خلطة البيت الخاصة المميزة والمحشوة بالكامل", isBestSeller: true, rank: 3, sizes: [{ label: "كبير", price: 170 }, { label: "وسط", price: 130 }, { label: "صغير", price: 90 }] },
  { id: "p12", cat: "البيتزا", name: "بيتزا كرانشي (حار أو بارد)", desc: "قطع دجاج مقرمشة حارة أو عادية", sizes: [{ label: "كبير", price: 130 }, { label: "وسط", price: 100 }, { label: "صغير", price: 80 }] },
  { id: "p13", cat: "البيتزا", name: "بيتزا ميكس دجاج", desc: "توليفة دجاج كرانشي ورانش وشاورما", sizes: [{ label: "كبير", price: 135 }, { label: "وسط", price: 105 }, { label: "صغير", price: 85 }] },
  { id: "p14", cat: "البيتزا", name: "حشو الأطراف", desc: "إضافة أطراف محشوة لأي بيتزا", sizes: [{ label: "كبير", price: 35 }, { label: "وسط", price: 30 }, { label: "صغير", price: 25 }] },
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
  const now = new Date();
  const hours = now.getHours();
  const isOpen = hours >= 13 || hours < 3;
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

  // حالات تتبع الأوردر للعميل
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [trackQuery, setTrackQuery] = useState("");
  const [trackedOrderResult, setTrackedOrderResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

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

  const [scheduleType, setScheduleType] = useState("now"); 
  const [scheduleTime, setScheduleTime] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);
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
    }, 60000);

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
        if (data && data.activeVisitors) {
          setActiveVisitors(data.activeVisitors);
        }
      } catch (e) {}
    };

    sendPing();
    const visitorTimer = setInterval(sendPing, 30000);

    return () => {
      clearInterval(statusTimer);
      clearInterval(visitorTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("dream-corner-saved-cart", JSON.stringify(cart));
    }
  }, [cart]);

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

    if (delta > 0) {
      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 500);
    }
  };

  const handleClearCart = () => {
    setCart({});
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("dream-corner-saved-cart");
    }
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
      if (data && data.status === "success" && Array.isArray(data.orders)) {
        setReportsData(data.orders);
      } else if (Array.isArray(data)) {
        setReportsData(data);
      }
    } catch (e) {
      console.error(e);
    } finally { setReportsLoading(false); }
  };

  useEffect(() => { if (adminOpen) fetchReportsFromSheet(); }, [adminOpen]);

  // دالة تتبع الأوردر للعميل من المنيو
  const handleTrackOrder = async () => {
    const q = trackQuery.trim();
    if (!q) {
      setTrackError("من فضلك اكتب رقم الأوردر أو رقم الموبايل.");
      return;
    }
    setTrackLoading(true);
    setTrackError("");
    setTrackedOrderResult(null);

    try {
      const res = await fetch(GOOGLE_SHEET_SCRIPT_URL + "?action=orders&adminKey=" + ADMIN_SECRET_KEY);
      const data = await res.json();
      
      let ordersList = [];
      if (data && data.status === "success" && Array.isArray(data.orders)) {
        ordersList = data.orders;
      } else if (Array.isArray(data)) {
        ordersList = data;
      }

      const found = ordersList.find(o => 
        String(o["رقم الأوردر"] || "").trim().toLowerCase() === q.toLowerCase() ||
        String(o["رقم الموبايل"] || "").trim() === q
      );

      if (found) {
        setTrackedOrderResult(found);
      } else {
        setTrackError("لم يتم العثور على أوردر بهذا الرقم، تأكد من البيانات المدخلة.");
      }
    } catch (e) {
      setTrackError("حدث خطأ أثناء الاتصال بالسيستم، حاول مرة أخرى.");
    } finally {
      setTrackLoading(false);
    }
  };

  // دالة تحديث حالة الأوردر من لوحة التحكم للإدارة
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_order_status",
          adminKey: ADMIN_SECRET_KEY,
          orderId: orderId,
          status: newStatus,
          note: "تحديث الحالة من لوحة التحكم"
        })
      });
      
      setReportsData(prev => prev.map(row => {
        if (String(row["رقم الأوردر"]) === String(orderId)) {
          return { ...row, "حالة الطلب": newStatus };
        }
        return row;
      }));
    } catch (e) {
      alert("حدث خطأ أثناء تحديث حالة الأوردر.");
    }
  };

  const filteredReportsData = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData) || reportsData.length === 0) return [];
    
    const getShiftDateStr = (dateObj) => {
      const d = new Date(dateObj);
      const hour = d.getHours();
      if (hour < 3) { d.setDate(d.getDate() - 1); }
      return d.toLocaleDateString("ar-EG");
    };

    const now = new Date();
    const todayShiftStr = getShiftDateStr(now);
    const yesterdayDate = new Date(now); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayShiftStr = getShiftDateStr(yesterdayDate);

    return reportsData.filter(row => {
      if (!row) return false;
      const dateStr = String(row["التاريخ والوقت"] || "");
      const rowDate = new Date(dateStr);
      const rowShiftStr = !isNaN(rowDate.getTime()) ? getShiftDateStr(rowDate) : dateStr;

      let passesDate = true;
      if (reportDateFilter === "today") passesDate = rowShiftStr === todayShiftStr || dateStr.includes(todayShiftStr);
      else if (reportDateFilter === "yesterday") passesDate = rowShiftStr === yesterdayShiftStr || dateStr.includes(yesterdayShiftStr);

      let passesSearch = true;
      if (reportSearchQuery.trim()) {
        const q = reportSearchQuery.trim().toLowerCase();
        passesSearch = String(row["اسم العميل"] || "").toLowerCase().includes(q) || String(row["رقم الموبايل"] || "").toLowerCase().includes(q) || String(row["المنطقة / القرية"] || "").toLowerCase().includes(q);
      }
      return passesDate && passesSearch;
    });
  }, [reportsData, reportDateFilter, reportSearchQuery]);

  const reportsAnalytics = useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData) || reportsData.length === 0) {
      return { totalOrders: 0, totalSales: 0, totalDelivery: 0, netTotal: 0, cashSales: 0, electronicSales: 0, growthSalesPercent: 0, growthOrdersPercent: 0, topArea: "لا يوجد", goldenCustomer: null, allCustomersList: [], topItems: [], peakHours: [], sevenDaysChartData: [] };
    }

    const getShiftDateStr = (dateObj) => {
      const d = new Date(dateObj);
      const hour = d.getHours();
      if (hour < 3) { d.setDate(d.getDate() - 1); }
      return d.toLocaleDateString("ar-EG");
    };

    const now = new Date();
    const todayShiftStr = getShiftDateStr(now);
    const yesterdayDate = new Date(now); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayShiftStr = getShiftDateStr(yesterdayDate);

    let totalSales = 0, totalDelivery = 0, netTotal = 0, cashSales = 0, electronicSales = 0;
    let todayNetTotal = 0, todayOrdersCount = 0, yesterdayNetTotal = 0, yesterdayOrdersCount = 0;

    const areasMap = {}, customersMap = {}, itemsMap = {}, hoursMap = {}, daysMap = {};

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const shiftKey = getShiftDateStr(d);
      daysMap[shiftKey] = 0;
    }

    filteredReportsData.forEach(row => {
      if (!row) return;
      const cartVal = Number(row["حساب الأكل الأصلي"]) || 0;
      const delVal = Number(row["مصاريف التوصيل"]) || 0;
      const finalVal = Number(row["الإجمالي النهائي"]) || 0;
      const area = String(row["المنطقة / القرية"] || "غير محدد");
      const pay = String(row["طريقة الدفع"] || "");
      const custName = String(row["اسم العميل"] || "عميل بدون اسم");
      const custPhone = String(row["رقم الموبايل"] || "");
      const itemsText = String(row["تفاصيل الطلبات"] || "");
      const timestamp = String(row["التاريخ والوقت"] || "");

      totalSales += cartVal; totalDelivery += delVal; netTotal += finalVal;
      if (pay.includes("إلكتروني")) electronicSales += finalVal; else cashSales += finalVal;

      if (!areasMap[area]) areasMap[area] = { count: 0 };
      areasMap[area].count += 1;

      const custKey = custPhone ? custPhone.trim() : custName.trim();
      if (!customersMap[custKey]) customersMap[custKey] = { name: custName, phone: custPhone, count: 0, spent: 0, lastArea: area };
      customersMap[custKey].count += 1; customersMap[custKey].spent += finalVal;

      if (itemsText) {
        itemsText.split("|").forEach(part => {
          const trimmed = part.trim();
          if (trimmed) {
            const match = trimmed.match(/(.+) x(\d+)/);
            if (match) itemsMap[match[1].trim()] = (itemsMap[match[1].trim()] || 0) + (Number(match[2]) || 1);
            else itemsMap[trimmed] = (itemsMap[trimmed] || 0) + 1;
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

    reportsData.forEach(row => {
      if (!row) return;
      const dateStr = String(row["التاريخ والوقت"] || "");
      const rowDate = new Date(dateStr);
      const rowShiftStr = !isNaN(rowDate.getTime()) ? getShiftDateStr(rowDate) : dateStr;
      const finalVal = Number(row["الإجمالي النهائي"]) || 0;

      if (rowShiftStr === todayShiftStr || dateStr.includes(todayShiftStr)) { todayNetTotal += finalVal; todayOrdersCount++; }
      else if (rowShiftStr === yesterdayShiftStr || dateStr.includes(yesterdayShiftStr)) { yesterdayNetTotal += finalVal; yesterdayOrdersCount++; }

      Object.keys(daysMap).forEach(dayKey => { if (rowShiftStr === dayKey || dateStr.includes(dayKey)) daysMap[dayKey] += finalVal; });
    });

    const growthSalesPercent = yesterdayNetTotal > 0 ? Math.round(((todayNetTotal - yesterdayNetTotal) / yesterdayNetTotal) * 100) : (todayNetTotal > 0 ? 100 : 0);
    const growthOrdersPercent = yesterdayOrdersCount > 0 ? Math.round(((todayOrdersCount - yesterdayOrdersCount) / yesterdayOrdersCount) * 100) : (todayOrdersCount > 0 ? 100 : 0);

    let topArea = "غير محدد", maxCount = 0;
    Object.entries(areasMap).forEach(([a, data]) => { if (data.count > maxCount) { maxCount = data.count; topArea = a; } });

    const sortedCustomers = Object.values(customersMap).sort((a, b) => b.spent - a.spent);
    const goldenCustomer = sortedCustomers.length > 0 ? sortedCustomers[0] : null;

    const topItems = Object.entries(itemsMap).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5);
    const peakHours = Object.entries(hoursMap).map(([hour, count]) => ({ hour, count })).sort((a, b) => b.count - a.count).slice(0, 4);

    const maxChartVal = Math.max(...Object.values(daysMap), 1);
    const sevenDaysChartData = Object.entries(daysMap).map(([day, val]) => ({ day, val, heightPercent: Math.max(10, Math.round((val / maxChartVal) * 100)) }));

    return { totalOrders: filteredReportsData.length, totalSales, totalDelivery, netTotal, cashSales, electronicSales, growthSalesPercent, growthOrdersPercent, topArea: topArea + " (" + maxCount + " أوردر)", goldenCustomer, allCustomersList: sortedCustomers, topItems, peakHours, sevenDaysChartData };
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

  const sendZReportToWhatsApp = () => {
    const zText = `📊 تقرير تقفيل الخزنة والوردية (Z-Report) - ${restaurantName}\n\n🛒 إجمالي الأوردرات: ${reportsAnalytics.totalOrders} أوردر\n💵 مبيعات المأكولات: ${money(reportsAnalytics.totalSales)}\n🛵 إيرادات التوصيل: ${money(reportsAnalytics.totalDelivery)}\n💰 صافي الدخل الكلي: ${money(reportsAnalytics.netTotal)}\n\n🏆 العميل الذهبي المفضل: ${reportsAnalytics.goldenCustomer ? reportsAnalytics.goldenCustomer.name + " (" + money(reportsAnalytics.goldenCustomer.spent) + ")" : "لا يوجد"}\n✨ التقرير مستخرج أوتوماتيكياً عبر Google Sheets!`;
    const phone = whatsappNumber.replace(/[^\d+]/g, "");
    window.open("https://wa.me/" + phone + "?text=" + encodeURIComponent(zText), "_blank");
  };

  const handleLogoClickLocal = () => {
    setLogoClicks((prev) => {
      if (prev + 1 >= 3) { setPinModalOpen(true); return 0; }
      return prev + 1;
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setValidationError("متصفحك لا يدعم تحديد الموقع تلقائياً."); return; }
    setGeoLinkLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLink("http://maps.google.com/?q=" + position.coords.latitude + "," + position.coords.longitude);
        setCustomerAddress(prev => prev + " [تم تحديد اللوكيشن بـ GPS 📍]");
        setGeoLinkLoading(false);
      },
      () => { setValidationError("فشل تحديد الموقع، برجاء تفعيل الـ GPS في موبايلك."); setGeoLinkLoading(false); }
    );
  };

  const handleApplyPromo = () => {
    const codeClean = enteredPromo.trim().toUpperCase();
    if (!codeClean) return;
    const match = DEFAULT_PROMO_CODES.find(p => p.code.toUpperCase() === codeClean);
    if (match) {
      setAppliedDiscountPercent(match.discount); setPromoError("");
    } else { setAppliedDiscountPercent(0); setPromoError("كود الخصم غير صحيح أو منتهي الصلاحية!"); }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const savedName = localStorage.getItem("customer-name-cache");
      const savedPhone = localStorage.getItem("customer-phone-cache");
      const savedAddress = localStorage.getItem("customer-address-cache");
      if (savedName) setCustomerName(savedName);
      if (savedPhone) setCustomerPhone(savedPhone);
      if (savedAddress) setCustomerAddress(savedAddress);
    }
  }, []);

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin === adminPin) { setIsAdmin(true); setPinModalOpen(false); setEnteredPin(""); setAdminOpen(true); }
    else setPinError("رمز الأمان PIN غير صحيح!");
  };

  const copyText = (label, value) => {
    const ok = copyTextToClipboard(value);
    if (ok) {
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    }
  };

  const categories = useMemo(() => ["الكل", ...new Set(items.map((i) => i.cat))], [items]);
  const bestSellerItems = useMemo(() => items.filter(item => item.isBestSeller).sort((a,b) => (a.rank || 99) - (b.rank || 99)), [items]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = activeCat === "الكل" || item.cat === activeCat;
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;
      return matchesCategory && (item.name.toLowerCase().includes(cleanQuery) || (item.desc && item.desc.toLowerCase().includes(cleanQuery)));
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

  const sendWhatsApp = () => {
    if (!restaurantStatus.isOpen) { setCloseNoticeOpen(true); return; }

    if (cartList.length === 0) { setValidationError("السلة فارغة، اختر أصنافك أولاً."); return; }
    if (!customerName.trim()) { setValidationError("من فضلك اكتب اسمك."); return; }
    if (!customerPhone.trim()) { setValidationError("من فضلك اكتب رقم الموبايل."); return; }
    if (!customerAddress.trim()) { setValidationError("من فضلك اكتب العنوان بالتفصيل."); return; }
    if (selectedAreaIndex === -1) { setValidationError("من فضلك اختر منطقة التوصيل."); return; }
    if (scheduleType === "later" && !scheduleTime.trim()) { setValidationError("من فضلك اكتب موعد التوصيل."); return; }

    setValidationError("");

    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("customer-name-cache", customerName.trim());
      localStorage.setItem("customer-phone-cache", customerPhone.trim());
      localStorage.setItem("customer-address-cache", customerAddress.trim());
      localStorage.removeItem("dream-corner-saved-cart");
    }

    const itemsSummary = cartList.map((i) => i.label + " x" + i.qty).join(" | ");
    const lines = cartList.map((i) => "• " + i.label + " x" + i.qty + " — " + money(i.price * i.qty));
    
    const deliveryTimeText = scheduleType === "now" ? "⚡ توصيل فوري (الآن)" : "🕒 مجدول للموعد: " + scheduleTime;
    const paymentText = paymentMethod === "cash" ? "💵 نقدي (كاش)" : "📱 دفع إلكتروني";
    const clientRequestId = "req_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    try {
      fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_order",
          clientRequestId: clientRequestId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          area: activeDeliveryArea.name,
          address: customerAddress.trim(),
          geoLink: geoLink || "",
          paymentMethod: paymentText,
          schedule: deliveryTimeText,
          itemsSummary: itemsSummary,
          cartTotal: cartTotal,
          couponDiscount: discountAmount,
          deliveryPrice: activeDeliveryArea.price,
          finalTotal: finalTotal,
          customerNotes: customerNotes || ""
        })
      });
    } catch (e) {}

    let text = `طلب جديد من منيو ${restaurantName} 🍽\n\n👤 العميل: ${customerName}\n📱 الهاتف: ${customerPhone}\n💳 الدفع: ${paymentText}\n📍 المنطقة: ${activeDeliveryArea.name}\n🏠 العنوان: ${customerAddress}\n\nالطلبات:\n${lines.join("\n")}\n\n💵 حساب الأكل: ${money(cartTotal)}\n🛵 التوصيل: ${money(activeDeliveryArea.price)}\n💰 الإجمالي: ${money(finalTotal)}`;
    window.open("https://wa.me/" + whatsappNumber.replace(/[^\d+]/g, "") + "?text=" + encodeURIComponent(text), "_blank");

    setCartOpen(false); setCart({}); setOrderSuccess(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#08090C] text-white font-['Tajawal'] pb-32">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#0C0E14]/90 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div onClick={handleLogoClickLocal} className="cursor-pointer flex items-center gap-2">
          <img src={LOGO_SRC} alt="Dream Corner" className="w-9 h-9 object-contain border border-amber-500/20 rounded-full p-0.5" />
          <div className="text-right">
            <span className="text-sm font-black text-amber-400 tracking-wider block leading-none">{restaurantName}</span>
            <span className="text-[8px] text-amber-200/60 font-bold uppercase tracking-widest">DREAM CORNER</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={() => setAdminOpen(true)} className="px-3 py-1.5 rounded-xl border border-amber-500/50 text-amber-400 bg-amber-500/10 text-xs font-bold flex items-center gap-1 animate-pulse">
              <LayoutGrid size={15} /> <span>لوحة التحكم</span>
            </button>
          )}
          <button onClick={() => setCartOpen(true)} className={`p-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 relative transition-transform duration-300 ${animateCart ? "scale-125 bg-amber-400 text-black" : ""}`}>
            <ShoppingCart size={16} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* SOCIAL MEDIA STRIP */}
      <div className="w-full flex justify-center items-center py-2.5 bg-[#0C0E14]/80 border-b border-white/5 sticky top-[57px] z-20 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4 py-1 rounded-full bg-[#1A1D26] border border-white/10 shadow-inner">
          <a href={"tel:" + whatsappNumber} className="p-2 rounded-full bg-amber-400 text-black transition-transform active:scale-95 shadow"><Phone size={13} /></a>
          <span className="h-3.5 w-[1px] bg-white/20" />
          <a href={"https://wa.me/" + whatsappNumber.replace(/[^\d+]/g, "")} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#25D366] text-white transition-transform active:scale-95 shadow"><MessageCircle size={13} /></a>
          <a href="https://www.facebook.com/share/1E3Dx3c5Yh/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-[#1877F2] text-white transition-transform active:scale-95 shadow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="https://www.tiktok.com/@dreamcornerfood" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-black text-white border border-white/20 transition-transform active:scale-95 shadow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12.525.02c1.31.01 2.61.03 3.91.05.08 1.53.64 2.93 1.66 4.02.97.97 2.24 1.57 3.63 1.69v3.91c-1.6-.05-3.11-.64-4.32-1.64-.1-.08-.19-.17-.28-.26v6.2c-.06 4.67-3.81 8.28-8.42 8.01-3.69-.21-6.72-3.14-7.06-6.82-.44-4.78 3.32-8.91 8.11-8.52v3.96c-2.15-.22-4.11 1.29-4.44 3.44-.4 2.58 1.56 4.88 4.15 4.96 2.43.08 4.5-1.74 4.66-4.16.03-.43.02-.87.02-1.3V0z"/></svg></a>
        </div>
      </div>

      {/* WELCOME BANNER */}
      {customerName && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2"><Crown size={15} className="text-amber-400 animate-bounce" /><span className="font-bold text-amber-300">أهلاً بعودتك يا {customerName}! 👋</span></div>
        </div>
      )}

      {/* HERO BANNER SECTION */}
      <section className="relative w-full h-60 sm:h-72 overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" alt="Delicious Pizza" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/60 to-transparent" />

        <div className="relative z-10 text-center px-4 space-y-2.5">
          <h1 className="text-2xl sm:text-4xl font-black text-amber-400 tracking-wide drop-shadow-md">{restaurantName}</h1>
          <p className="text-xs sm:text-sm text-gray-300 font-bold opacity-90">{tagline}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-bold">
            <span className="px-3 py-1 rounded-full bg-black/70 border border-white/10 font-black flex items-center gap-1" style={{ color: restaurantStatus.isOpen ? "#22c55e" : "#ef4444" }}>{restaurantStatus.text}</span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-gray-200 flex items-center gap-1"><Bike size={12} className="text-amber-400" /> توصيل سريع</span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-gray-200 flex items-center gap-1"><Clock size={12} className="text-amber-400" /> {restaurantStatus.timeText}</span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 (1250+ تقييم)</span>
          </div>
        </div>
      </section>

      {/* TRACK ORDER STRIP (فوق شريط الأقسام مباشرة بشكل احترافي) */}
      <div className="max-w-3xl mx-auto px-4 pt-3">
        <div onClick={() => setTrackModalOpen(true)} className="w-full bg-gradient-to-r from-amber-500/20 via-[#1A1D26] to-amber-500/15 border border-amber-500/40 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all shadow-md group">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-black font-black group-hover:scale-110 transition-transform">
              <Bike size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-amber-300">تتبع حالة طلبك لحظياً 🛵</p>
              <p className="text-[10px] text-gray-300">اضغط هنا واكتب رقم الأوردر لمعرفة أين وصل طلبك الآن</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-xl bg-amber-400 text-black text-xs font-black flex items-center gap-1 shadow">
            <span>استعلم الآن</span>
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      {/* CATEGORIES NAV BAR */}
      <nav className="sticky top-[100px] z-20 bg-[#08090C]/95 backdrop-blur-md border-y border-white/10 py-3 px-4 mt-3">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${activeCat === c ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20" : "bg-[#141721] text-gray-300 border border-white/5 hover:bg-white/10"}`}
            >
              <span>{c === "البيتزا" ? "🍕" : c === "السندوتشات" ? "🥪" : c === "المشروبات" ? "🥤" : c === "الأصناف الجانبية" ? "🍟" : "🍽"}</span>
              <span>{c}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <div className="relative">
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن بيتزا، سندوتش، مشروب..." className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#111319] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500/50" />
          <Search size={15} className="absolute right-3.5 top-3 text-gray-400" />
          {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute left-3 top-2.5 p-1 rounded-full text-gray-400"><X size={14} /></button>}
        </div>
      </div>

      {/* OFFERS SLIDER */}
      <section className="max-w-3xl mx-auto px-4 pt-5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {COMING_SOON_OFFERS.map((off) => (
            <div key={off.id} className={`w-[260px] sm:w-[290px] shrink-0 p-3.5 rounded-3xl bg-gradient-to-r ${off.bg} border border-amber-500/30 flex items-center justify-between shadow-xl`}>
              <div className="space-y-1">
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-black">{off.tag}</span>
                <h3 className="text-xs font-black text-amber-300">{off.title}</h3>
                <p className="text-[10px] text-gray-300">{off.desc}</p>
              </div>
              <Percent size={28} className="text-amber-400/80 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      {bestSellerItems.length > 0 && activeCat === "الكل" && !searchQuery.trim() && (
        <section className="max-w-3xl mx-auto px-4 pt-7 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-amber-400 flex items-center gap-1 uppercase tracking-wide">
              <Flame size={16} className="text-red-500 animate-pulse" />
              <span>الأكثر طلباً الآن 🔥</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {bestSellerItems.map((item) => (
              <div key={item.id} className="bg-[#111319] border border-white/10 rounded-3xl p-3.5 flex flex-col justify-between relative shadow-lg hover:border-amber-500/40 transition-all overflow-hidden">
                
                <div className="absolute top-2.5 -left-7 rotate-[-35deg] bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 text-black font-black text-[8px] px-7 py-0.5 shadow-md border-y border-amber-300/40 z-10 flex items-center justify-center gap-0.5">
                  🔥 الأكثر طلباً
                </div>

                <div className="space-y-1 mt-2">
                  <h3 className="text-xs sm:text-sm font-black text-white truncate">{item.name}</h3>
                  <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{item.desc || "الوجبة الأكثر طلباً وشهيرة من دريم كورنر!"}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
                  {item.sizes ? (
                    item.sizes.slice(0, 2).map((sz) => {
                      const key = item.id + "::" + sz.label;
                      return (
                        <div key={sz.label} className="flex items-center justify-between text-xs bg-[#1A1D26] p-1.5 px-2.5 rounded-xl border border-white/5">
                          <span className="text-gray-200 font-bold">{sz.label}</span>
                          <button onClick={() => addToCart(key, 1)} className="text-amber-400 font-black text-xs hover:underline flex items-center gap-0.5">
                            <span>{money(sz.price)}</span>
                            <span className="text-base font-black text-amber-300 ml-0.5">+</span>
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-black text-amber-400">{money(item.price)}</span>
                      <button onClick={() => addToCart(item.id, 1)} className="p-2 rounded-full bg-amber-400 text-black font-black active:scale-95"><Plus size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MAIN MENU ITEMS */}
      <main className="max-w-3xl mx-auto px-4 pt-7 space-y-6">
        {groups.map((group) => {
          const subcat = group[0];
          const list = group[1];
          return (
            <div key={subcat || "main"} className="space-y-3">
              {subcat && (
                <h2 className="text-xs font-black text-amber-400 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-3 rounded-full bg-amber-400" />
                  <span>{subcat}</span>
                </h2>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {list.map((item) => (
                  <div key={item.id} className="bg-[#111319] border border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-md hover:border-amber-500/30 transition-all">
                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-black text-white">{item.name}</h3>
                      {item.desc && <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 space-y-2">
                      {item.sizes ? (
                        item.sizes.map((sz) => {
                          const key = item.id + "::" + sz.label;
                          const qty = cart[key] || 0;
                          return (
                            <div key={sz.label} className="flex items-center justify-between text-xs bg-[#1A1D26] p-2 px-3 rounded-xl border border-white/5">
                              <span className="text-gray-200 font-bold">{sz.label}</span>
                              <span className="text-amber-400 font-black text-xs">{money(sz.price)}</span>
                              {qty > 0 ? (
                                <div className="flex items-center gap-2">
                                  <button onClick={() => addToCart(key, -1)} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"><Minus size={10} /></button>
                                  <span className="font-black text-white text-xs">{qty}</span>
                                  <button onClick={() => addToCart(key, 1)} className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold"><Plus size={10} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="p-1.5 rounded-full bg-amber-400 text-black font-black active:scale-95"><Plus size={12} /></button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-amber-400">{money(item.price)}</span>
                          {cart[item.id] > 0 ? (
                            <div className="flex items-center gap-2 bg-[#1A1D26] px-2.5 py-1 rounded-full border border-white/10">
                              <button onClick={() => addToCart(item.id, -1)} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"><Minus size={10} /></button>
                              <span className="font-bold text-xs">{cart[item.id]}</span>
                              <button onClick={() => addToCart(item.id, 1)} className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold"><Plus size={10} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item.id, 1)} className="p-2 rounded-full bg-amber-400 text-black active:scale-95"><Plus size={13} /></button>
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

      {/* TRUST BADGES STRIP */}
      <section className="max-w-3xl mx-auto px-4 pt-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#111319] p-3.5 rounded-3xl border border-white/10 text-center text-[10px]">
          <div className="space-y-1 p-1"><Headphones size={18} className="mx-auto text-amber-400" /><p className="font-bold text-white">خدمة عملاء 24/7</p></div>
          <div className="space-y-1 p-1"><CreditCard size={18} className="mx-auto text-amber-400" /><p className="font-bold text-white">طرق دفع متعددة</p></div>
          <div className="space-y-1 p-1"><ShieldCheck size={18} className="mx-auto text-amber-400" /><p className="font-bold text-white">جودة مضمونة</p></div>
          <div className="space-y-1 p-1"><Bike size={18} className="mx-auto text-amber-400" /><p className="font-bold text-white">توصيل سريع</p></div>
        </div>
      </section>

      {/* FOOTER RIGHTS */}
      <div className="fixed bottom-12 inset-x-0 z-20 border-t border-white/10 px-4 py-2.5 flex items-center justify-center gap-3 text-xs font-semibold bg-[#08090C]/90 backdrop-blur-md">
        <a href="https://fb.com/mr.3abkarino" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-amber-400 hover:underline">
          Mr3abkarino© <span className="text-red-500 text-sm animate-pulse">❤️</span>
        </a>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1 truncate text-gray-400 text-[10px]">
          <MapPin size={12} className="shrink-0 text-amber-400" />
          <span className="truncate">{address}</span>
        </span>
      </div>

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 inset-x-0 z-30 px-4">
          <div onClick={() => setCartOpen(true)} className={`max-w-md mx-auto bg-amber-400 text-black p-3 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all duration-300 ${animateCart ? "scale-105 shadow-amber-500/50 ring-2 ring-amber-300" : ""}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-black text-amber-400 flex items-center justify-center font-black text-xs">{cartCount}</div>
              <div>
                <p className="text-xs font-black">سلة الطلبات ({cartCount})</p>
                <p className="text-[10px] font-bold opacity-80">{money(cartTotal)}</p>
              </div>
            </div>
            <button className="px-3.5 py-1.5 rounded-xl bg-black text-amber-400 text-xs font-black flex items-center gap-1">
              عرض السلة والدفع <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM NAVIGATION APP BAR */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-[#0C0E14] border-t border-white/10 px-6 py-2 flex items-center justify-between text-[10px] text-gray-400">
        <button onClick={() => setActiveCat("الكل")} className="flex flex-col items-center gap-1 text-amber-400 font-bold">
          <Home size={18} /> <span>الرئيسية</span>
        </button>
        <button onClick={() => setActiveCat("البيتزا")} className="flex flex-col items-center gap-1 hover:text-white">
          <Utensils size={18} /> <span>المنيو</span>
        </button>
        <div onClick={handleLogoClickLocal} className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 -mt-5 shadow-lg border-2 border-[#0C0E14] cursor-pointer">
          <img src={LOGO_SRC} alt="Logo" className="w-full h-full object-contain rounded-full bg-black p-1" />
        </div>
        <button onClick={() => alert("العنوان بالتفصيل: " + address)} className="flex flex-col items-center gap-1 hover:text-white">
          <MapPin size={18} /> <span>الموقع</span>
        </button>
        <a href={"https://wa.me/" + whatsappNumber.replace(/[^\d+]/g, "")} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 hover:text-white">
          <Phone size={18} /> <span>تواصل معنا</span>
        </a>
      </footer>

      {/* TRACK ORDER MODAL */}
      {trackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-md bg-[#111319] border border-amber-500/40 rounded-3xl p-5 space-y-4 shadow-2xl text-white">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-amber-400 flex items-center gap-1.5">
                <Bike size={18} />
                <span>تتبع حالة طلبك لحظياً 🔍</span>
              </h3>
              <button onClick={() => setTrackModalOpen(false)} className="p-1.5 rounded-full bg-white/10 text-gray-300 hover:text-white"><X size={16} /></button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-gray-300">اكتب رقم الأوردر (مثلاً: DC-...) أو رقم تليفونك لمعرفة حالة الوجبة:</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="رقم الأوردر أو الموبايل..." 
                  value={trackQuery} 
                  onChange={(e) => setTrackQuery(e.target.value)} 
                  className="flex-1 p-2.5 rounded-xl bg-[#1A1D26] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button onClick={handleTrackOrder} className="px-4 py-2.5 rounded-xl bg-amber-400 text-black font-black text-xs">
                  {trackLoading ? "جاري..." : "بحث"}
                </button>
              </div>
              {trackError && <p className="text-[10px] text-red-400 font-bold bg-red-500/10 p-2 rounded-lg">{trackError}</p>}
            </div>

            {trackedOrderResult && (
              <div className="p-4 rounded-2xl bg-[#1A1D26] border border-amber-500/30 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block">رقم الطلب:</span>
                    <span className="font-black text-amber-400">{trackedOrderResult["رقم الأوردر"]}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-gray-400 block">الحالة الحالية:</span>
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-black border border-amber-500/30 text-[11px]">
                      {trackedOrderResult["حالة الطلب"] || "جديد"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-gray-300">
                  <p>👤 العميل: <span className="font-bold text-white">{trackedOrderResult["اسم العميل"]}</span></p>
                  <p>📍 المنطقة: <span className="font-bold text-white">{trackedOrderResult["المنطقة / القرية"]}</span></p>
                  <p>🛍️ الأصناف: <span className="font-bold text-white">{trackedOrderResult["تفاصيل الطلبات"]}</span></p>
                  <p>💰 الإجمالي: <span className="font-bold text-amber-400">{money(trackedOrderResult["الإجمالي النهائي"])}</span></p>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] text-gray-400 font-bold">مراحل تنفيذ الأوردر:</p>
                  <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-bold">
                    <div className={`p-1.5 rounded-lg border ${["جديد", "تم التأكيد", "جاري التحضير", "خرج للتوصيل", "تم التسليم"].includes(trackedOrderResult["حالة الطلب"]) ? "bg-amber-400 text-black border-amber-400" : "bg-black/40 text-gray-500 border-white/5"}`}>1. استلام الطلب</div>
                    <div className={`p-1.5 rounded-lg border ${["جاري التحضير", "خرج للتوصيل", "تم التسليم"].includes(trackedOrderResult["حالة الطلب"]) ? "bg-amber-400 text-black border-amber-400" : "bg-black/40 text-gray-500 border-white/5"}`}>2. التحضير 👨‍🍳</div>
                    <div className={`p-1.5 rounded-lg border ${["خرج للتوصيل", "تم التسليم"].includes(trackedOrderResult["حالة الطلب"]) ? "bg-amber-400 text-black border-amber-400" : "bg-black/40 text-gray-500 border-white/5"}`}>3. في الطريق 🛵</div>
                    <div className={`p-1.5 rounded-lg border ${trackedOrderResult["حالة الطلب"] === "تم التسليم" ? "bg-emerald-500 text-white border-emerald-500" : "bg-black/40 text-gray-500 border-white/5"}`}>4. تم التسليم 🎉</div>
                  </div>
                </div>

              </div>
            )}

            <button onClick={() => setTrackModalOpen(false)} className="w-full py-2.5 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-bold">
              إغلاق النافذة
            </button>

          </div>
        </div>
      )}

      {/* CART DRAWER MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0">
          <div className="absolute inset-0" onClick={() => setCartOpen(false)} />
          
          <div className="relative z-10 w-full max-w-lg bg-[#111319] border-t border-x border-amber-500/30 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl" dir="rtl">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-amber-400 flex items-center gap-1.5">
                  <ShoppingCart size={18} />
                  <span>سلة المشتريات ({cartCount})</span>
                </h3>

                {cartCount > 0 && (
                  <button onClick={handleClearCart} className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all mr-2 flex items-center gap-1 text-[10px] font-bold">
                    <Trash2 size={13} />
                    <span>تصفير السلة</span>
                  </button>
                )}
              </div>

              <button onClick={() => setCartOpen(false)} className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 hover:bg-amber-500/30">
                <span>إغلاق ورجوع للمنيو</span>
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {cartList.map((cartItem) => (
                <div key={cartItem.key} className="flex items-center justify-between text-xs p-2.5 bg-[#1A1D26] rounded-xl border border-white/5">
                  <div>
                    <p className="font-bold text-white">{cartItem.label}</p>
                    <p className="text-amber-400 font-bold">{money(cartItem.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addToCart(cartItem.key, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white"><Minus size={12} /></button>
                    <span className="font-bold text-white">{cartItem.qty}</span>
                    <button onClick={() => addToCart(cartItem.key, 1)} className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-gray-300"><span>حساب المأكولات:</span><span>{money(cartTotal)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>خصم الكوبون (-{appliedDiscountPercent}%):</span><span>-{money(discountAmount)}</span></div>}
              <div className="flex justify-between text-gray-300"><span>توصيل لـ ({selectedAreaIndex >= 0 ? activeDeliveryArea.name : "لم تحدد"}):</span><span>{money(activeDeliveryArea.price)}</span></div>
              <div className="flex justify-between pt-2 text-sm font-black border-t border-white/10"><span>الإجمالي النهائي:</span><span className="text-amber-400 text-base">{money(finalTotal)}</span></div>
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="كوبون خصم؟" value={enteredPromo} onChange={e => setEnteredPromo(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl bg-[#1A1D26] border border-white/10 text-xs text-white uppercase" />
              <button onClick={handleApplyPromo} className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">تطبيق</button>
            </div>
            {promoError && <p className="text-[10px] text-red-400 font-bold">{promoError}</p>}

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <input type="text" placeholder="اسمك الكريم..." value={customerName} onChange={e => { setCustomerName(e.target.value); setValidationError(""); }} className="w-full p-2.5 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
              <input type="tel" placeholder="رقم تليفونك..." value={customerPhone} onChange={e => { setCustomerPhone(e.target.value); setValidationError(""); }} className="w-full p-2.5 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
              
              <select value={selectedAreaIndex} onChange={e => { setSelectedAreaIndex(Number(e.target.value)); setValidationError(""); }} className="w-full p-2.5 rounded-xl bg-[#1A1D26] border border-white/10 text-white">
                <option value={-1}>اختر منطقة التوصيل...</option>
                {deliveryAreas.map((a, i) => <option key={i} value={i}>{a.name} (+{money(a.price)})</option>)}
              </select>

              <div className="p-2.5 rounded-xl bg-[#1A1D26] space-y-1.5 border border-white/5">
                <p className="text-[10px] text-gray-400 font-bold">موعد التوصيل المطلق:</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <button type="button" onClick={() => setScheduleType("now")} className={`py-1.5 rounded-lg border ${scheduleType === "now" ? "bg-amber-400 text-black font-bold" : "border-white/10 text-gray-300"}`}>⚡ فوري الآن</button>
                  <button type="button" onClick={() => setScheduleType("later")} className={`py-1.5 rounded-lg border ${scheduleType === "later" ? "bg-amber-400 text-black font-bold" : "border-white/10 text-gray-300"}`}>🕒 مجدول لاحقاً</button>
                </div>
                {scheduleType === "later" && <input type="text" placeholder="الموعد (مثال: الساعة 9:30 مساءً)..." value={scheduleTime} onChange={e => { setScheduleTime(e.target.value); setValidationError(""); }} className="w-full p-2 mt-1 rounded-lg bg-[#111319] text-[10px] text-white border border-amber-500/30" />}
              </div>

              <div className="flex gap-1.5">
                <input type="text" placeholder="العنوان بالتفصيل..." value={customerAddress} onChange={e => { setCustomerAddress(e.target.value); setValidationError(""); }} className="flex-1 p-2.5 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
                <button type="button" onClick={handleGetLocation} className="px-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  {geoLoading ? "..." : <Navigation size={15} />}
                </button>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-bold text-amber-400">اختر طريقة الدفع المفضلة:</p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button type="button" onClick={() => setPaymentMethod("cash")} className={`py-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 ${paymentMethod === "cash" ? "bg-amber-400 text-black" : "border-white/10 text-gray-300 bg-[#1A1D26]"}`}><DollarSign size={13}/> كاش</button>
                  <button type="button" onClick={() => setPaymentMethod("electronic")} className={`py-2 rounded-xl border text-[10px] font-bold flex items-center justify-center gap-1 ${paymentMethod === "electronic" ? "bg-amber-400 text-black" : "border-white/10 text-gray-300 bg-[#1A1D26]"}`}><Wallet size={13}/> دفع إلكتروني</button>
                </div>

                {paymentMethod === "electronic" && (
                  <div className="p-3 rounded-2xl bg-black/50 border border-amber-500/30 space-y-2 text-[10px]">
                    <p className="text-amber-400 text-center font-bold">حول المبلغ وانسخ الحساب وارسل اسكرين شوت بالتحويل:</p>
                    
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1D26]">
                      <div className="flex items-center gap-2">
                        <Phone size={13} className="text-amber-400" />
                        <div>
                          <p className="text-[9px] text-gray-400">فودافون كاش</p>
                          <p className="font-bold text-white">{vodafoneCash}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => copyText("vodafone", vodafoneCash)} className="p-1.5 rounded-lg border border-white/10 text-amber-300">
                        {copied === "vodafone" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#1A1D26]">
                      <div className="flex items-center gap-2">
                        <CreditCard size={13} className="text-amber-400" />
                        <div>
                          <p className="text-[9px] text-gray-400">حساب InstaPay</p>
                          <p className="font-bold text-white">{instapay}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => copyText("instapay", instapay)} className="p-1.5 rounded-lg border border-white/10 text-amber-300">
                        {copied === "instapay" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            </div>

            {validationError && <p className="text-[10px] text-red-400 text-center font-bold bg-red-500/10 py-1.5 rounded-lg">{validationError}</p>}

            <button onClick={sendWhatsApp} className="w-full py-3.5 rounded-xl bg-[#25D366] text-white font-black text-xs flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg">
              <MessageCircle size={18} /> تأكيد وإرسال عبر واتساب
            </button>
          </div>
        </div>
      )}

      {/* RESTAURANT CLOSED NOTICE MODAL */}
      {closeNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-sm bg-[#111319] border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-3xl animate-pulse">🍕</div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white">يا غالي، الأفران ريحت شوية.. 👨‍🍳</h3>
              <p className="text-xs text-gray-300 leading-relaxed">بنجهزلك حاجة فريش وطعم يفرّق بكرة! المنيو معاك لفّ فيه براحتك واختار كل اللي تحبه من دلوقتي، وأول ما نفتح هنكون جاهزين نولّع الدنيا! 🔥🚀</p>
            </div>
            <div className="p-3 rounded-2xl bg-[#1A1D26] border border-white/5 space-y-1"><p className="text-[10px] text-gray-400 font-bold">مواعيد استقبال الدليفري والطلبات:</p><p className="text-xs font-black text-amber-400">{restaurantStatus.timeText}</p></div>
            <button onClick={() => setCloseNoticeOpen(false)} className="w-full py-3 rounded-xl bg-amber-400 text-black font-black text-xs shadow-md">حبيبي، هتختار الأكل من دلوقتي واستعد لوقت الفتح! ✨</button>
          </div>
        </div>
      )}

      {/* ENTERPRISE ADMIN DASHBOARD MODAL */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-6xl max-h-[96vh] rounded-3xl border border-amber-500/20 shadow-2xl flex flex-col overflow-hidden" style={{ background: "#0C0E14", color: "#F3E9D8" }}>
            
            <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-[#141721]">
              <div className="flex items-center gap-3">
                <img src={LOGO_SRC} alt="Dream Corner" className="w-9 h-9 rounded-xl border border-amber-500/30 p-0.5 object-contain" />
                <div>
                  <h2 className="text-base font-black text-amber-400 flex items-center gap-1.5">
                    <span>الرئيسية | لوحة تحكم دريم كورنر</span>
                    <span className="text-[9px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Enterprise v23.0</span>
                  </h2>
                  <p className="text-[10px] text-gray-400">مرحباً بك في لوحة التحكّم والذكاء المالي 👋</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={fetchReportsFromSheet} className="px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-400 bg-amber-500/10 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-all">
                  <RefreshCw size={13} className={reportsLoading ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">تحديث البيانات</span>
                </button>
                <button onClick={() => setAdminOpen(false)} className="p-2 rounded-full border border-white/10 text-gray-400 hover:text-white transition-colors"><X size={18} /></button>
              </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-56 border-b md:border-b-0 md:border-l border-white/10 p-3 bg-[#10121A] flex md:flex-col gap-1 overflow-x-auto shrink-0" style={{ scrollbarWidth: "none" }}>
                <button onClick={() => setAdminTab("dashboard")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "dashboard" ? "bg-amber-500 text-black" : "text-gray-400"}`}><Home size={16} /> <span>الرئيسية والتقارير</span></button>
                <button onClick={() => setAdminTab("items")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "items" ? "bg-amber-500 text-black" : "text-gray-400"}`}><Utensils size={16} /> <span>المنيو والأسعار</span></button>
                <button onClick={() => setAdminTab("customers")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "customers" ? "bg-amber-500 text-black" : "text-gray-400"}`}><Users size={16} /> <span>العملاء والمكافآت</span></button>
                <button onClick={() => setAdminTab("delivery")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "delivery" ? "bg-amber-500 text-black" : "text-gray-400"}`}><Bike size={16} /> <span>مناطق الدليفري</span></button>
                <button onClick={() => setAdminTab("settings")} className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${adminTab === "settings" ? "bg-amber-500 text-black" : "text-gray-400"}`}><Settings size={16} /> <span>إعدادات المطعم</span></button>

                <div className="mt-auto pt-4 hidden md:block border-t border-white/10 space-y-2">
                  <button onClick={sendZReportToWhatsApp} className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5"><Share2 size={13} /> <span>تصدير Z-Report</span></button>
                  <button onClick={exportToCSV} className="w-full py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"><Download size={13} /> <span>تحميل Excel</span></button>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto space-y-5 bg-[#0C0E14]">
                {adminTab === "dashboard" && (
                  <div className="space-y-5">
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

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-amber-500/20 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs"><span>الزوار النشطون الآن</span><span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><Users size={14} /></span></div>
                        <div className="my-2"><span className="text-xl font-black text-amber-400">{activeVisitors} زائر 🟢</span></div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><span>متصل لحظياً بالشيت</span></div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-amber-500/20 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs"><span>إجمالي المبيعات</span><span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><DollarSign size={14} /></span></div>
                        <div className="my-2"><span className="text-xl font-black text-amber-400">{money(reportsAnalytics.netTotal)}</span></div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${reportsAnalytics.growthSalesPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>{reportsAnalytics.growthSalesPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}<span>{reportsAnalytics.growthSalesPercent >= 0 ? `+${reportsAnalytics.growthSalesPercent}% عن أمس` : `${reportsAnalytics.growthSalesPercent}% عن أمس`}</span></div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs"><span>صافي المأكولات</span><span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><Utensils size={14} /></span></div>
                        <div className="my-2"><span className="text-xl font-black text-white">{money(reportsAnalytics.totalSales)}</span></div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><CheckCircle2 size={12} /><span>بدون مصاريف التوصيل</span></div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs"><span>إيرادات التوصيل</span><span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400"><Bike size={14} /></span></div>
                        <div className="my-2"><span className="text-xl font-black text-white">{money(reportsAnalytics.totalDelivery)}</span></div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold"><CheckCircle2 size={12} /><span>محسوب حقيقي من الشيت</span></div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#141721] border border-white/5 flex flex-col justify-between">
                        <div className="flex items-center justify-between text-gray-400 text-xs"><span>عدد الطلبات</span><span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400"><ShoppingCart size={14} /></span></div>
                        <div className="my-2"><span className="text-xl font-black text-white">{reportsAnalytics.totalOrders} أوردر</span></div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${reportsAnalytics.growthOrdersPercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>{reportsAnalytics.growthOrdersPercent >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}<span>{reportsAnalytics.growthOrdersPercent >= 0 ? `+${reportsAnalytics.growthOrdersPercent}% عن أمس` : `${reportsAnalytics.growthOrdersPercent}% عن أمس`}</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <div className="flex items-center justify-between"><h3 className="text-xs font-bold text-gray-300 flex items-center gap-2"><TrendingUp size={15} className="text-amber-400" /><span>المبيعات الفعلية خلال آخر 7 أيام (حقيقي)</span></h3><span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">100% Real Data</span></div>
                        <div className="h-44 w-full pt-4 flex items-end justify-between gap-2 px-2 relative border-b border-white/10 pb-2">
                          {reportsAnalytics.sevenDaysChartData.map((pt, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 z-10 group h-full justify-end">
                              <span className="text-[8px] font-bold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">{money(pt.val)}</span>
                              <div className="w-full bg-gradient-to-t from-amber-500/30 to-amber-400 rounded-t-lg transition-all" style={{ height: `${pt.heightPercent}%` }}><div className="w-2 h-2 rounded-full bg-amber-400 mx-auto -mt-1 shadow-md shadow-amber-500/50" /></div>
                              <span className="text-[9px] text-gray-400 truncate mt-1">{pt.day}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2"><Utensils size={15} className="text-amber-400" /><span>أفضل الأصناف مبيعاً 🔥</span></h3>
                        <div className="space-y-2.5">
                          {reportsAnalytics.topItems.length > 0 ? reportsAnalytics.topItems.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-bold"><span className="text-gray-200">{item.name}</span><span className="text-amber-400">{item.qty} وجبات</span></div>
                              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full" style={{ width: `${Math.min(100, item.qty * 15)}%` }} /></div>
                            </div>
                          )) : <p className="text-xs text-center py-8 text-gray-500">جاري تسجيل الأصناف الأكثر طلباً...</p>}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2"><PieChart size={15} className="text-sky-400" /><span>توزيع طرق الدفع</span></h3>
                        <div className="text-xs space-y-2 font-bold py-2">
                          <p>💵 كاش: <span className="text-amber-400">{money(reportsAnalytics.cashSales)}</span></p>
                          <p>📱 إلكتروني: <span className="text-emerald-400">{money(reportsAnalytics.electronicSales)}</span></p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                        <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2"><Clock size={15} className="text-purple-400" /><span>ساعات الذروة والضغط</span></h3>
                        <div className="grid grid-cols-2 gap-2">
                          {reportsAnalytics.peakHours.map((h, i) => (
                            <div key={i} className="p-2 rounded-xl bg-[#1C202E] text-center"><span className="text-xs font-bold text-purple-300 block">{h.hour}</span><span className="text-[9px] text-emerald-400 font-bold">{h.count} أوردر</span></div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#141721] to-[#141721] border border-amber-500/30 space-y-2">
                        <h3 className="text-xs font-black text-amber-400 flex items-center gap-1.5"><Trophy size={16} /><span>العميل الذهبي 👑</span></h3>
                        {reportsAnalytics.goldenCustomer && (
                          <div className="pt-1 text-xs"><p className="font-bold text-white">{reportsAnalytics.goldenCustomer.name}</p><p className="text-[10px] text-gray-400">📱 {reportsAnalytics.goldenCustomer.phone}</p><p className="text-emerald-400 font-bold pt-1">{money(reportsAnalytics.goldenCustomer.spent)} إجمالي المشتريات</p></div>
                        )}
                      </div>
                    </div>

                    {/* إدارة وتحديث حالات الطلبات الحية (مع أزرار التعديل الفوري للآدمن) */}
                    <div className="p-4 rounded-2xl bg-[#141721] border border-white/5 space-y-3">
                      <h3 className="text-xs font-bold text-gray-300 flex items-center gap-2">
                        <ShoppingCart size={15} className="text-amber-400" />
                        <span>إدارة وتحديث حالات الطلبات الحية ({filteredReportsData.length})</span>
                      </h3>

                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {filteredReportsData.slice().reverse().map((row, idx) => {
                          const orderId = String(row["رقم الأوردر"] || "");
                          const currentStatus = String(row["حالة الطلب"] || "جديد");

                          return (
                            <div key={idx} className="p-3.5 rounded-2xl bg-[#1C202E] border border-white/10 text-xs space-y-2.5">
                              
                              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/5 pb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-amber-400">{orderId}</span>
                                    <span className="text-white font-bold">- {row["اسم العميل"]}</span>
                                    <span className="text-[10px] text-gray-400">({row["رقم الموبايل"]})</span>
                                  </div>
                                  <p className="text-[10px] text-gray-400 mt-0.5">📍 {row["المنطقة / القرية"]} ({row["العنوان بالتفصيل"]}) · 🕒 {row["التاريخ والوقت"]}</p>
                                </div>

                                <div className="text-left flex items-center gap-2">
                                  <span className="text-sm font-black text-amber-400">{money(row["الإجمالي النهائي"])}</span>
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                                    currentStatus === "تم التسليم" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                    currentStatus === "ملغي" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                    "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                  }`}>
                                    {currentStatus}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-[10px] gap-2">
                                <span className="text-gray-300 font-bold truncate max-w-xs">🛍️ {row["تفاصيل الطلبات"]}</span>
                                
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-gray-400 ml-1">تغيير الحالة:</span>
                                  <button onClick={() => handleUpdateStatus(orderId, "جاري التحضير")} className={`px-2 py-1 rounded-lg border font-bold ${currentStatus === "جاري التحضير" ? "bg-amber-400 text-black border-amber-400" : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/10"}`}>تحضير 👨‍🍳</button>
                                  <button onClick={() => handleUpdateStatus(orderId, "خرج للتوصيل")} className={`px-2 py-1 rounded-lg border font-bold ${currentStatus === "خرج للتوصيل" ? "bg-amber-400 text-black border-amber-400" : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/10"}`}>في الطريق 🛵</button>
                                  <button onClick={() => handleUpdateStatus(orderId, "تم التسليم")} className={`px-2 py-1 rounded-lg border font-bold ${currentStatus === "تم التسليم" ? "bg-emerald-500 text-white border-emerald-500" : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/10"}`}>تسليم ✅</button>
                                  <button onClick={() => handleUpdateStatus(orderId, "ملغي")} className={`px-2 py-1 rounded-lg border font-bold ${currentStatus === "ملغي" ? "bg-red-500 text-white border-red-500" : "bg-black/40 text-gray-300 border-white/10 hover:bg-white/10"}`}>إلغاء ❌</button>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}

                {adminTab === "items" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-3"><p className="font-bold text-sm text-amber-400">إدارة الأصناف والأسعار</p><button onClick={() => { const id = "n" + Date.now(); setItems([...items, { id, cat: "أصناف جديدة", name: "صنف جديد", price: 20 }]); }} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500 text-black"><PlusCircle size={14} /> إضافة صنف</button></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {items.map((item) => (
                        <div key={item.id} className="p-3 rounded-2xl border border-white/5 bg-[#141721] flex justify-between items-center text-xs">
                          <div><p className="font-bold text-white text-sm">{item.name}</p><p className="text-gray-400">{item.sizes ? item.sizes.map((s) => s.label + ":" + money(s.price)).join(" / ") : money(item.price)}</p></div>
                          <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-2 rounded-full border border-red-500/30 text-red-400"><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "customers" && (
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-amber-400 mb-2">قائمة حسابات العملاء التراكمية</p>
                    {reportsAnalytics.allCustomersList.map((cust, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#141721] border border-white/5 flex justify-between text-xs">
                        <div><p className="font-bold text-white">{idx + 1}. {cust.name}</p><p className="text-[10px] text-gray-400">📱 {cust.phone}</p></div>
                        <div className="text-left"><span className="text-sm font-black text-emerald-400 block">{money(cust.spent)}</span><span className="text-[10px] text-gray-400">{cust.count} أوردرات</span></div>
                      </div>
                    ))}
                  </div>
                )}

                {adminTab === "delivery" && (
                  <div className="space-y-3">
                    <p className="font-bold text-sm text-amber-400 mb-2">إدارة مناطق وقرى الدليفري</p>
                    <div className="flex gap-2">
                      <input type="text" placeholder="اسم القرية" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="flex-1 p-2 rounded-xl bg-[#141721] text-xs text-white" />
                      <input type="number" placeholder="سعر التوصيل" value={newAreaPrice} onChange={(e) => setNewAreaPrice(e.target.value)} className="w-24 p-2 rounded-xl bg-[#141721] text-xs text-white" />
                      <button onClick={() => { if(newAreaName.trim() && newAreaPrice) setDeliveryAreas([...deliveryAreas, { name: newAreaName.trim(), price: Number(newAreaPrice) }]); setNewAreaName(""); setNewAreaPrice(""); }} className="px-4 bg-emerald-600 text-white rounded-xl text-xs font-bold">إضافة</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {deliveryAreas.map((area, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#141721]">
                          <span>{area.name} · <span className="text-amber-400">{money(area.price)}</span></span>
                          <button onClick={() => setDeliveryAreas(deliveryAreas.filter((_, i) => i !== idx))} className="text-red-400"><Trash2 size={12}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {adminTab === "settings" && (
                  <div className="space-y-3 max-w-lg mx-auto text-xs">
                    <p className="font-bold text-sm text-amber-400 mb-2">إعدادات الهوية والأمان والمحافظ</p>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">اسم المطعم:</span><input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">الشعار الفرعي (Slogan):</span><input value={tagline} onChange={e => setTagline(e.target.value)} className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">العنوان الجغرافي:</span><input value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">رقم واتساب الاستقبال:</span><input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} dir="ltr" className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">رقم فودافون كاش:</span><input value={vodafoneCash} onChange={e => setVodafoneCash(e.target.value)} dir="ltr" className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">حساب InstaPay:</span><input value={instapay} onChange={e => setInstapay(e.target.value)} dir="ltr" className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                    <label className="block space-y-1"><span className="text-gray-300 font-bold">رمز الأمان PIN للمدير:</span><input value={adminPin} onChange={e => setAdminPin(e.target.value)} dir="ltr" className="w-full p-2.5 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PIN SECURITY MODAL */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleVerifyPin} className="bg-[#111319] border border-amber-500/30 p-5 rounded-3xl space-y-3 w-full max-w-xs text-center">
            <KeyRound size={32} className="mx-auto text-amber-400" />
            <h3 className="text-sm font-bold text-white">دخول مدير المطعم</h3>
            <input type="password" placeholder="••••" value={enteredPin} onChange={e => setEnteredPin(e.target.value)} className="w-full p-2 text-center rounded-xl bg-[#1A1D26] text-white text-lg tracking-widest border border-white/10" />
            {pinError && <p className="text-[10px] text-red-400 font-bold">{pinError}</p>}
            <button type="submit" className="w-full py-2 rounded-xl bg-amber-400 text-black font-black text-xs">دخول</button>
          </form>
        </div>
      )}

      {/* SUCCESS ORDER MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111319] border border-amber-500/30 p-6 rounded-3xl text-center space-y-3 max-w-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">✓</div>
            <h3 className="text-sm font-bold text-white">تم إرسال أوردرك بنجاح! 🎉</h3>
            <p className="text-xs text-gray-400 leading-relaxed">جاري تحويلك لواتساب المطعم لتأكيد واستلام الفاتورة.</p>
            <button onClick={() => setOrderSuccess(false)} className="w-full py-2 rounded-xl bg-amber-400 text-black font-black text-xs">فهمت، شكراً لك</button>
          </div>
        </div>
      )}

    </div>
  );
}
