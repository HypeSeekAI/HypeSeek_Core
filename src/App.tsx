import { motion } from 'framer-motion'
import { 
  Radar, 
  Activity, 
  Check, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Coins, 
  Users
} from 'lucide-react'

// --- Components ---

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 bg-[var(--hs-cyan)]/20 blur-md rounded-full" />
            <Radar className="relative h-8 w-8 text-[var(--hs-cyan)]" />
          </div>
          <span className="orbitron text-xl font-bold tracking-tighter text-white">
            HYPESEEK
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#" className="hover:text-[var(--hs-cyan)] transition-colors">Features</a>
          <a href="#" className="hover:text-[var(--hs-cyan)] transition-colors">Comparison</a>
          <a href="#" className="hover:text-[var(--hs-cyan)] transition-colors">Docs</a>
        </div>

        <button className="rounded-lg bg-[var(--hs-cyan)] px-5 py-2.5 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,246,255,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(0,246,255,0.6)]">
          Launch App
        </button>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="radar-bg">
        <div className="radar-grid" />
        <div className="radar-sweep" />
        {/* Random pulse nodes */}
        <div className="pulse-node" style={{ top: '40%', left: '30%' }}>
          <div className="pulse-ring" style={{ width: '40px', height: '40px', top: '-18px', left: '-18px' }} />
        </div>
        <div className="pulse-node" style={{ top: '60%', left: '70%' }}>
          <div className="pulse-ring" style={{ width: '30px', height: '30px', top: '-13px', left: '-13px', animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--hs-cyan)]/30 bg-[var(--hs-cyan)]/10 px-4 py-1.5 mb-8">
            <div className="h-2 w-2 rounded-full bg-[var(--hs-cyan)] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[var(--hs-cyan)] uppercase">
              Predicting Narrative Breaks 2H Ahead
            </span>
          </div>
          
          <h1 className="orbitron text-5xl md:text-8xl font-black tracking-tighter text-white mb-6 leading-tight">
            TRADE THE<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--hs-cyan)] to-[var(--hs-purple)]">
              NARRATIVE
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 leading-relaxed">
            HypeSeek is the institutional-grade terminal for Solana narrative detection. 
            AI-driven sentiment analysis combined with real-time on-chain scrutiny.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto rounded-lg bg-[var(--hs-cyan)] px-8 py-4 text-base font-bold text-black shadow-[0_0_20px_rgba(0,246,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(0,246,255,0.5)]">
              Start Scanning Now
            </button>
            <button className="w-full sm:w-auto rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30">
              View Comparison
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function PreviewCards() {
  const cards = [
    { name: 'AI AGENTS', score: 94, trend: [40, 50, 45, 70, 85, 94], color: 'cyan' },
    { name: 'DESCI', score: 88, trend: [30, 40, 60, 55, 75, 88], color: 'purple' },
    { name: 'TRUMP META', score: 72, trend: [20, 30, 45, 40, 60, 72], color: 'green' },
  ]

  return (
    <section className="py-24 px-6 bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="hs-card p-8 rounded-2xl group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="orbitron text-sm font-bold text-white/50 tracking-widest">{card.name}</span>
                <Activity className="h-5 w-5 text-white/20" />
              </div>
              <div className="flex items-end gap-4 mb-8">
                <span className="orbitron text-6xl font-black text-white">{card.score}</span>
                <span className="text-sm font-bold text-[var(--hs-green)] mb-2">+12.4%</span>
              </div>
              <div className="h-16 flex items-end gap-1">
                {card.trend.map((h, j) => (
                  <div 
                    key={j} 
                    className="flex-1 bg-gradient-to-t from-[var(--hs-cyan)]/10 to-[var(--hs-cyan)]/50 rounded-t-sm" 
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonTable() {
  const features = [
    { name: 'Real-time On-chain Scanning', hs: true, ds: true },
    { name: 'Cross-platform Sentiment AI', hs: true, ds: false },
    { name: 'Narrative Breakout Alerts', hs: true, ds: false },
    { name: 'Whale Signal Correlation', hs: true, ds: true },
    { name: 'Predictive Virality Score', hs: true, ds: false },
    { name: 'AI Narrative Context', hs: true, ds: false },
  ]

  return (
    <section className="py-24 px-6 bg-[#080808]">
      <div className="mx-auto max-w-4xl">
        <h2 className="orbitron text-3xl md:text-5xl font-black text-center text-white mb-16 tracking-tighter">
          THE HYPESEEK <span className="text-[var(--hs-cyan)]">MOAT</span>
        </h2>
        
        <div className="hs-card rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-8 py-6 text-sm orbitron text-white/50">FEATURE</th>
                <th className="px-8 py-6 text-sm orbitron text-center text-white/50">DEXSCREENER</th>
                <th className="px-8 py-6 text-sm orbitron text-center text-[var(--hs-cyan)]">HYPESEEK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {features.map((f) => (
                <tr key={f.name} className="hover:bg-white/2 transition-colors">
                  <td className="px-8 py-5 text-sm font-medium">{f.name}</td>
                  <td className="px-8 py-5 text-center">
                    {f.ds ? <Check className="h-5 w-5 text-white/20 mx-auto" /> : <div className="h-px w-4 bg-white/10 mx-auto" />}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Check className="h-5 w-5 text-[var(--hs-cyan)] mx-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function FeatureGrid() {
  const features = [
    { title: 'AI Sentiment', desc: 'Real-time LLM parsing of X, Reddit, and Telegram sentiment shifts.', icon: Activity },
    { title: 'On-chain Scrutiny', desc: 'Instant developer and whale movement tracking on Solana.', icon: ShieldCheck },
    { title: 'Pump.fun Integration', desc: 'Deep-links and auto-sniping potential for the latest launches.', icon: Zap },
    { title: 'Global Narrative', desc: 'Track narratives across multiple chains and platforms.', icon: Globe },
    { title: 'Rev-Share', desc: 'HypeSeek holders receive a portion of terminal revenue.', icon: Coins },
    { title: 'Alpha Communities', desc: 'Verified token-gated rooms for top narrative traders.', icon: Users },
  ]

  return (
    <section className="py-24 px-6 bg-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="hs-card p-8 rounded-2xl border-white/5 hover:border-[var(--hs-cyan)]/30 transition-all group">
              <div className="h-12 w-12 rounded-lg bg-[var(--hs-cyan)]/10 flex items-center justify-center mb-6 text-[var(--hs-cyan)] group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="orbitron text-xl font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-[#050505]">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <Radar className="h-6 w-6 text-[var(--hs-cyan)]" />
          <span className="orbitron text-lg font-bold text-white tracking-tighter">HYPESEEK</span>
        </div>
        <div className="text-white/30 text-sm">
          © 2026 HYPESEEK TERMINAL. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-6 text-white/50 hover:text-white transition-colors">
          <a href="#"><Globe className="h-5 w-5" /></a>
          <a href="#"><Activity className="h-5 w-5" /></a>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <div className="bg-[#0b0b0b] min-h-screen text-white font-inter selection:bg-[var(--hs-cyan)]/30">
      <div className="noise" />
      <Navbar />
      <Hero />
      <PreviewCards />
      <ComparisonTable />
      <FeatureGrid />
      <Footer />
    </div>
  )
}
