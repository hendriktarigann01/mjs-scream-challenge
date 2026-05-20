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
    <div className="fixed inset-0 bg-[#303030B2]/70 z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="relative flex flex-col items-center justify-center w-full max-w-lg"
      >
        <div className="relative min-h-[600px] justify-center border-[3px] border-white rounded-[32px] w-full flex flex-col items-center gap-12 px-6 sm:px-10 pt-10 pb-8 z-10 mx-auto overflow-hidden">
          <Image
            src="/common/background-modal.webp"
            alt="Modal Background"
            fill
            priority
            sizes="(max-width: 512px) 100vw, 512px"
            className="object-cover z-0"
          />

          <h2 className="text-2xl sm:text-3xl text-white font-bold uppercase tracking-tight text-center leading-tight z-10">
            Congratulations!
          </h2>

          <div className="flex flex-col items-center gap-2 w-full max-w-[400px] z-10">
            <p className="font-sans text-sm text-white font-bold uppercase tracking-widest">
              Final Score
            </p>
            <div className="w-full min-h-12 flex items-center justify-center py-2.5 rounded-full bg-[#624072] border-[2px] border-white shadow-[0_3px_0_0_#FFFFFF]">
              <span className="font-sans text-lg text-white font-extrabold tracking-widest">
                {finalScore}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-full max-w-[400px] relative mt-2 z-10">
            <p className="font-sans text-sm text-white font-bold uppercase tracking-widest mb-1 z-20">
              Max Combo
            </p>

            <div className="relative w-full flex justify-center items-center">
             
              <div className="relative min-h-12 z-10 w-full flex items-center justify-center py-2.5 rounded-full bg-[#624072] border-[2px] border-[#FFFFFF] shadow-[0_3px_0_0_#FFFFFF]">
                <span className="font-sans text-lg text-white font-extrabold tracking-widest uppercase">
                  Combo x{maxCombo}
                </span>
              </div>
            </div>
          </div>

          <motion.button
            onClick={onLeaderboard}
            disabled={submitting}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex min-h-12 items-center justify-center gap-3 w-full max-w-[400px] mt-8 py-2.5 rounded-full bg-[#624072] border-[2px] border-white shadow-[0_4px_0_0_#FFFFFF] font-sans text-base text-white font-extrabold uppercase tracking-widest transition-all z-10"
          >
            {submitting ? "Submitting…" : "View Leaderboard"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
