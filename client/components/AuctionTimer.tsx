import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'

interface AuctionTimerProps {
  timeRemaining: number
  isEnded: boolean
}

export default function AuctionTimer({ timeRemaining, isEnded }: AuctionTimerProps) {
  const formatTime = (ms: number) => {
    if (ms <= 0) return { h: '00', m: '00', s: '00' }

    const seconds = Math.floor(ms / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return {
      h: String(hours).padStart(2, '0'),
      m: String(minutes).padStart(2, '0'),
      s: String(secs).padStart(2, '0')
    }
  }

  const { h, m, s } = formatTime(timeRemaining)

  const isUrgent = !isEnded && timeRemaining < 30000 // Less than 30 seconds
  const isCrtical = !isEnded && timeRemaining < 10000 // Less than 10 seconds

  return (
    <div className="card glass" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
      border: isCrtical ? '2px solid var(--error)' : isUrgent ? '1px solid var(--error)' : '1px solid var(--border)',
      boxShadow: isCrtical ? '0 0 30px rgba(239, 68, 68, 0.4)' : isUrgent ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Pulse background overlay for critical moments */}
      {isCrtical && (
        <motion.div
          animate={{ opacity: [0.02, 0.08, 0.02] }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--error)',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', position: 'relative', zIndex: 1 }}>
        <Clock size={16} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {isEnded ? 'Auction Concluded' : 'Time Remaining'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <TimeUnit value={h} label="hours" />
        <TimeSeparator />
        <TimeUnit value={m} label="mins" />
        <TimeSeparator />
        <TimeUnit value={s} label="secs" isUrgent={isUrgent || isCrtical} />
      </div>

      <AnimatePresence>
        {isUrgent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <motion.p
              animate={{ scale: isCrtical ? [1, 1.15, 1] : [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: isCrtical ? 0.5 : 1 }}
              style={{
                color: 'var(--error)',
                fontSize: isCrtical ? '1rem' : '0.9rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              {isCrtical ? '⚠️ CRITICAL ENDING!' : '🔥 Ending Soon'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TimeUnit({ value, label, isUrgent }: { value: string, label: string, isUrgent?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            color: isUrgent ? 'var(--error)' : 'var(--text)',
            lineHeight: 1
          }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
        {label}
      </span>
    </div>
  )
}

function TimeSeparator() {
  return (
    <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--border)', marginTop: '-1.5rem' }}>:</div>
  )
}
