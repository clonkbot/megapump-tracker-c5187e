import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenAlert {
  id: string;
  name: string;
  symbol: string;
  type: 'pump' | 'dump';
  percentChange: number;
  price: string;
  timestamp: Date;
  volume24h: string;
  marketCap: string;
}

// Simulated data generator for demo
const generateMockAlert = (): TokenAlert => {
  const tokens = [
    { name: 'MegaDoge', symbol: 'MDOGE' },
    { name: 'EthKiller', symbol: 'ETHK' },
    { name: 'MoonShot', symbol: 'MOON' },
    { name: 'GigaChad', symbol: 'GIGA' },
    { name: 'NeonPunk', symbol: 'NEON' },
    { name: 'CyberApe', symbol: 'CAPE' },
    { name: 'QuantumFlux', symbol: 'QFLX' },
    { name: 'HyperNode', symbol: 'HYPE' },
    { name: 'VoidToken', symbol: 'VOID' },
    { name: 'PlasmaCore', symbol: 'PLSM' },
  ];
  const token = tokens[Math.floor(Math.random() * tokens.length)];
  const isPump = Math.random() > 0.45;
  const percentChange = (20 + Math.random() * 180) * (isPump ? 1 : -1);

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: token.name,
    symbol: token.symbol,
    type: isPump ? 'pump' : 'dump',
    percentChange: parseFloat(percentChange.toFixed(2)),
    price: `$${(Math.random() * 10).toFixed(6)}`,
    timestamp: new Date(),
    volume24h: `$${(Math.random() * 10000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    marketCap: `$${(Math.random() * 100000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
  };
};

// Matrix rain character component
const MatrixRain = () => {
  const columns = 30;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789MEGAETH';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      {[...Array(columns)].map((_, i) => (
        <div
          key={i}
          className="absolute text-[#00ff88] text-xs font-mono whitespace-nowrap"
          style={{
            left: `${(i / columns) * 100}%`,
            animation: `matrixFall ${8 + Math.random() * 12}s linear infinite`,
            animationDelay: `${-Math.random() * 20}s`,
          }}
        >
          {[...Array(30)].map((_, j) => (
            <div key={j} style={{ opacity: 1 - j * 0.03 }}>
              {chars[Math.floor(Math.random() * chars.length)]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Glitchy text component
const GlitchText = ({ children, className = '' }: { children: string; className?: string }) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        className="absolute top-0 left-0 text-[#ff0055] opacity-80 z-0"
        style={{
          clipPath: 'inset(10% 0 60% 0)',
          animation: 'glitch1 2s infinite linear alternate-reverse',
        }}
      >
        {children}
      </span>
      <span
        className="absolute top-0 left-0 text-[#00d4ff] opacity-80 z-0"
        style={{
          clipPath: 'inset(60% 0 10% 0)',
          animation: 'glitch2 2s infinite linear alternate-reverse',
        }}
      >
        {children}
      </span>
    </span>
  );
};

// Alert card component
const AlertCard = ({ alert, index }: { alert: TokenAlert; index: number }) => {
  const isPump = alert.type === 'pump';
  const accentColor = isPump ? '#00ff88' : '#ff0055';

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      className="relative group"
    >
      <div
        className="absolute inset-0 opacity-30 blur-xl transition-opacity group-hover:opacity-50"
        style={{ backgroundColor: accentColor }}
      />
      <div
        className="relative bg-[#0d0d15]/90 border backdrop-blur-sm p-4 md:p-5"
        style={{
          borderColor: accentColor,
          boxShadow: `0 0 20px ${accentColor}33, inset 0 0 30px ${accentColor}11`,
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-lg md:text-xl font-bold font-orbitron"
                style={{ color: accentColor }}
              >
                ${alert.symbol}
              </span>
              <span className="text-[#606080] text-sm font-mono">{alert.name}</span>
            </div>
            <div className="text-[#808090] text-xs font-mono">
              {alert.timestamp.toLocaleTimeString()}
            </div>
          </div>

          {/* Type badge */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="px-3 py-1 font-orbitron text-sm font-bold tracking-wider"
            style={{
              backgroundColor: `${accentColor}22`,
              color: accentColor,
              border: `1px solid ${accentColor}`,
              textShadow: `0 0 10px ${accentColor}`,
            }}
          >
            {isPump ? '▲ PUMP' : '▼ DUMP'}
          </motion.div>
        </div>

        {/* Main stat */}
        <div
          className="text-3xl md:text-4xl font-bold font-mono mb-4"
          style={{
            color: accentColor,
            textShadow: `0 0 30px ${accentColor}66`,
          }}
        >
          {alert.percentChange > 0 ? '+' : ''}{alert.percentChange}%
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-3 gap-3 text-xs font-mono">
          <div>
            <div className="text-[#505060] mb-1">PRICE</div>
            <div className="text-[#e0e0e0]">{alert.price}</div>
          </div>
          <div>
            <div className="text-[#505060] mb-1">VOL 24H</div>
            <div className="text-[#e0e0e0]">{alert.volume24h}</div>
          </div>
          <div>
            <div className="text-[#505060] mb-1">MCAP</div>
            <div className="text-[#e0e0e0]">{alert.marketCap}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Stats display
const StatsBar = ({ alerts }: { alerts: TokenAlert[] }) => {
  const pumps = alerts.filter(a => a.type === 'pump').length;
  const dumps = alerts.filter(a => a.type === 'dump').length;
  const biggestPump = Math.max(...alerts.filter(a => a.type === 'pump').map(a => a.percentChange), 0);
  const biggestDump = Math.min(...alerts.filter(a => a.type === 'dump').map(a => a.percentChange), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {[
        { label: 'PUMPS', value: pumps, color: '#00ff88' },
        { label: 'DUMPS', value: dumps, color: '#ff0055' },
        { label: 'MAX PUMP', value: `+${biggestPump.toFixed(0)}%`, color: '#00ff88' },
        { label: 'MAX DUMP', value: `${biggestDump.toFixed(0)}%`, color: '#ff0055' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="bg-[#0d0d15]/80 border border-[#1a1a2e] p-4 text-center"
        >
          <div className="text-[#505060] text-xs font-mono mb-1">{stat.label}</div>
          <div
            className="text-2xl font-bold font-orbitron"
            style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}44` }}
          >
            {stat.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const [alerts, setAlerts] = useState<TokenAlert[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pump' | 'dump'>('all');

  // Generate initial alerts
  useEffect(() => {
    const initial = [...Array(6)].map(() => generateMockAlert());
    setAlerts(initial);
  }, []);

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newAlert = generateMockAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const filteredAlerts = alerts.filter(a => filter === 'all' || a.type === filter);

  const toggleLive = useCallback(() => setIsLive(prev => !prev), []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] relative overflow-hidden">
      {/* Background effects */}
      <MatrixRain />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-[#00ff88] rounded-full blur-[200px] opacity-5 -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-[#ff0055] rounded-full blur-[200px] opacity-5 translate-x-1/2 translate-y-1/2" />

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* CRT scanlines */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 md:mb-14"
        >
          <div className="mb-4">
            <span className="text-[#00d4ff] font-mono text-xs tracking-[0.3em] opacity-70">
              /// MEGAETH NETWORK ///
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black mb-4 tracking-tight">
            <GlitchText className="text-[#e0e0e0]">MEGA</GlitchText>
            <span className="text-[#00ff88]" style={{ textShadow: '0 0 40px #00ff8866' }}>PUMP</span>
          </h1>

          <p className="text-[#606080] font-mono text-sm md:text-base max-w-lg mx-auto">
            Real-time tracking of 20%+ price movements on MegaETH chain
          </p>

          {/* Live indicator */}
          <motion.div
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#0d0d15]/80 border border-[#1a1a2e]"
            animate={{ borderColor: isLive ? ['#1a1a2e', '#00ff88', '#1a1a2e'] : '#1a1a2e' }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <motion.div
              animate={{
                scale: isLive ? [1, 1.3, 1] : 1,
                opacity: isLive ? [1, 0.5, 1] : 0.3,
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: isLive ? '#00ff88' : '#505060' }}
            />
            <span className="font-mono text-xs text-[#808090]">
              {isLive ? 'LIVE FEED ACTIVE' : 'FEED PAUSED'}
            </span>
          </motion.div>
        </motion.header>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Filter buttons */}
          <div className="flex gap-2">
            {(['all', 'pump', 'dump'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200"
                style={{
                  backgroundColor: filter === f ? (f === 'pump' ? '#00ff8822' : f === 'dump' ? '#ff005522' : '#00d4ff22') : 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: filter === f ? (f === 'pump' ? '#00ff88' : f === 'dump' ? '#ff0055' : '#00d4ff') : '#1a1a2e',
                  color: filter === f ? (f === 'pump' ? '#00ff88' : f === 'dump' ? '#ff0055' : '#00d4ff') : '#606080',
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Toggle live */}
          <button
            onClick={toggleLive}
            className="px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200"
            style={{
              borderColor: isLive ? '#00ff88' : '#1a1a2e',
              color: isLive ? '#00ff88' : '#606080',
              backgroundColor: isLive ? '#00ff8811' : 'transparent',
            }}
          >
            {isLive ? '◼ PAUSE' : '▶ RESUME'}
          </button>
        </motion.div>

        {/* Stats */}
        <StatsBar alerts={alerts} />

        {/* Alerts grid */}
        <motion.div
          layout
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => (
              <AlertCard key={alert.id} alert={alert} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredAlerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-[#303040] text-6xl mb-4">◇</div>
            <div className="text-[#505060] font-mono">No alerts matching filter</div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 pt-8 border-t border-[#1a1a2e] text-center"
        >
          <div className="text-[#404050] font-mono text-xs">
            Requested by{' '}
            <a
              href="https://twitter.com/hey_gamble"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#606080] hover:text-[#00d4ff] transition-colors"
            >
              @hey_gamble
            </a>
            {' · '}
            Built by{' '}
            <a
              href="https://twitter.com/clonkbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#606080] hover:text-[#00d4ff] transition-colors"
            >
              @clonkbot
            </a>
          </div>
        </motion.footer>
      </div>

      {/* Global styles */}
      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes glitch1 {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        @keyframes glitch2 {
          0% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
          100% { transform: translate(0); }
        }

        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
      `}</style>
    </div>
  );
}

export default App;
