import React, { useState } from 'react';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Validatsiya: Faqat harflar
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-Яo'O'g'G'\s]/g, '');
    setFormData((prev) => ({ ...prev, name: value }));
  };

  // Validatsiya: Faqat raqamlar va +
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9+]/g, '');
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const sendTelegramNotification = async (data) => {
    const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '7683966754:AAE1eIMceOA4Dax5WGyy1Gp9ghRFFOinDhY';
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '6053383227';

    const text = `
<b>📩 YANGI MUROJAAT (Contact sahifasi)</b>

👤 <b>Ism:</b> ${data.name}
📞 <b>Telefon:</b> <code>${data.phone}</code>
💬 <b>Xabar:</b> ${data.message || 'Izoh yo\'q'}
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
      console.error("Telegram xabarnomasida xatolik:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'contacts'), {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        createdAt: serverTimestamp()
      });

      await sendTelegramNotification(formData);

      setSubmitted(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error(error);
      alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5" />
          Aloqa Markazi
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Biz bilan bog'laning</h1>
        <p className="text-zinc-400 text-xs md:text-sm">
          Savollaringiz bormi yoki loyihangizni muhokama qilmoqchimisiz? Formani to'ldiring, biz siz bilan tezda bog'lanamiz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6 bg-zinc-900/60 border border-zinc-800/80 p-8 rounded-3xl">
          <h2 className="text-lg font-bold text-white mb-4">Aloqa ma'lumotlari</h2>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-2xl text-lime-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Telefon</p>
              <p className="text-xs font-bold text-white">+998 (90) 123-45-67</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-2xl text-lime-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">E-mail</p>
              <p className="text-xs font-bold text-white">info@poligrafiyapro.uz</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-2xl text-lime-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Manzil</p>
              <p className="text-xs font-bold text-white">Toshkent sh., Chilonzor 1-mavze</p>
            </div>
          </div>

          <div className="flex items-start gap-4 pt-4 border-t border-zinc-800">
            <div className="p-3 bg-lime-400/10 border border-lime-400/20 rounded-2xl text-lime-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400">Ish vaqti</p>
              <p className="text-xs font-bold text-white">Dush - Shan: 09:00 - 19:00</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800/80 p-8 md:p-10 rounded-3xl">
          <h2 className="text-lg font-bold text-white mb-6">Xabar yuborish</h2>

          {submitted ? (
            <div className="p-6 bg-lime-400/10 border border-lime-400/30 text-center rounded-2xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-lime-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Xabaringiz muvaffaqiyatli yuborildi!</h3>
              <p className="text-zinc-400 text-xs">Tez orada siz bilan bog'lanamiz.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Yangi xabar yuborish
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Ismingiz * (faqat harflar)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Jaloliddin"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Telefon raqamingiz * (faqat raqamlar)</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+998951903181"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Xabaringiz</label>
                <textarea
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Xabaringizni yozing..."
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs outline-none focus:border-lime-400 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-lime-400/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Yuborish <Send className="w-4 h-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}