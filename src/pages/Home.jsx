import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  ArrowRight, 
  Loader2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Award, 
  HelpCircle, 
  ChevronDown
} from 'lucide-react';
import { ImageCarousel } from '../App';

export default function Home({ onOpenOrderModal }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sSnap = await getDocs(query(collection(db, 'services'), limit(6)));
        setServices(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Buyurtmalar necha kunda tayyor bo'ladi?",
      a: "Odatda buyurtma hajmi va murakkabligiga qarab 1 soatdan 2 ish kunigacha tayyorlanadi. Shoshilinch buyurtmalar ustuvor tartibda bajariladi."
    },
    {
      q: "Maket va dizayn tayyorlash xizmati bormi?",
      a: "Ha, bizning tajribali dizaynerlarimiz brendingizga mos individual dizayn va tayyor maketlarni noldan yaratib berishadi."
    },
    {
      q: "Minimal buyurtma miqdori qancha?",
      a: "Vizitka va flayerlar uchun kamida 100 dona, boshqa mahsulotlar uchun 1 donadan ham buyurtma berishingiz mumkin."
    },
    {
      q: "O'zbekiston bo'ylab yetkazib berish xizmati mavjudmi?",
      a: "Ha, Toshkent shahri bo'ylab kuryerlik hamda viloyatlarga pochta xizmatlari orqali xavfsiz yetkazib beramiz."
    }
  ];

  return (
    <div className="space-y-28 py-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 text-center max-w-5xl mx-auto px-4 space-y-8">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold tracking-wide shadow-lg shadow-lime-400/10">
          <Sparkles className="w-4 h-4" />
          Zamonaviy Poligrafiya & Reklama Studiyasi
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
          Biznesingiz uchun <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-emerald-400 to-teal-400">
            Premium Poligrafiya
          </span> Yechimlari
        </h1>

        <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Vizitkalardan tortib keng formatli reklamalargacha. Yaponiyaning so'nggi avlod uskunalarida yuqori aniqlikda chop etamiz.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onOpenOrderModal && onOpenOrderModal()}
            className="w-full sm:w-auto px-8 py-4 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xl shadow-lime-400/20 active:scale-95"
          >
            Buyurtma berish <ArrowRight className="w-4 h-4" />
          </button>
          <Link
            to="/services"
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 font-bold rounded-2xl text-xs transition flex items-center justify-center"
          >
            Xizmatlarni ko'rish
          </Link>
        </div>
      </section>

      {/* 2. STATISTIKA BLOKI */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl">
          <div className="text-center space-y-1">
            <p className="text-3xl md:text-4xl font-black text-lime-400">10+</p>
            <p className="text-zinc-400 text-xs">Yillik Tajriba</p>
          </div>
          <div className="text-center space-y-1 border-l border-zinc-800">
            <p className="text-3xl md:text-4xl font-black text-lime-400">50K+</p>
            <p className="text-zinc-400 text-xs">Tayyorlangan Loyihalar</p>
          </div>
          <div className="text-center space-y-1 border-l border-zinc-800">
            <p className="text-3xl md:text-4xl font-black text-lime-400">99%</p>
            <p className="text-zinc-400 text-xs">Mamnun Mijozlar</p>
          </div>
          <div className="text-center space-y-1 border-l border-zinc-800">
            <p className="text-3xl md:text-4xl font-black text-lime-400">24/7</p>
            <p className="text-zinc-400 text-xs">Onlayn Qabul</p>
          </div>
        </div>
      </section>

      {/* 3. AFZALLIKLAR */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white">Nega Aynan Biz?</h2>
          <p className="text-zinc-400 text-xs md:text-sm">Mijozlarimizga eng yaxshi xizmat sifatini taklif qilamiz</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
            <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Tezkor Ijro</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Tayyor maket bo'lganda buyurtmangiz bir necha soat ichida chop etib beriladi.</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
            <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Yuqori Sifat Kafolati</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Nemis va yapon bo'yoqlari orqali ranglarning haqiqiy va yorqin chiqishini ta'minlaymiz.</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
            <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Hamyonbop Narxlar</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Katta hajmdagi va doimiy buyurtmalar uchun maxsus ulgurji narxlar amal qiladi.</p>
          </div>
        </div>
      </section>

      {/* 4. XIZMATLAR PREVIEW (STRELKA BILAN RASMLAR) */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Ommabop Xizmatlar</h2>
            <p className="text-zinc-400 text-xs mt-1">Admin paneldan boshqariladigan asosiy yo'nalishlar</p>
          </div>
          <Link to="/services" className="text-lime-400 hover:text-lime-300 text-xs font-bold flex items-center gap-1">
            Barchasini ko'rish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-lime-400 animate-spin" /></div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
            Hozircha xizmatlar kiritilmagan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(s => (
              <div key={s.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 transition">
                <div className="h-52 bg-zinc-950 relative overflow-hidden">
                  <ImageCarousel 
                    images={s.images || [s.imageUrl, s.imageUrl2]} 
                    title={s.title} 
                  />
                  {s.price && <span className="absolute bottom-3 right-3 bg-zinc-950/90 text-lime-400 text-xs font-extrabold px-3 py-1 rounded-full border border-zinc-800 z-10">{s.price}</span>}
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">{s.description}</p>
                  <button onClick={() => onOpenOrderModal(s.title)} className="w-full py-3 bg-zinc-800 hover:bg-lime-400 hover:text-zinc-950 text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer">
                    Buyurtma berish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Ko'p Beriladigan Savollar</h2>
          <p className="text-zinc-400 text-xs">Biznes va matbaa jarayonlari bo'yicha eng muhim savollarga javoblar</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left font-bold text-white text-xs md:text-sm flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-800/50 transition"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-lime-400 shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180 text-lime-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-zinc-400 text-xs leading-relaxed border-t border-zinc-800/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}