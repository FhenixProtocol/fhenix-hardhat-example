"use client";

import { Navbar } from "@/components/Navbar";
import { CounterPage } from "@/components/counter/CounterPage";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 font-sans selection:bg-primary selection:text-base-100">
      {/* Background Grid Effect */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] [data-theme='fhenixdark']_&]:opacity-20 transition-opacity duration-300"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      {/* Background Mask/Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      <main className="relative z-10 max-w-7xl mx-auto flex flex-col gap-8 p-4 md:p-8 pb-10">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary opacity-50"></div>
            <span className="text-primary font-pixel text-sm tracking-widest uppercase">
              Encrypted Counter
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-base-content tracking-tight font-display uppercase">
            Fhenix Counter Dashboard
          </h1>
          <p className="text-base-content/60 text-lg font-medium">
            Read the current counter value and submit encrypted updates on
            Ethereum Sepolia.
          </p>
        </header>

        <CounterPage />
      </main>
    </div>
  );
}
