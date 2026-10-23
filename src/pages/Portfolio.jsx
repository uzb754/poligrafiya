import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Sparkles, X, CheckCircle2, Layers, Cpu } from 'lucide-react';
import { ImageCarousel } from '../App';

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    getDocs(collection(db, 'portfolio')).then(snap => {
      setPortfolio(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      {/* Dynamic Sarlavha */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          Bizning Ishlarimiz
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Bizning <span className="text-lime-400">Portfolio</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Mijozlarimiz uchun tayyorlangan so'nggi ishlar. Loyiha ustiga bosib foydalanilgan materiallar bilan tanishing.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-lime-400 animate-spin" /></div>
      ) : portfolio.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
          Hozircha ishlar kiritilmagan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {portfolio.map(p => (
            <div 
              key={p.id} 
              onClick={() => setSelectedItem(p)}
              className="relative bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden h-80 hover:border-lime-400/50 transition duration-300 cursor-pointer group flex flex-col justify-between shadow-xl"
            >
              {/* STRELKALI RASM KARUSELI */}
              <div className="absolute inset-0 z-0">
                <ImageCarousel 
                  images={p.images || [p.imageUrl, p.imageUrl2]} 
                  title={p.title} 
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-90 pointer-events-none" />

              <div className="relative z-10 p-6 mt-auto space-y-1.5 pointer-events-none">
                {p.category && (
                  <span className="text-lime-400 text-[10px] font-extrabold uppercase tracking-widest bg-lime-400/10 border border-lime-400/20 px-2.5 py-1 rounded-full inline-block">
                    {p.category}
                  </span>
                )}
                <h3 className="text-lg font-extrabold text-white group-hover:text-lime-400 transition">{p.title}</h3>
                {p.client && <p className="text-zinc-400 text-xs">Mijoz: {p.client}</p>}
                
                <p className="text-lime-400/80 text-[11px] font-semibold pt-1 flex items-center gap-1">
                  Batafsil ma'lumotni ko'rish →
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOYIHA HAQIDA BATAFSIL MODAL OYNA (USTIGA BOSSAGINA CHIQADI) */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md transition-all"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800/90 rounded-3xl max-w-2xl w-full p-6 md:p-8 relative space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Yopish tugmasi */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1.5 rounded-full bg-zinc-950 border border-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Rasm Karuseli */}
            <div className="h-64 rounded-2xl overflow-hidden relative border border-zinc-800">
              <ImageCarousel 
                images={selectedItem.images || [selectedItem.imageUrl, selectedItem.imageUrl2]} 
                title={selectedItem.title} 
              />
            </div>

            {/* Sarlavha va ma'lumotlar */}
            <div className="space-y-4">
              <div>
                {selectedItem.category && (
                  <span className="text-lime-400 text-xs font-bold uppercase tracking-wider">
                    {selectedItem.category}
                  </span>
                )}
                <h2 className="text-2xl font-black text-white">{selectedItem.title}</h2>
                {selectedItem.client && <p className="text-zinc-400 text-xs mt-0.5">Mijoz: {selectedItem.client}</p>}
              </div>

              {selectedItem.description && (
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-300">Loyiha haqida:</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              {/* FOYDALANILGAN MAHSULOTLAR VA MATERIALAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-zinc-800/80">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-lime-400 text-xs font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Foydalanilgan Materiallar</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedItem.materials || "300g Premium Bo'rli Qog'oz, Soft-Touch Laminatsiya, Uf-Lak"}
                  </p>
                </div>

                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-lime-400 text-xs font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Ishlatilgan Texnologiya</span>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedItem.technologies || "Yaponiyaning Roland / Konica Minolta raqamli chop etish uskunalari"}
                  </p>
                </div>
              </div>
            </div>

            {/* Yopish va buyurtma berish */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-full py-3 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-xl text-xs transition cursor-pointer"
              >
                Tushunarli (Yopish)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}