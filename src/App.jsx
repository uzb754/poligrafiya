import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import { 
  Printer, 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
  Trash2,
  Plus,
  Layers,
  Package,
  Image as ImageIcon,
  FileText,
  ShoppingBag,
  Clock,
  Instagram,
  Send as TelegramIcon,
  Facebook,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Edit,
  Save,
  ChevronLeft,
  ChevronRight,
  Activity,
  Users,
  Eye,
  UserCheck,
  Cpu
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc,
  doc, 
  setDoc,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Sahifalar
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import Portfolio from './pages/Portfolio';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';

// --- TELEGRAM BOTGA XABAR YUBORISH FUNKSIYASI ---
const sendTelegramNotification = async (orderData) => {
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '7683966754:AAE1eIMceOA4Dax5WGyy1Gp9ghRFFOinDhY';
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '6053383227';

  const text = `
<b>🛍 YANGI BUYURTMA!</b>

👤 <b>Ism:</b> ${orderData.name}
📞 <b>Tel:</b> <code>${orderData.phone}</code>
🛠 <b>Xizmat:</b> ${orderData.service}
📝 <b>Izoh:</b> ${orderData.description || 'Izoh qoldirilmagan'}
⏰ <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ')}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      })
    });
  } catch (err) {
    console.error("Telegram xabarnoma yuborishda xatolik:", err);
  }
};

// --- STRELKA BILAN RASMLARNI ALMASHTIRISH KOMPONENTI ---
export function ImageCarousel({ images = [], title = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageList = images.filter(Boolean);

  if (imageList.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-600 bg-zinc-950">
        <ImageIcon className="w-10 h-10" />
      </div>
    );
  }

  const prevSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-full group overflow-hidden bg-zinc-950">
      <img
        src={imageList[currentIndex]}
        alt={title}
        className="w-full h-full object-cover transition-all duration-300"
      />

      {imageList.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/80 text-white hover:bg-lime-400 hover:text-zinc-950 transition cursor-pointer border border-zinc-800 shadow-md opacity-80 group-hover:opacity-100 z-10"
            title="Oldingi rasm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/80 text-white hover:bg-lime-400 hover:text-zinc-950 transition cursor-pointer border border-zinc-800 shadow-md opacity-80 group-hover:opacity-100 z-10"
            title="Keyingi rasm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-950/70 border border-zinc-800/80 z-10">
            {imageList.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-lime-400 w-3' : 'bg-zinc-600'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// --- ADMIN REKLAMA DASHBOARD ---
function AdminReklama() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('analytics');

  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Analytics stats
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalPageViews, setTotalPageViews] = useState(0);
  const [convertedUsersCount, setConvertedUsersCount] = useState(0);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    client: '',
    materials: '',
    technologies: ''
  });
  const [images, setImages] = useState([]);

  const correctLogin = import.meta.env.VITE_ADMIN_LOGIN || 'Jaloliddin';
  const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD || '951903181';

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginInput === correctLogin && passwordInput === correctPassword) {
      setIsLoggedIn(true);
      setError('');
      fetchAllData();
    } else {
      setError('Login yoki parol xato!');
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    // Online foydalanuvchilarni real-vaqt rejimida hisoblash
    const unsubscribeOnline = onSnapshot(collection(db, 'online_users'), (snapshot) => {
      const now = Date.now();
      let activeUsers = 0;
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.lastSeen && now - data.lastSeen < 30000) { // 30 soniya ichida faol bo'lganlar
          activeUsers++;
        }
      });
      setOnlineCount(activeUsers);
    });

    // Sayt tashriflari va buyurtma berganlar sonini kuzatish
    const unsubscribeAnalytics = onSnapshot(collection(db, 'analytics'), (snapshot) => {
      let pageViews = 0;
      let orderUsers = 0;
      snapshot.forEach((docSnap) => {
        if (docSnap.id === 'pageviews') pageViews = docSnap.data().count || 0;
        if (docSnap.id === 'order_users') orderUsers = docSnap.data().count || 0;
      });
      setTotalPageViews(pageViews);
      setConvertedUsersCount(orderUsers);
    });

    return () => {
      unsubscribeOnline();
      unsubscribeAnalytics();
    };
  }, [isLoggedIn]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const oSnap = await getDocs(collection(db, 'orders'));
      setOrders(oSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const sSnap = await getDocs(collection(db, 'services'));
      setServices(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const pSnap = await getDocs(collection(db, 'products'));
      setProducts(pSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const portSnap = await getDocs(collection(db, 'portfolio'));
      setPortfolio(portSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const bSnap = await getDocs(collection(db, 'blog'));
      setBlogs(bSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_SIZE = 800;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
          resolve(compressedBase64);
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 2) {
      alert("Maksimal 2 ta rasm yuklashingiz mumkin!");
      return;
    }

    for (const file of files) {
      try {
        const compressedBase64 = await compressImage(file);
        setImages(prev => [...prev, compressedBase64].slice(0, 2));
      } catch (err) {
        console.error("Rasm yuklashda xatolik:", err);
      }
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: '', 
      price: '', 
      category: '', 
      client: '',
      materials: '',
      technologies: ''
    });
    setImages([]);
    setEditingId(null);
  };

  const handleStartEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      price: item.price || '',
      category: item.category || '',
      client: item.client || '',
      materials: item.materials || '',
      technologies: item.technologies || ''
    });
    setImages(item.images || (item.imageUrl ? [item.imageUrl, item.imageUrl2].filter(Boolean) : []));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSaveItem = async (e, collectionName) => {
    e.preventDefault();
    try {
      const itemData = {
        ...formData,
        imageUrl: images[0] || '',
        imageUrl2: images[1] || '',
        images: images,
        updatedAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), itemData);
        alert("Muvaffaqiyatli tahrirlandi!");
      } else {
        itemData.createdAt = serverTimestamp();
        await addDoc(collection(db, collectionName), itemData);
        alert("Muvaffaqiyatli qo'shildi!");
      }

      resetForm();
      fetchAllData();
    } catch (err) {
      console.error("Xatolik:", err);
      alert("Xatolik yuz berdi: " + err.message);
    }
  };

  const handleDeleteItem = async (collectionName, id) => {
    if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        fetchAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-zinc-950">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 md:p-10 rounded-3xl max-w-md w-full space-y-6 shadow-2xl shadow-lime-500/5">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center mx-auto text-lime-400 shadow-lg shadow-lime-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Paneli</h2>
            <p className="text-zinc-400 text-xs">Tizimga kirish uchun maxfiy kalitlarni kiriting</p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Login</label>
              <input
                type="text"
                required
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Parol</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-sm focus:border-lime-400 focus:ring-1 focus:ring-lime-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-bold rounded-xl text-sm transition duration-200 cursor-pointer shadow-lg shadow-lime-400/20 active:scale-[0.99]"
            >
              Tizimga kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Statistika / Online', icon: Activity, count: onlineCount },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, count: orders.length },
    { id: 'services', label: 'Xizmatlar (/services)', icon: Layers, count: services.length },
    { id: 'products', label: 'Mahsulotlar (/products)', icon: Package, count: products.length },
    { id: 'portfolio', label: 'Portfolio (/portfolio)', icon: ImageIcon, count: portfolio.length },
    { id: 'blog', label: 'Maqolalar (/blog)', icon: FileText, count: blogs.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 backdrop-blur-xl p-6 border border-zinc-800/80 rounded-3xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-zinc-400 text-xs">Jaloliddin — Boshqaruv Markazi</p>
          </div>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <LogOut className="w-4 h-4" /> Chiqish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigatsiya */}
        <div className="space-y-2.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); resetForm(); }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-lime-400 text-zinc-950 shadow-lg shadow-lime-400/15' 
                    : 'bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800/80 hover:text-white border border-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                  isActive ? 'bg-zinc-950 text-lime-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tarkib paneli */}
        <div className="lg:col-span-3 space-y-6">

          {/* ONLINE ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                    <Activity className="w-5 h-5 text-lime-400" />
                    Jonli Monitoring va Trafik
                  </h2>
                  <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-lime-400 text-xs font-extrabold">
                    <span className="w-2 h-2 rounded-full bg-lime-400 animate-ping" /> Live
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Online foydalanuvchilar */}
                  <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-semibold">Ayni vaqtda online</span>
                      <Users className="w-5 h-5 text-lime-400" />
                    </div>
                    <p className="text-4xl font-black text-white">{onlineCount} <span className="text-xs text-zinc-500 font-normal">odam</span></p>
                    <p className="text-[11px] text-zinc-500">Saytda hozir faol bo'lib turgan foydalanuvchilar</p>
                  </div>

                  {/* Barcha sahifalar ko'rilishi */}
                  <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-semibold">Saytga kirishlar (Views)</span>
                      <Eye className="w-5 h-5 text-teal-400" />
                    </div>
                    <p className="text-4xl font-black text-white">{totalPageViews} <span className="text-xs text-zinc-500 font-normal">marta</span></p>
                    <p className="text-[11px] text-zinc-500">Jami sahifalarga tashrif buyurganlar</p>
                  </div>

                  {/* Zakaz tugmasini bosganlar */}
                  <div className="p-6 bg-zinc-950 border border-zinc-800/80 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-semibold">Zakaz berganganlar</span>
                      <UserCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-4xl font-black text-white">{convertedUsersCount} <span className="text-xs text-zinc-500 font-normal">odam</span></p>
                    <p className="text-[11px] text-zinc-500">Buyurtma berib ma'lumot qoldirgan unikal mijozlar</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BUYURTMALAR TABLE */}
          {activeTab === 'orders' && (
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
              <h2 className="text-lg font-bold text-white flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-lime-400" />
                Kelib tushgan buyurtmalar
              </h2>
              {loading ? <Loader2 className="w-6 h-6 text-lime-400 animate-spin mx-auto" /> : (
                <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="border-b border-zinc-800 text-zinc-400 uppercase font-semibold bg-zinc-950">
                      <tr>
                        <th className="p-4">Ism</th>
                        <th className="p-4">Telefon</th>
                        <th className="p-4">Xizmat</th>
                        <th className="p-4">Izoh</th>
                        <th className="p-4 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 bg-zinc-950/40">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-6 text-center text-zinc-500">Hali buyurtmalar yo'q</td>
                        </tr>
                      ) : orders.map(o => (
                        <tr key={o.id} className="hover:bg-zinc-900/60 transition">
                          <td className="p-4 font-semibold text-white">{o.name}</td>
                          <td className="p-4 text-lime-400 font-mono">{o.phone}</td>
                          <td className="p-4 text-zinc-200">{o.service}</td>
                          <td className="p-4 text-zinc-400 max-w-xs truncate">{o.description || '-'}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteItem('orders', o.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition cursor-pointer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* QO'SHISH VA TAHRIRLASH FORMASI */}
          {['services', 'products', 'portfolio', 'blog'].includes(activeTab) && (
            <div className="space-y-6">
              
              <form onSubmit={(e) => handleSaveItem(e, activeTab)} className="bg-zinc-900/60 border border-zinc-800/80 p-6 md:p-8 rounded-3xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                    {editingId ? <Edit className="w-5 h-5 text-lime-400" /> : <Plus className="w-5 h-5 text-lime-400" />}
                    {editingId ? "Elementni tahrirlash" : "Yangi element qo'shish"} ({activeTab})
                  </h3>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="text-xs text-zinc-400 hover:text-white underline">
                      Bekor qilish
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Sarlavha / Nomi *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Masalan: Vizitka chop etish"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Narxi / Mijoz nomi</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      placeholder="50,000 so'm yoki Mijoz nomi"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                    />
                  </div>

                  {/* UPLOAD RASM */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-xs font-medium text-zinc-400">Kompyuterdan rasm yuklash (Maksimal 2 ta rasm)</label>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-2xl border border-zinc-700/80 overflow-hidden shadow-md">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600/90 text-white rounded-full hover:bg-red-600 transition cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <span className="absolute bottom-1.5 left-1.5 bg-zinc-950/90 text-[9px] font-bold text-lime-400 px-2 py-0.5 rounded-md border border-lime-400/20">
                            {idx + 1}-rasm
                          </span>
                        </div>
                      ))}

                      {images.length < 2 && (
                        <label className="w-24 h-24 border-2 border-dashed border-zinc-800 hover:border-lime-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer text-zinc-500 hover:text-lime-400 transition bg-zinc-950/50">
                          <UploadCloud className="w-6 h-6 mb-1" />
                          <span className="text-[10px] font-bold">Rasm yuklang</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* FOYDALANILGAN MATERIAL VA TEXNOLOGIYALAR (PORTFOLIO VA MAHSULOTLAR UCHUN) */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Foydalanilgan Materiallar</label>
                    <input
                      type="text"
                      value={formData.materials}
                      onChange={e => setFormData({...formData, materials: e.target.value})}
                      placeholder="Masalan: 300g Qog'oz, Soft-Touch Laminatsiya"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ishlatilgan Texnologiya</label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={e => setFormData({...formData, technologies: e.target.value})}
                      placeholder="Masalan: Roland / Konica Minolta"
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tavsif / Ma'lumot</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Qisqacha ma'lumot..."
                      className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button type="submit" className="px-6 py-3 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-extrabold rounded-xl text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-lime-400/15">
                    {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {editingId ? "O'zgarishlarni saqlash" : "Bazaga qo'shish"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl text-xs transition">
                      Bekor qilish
                    </button>
                  )}
                </div>
              </form>

              {/* MAVJUD RO'YXAT */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 md:p-8 rounded-3xl space-y-4 shadow-xl">
                <h3 className="text-md font-bold text-white">Mavjud ro'yxat</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeTab === 'services' ? services :
                    activeTab === 'products' ? products :
                    activeTab === 'portfolio' ? portfolio : blogs).map(item => (
                    <div key={item.id} className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex items-start justify-between gap-4 hover:border-lime-500/30 transition">
                      <div className="flex gap-3.5">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-800 shrink-0">
                          <ImageCarousel images={item.images || [item.imageUrl, item.imageUrl2]} title={item.title} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-xs">{item.title}</h4>
                          {item.price && <p className="text-lime-400 text-xs font-extrabold">{item.price}</p>}
                          <p className="text-zinc-400 text-[11px] line-clamp-2 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button 
                          onClick={() => handleStartEdit(item)}
                          className="p-2 bg-lime-400/10 hover:bg-lime-400/20 text-lime-400 rounded-xl transition cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(activeTab, item.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// --- ASOSIY APP KOMPONENTI ---
export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '',
    serviceName: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Foydalanuvchi online va pageview tracker
  useEffect(() => {
    // 1. Unikal user session ID olish
    let sessionId = localStorage.getItem('user_session_id');
    if (!sessionId) {
      sessionId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('user_session_id', sessionId);
    }

    // 2. Online Presence (Heartbeat yuborish)
    const userPresenceRef = doc(db, 'online_users', sessionId);
    const updatePresence = async () => {
      try {
        await setDoc(userPresenceRef, { lastSeen: Date.now() }, { merge: true });
      } catch (e) {
        console.error(e);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 10000); // Har 10 soniyada yangilaydi

    // 3. Overall Pageviews tracking
    const trackerRef = doc(db, 'analytics', 'pageviews');
    getDocs(collection(db, 'analytics')).then(snap => {
      let currentViews = 0;
      snap.forEach(d => {
        if (d.id === 'pageviews') currentViews = d.data().count || 0;
      });
      setDoc(trackerRef, { count: currentViews + 1 }, { merge: true }).catch(() => {});
    });

    return () => clearInterval(interval);
  }, []);

  const openOrderModal = (serviceName = '') => {
    setSelectedService(serviceName);
    setOrderForm((prev) => ({ ...prev, serviceName }));
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const handleOrderNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-Яo'O'g'G'\s]/g, '');
    setOrderForm((prev) => ({ ...prev, name: value }));
  };

  const handleOrderPhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setOrderForm((prev) => ({ ...prev, phone: value }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newOrderData = {
      name: orderForm.name,
      phone: orderForm.phone,
      service: orderForm.serviceName || selectedService || 'Umumiy buyurtma',
      description: orderForm.description,
      status: 'new',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'orders'), newOrderData);
      await sendTelegramNotification(newOrderData);

      // Conversions Tracker (Order berganlarni sanoqqa qo'shish)
      const orderUsersRef = doc(db, 'analytics', 'order_users');
      getDocs(collection(db, 'analytics')).then(snap => {
        let currentOrders = 0;
        snap.forEach(d => {
          if (d.id === 'order_users') currentOrders = d.data().count || 0;
        });
        setDoc(orderUsersRef, { count: currentOrders + 1 }, { merge: true }).catch(() => {});
      });

      setSubmitted(true);
      setOrderForm({ name: '', phone: '', serviceName: '', description: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navLinks = [
    { path: '/', label: 'Bosh sahifa' },
    { path: '/services', label: 'Xizmatlar' },
    { path: '/products', label: 'Mahsulotlar' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/blog', label: 'Maqolalar' },
    { path: '/about', label: 'Biz haqimizda' },
    { path: '/contact', label: 'Aloqa' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-lime-400 selection:text-zinc-950">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-lime-400 font-black text-xl tracking-wider group">
            <div className="w-10 h-10 rounded-2xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center group-hover:scale-105 transition duration-300 shadow-md shadow-lime-400/10">
              <Printer className="w-5 h-5 text-lime-400" />
            </div>
            <span className="tracking-tight">POLIGRAFIYA<span className="text-white font-light">.UZ</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-bold tracking-wide transition duration-200 hover:text-lime-400 ${
                    isActive ? 'text-lime-400 font-extrabold border-b-2 border-lime-400 pb-1' : 'text-zinc-400'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={() => openOrderModal()}
              className="px-5 py-2.5 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-xl text-xs transition duration-300 shadow-lg shadow-lime-400/20 active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Tezkor buyurtma
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 text-zinc-400 hover:text-white rounded-xl bg-zinc-900 border border-zinc-800 cursor-pointer"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-800 p-6 space-y-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-semibold text-zinc-300 hover:text-lime-400 py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => { setIsMenuOpen(false); openOrderModal(); }}
              className="w-full py-3 bg-lime-400 text-zinc-950 font-extrabold rounded-xl text-xs cursor-pointer"
            >
              Tezkor buyurtma
            </button>
          </div>
        )}
      </header>

      {/* MAIN ROUTES */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home onOpenOrderModal={openOrderModal} />} />
          <Route path="/services" element={<Services onOpenOrderModal={openOrderModal} />} />
          <Route path="/products" element={<Products onOpenOrderModal={openOrderModal} />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="/adminreklama" element={<AdminReklama />} />

          <Route 
            path="*" 
            element={
              <div className="text-center py-28 space-y-4">
                <h1 className="text-7xl font-black text-lime-400 tracking-tight">404</h1>
                <p className="text-zinc-400 text-sm">Kechirasiz, sahifa topilmadi.</p>
                <Link to="/" className="inline-block px-6 py-3 bg-zinc-800 text-white text-xs font-bold rounded-xl border border-zinc-700">Bosh sahifaga qaytish</Link>
              </div>
            } 
          />
        </Routes>
      </main>

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-800/80 mt-28 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-2.5 text-lime-400 font-black text-2xl tracking-wider">
                <Printer className="w-7 h-7" />
                <span>POLIGRAFIYA<span className="text-white font-light">.UZ</span></span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                Zamonaviy yapon va nemis uskunalarida yuqori aniqlikdagi chop etish va dizayn xizmatlari. Vizitkadan tortib ulkan reklama konstruksiyalarigacha.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://t.me" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-lime-400 transition duration-300">
                  <TelegramIcon className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-lime-400 transition duration-300">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-lime-400 transition duration-300">
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-black text-xs tracking-widest uppercase">Sahifalar</h4>
              <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
                <li><Link to="/services" className="hover:text-lime-400 transition flex items-center gap-2"><ArrowRight className="w-3 h-3 text-lime-400" /> Xizmatlar</Link></li>
                <li><Link to="/products" className="hover:text-lime-400 transition flex items-center gap-2"><ArrowRight className="w-3 h-3 text-lime-400" /> Mahsulotlar</Link></li>
                <li><Link to="/portfolio" className="hover:text-lime-400 transition flex items-center gap-2"><ArrowRight className="w-3 h-3 text-lime-400" /> Portfolio</Link></li>
                <li><Link to="/blog" className="hover:text-lime-400 transition flex items-center gap-2"><ArrowRight className="w-3 h-3 text-lime-400" /> Maqolalar</Link></li>
                <li><Link to="/about" className="hover:text-lime-400 transition flex items-center gap-2"><ArrowRight className="w-3 h-3 text-lime-400" /> Biz haqimizda</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-black text-xs tracking-widest uppercase">Ish Tartibi</h4>
              <div className="space-y-2 text-xs text-zinc-400">
                <p className="flex items-center gap-2 font-semibold text-zinc-300"><Clock className="w-4 h-4 text-lime-400" /> Dushanba - Shanba</p>
                <p className="text-[11px] text-zinc-500 pl-6">09:00 dan 19:00 gacha</p>
                <p className="flex items-center gap-2 pt-2 font-semibold text-zinc-300"><Sparkles className="w-4 h-4 text-lime-400" /> Yakshanba - Dam olish</p>
                <p className="text-[11px] text-zinc-500 pl-6">Onlayn arizalar 24/7 qabul qilinadi</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-black text-xs tracking-widest uppercase">Aloqa</h4>
              <div className="space-y-2.5 text-xs text-zinc-400">
                <p className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-lime-400" /> +998 (90) 123-45-67</p>
                <p className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-lime-400" /> info@poligrafiyapro.uz</p>
                <p className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-lime-400" /> Toshkent, Chilonzor 1-mavze</p>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} POLIGRAFIYA.UZ. Barcha huquqlar himoyalangan.</p>
            <p className="font-medium">Sifatli va operativ matbaa xizmatlari</p>
          </div>
        </div>
      </footer>

      {/* MODAL BUYURTMA OYNASI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md transition-all">
          <div className="bg-zinc-900 border border-zinc-800/90 rounded-3xl p-6 md:p-8 max-w-md w-full relative space-y-6 shadow-2xl shadow-lime-500/10">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-full bg-zinc-950 border border-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white tracking-tight">Buyurtma berish</h3>

            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center mx-auto text-lime-400 shadow-lg shadow-lime-400/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Arizangiz qabul qilindi!</h4>
                <p className="text-zinc-400 text-xs leading-relaxed">Tez orada operatorimiz siz bilan bog'lanadi hamda Telegram botingizga bildirishnoma bordi.</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Yopish
                </button>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Xizmat nomi</label>
                  <input
                    type="text"
                    value={orderForm.serviceName}
                    onChange={(e) => setOrderForm({ ...orderForm, serviceName: e.target.value })}
                    placeholder="Masalan: Vizitka chop etish"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Ismingiz * (faqat harflar)</label>
                  <input
                    type="text"
                    required
                    value={orderForm.name}
                    onChange={handleOrderNameChange}
                    placeholder="Abbosxon"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Telefon raqamingiz * (faqat raqamlar)</label>
                  <input
                    type="text"
                    required
                    value={orderForm.phone}
                    onChange={handleOrderPhoneChange}
                    placeholder="+998901234567"
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Qo'shimcha izoh</label>
                  <textarea
                    rows="2"
                    value={orderForm.description}
                    onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                    placeholder="Soni, hajmi yoki maxsus istaklar..."
                    className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition duration-200 shadow-lg shadow-lime-400/20 active:scale-[0.99]"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Yuborish <Send className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}