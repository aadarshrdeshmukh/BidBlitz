import { Bid } from '@/types/auction'
import { motion, AnimatePresence } from 'framer-motion'
import { History, User, Trophy } from 'lucide-react'

interface BidHistoryProps {
  bids: Bid[]
  currentUserId?: string
}

export default function BidHistory({ bids, currentUserId }: BidHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="card glass" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} color="var(--primary)" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Live Bid Feed</h3>
        </div>
        <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          {bids.length} total
        </span>
      </div>

      <div style={{
        flex: 1,
        maxHeight: '500px',
        overflowY: 'auto',
        paddingRight: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative'
      }}>
        {/* Timeline Line */}
        {bids.length > 1 && (
          <div style={{
            position: 'absolute',
            left: '30px',
            top: '20px',
            bottom: '20px',
            width: '2px',
            background: 'linear-gradient(to bottom, var(--primary), rgba(255,255,255,0.05))',
            zIndex: 0
          }} />
        )}

        {bids.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem' }}>No bids yet. Be the first!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {bids.map((bid, index) => {
              const isHighest = index === 0;
              const isUserBid = bid.userId === currentUserId;

              return (
                <motion.div
                  key={bid._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    background: isHighest ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255,255,255,0.03)',
                    border: isHighest ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    zIndex: 1,
                    marginLeft: bids.length > 1 ? '10px' : '0'
                  }}
                >
                  {isHighest && (
                    <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: 'var(--primary)' }} />
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isUserBid ? 'var(--primary)' : 'rgba(110, 110, 110, 0.4)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid var(--background)',
                      boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                      zIndex: 2
                    }}>
                      <User size={18} color={isUserBid ? 'black' : 'white'} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {bid.username}
                        </span>
                        {isHighest && (
                          <div style={{
                            background: 'white',
                            color: 'black',
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            👑 Top Bidder
                          </div>
                        )}
                        {isUserBid && !isHighest && (
                          <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            fontSize: '0.65rem',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}>
                            You
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                        {formatDate(bid.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: isHighest ? 'var(--primary)' : 'var(--text)'
                    }}>
                      ${bid.amount}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
