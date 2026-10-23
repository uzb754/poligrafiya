import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Loader2, ShoppingBag, Package, Star } from 'lucide-react';
import { ImageCarousel } from '../App';

export default function Products({ onOpenOrderModal }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, 'products'))
      .then(snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      {/* Sarlavha Qismi */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold">
          <Package className="w-3.5 h-3.5" />
          Sifatli Mahsulotlar
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Mahsulotlar <span className="text-lime-400">Katalogi</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Tayyor matbaa mahsulotlari, standart o'lchamlar va hamyonbop narxlar.
        </p>
      </div>

      {/* Mahsulotlar Ro'yxati */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-lime-400 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 text-zinc-400 text-xs">
          Hozircha mahsulotlar kiritilmagan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(pr => {
            // Rasmlar massivini to'g'ri shakllantirish
            const productImages = pr.images && pr.images.length > 0 
              ? pr.images 
              : [pr.imageUrl, pr.imageUrl2].filter(Boolean);

            return (
              <div 
                key={pr.id} 
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-lime-400/40 transition duration-300 group shadow-xl"
              >
                <div className="space-y-4">
                  {/* STRELKALAR ORQALI RASMNI ALMASHTIRISH BLOKI */}
                  <div className="h-56 bg-zinc-950 relative overflow-hidden">
                    <ImageCarousel 
                      images={productImages} 
                      title={pr.title} 
                    />
                    {pr.price && (
                      <span className="absolute bottom-3 right-3 bg-zinc-950/90 text-lime-400 text-xs font-extrabold px-3.5 py-1 rounded-full border border-zinc-800/80 shadow-lg z-10 pointer-events-none">
                        {pr.price}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-1 text-lime-400">
                      <Star className="w-3.5 h-3.5 fill-lime-400" />
                      <Star className="w-3.5 h-3.5 fill-lime-400" />
                      <Star className="w-3.5 h-3.5 fill-lime-400" />
                      <Star className="w-3.5 h-3.5 fill-lime-400" />
                      <Star className="w-3.5 h-3.5 fill-lime-400" />
                      <span className="text-[10px] text-zinc-500 pl-1 font-semibold">5.0</span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition">
                      {pr.title}
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">
                      {pr.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => onOpenOrderModal(pr.title)} 
                    className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-xl text-xs transition duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-lime-400/15 active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" /> Buyurtma Berish
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}