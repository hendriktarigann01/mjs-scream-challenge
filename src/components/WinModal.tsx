import { motion } from "framer-motion";
import Image from "next/image";

interface WinModalProps {
  finalScore: number;
  maxCombo: number;
  onLeaderboard: () => void;
  submitting?: boolean;
}

export function WinModal({
  finalScore,
  maxCombo,
  onLeaderboard,
  submitting = false,
}: WinModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative flex flex-col items-center justify-center w-full max-w-lg"
      >
        {/* Kartu Utama */}
        <div className="relative min-h-96 flex justify-center bg-white border-[3px] border-brand-primary rounded-[32px] w-full flex flex-col items-center gap-8 px-6 sm:px-10 pt-10 pb-8 z-10 mx-auto">

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl text-brand-primary font-bold uppercase tracking-tight text-center leading-tight">
            Congratulations!
          </h2>

          {/* Final Score */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[400px]">
            <p className="font-sans text-[10px] text-brand-primary font-bold uppercase tracking-widest">
              Final Score
            </p>
            <div className="w-full min-h-12 flex items-center justify-center py-2.5 rounded-full bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34]">
              <span className="font-sans text-lg text-brand-primary font-extrabold tracking-widest">
                {finalScore}
              </span>
            </div>
          </div>

          {/* Combo Section */}
          <div className="flex flex-col items-center w-full max-w-[400px] relative mt-2">
            <p className="font-sans text-[10px] text-brand-primary font-bold uppercase tracking-widest mb-1 z-20">
              Max Combo
            </p>

            <div className="relative w-full flex justify-center items-center">
              {/* API - Dibuat Responsive & Z-Index dibenahi */}
              <div className="absolute -bottom-4 w-[120%] pointer-events-none z-0">
                <Image
                  src="/common/combo-x5.gif"
                  alt="fire"
                  width={340}
                  height={80}
                  unoptimized
                  className="w-full h-auto object-contain opacity-80"
                />
              </div>

              {/* COMBO BOX */}
              <div className="relative min-h-12 z-10 w-full flex items-center justify-center py-2.5 rounded-full bg-white border-[3px] border-[#DE7A00] shadow-[0_4px_0_0_#DE7A00]">
                <span className="font-sans text-lg text-[#DE7A00] font-extrabold tracking-widest uppercase">
                  Combo x{maxCombo}
                </span>
              </div>
            </div>
          </div>

          {/* Button - Kasih margin top dikit biar ga ketabrak api */}
          <motion.button
            onClick={onLeaderboard}
            disabled={submitting}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex min-h-12 items-center justify-center gap-3 w-full max-w-[400px] mt-4 py-2.5 rounded-full bg-white border-[3px] border-brand-primary shadow-[0_4px_0_0_#191B34] font-sans text-base text-brand-primary font-extrabold uppercase tracking-widest transition-all"
          >
            {/* SVG Icon tetap di sini */}
            {submitting ? "Submitting…" : "View Leaderboard"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}