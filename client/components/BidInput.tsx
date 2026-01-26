import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Send, Zap, ChevronRight, TrendingUp, Trophy } from 'lucide-react'

interface BidInputProps {
  currentBid: number
  onPlaceBid: (amount: number) => void
  disabled: boolean
  isEnded: boolean
  balance?: number
  isAutoBidActive: boolean
  setIsAutoBidActive: (val: boolean) => void
  autoBidMax: number | null
  setAutoBidMax: (val: number | null) => void
}

export default function BidInput({
  currentBid,
  onPlaceBid,
  disabled,
  isEnded,
  balance = 0,
  isAutoBidActive,
  setIsAutoBidActive,
  autoBidMax,
  setAutoBidMax
}: BidInputProps) {
  const [bidAmount, setBidAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const amount = parseFloat(bidAmount)
    if (isNaN(amount) || amount <= currentBid) {
      return
    }

    setIsSubmitting(true)
    onPlaceBid(amount)

    setTimeout(() => {
      setIsSubmitting(false)
      setBidAmount('')
    }, 1000)
  }

  const quickBidIncrements = [10, 50, 100]

  return (
    <div className={`card glass ${disabled ? 'disabled' : ''}`} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      opacity: disabled && !isEnded ? 0.7 : 1
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <DollarSign size={20} color="var(--primary)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Place Your Bid</h3>
      </div>

      {isEnded ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem 1rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          color: 'var(--text-muted)'
        }}>
          Bidding has concluded
        </div>
      ) : !disabled ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                placeholder={`Min: $${currentBid + 1}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={currentBid + 1}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  paddingLeft: '3rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
              <DollarSign
                size={20}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting || !bidAmount}
              className="glow-btn"
              style={{
                width: '100%',
                padding: '1.25rem',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isSubmitting ? (
                <span className="pulsate">Placing Bid...</span>
              ) : (
                <>
                  Place Bid <Send size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Auto-Bid Feature */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Soft Auto-Bid</span>
              </div>
              <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
                <input
                  type="checkbox"
                  checked={isAutoBidActive}
                  onChange={(e) => setIsAutoBidActive(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: isAutoBidActive ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                  transition: '0.4s',
                  borderRadius: '34px'
                }}>
                  <span style={{
                    position: 'absolute',
                    height: '18px',
                    width: '18px',
                    left: '2px',
                    bottom: '2px',
                    background: isAutoBidActive ? 'black' : 'white',
                    transition: '0.4s',
                    borderRadius: '50%',
                    transform: isAutoBidActive ? 'translateX(22px)' : 'none'
                  }} />
                </span>
              </label>
            </div>
            {isAutoBidActive && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Auto-places minimum bids up to your maximum limit.
                </p>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    placeholder="Maximum Limit"
                    value={autoBidMax || ''}
                    onChange={(e) => setAutoBidMax(parseFloat(e.target.value) || null)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      paddingLeft: '2.5rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: 'white',
                      outline: 'none'
                    }}
                  />
                  <Trophy size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                </div>
              </motion.div>
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <Zap size={14} color="var(--warning)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Quick Increments
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[10, 50, 100, 500].map(inc => (
                <motion.button
                  key={inc}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlaceBid(currentBid + inc)}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    fontWeight: 600
                  }}
                >
                  +${inc}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to start bidding on this premium item.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const auctionId = window.location.pathname.split('/').pop();
              window.location.href = `/login?redirectTo=/auction/${auctionId}`;
            }}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border)',
              color: 'white',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Join the Auction
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}
    </div>
  )
}
