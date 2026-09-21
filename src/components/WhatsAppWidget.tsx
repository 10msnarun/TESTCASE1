import React, { useState } from 'react';
import { MessageCircle, X, Send, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COMPANY_INFO } from '../data/content';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const quickPrompts = [
    'Need an AWS Well-Architected audit & cost estimate',
    'Planning a high-priority on-prem migration to Azure',
    'Want to reduce our cloud bill by 30%+ (FinOps)',
    'Looking for a dedicated Cloud Architect pod'
  ];

  const handleSendWhatsApp = (customText?: string) => {
    const textToSend = customText || message || 'Hello LIS Cloud team! I would like to schedule a cloud architecture consultation.';
    const encodedText = encodeURIComponent(textToSend);
    // WhatsApp direct API link (clean international format)
    const url = `https://wa.me/18005472568?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside aria-label="WhatsApp live chat assistance" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Chat Drawer / Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-purple-200 overflow-hidden text-slate-900"
            id="whatsapp-chat-card"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-800 to-indigo-900 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-purple-200 text-purple-950 font-bold flex items-center justify-center text-sm border-2 border-white shadow">
                    AR
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Alex Rivera <span className="text-[10px] bg-purple-600/70 px-1.5 py-0.5 rounded text-purple-100">Staff Architect</span>
                  </h4>
                  <p className="text-xs text-purple-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Online now • Avg reply &lt; 3 mins
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-purple-200 hover:text-white hover:bg-purple-700/50 transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat popup"
                id="close-whatsapp-card-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 bg-slate-50 space-y-3 max-h-80 overflow-y-auto">
              <div className="p-3 bg-white rounded-2xl rounded-tl-sm border border-slate-200 shadow-xs text-xs text-slate-700 space-y-1.5">
                <p className="font-medium text-slate-900">
                  👋 Welcome to LIS Cloud Consulting!
                </p>
                <p>
                  How can we help your team with AWS or Azure cloud infrastructure today?
                </p>
                <div className="pt-1 flex items-center gap-1 text-[10px] text-purple-700 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-purple-600" />
                  Direct channel to senior solutions architects
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Quick topics:
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendWhatsApp(prompt)}
                      className="text-left text-xs p-2 rounded-xl bg-white border border-purple-100 text-slate-800 hover:border-purple-600 hover:bg-purple-50 transition-all font-medium flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate">{prompt}</span>
                      <Send className="w-3 h-3 text-slate-400 group-hover:text-purple-600 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-3 bg-white border-t border-slate-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a question for our cloud architects..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendWhatsApp();
                  }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white"
                  id="whatsapp-custom-msg-input"
                />
                <button
                  onClick={() => handleSendWhatsApp()}
                  id="whatsapp-chat-submit-btn"
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-sm cursor-pointer"
                  title="Send via WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Opens official WhatsApp API securely with enterprise encryption.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        id="whatsapp-floating-trigger-btn"
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-700/30 hover:shadow-2xl hover:shadow-emerald-600/40 transition-all cursor-pointer"
        aria-label="Contact LIS on WhatsApp"
      >
        <div className="relative">
          {/* Pulsing ring indicator */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-emerald-600"></span>
          </span>
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-black tracking-wide uppercase">
            Chat on WhatsApp
          </span>
          <span className="text-[10px] text-emerald-100 font-medium">
            Architect on duty
          </span>
        </div>
      </motion.button>
    </aside>
  );
};
