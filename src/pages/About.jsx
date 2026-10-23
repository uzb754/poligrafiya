import React from 'react';
import { Award, ShieldCheck, Zap, Users, CheckCircle2, Clock } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-20">
      {/* Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Biz Haqimizda</h1>
        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed">
          Poligrafiya va matbaa sohasi bo‘yicha ko‘p yillik tajribaga ega zamonaviy va ishonchli reklama ishlab chiqarish studiyasimiz.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl">
        <div className="text-center space-y-1">
          <p className="text-3xl font-black text-lime-400">10+</p>
          <p className="text-zinc-400 text-xs">Yillik Tajriba</p>
        </div>
        <div className="text-center space-y-1 border-l border-zinc-800">
          <p className="text-3xl font-black text-lime-400">50,000+</p>
          <p className="text-zinc-400 text-xs">Bajarilgan Buyurtmalar</p>
        </div>
        <div className="text-center space-y-1 border-l border-zinc-800">
          <p className="text-3xl font-black text-lime-400">100%</p>
          <p className="text-zinc-400 text-xs">Sifat Kafolati</p>
        </div>
        <div className="text-center space-y-1 border-l border-zinc-800">
          <p className="text-3xl font-black text-lime-400">24/7</p>
          <p className="text-zinc-400 text-xs">Onlayn Qabul</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Zamonaviy Uskunalar</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">Ishlab chiqarish jarayonida eng oxirgi rusumdagi yapon va nemis texnologiyalaridan foydalanamiz.</p>
        </div>
        
        <div className="p-8 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Sifat Kafolati</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">Har bir tayyorlangan mahsulot xodimlarimiz tomonidan qattiq sifat nazoratidan o'tkaziladi.</p>
        </div>

        <div className="p-8 bg-zinc-900/60 border border-zinc-800/80 rounded-3xl space-y-4 hover:border-lime-400/40 transition">
          <div className="w-12 h-12 bg-lime-400/10 border border-lime-400/30 rounded-2xl flex items-center justify-center text-lime-400">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Professional Jamoa</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">Tajribali dizaynerlar va matbaa ustalari sizning g'oyangizni mukammal amalga oshiradi.</p>
        </div>
      </div>
    </div>
  );
}