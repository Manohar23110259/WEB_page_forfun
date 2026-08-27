"use client";
import { motion } from "framer-motion";
import { Sparkles, User, ShieldCheck, ArrowDown, RefreshCw } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import { supabase } from "@/lib/supabase";

type Star = {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: string;
};

export default function Home() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [subjectName, setSubjectName] = useState("");
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);
  const [status, setStatus] = useState<{ kind: "idle" } | { kind: "saving" } | { kind: "ok" | "error"; text: string }>({
    kind: "idle",
  });

  useEffect(() => {
    setMounted(true);
    setStars(
      Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        duration: `${1.5 + Math.random() * 3}s`,
      }))
    );
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = sigCanvas.current?.getCanvas();
    if (!canvas) return;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d")?.scale(ratio, ratio);
    sigCanvas.current?.clear();
  }, [mounted]);

  const handleVerify = async () => {
    if (!subjectName.trim() || sigCanvas.current?.isEmpty()) {
      setStatus({ kind: "error", text: "Name and signature are required." });
      return;
    }
    if (!supabase) {
      setStatus({ kind: "error", text: "Vault is not configured. Add Supabase keys to .env.local." });
      return;
    }

    const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    setStatus({ kind: "saving" });
    try {
      const { error } = await supabase.from("signatures").insert([
        { subject_name: subjectName, image_data: dataURL },
      ]);
      if (error) throw error;
      setStatus({ kind: "ok", text: `Identity secured for ${subjectName}.` });
      setSubjectName("");
      sigCanvas.current?.clear();
    } catch {
      setStatus({ kind: "error", text: "Vault connection error." });
    }
  };

  if (!mounted) return <div className="bg-[#020617] min-h-screen" />;

  return (
    <main className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      <div className="stars">
        <div className="moon" />

        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              ["--duration" as string]: star.duration,
            }}
          />
        ))}

        <div className="orb w-[600px] h-[600px] bg-indigo-600/10 top-[-10%] left-[-10%]" />
        <div className="orb w-[500px] h-[500px] bg-pink-600/05 bottom-[-10%] right-[-10%]" />
      </div>

      <section className="h-screen flex flex-col items-center justify-center px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="w-full max-w-[95vw] md:max-w-7xl bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-10 md:p-24 rounded-[4rem] shadow-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] uppercase tracking-[0.5em] text-indigo-400 mb-10 font-bold">
            <Sparkles size={15} /> The Exclusive Manu-script
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[7.5rem] font-serif font-light leading-[1.1] text-white">
            If Sarcasm was a Girl... it looks like you!!
          </h1>

          <p className="mt-12 text-indigo-100/60 text-lg md:text-2xl italic tracking-[0.2em] font-light max-w-4xl mx-auto border-t border-white/5 pt-12">
            “Too Smart to Argue With... Too Cute to Ignore.”
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 opacity-20 text-white flex flex-col items-center gap-2"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-indigo-300">Scroll to Sign</span>
          <ArrowDown size={20} className="text-indigo-400" />
        </motion.div>
      </section>

      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl p-10 md:p-14 rounded-[3.5rem] text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="text-white" size={36} />
          </div>
          <h2 className="text-3xl font-serif font-light mb-4">Seal This Moment</h2>
          <p className="text-indigo-200/40 text-sm mb-12 italic">One signature and this becomes my favorite chapter.</p>

          <div className="space-y-6">
            <div className="relative group text-left">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
              <input
                type="text"
                placeholder="Subject Name"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  if (status.kind !== "idle") setStatus({ kind: "idle" });
                }}
                className="w-full bg-slate-950/40 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700"
              />
            </div>

            <div className="bg-slate-950/80 rounded-[2.5rem] overflow-hidden border border-white/10 h-[280px] relative shadow-inner">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="#818cf8"
                canvasProps={{ style: { width: "100%", height: "100%" }, className: "sigCanvas cursor-crosshair" }}
              />
            </div>

            {status.kind !== "idle" && (
              <p
                className={`text-sm ${
                  status.kind === "ok"
                    ? "text-indigo-300"
                    : status.kind === "saving"
                      ? "text-slate-400"
                      : "text-pink-300"
                }`}
              >
                {status.kind === "saving" ? "Securing…" : status.text}
              </p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => sigCanvas.current?.clear()}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
              >
                <RefreshCw size={14} /> Clear
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={status.kind === "saving"}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white hover:shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all active:scale-95 shadow-xl disabled:opacity-60"
              >
                Verify Signature
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <footer className="py-32 text-center opacity-40 relative z-10">
        <p className="text-[11px] tracking-[0.8em] text-indigo-300 uppercase">Inspired from — 10_v</p>
        <p className="text-[9px] tracking-[0.4em] text-slate-500 mt-2 font-bold uppercase italic">Implemented by — neeku telusu ga!!</p>
      </footer>
    </main>
  );
}
