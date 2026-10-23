import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, ArrowRight, Layers, CheckCircle } from 'lucide-react';
import { ImageCarousel } from '../App';

export default function Services({ onOpenOrderModal }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'services')).then(snap => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold">
          <Layers className="w-3.5 h-3.5" />
          Keng Ko'lamli Matbaa
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Barcha <span className="text-lime-400">Xizmatlarimiz</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Admin paneldan real vaqt rejimida boshqariladigan barcha poligrafiya xizmatlari va narxlari katalogi.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-lime-400 animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
          Hozircha xizmatlar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(s => (
            <div key={s.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 transition group">
              <div className="space-y-4">
                {/* STRELKA BILAN RASMLARNI ALMASHTIRISH BLOKI */}
                <div className="h-56 bg-zinc-950 relative overflow-hidden">
                  <ImageCarousel 
                    images={s.images || [s.imageUrl, s.imageUrl2]} 
                    title={s.title} 
                  />
                  {s.price && (
                    <span className="absolute bottom-3 right-3 bg-zinc-950/90 text-lime-400 text-xs font-extrabold px-3.5 py-1 rounded-full border border-zinc-800/80 shadow-lg z-10">
                      {s.price}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition">{s.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{s.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 space-y-4">
                <div className="border-t border-zinc-800/60 pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    <span>Yuqori aniqlik va yorqin ranglar</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                    <CheckCircle className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                    <span>Individual hajm va standartlar</span>
                  </div>
                </div>

                <button 
                  onClick={() => onOpenOrderModal(s.title)} 
                  className="w-full py-3.5 bg-zinc-800 hover:bg-lime-400 hover:text-zinc-950 text-zinc-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  Buyurtma berish <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}