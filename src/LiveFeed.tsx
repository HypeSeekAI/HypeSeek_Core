import { motion } from 'framer-motion';
// Correctly import Navbar from the App component file
import { Navbar } from './App'; 
import { Filter, ChevronDown, FileText } from 'lucide-react';

const narratives = [
  { id: 1, name: 'AI AGENTS', score: 94, category: 'Technology', trend: '+12.4%', change: 12.4 },
  { id: 2, name: 'DEPIN', score: 88, category: 'Infrastructure', trend: '+8.1%', change: 8.1 },
  { id: 3, name: 'TRUMP META', score: 72, category: 'Politics', trend: '-2.5%', change: -2.5 },
  { id: 4, name: 'REAL WORLD ASSETS', score: 91, category: 'Finance', trend: '+15.2%', change: 15.2 },
  { id: 5, name: 'SOLANA GAMING', score: 85, category: 'Gaming', trend: '+7.8%', change: 7.8 },
  { id: 6, name: 'CELEBCOINS V2', score: 65, category: 'Culture', trend: '-5.0%', change: -5.0 },
];

export function LiveFeed() {
  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white font-inter selection:bg-[var(--hs-cyan)]/30">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pt-24 pb-12">
        <header className="mb-8 mt-8">
          <h1 className="orbitron text-4xl md:text-5xl font-black tracking-tighter text-white">Live Feed</h1>
          <p className="text-white/60 mt-2">Real-time narrative and virality scoring.</p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10">
            <Filter size={16} />
            <span>Category</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="hs-card rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-xs orbitron text-white/50">NARRATIVE</th>
                  <th className="px-6 py-4 text-xs orbitron text-white/50 text-center">VIRALITY SCORE</th>
                  <th className="px-6 py-4 text-xs orbitron text-white/50 text-center">24H TREND</th>
                  <th className="px-6 py-4 text-xs orbitron text-white/50 text-center">DETAILS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {narratives.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{item.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="orbitron text-lg font-bold text-[var(--hs-cyan)]">{item.score}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-sm ${item.change > 0 ? 'text-[var(--hs-green)]' : 'text-red-500'}`}>
                        {item.trend}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center">
                      <button className="text-white/50 hover:text-[var(--hs-cyan)] transition-colors">
                        <FileText size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
