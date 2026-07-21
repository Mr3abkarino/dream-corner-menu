import { useState, useEffect, useMemo, useRef } from "react";
import restaurantLogo from "./assets/logo.png";
import {
  ShoppingCart, Plus, Minus, X, Pencil, Trash2, Check, Copy,
  QrCode, Settings, Phone, CreditCard, Sparkles, Search, RotateCcw,
  Palette, Save, PlusCircle, MessageCircle, MapPin, KeyRound, LogOut, FileText, ChevronDown, User, Tag, Navigation, Award, Calendar, DollarSign, Wallet, Flame, BarChart3, RefreshCw, Share2, TrendingUp, Download, PieChart, Crown, Clock, Bike, Utensils, Trophy, Users, Home, ChevronLeft, Star, Percent, ShieldCheck, Headphones, ArrowUpRight, ArrowDownRight, LayoutGrid
} from "lucide-react";

const LOGO_SRC = restaurantLogo;
const MENU_VERSION = "7.0"; // الإصدار الذهبي v7.0: ضبط كافة الملاحظات وإعادة صفحة التقارير الكاملة v4.5
const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbybuw8CuUGV-hf_ecUyevpGB5YioMKCdeOP3PxSKKuzGgMmtcfbHyrd0F81eJg3Z_U/exec";

const THEMES = [
  { id: "brand", name: "هوية دريم كورنر", bg: "#0A0A0A", surface: "#141414", surface2: "#1F1F1F", accent: "#D4AF37", accent2: "#8B1E1E", text: "#F3E9D8", muted: "#A3A3A3" }
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
  const theme = THEMES[0];
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
  const [adminTab, setAdminTab] = useState("reports"); // 'reports' | 'items' | 'settings'
  const [qrOpen, setQrOpen] = useState(false);
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
  const [dailyTarget, setDailyTarget] = useState(3000);

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
    if (adminOpen && adminTab === "reports") {
      fetchReportsFromSheet();
    }
  }, [adminOpen, adminTab]);

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

  // إحصائيات تقارير اللوحة الشاملة بالكامل v4.5
  const reportsAnalytics = useMemo(() => {
    if (!filteredReportsData || filteredReportsData.length === 0) {
      return {
        totalOrders: 0, totalSales: 0, totalDelivery: 0, netTotal: 0,
        cashSales: 0, electronicSales: 0, instantOrders: 0, scheduledOrders: 0,
        topArea: "لا يوجد", goldenCustomer: null, allCustomersList: [], topItems: [], peakHours: [], deliveryBreakdown: []
      };
    }
    
    let totalSales = 0;
    let totalDelivery = 0;
    let netTotal = 0;
    let cashSales = 0;
    let electronicSales = 0;
    let instantOrders = 0;
    let scheduledOrders = 0;
    
    const areasMap = {};
    const customersMap = {};
    const itemsMap = {};
    const hoursMap = {};

    filteredReportsData.forEach(row => {
      const cartVal = Number(row["حساب الأكل الأصلي"]) || 0;
      const delVal = Number(row["مصاريف التوصيل"]) || 0;
      const finalVal = Number(row["الإجمالي النهائي"]) || 0;
      const area = row["المنطقة / القرية"] || "غير محدد";
      const pay = row["طريقة الدفع"] || "";
      const sched = row["نوع وموعد التوصيل"] || "";
      const custName = row["اسم العميل"] || "عميل بدون اسم";
      const custPhone = row["رقم الموبايل"] || "";
      const itemsText = row["تفاصيل الطلبات"] || "";
      const timestamp = row["التاريخ والوقت"] || "";

      totalSales += cartVal;
      totalDelivery += delVal;
      netTotal += finalVal;

      if (pay.includes("إلكتروني")) electronicSales += finalVal;
      else cashSales += finalVal;

      if (sched.includes("مجدول")) scheduledOrders++;
      else instantOrders++;

      if (!areasMap[area]) areasMap[area] = { count: 0, deliveryFees: 0 };
      areasMap[area].count += 1;
      areasMap[area].deliveryFees += delVal;

      const custKey = custPhone ? custPhone.trim() : custName.trim();
      if (!customersMap[custKey]) {
        customersMap[custKey] = { name: custName, phone: custPhone, count: 0, spent: 0, lastArea: area };
      }
      customersMap[custKey].count += 1;
      customersMap[custKey].spent += finalVal;
      customersMap[custKey].lastArea = area;

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
          
          const hourLabel = hour >= 12 ? `${hour === 12 ? 12 : hour - 12} مساءً` : `${hour === 0 ? 12 : hour} صباحاً`;
          hoursMap[hourLabel] = (hoursMap[hourLabel] || 0) + 1;
        }
      }
    });

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
      .slice(0, 3);

    const deliveryBreakdown = Object.entries(areasMap)
      .map(([area, data]) => ({ area, count: data.count, fees: data.deliveryFees }))
      .sort((a, b) => b.count - a.count);

    return {
      totalOrders: filteredReportsData.length,
      totalSales,
      totalDelivery,
      netTotal,
      cashSales,
      electronicSales,
      instantOrders,
      scheduledOrders,
      topArea: topArea + " (" + maxCount + " أوردر)",
      goldenCustomer,
      allCustomersList: sortedCustomers,
      topItems,
      peakHours,
      deliveryBreakdown
    };
  }, [filteredReportsData]);

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
      setAdminOpen(true);
    } else {
      setPinError("رمز الأمان PIN غير صحيح!");
      setEnteredPin("");
    }
  };

  const categories = useMemo(() => ["الكل", ...new Set(items.map((i) => i.cat))], [items]);
  const bestSellerItems = useMemo(() => items.filter(item => item.isBestSeller).sort((a,b) => (a.rank || 99) - (b.rank || 99)), [items]);

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

  const updateItem = (id, patch) => setItems((its) => its.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const updateSize = (id, sizeIdx, patch) => setItems((its) => its.map((i) => i.id === id ? { ...i, sizes: i.sizes.map((s, idx) => (idx === sizeIdx ? { ...s, ...patch } : s)) } : i));
  const deleteItem = (id) => setItems((its) => its.filter((i) => i.id !== id));

  const addNewItem = () => {
    const id = "n" + Date.now().toString();
    setItems((its) => [...its, { id, cat: activeCat === "الكل" ? "أصناف جديدة" : activeCat, name: "صنف جديد", price: 20, desc: "" }]);
    setEditingId(id);
  };

  const handleAddDeliveryArea = () => {
    if (!newAreaName.trim() || !newAreaPrice.trim()) return;
    setDeliveryAreas([...deliveryAreas, { name: newAreaName.trim(), price: Number(newAreaPrice) }]);
    setNewAreaName(""); setNewAreaPrice("");
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
    if (scheduleType === "later" && !scheduleTime) {
      setValidationError("برجاء اختيار وقت وموعد التوصيل المطلق!");
      return;
    }
    setValidationError("");

    if (appliedDiscountPercent > 0 && enteredPromo.trim()) {
      const codeClean = enteredPromo.trim().toUpperCase();
      setPromoCodes(prevCodes => prevCodes.map(p => {
        if (p.code === codeClean) return { ...p, used: p.used + 1 };
        return p;
      }));
    }

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
               
    if (geoLink) text += "📍 لوكيشن خريطة العميل: " + geoLink + "\n";
    if (customerNotes.trim()) text += "📝 ملاحظات العميل: " + customerNotes.trim() + "\n";
    
    text += "\nالطلبات:\n" + lines.join("\n") + "\n\n" +
            "💵 حساب الأكل الأصلي: " + money(cartTotal) + "\n";
            
    if (discountAmount > 0) text += "🏷 كود الخصم المطبق: " + enteredPromo.toUpperCase() + " (-" + appliedDiscountPercent + "%)\n📉 قيمة الخصم: " + money(discountAmount) + "\n";
    if (redeemPoints && pointsDiscountValue > 0) text += "🪙 خصم نقاط محفظة الولاء: -" + money(pointsDiscountValue) + " (تم خصم " + pointsDiscountValue + " نقطة)\n";

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
    setPaymentMethod("cash");
  };

  const copyText = (label, value) => {
    const ok = copyTextToClipboard(value);
    if (ok) { setCopied(label); setTimeout(() => setCopied(""), 1500); }
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

  return (
    <div dir="rtl" className="min-h-screen bg-[#08090C] text-white font-['Tajawal'] pb-28">
      
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
          <button onClick={() => setCartOpen(true)} className="p-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 relative">
            <ShoppingCart size={16} />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-black rounded-full flex items-center justify-center">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* PERSONALIZED WELCOME BANNER FOR SAVED CUSTOMERS */}
      {customerName && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Crown size={15} className="text-amber-400 animate-bounce" />
            <span className="font-bold text-amber-300">أهلاً بعودتك يا {customerName}! 👋</span>
          </div>
          {userPoints > 0 && (
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-black flex items-center gap-1">
              🪙 {userPoints} نقطة ذهبية
            </span>
          )}
        </div>
      )}

      {/* HERO BANNER SECTION (مع إضافة حالة العمل مفتوح/مغلق) */}
      <section className="relative w-full h-60 sm:h-72 overflow-hidden flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" alt="Delicious Pizza" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/60 to-transparent" />

        <div className="relative z-10 text-center px-4 space-y-2.5">
          <h1 className="text-2xl sm:text-4xl font-black text-amber-400 tracking-wide drop-shadow-md">{restaurantName}</h1>
          <p className="text-xs sm:text-sm text-gray-300 font-bold opacity-90">{tagline}</p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] font-bold">
            {/* الشارة المطلوبة: حالة المطعم حسب مواعيد العمل */}
            <span className="px-3 py-1 rounded-full bg-black/70 border border-white/10 font-black flex items-center gap-1" style={{ color: status.isOpen ? "#22c55e" : "#ef4444" }}>
              {status.text}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-gray-200 flex items-center gap-1">
              <Bike size={12} className="text-amber-400" /> توصيل سريع لجميع القرى
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-gray-200 flex items-center gap-1">
              <Clock size={12} className="text-amber-400" /> {status.timeText}
            </span>
            <span className="px-3 py-1 rounded-full bg-black/60 border border-amber-500/30 text-amber-300 flex items-center gap-1">
              <Star size={12} className="fill-amber-400 text-amber-400" /> 4.9 (1250+ تقييم)
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORIES NAV BAR */}
      <nav className="sticky top-[57px] z-20 bg-[#08090C]/95 backdrop-blur-md border-y border-white/10 py-3 px-4">
        <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-5 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 ${activeCat === c ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20" : "bg-[#141721] text-gray-300 border border-white/5 hover:bg-white/10"}`}
            >
              <span>{c === "البيتزا" ? "🍕" : c === "السندوتشات" ? "🥪" : c === "المشروبات" ? "🥤" : "🍽"}</span>
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

      {/* OFFERS SLIDER (تم التحديث لـ: انتظروا قريباً) */}
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

      {/* TOP BEST SELLERS ("الأكثر طلباً 🔥") */}
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
              <div key={item.id} className="bg-[#111319] border border-white/10 rounded-3xl p-3 flex flex-col justify-between relative shadow-lg hover:border-amber-500/40 transition-all">
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center z-10 shadow">
                  {item.rank || 1}
                </span>

                <div className="space-y-1 mt-1">
                  <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                  <p className="text-[9px] text-gray-400 line-clamp-2 leading-relaxed">{item.desc || "الوجبة الأكثر طلباً وشهيرة من دريم كورنر!"}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5">
                  {item.sizes ? (
                    item.sizes.slice(0, 2).map((sz) => {
                      const key = item.id + "::" + sz.label;
                      return (
                        <div key={sz.label} className="flex items-center justify-between text-[9px] bg-[#1A1D26] p-1 px-2 rounded-xl">
                          <span className="text-gray-300 font-bold">{sz.label}</span>
                          <button onClick={() => addToCart(key, 1)} className="text-amber-400 font-black hover:underline">{money(sz.price)} +</button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-black text-amber-400">{money(item.price)}</span>
                      <button onClick={() => addToCart(item.id, 1)} className="p-1.5 rounded-full bg-amber-400 text-black"><Plus size={12} /></button>
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
                  <div key={item.id} className="bg-[#111319] border border-white/10 rounded-3xl p-3.5 flex flex-col justify-between shadow-md hover:border-amber-500/30 transition-all">
                    <div className="space-y-1">
                      <h3 className="text-xs font-black text-white">{item.name}</h3>
                      {item.desc && <p className="text-[10px] text-gray-400 leading-relaxed">{item.desc}</p>}
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5">
                      {item.sizes ? (
                        item.sizes.map((sz) => {
                          const key = item.id + "::" + sz.label;
                          const qty = cart[key] || 0;
                          return (
                            <div key={sz.label} className="flex items-center justify-between text-[10px] bg-[#1A1D26] p-1.5 px-2.5 rounded-xl">
                              <span className="text-gray-300 font-bold">{sz.label}</span>
                              <span className="text-amber-400 font-black">{money(sz.price)}</span>
                              {qty > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => addToCart(key, -1)} className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center"><Minus size={9} /></button>
                                  <span className="font-bold text-white text-xs">{qty}</span>
                                  <button onClick={() => addToCart(key, 1)} className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center"><Plus size={9} /></button>
                                </div>
                              ) : (
                                <button onClick={() => addToCart(key, 1)} className="p-1 rounded-full bg-amber-400 text-black"><Plus size={10} /></button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400">{money(item.price)}</span>
                          {cart[item.id] > 0 ? (
                            <div className="flex items-center gap-1.5 bg-[#1A1D26] px-2 py-0.5 rounded-full">
                              <button onClick={() => addToCart(item.id, -1)} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"><Minus size={10} /></button>
                              <span className="font-bold text-xs">{cart[item.id]}</span>
                              <button onClick={() => addToCart(item.id, 1)} className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center"><Plus size={10} /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(item.id, 1)} className="p-2 rounded-full bg-amber-400 text-black active:scale-95"><Plus size={12} /></button>
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

      {/* FLOATING CART BUTTON */}
      {cartCount > 0 && (
        <div className="fixed bottom-16 inset-x-0 z-30 px-4">
          <div onClick={() => setCartOpen(true)} className="max-w-md mx-auto bg-amber-400 text-black p-3 rounded-2xl shadow-2xl flex items-center justify-between cursor-pointer active:scale-98 transition-all">
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

      {/* CART DRAWER MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#111319] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[88vh] overflow-y-auto" dir="rtl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-black text-amber-400">سلة المشتريات 🛒</h3>
              <button onClick={() => setCartOpen(false)} className="p-1 rounded-full bg-white/10"><X size={16} /></button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {cartList.map((cartItem) => (
                <div key={cartItem.key} className="flex items-center justify-between text-xs p-2.5 bg-[#1A1D26] rounded-xl">
                  <div>
                    <p className="font-bold text-white">{cartItem.label}</p>
                    <p className="text-amber-400 font-bold">{money(cartItem.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addToCart(cartItem.key, -1)} className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"><Minus size={12} /></button>
                    <span className="font-bold text-white">{cartItem.qty}</span>
                    <button onClick={() => addToCart(cartItem.key, 1)} className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center"><Plus size={12} /></button>
                  </div>
                </div>
              ))}
            </div>

            {userPoints > 0 && (
              <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>🪙 محفظة النقاط: لديك {userPoints} نقطة</span>
                  <span>تساوي {money(userPoints)} خصم</span>
                </div>
                <button onClick={() => setRedeemPoints(!redeemPoints)} className={`w-full py-1 rounded-lg text-[10px] font-black ${redeemPoints ? "bg-emerald-600 text-white" : "bg-amber-400 text-black"}`}>
                  {redeemPoints ? "✓ تم تطبيق خصم النقاط" : "اضغط هنا لاستبدال النقاط بخصم فوري"}
                </button>
              </div>
            )}

            <div className="space-y-1 pt-2 border-t border-white/10 text-xs">
              <div className="flex justify-between text-gray-300"><span>حساب المأكولات:</span><span>{money(cartTotal)}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>خصم الكوبون (-{appliedDiscountPercent}%):</span><span>-{money(discountAmount)}</span></div>}
              {redeemPoints && pointsDiscountValue > 0 && <div className="flex justify-between text-emerald-400"><span>خصم النقاط:</span><span>-{money(pointsDiscountValue)}</span></div>}
              <div className="flex justify-between text-gray-300"><span>توصيل لـ ({selectedAreaIndex >= 0 ? activeDeliveryArea.name : "لم تحدد"}):</span><span>{money(activeDeliveryArea.price)}</span></div>
              <div className="flex justify-between pt-2 text-sm font-black border-t border-white/10"><span>الإجمالي النهائي:</span><span className="text-amber-400">{money(finalTotal)}</span></div>
            </div>

            <div className="flex gap-2">
              <input type="text" placeholder="كوبون خصم؟" value={enteredPromo} onChange={e => setEnteredPromo(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl bg-[#1A1D26] border border-white/10 text-xs text-white uppercase" />
              <button onClick={handleApplyPromo} className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">تطبيق</button>
            </div>
            {promoError && <p className="text-[10px] text-red-400 font-bold">{promoError}</p>}

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <input type="text" placeholder="اسمك الكريم..." value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-2 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
              <input type="tel" placeholder="رقم تليفونك..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-2 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
              
              <select value={selectedAreaIndex} onChange={e => setSelectedAreaIndex(Number(e.target.value))} className="w-full p-2 rounded-xl bg-[#1A1D26] border border-white/10 text-white">
                <option value={-1}>اختر منطقة التوصيل...</option>
                {deliveryAreas.map((a, i) => <option key={i} value={i}>{a.name} (+{money(a.price)})</option>)}
              </select>

              <div className="p-2 rounded-xl bg-[#1A1D26] space-y-1.5">
                <p className="text-[10px] text-gray-400 font-bold">موعد التوصيل المطلق:</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <button type="button" onClick={() => setScheduleType("now")} className={`py-1 rounded-lg border ${scheduleType === "now" ? "bg-amber-400 text-black font-bold" : "border-white/10"}`}>⚡ فوري الآن</button>
                  <button type="button" onClick={() => setScheduleType("later")} className={`py-1 rounded-lg border ${scheduleType === "later" ? "bg-amber-400 text-black font-bold" : "border-white/10"}`}>🕒 مجدول لاحقاً</button>
                </div>
                {scheduleType === "later" && <input type="text" placeholder="الموعد (مثال: الساعة 9:30 مساءً)..." value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full p-1.5 mt-1 rounded-lg bg-[#111319] text-[10px] text-white border border-amber-500/30" />}
              </div>

              <div className="flex gap-1.5">
                <input type="text" placeholder="العنوان بالتفصيل..." value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="flex-1 p-2 rounded-xl bg-[#1A1D26] border border-white/10 text-white" />
                <button type="button" onClick={handleGetLocation} className="px-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center">
                  {geoLoading ? "..." : <Navigation size={13} />}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button type="button" onClick={() => setPaymentMethod("cash")} className={`py-1.5 rounded-xl border text-[10px] font-bold ${paymentMethod === "cash" ? "bg-amber-400 text-black" : "border-white/10 text-gray-300"}`}>💵 كاش</button>
                <button type="button" onClick={() => setPaymentMethod("electronic")} className={`py-1.5 rounded-xl border text-[10px] font-bold ${paymentMethod === "electronic" ? "bg-amber-400 text-black" : "border-white/10 text-gray-300"}`}>📱 دفع إلكتروني</button>
              </div>

              {paymentMethod === "electronic" && (
                <div className="p-2 rounded-xl bg-black/40 border border-amber-500/30 space-y-1 text-[10px]">
                  <p className="text-amber-400 text-center font-bold">فودافون كاش: {vodafoneCash}</p>
                  <p className="text-amber-400 text-center font-bold">إنستا باي: {instapay}</p>
                </div>
              )}
            </div>

            {validationError && <p className="text-[10px] text-red-400 text-center font-bold">{validationError}</p>}

            <button onClick={sendWhatsApp} className="w-full py-3 rounded-xl bg-[#25D366] text-white font-black text-xs flex items-center justify-center gap-2">
              <MessageCircle size={18} /> تأكيد وإرسال عبر واتساب
            </button>
          </div>
        </div>
      )}

      {/* FULL ADMIN DASHBOARD MODAL (شاشة التقارير واللوحة الإدارية الشاملة v4.5 بالكامل) */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto" dir="rtl">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-amber-500/30 bg-[#0C0E14] text-[#F3E9D8] p-5 overflow-y-auto space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-black text-amber-400 flex items-center gap-2">
                <span>لوحة الذكاء والتقارير الشاملة 👑</span>
              </h2>
              <button onClick={() => setAdminOpen(false)} className="p-1 rounded-full bg-white/10 text-gray-300"><X size={16} /></button>
            </div>

            {/* TABS */}
            <div className="flex gap-1 p-1 rounded-xl bg-[#1C202E] border border-white/10">
              <button onClick={() => setAdminTab("reports")} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${adminTab === "reports" ? "bg-amber-500 text-black" : "text-gray-400"}`}>التقارير الشاملة</button>
              <button onClick={() => setAdminTab("items")} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${adminTab === "items" ? "bg-amber-500 text-black" : "text-gray-400"}`}>المنيو والأسعار</button>
              <button onClick={() => setAdminTab("settings")} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${adminTab === "settings" ? "bg-amber-500 text-black" : "text-gray-400"}`}>الإعدادات</button>
            </div>

            {/* TAB 1: REPORTS */}
            {adminTab === "reports" && (
              <div className="space-y-4">
                <div className="space-y-2 bg-[#141721] p-2.5 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400">الفترة الزمنية:</span>
                    <button onClick={fetchReportsFromSheet} className="p-1 px-2.5 rounded-lg border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                      <RefreshCw size={11} className={reportsLoading ? "animate-spin" : ""} />
                      <span>تحديث الحسابات</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[10px] font-bold">
                    <button onClick={() => setReportDateFilter("today")} className={`py-1.5 rounded-lg border ${reportDateFilter === "today" ? "bg-amber-400 text-black font-bold" : "border-white/10 text-gray-400"}`}>اليوم</button>
                    <button onClick={() => setReportDateFilter("yesterday")} className={`py-1.5 rounded-lg border ${reportDateFilter === "yesterday" ? "bg-amber-400 text-black font-bold" : "border-white/10 text-gray-400"}`}>أمس</button>
                    <button onClick={() => setReportDateFilter("all")} className={`py-1.5 rounded-lg border col-span-2 ${reportDateFilter === "all" ? "bg-amber-400 text-black font-bold" : "border-white/10 text-gray-400"}`}>الكل</button>
                  </div>

                  <input type="text" placeholder="بحث باسم العميل، الموبايل، القرية..." value={reportSearchQuery} onChange={(e) => setReportSearchQuery(e.target.value)} className="w-full px-3 py-1.5 rounded-xl text-[11px] bg-[#1C202E] border border-white/10 text-white focus:outline-none" />
                </div>

                {reportsLoading ? (
                  <div className="text-center py-8 space-y-2"><RefreshCw size={24} className="animate-spin mx-auto text-amber-400" /><p className="text-xs text-gray-400">جاري سحب تحليلات المبيعات من Google Sheets...</p></div>
                ) : (
                  <>
                    {/* الوسام الذهبي */}
                    {reportsAnalytics.goldenCustomer && (
                      <div className="p-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-600/20 space-y-1">
                        <div className="flex items-center justify-between text-xs font-black text-amber-400">
                          <span className="flex items-center gap-1"><Trophy size={15} /><span>🏆 الوسام الذهبي لأكثر العملاء شراءً</span></span>
                          <span className="text-[8px] px-2 py-0.5 rounded-full bg-amber-400 text-black">VIP #1</span>
                        </div>
                        <div className="flex justify-between pt-1 text-xs">
                          <div><p className="font-bold text-white">{reportsAnalytics.goldenCustomer.name}</p><p className="text-[10px] text-gray-400">📱 {reportsAnalytics.goldenCustomer.phone}</p></div>
                          <div className="text-left"><p className="font-black text-emerald-400">{money(reportsAnalytics.goldenCustomer.spent)}</p><p className="text-[9px] text-amber-300">{reportsAnalytics.goldenCustomer.count} أوردرات</p></div>
                        </div>
                      </div>
                    )}

                    {/* شريط الهدف المالي */}
                    <div className="p-3 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-amber-500/5 space-y-1.5">
                      <div className="flex justify-between text-xs font-bold"><span className="text-amber-400 flex items-center gap-1"><TrendingUp size={14} /><span>تحقيق الهدف المالي:</span></span><span>{reportsAnalytics.netTotal} / {dailyTarget} جنيه</span></div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500" style={{ width: `${Math.min(100, Math.round((reportsAnalytics.netTotal / dailyTarget) * 100))}%` }} /></div>
                      <p className="text-[9px] text-gray-400 font-bold">تم تحقيق {Math.round((reportsAnalytics.netTotal / dailyTarget) * 100)}% من المستهدف المقدر بـ {dailyTarget} ج.م</p>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-2xl bg-[#141721] border border-amber-500/30"><span className="text-[10px] text-gray-400">عدد الطلبات الكلي</span><p className="text-lg font-black text-amber-400 mt-1">{reportsAnalytics.totalOrders} أوردر</p></div>
                      <div className="p-3 rounded-2xl bg-[#141721] border border-emerald-500/30"><span className="text-[10px] text-gray-400">صافي الدخل النهائي</span><p className="text-lg font-black text-emerald-400 mt-1">{money(reportsAnalytics.netTotal)}</p></div>
                      <div className="p-3 rounded-2xl bg-[#141721] border border-white/10"><span className="text-[10px] text-gray-400">مبيعات المأكولات</span><p className="text-xs font-bold text-white mt-1">{money(reportsAnalytics.totalSales)}</p></div>
                      <div className="p-3 rounded-2xl bg-[#141721] border border-white/10"><span className="text-[10px] text-gray-400">إيرادات الدليفري</span><p className="text-xs font-bold text-white mt-1">{money(reportsAnalytics.totalDelivery)}</p></div>
                    </div>

                    {/* أشرطة التوزيع الملونة */}
                    <div className="p-3 rounded-2xl bg-[#141721] border border-white/10 space-y-2.5">
                      <p className="text-xs font-bold text-amber-400 flex items-center gap-1"><PieChart size={14} /><span>تحليل نوع الدفع والتوصيل:</span></p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold"><span>💵 كاش: {money(reportsAnalytics.cashSales)}</span><span className="text-emerald-400">📱 إلكتروني: {money(reportsAnalytics.electronicSales)}</span></div>
                        <div className="w-full h-2 rounded-full overflow-hidden flex bg-black/40"><div style={{ width: `${reportsAnalytics.netTotal ? (reportsAnalytics.cashSales / reportsAnalytics.netTotal) * 100 : 50}%` }} className="bg-amber-500 h-full" /><div style={{ width: `${reportsAnalytics.netTotal ? (reportsAnalytics.electronicSales / reportsAnalytics.netTotal) * 100 : 50}%` }} className="bg-emerald-500 h-full" /></div>
                      </div>
                      <div className="pt-1 text-[10px] flex justify-between font-bold border-t border-white/5"><span className="text-gray-400">القرية الأكثر طلباً:</span><span className="text-amber-400">{reportsAnalytics.topArea}</span></div>
                    </div>

                    {/* أزرار التصدير */}
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={sendZReportToWhatsApp} className="py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1"><Share2 size={13} /><span>تصدير Z-Report</span></button>
                      <button onClick={exportToCSV} className="py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1"><Download size={13} /><span>تحميل Excel</span></button>
                    </div>

                    {/* سجل الأوردرات الأخيرة */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <p className="text-xs font-bold text-amber-400">سجل الطلبات الأخير ({filteredReportsData.length} أوردر):</p>
                      <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                        {filteredReportsData.slice().reverse().map((row, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-[#141721] border border-white/5 text-xs space-y-1">
                            <div className="flex justify-between font-bold"><span>{row["اسم العميل"] || "عميل"} ({row["رقم الموبايل"]})</span><span className="text-amber-400">{money(row["الإجمالي النهائي"])}</span></div>
                            <p className="text-[10px] text-gray-400 truncate">🍽 {row["تفاصيل الطلبات"]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: ITEMS */}
            {adminTab === "items" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2"><p className="font-bold text-xs text-amber-400">تعديل أصناف المنيو</p><button onClick={addNewItem} className="px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold">+ إضافة صنف</button></div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item.id} className="p-2.5 rounded-xl bg-[#141721] border border-white/5 text-xs flex justify-between items-center">
                      <div><p className="font-bold text-white">{item.name}</p><p className="text-amber-400 text-[10px]">{item.sizes ? item.sizes.map(s => s.label + ":" + money(s.price)).join(" / ") : money(item.price)}</p></div>
                      <button onClick={() => deleteItem(item.id)} className="p-1 text-red-400"><Trash2 size={13}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SETTINGS */}
            {adminTab === "settings" && (
              <div className="space-y-3 text-xs max-w-sm mx-auto">
                <label className="block space-y-1"><span className="text-gray-400">اسم المطعم:</span><input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} className="w-full p-2 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
                <label className="block space-y-1"><span className="text-gray-400">رمز الأمان PIN:</span><input value={adminPin} onChange={e => setAdminPin(e.target.value)} className="w-full p-2 bg-[#141721] rounded-xl text-white border border-white/10" /></label>
              </div>
            )}

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

    </div>
  );
}
