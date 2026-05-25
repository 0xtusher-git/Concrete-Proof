import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Navbar() {
  return (
    <nav className="w-full border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          {/* Logo Mark: Square with overline C */}
          <div className="w-10 h-10 bg-concrete-yellow rounded flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className="absolute top-2 w-5 h-0.5 bg-black"></div>
            <span className="text-black font-bold text-xl mt-1 leading-none tracking-tighter">
              C
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl leading-tight tracking-tight">
              CONCRETE PROOF
            </span>
          </div>
        </Link>

        <Link
          href="/submit"
          className="glass-panel px-5 py-2.5 flex items-center gap-2 hover:bg-concrete-yellow/10 hover:border-concrete-yellow/40 transition-all group"
        >
          <span className="text-white font-medium text-sm group-hover:text-concrete-yellow transition-colors">
            Submit Your Proof
          </span>
          <ArrowRight className="w-4 h-4 text-concrete-yellow group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </nav>
  );
}
