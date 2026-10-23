import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, Calendar, FileText, ArrowRight } from 'lucide-react';
import { ImageCarousel } from '../App';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'blog')).then(snap => {
      setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold">
          <FileText className="w-3.5 h-3.5" />
          Maqolalar va Yangiliklar
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Yangiliklar va <span className="text-lime-400">Maqolalar</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Poligrafiya olamidagi yangiliklar, foydali maslahatlar va dizayn tendensiyalari.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-lime-400 animate-spin" /></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
          Hozircha maqolalar mavjud emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(b => (
            <div key={b.id} className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 transition group">
              <div>
                {/* STRELKALAR ORQALI RASMNI ALMASHTIRISH */}
                <div className="h-52 bg-zinc-950 relative overflow-hidden">
                  <ImageCarousel 
                    images={b.images || [b.imageUrl, b.imageUrl2]} 
                    title={b.title} 
                  />
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-lime-400" />
                    <span>{b.date || 'Yaqinda'}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-lime-400 transition">{b.title}</h3>
                  <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">{b.content || b.description}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-zinc-800/60">
                <button className="pt-4 text-lime-400 hover:text-lime-300 text-xs font-bold flex items-center gap-1 cursor-pointer">
                  Batafsil o'qish <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}