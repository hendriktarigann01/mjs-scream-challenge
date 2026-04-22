"use client";

interface IdleScreenProps {
  onStart: () => void;
}

export default function IdleScreen({ onStart }: IdleScreenProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent overflow-hidden">
      <div className="relative z-10 flex flex-col items-center gap-12 px-8 max-w-xl w-full">
        <div className="flex flex-col items-center gap-2">
          <p className="text-white/60 tracking-[0.4em] text-sm uppercase">
            Are you brave enough?
          </p>
          <h1
            className="text-white text-center text-[clamp(4rem,12vw,9rem)] leading-none font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
            }}
          >
            Scream
            <br />
            Challenge
          </h1>
        </div>

        <div
          className="animate-bounce text-white/80 text-sm tracking-widest uppercase"
          style={{ animationDuration: "2s" }}
        >
          Step up to the mic
        </div>
        <button
          onClick={onStart}
          className="w-36 h-10 px-6 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-sm tracking-widest uppercase rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
