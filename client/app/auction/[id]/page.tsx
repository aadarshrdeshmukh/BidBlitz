'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSocket } from '@/hooks/useSocket'
import { useAuction } from '@/hooks/useAuction'
import { getAuthUser } from '@/lib/auth'
import AuctionTimer from '@/components/AuctionTimer'
import BidInput from '@/components/BidInput'
import BidHistory from '@/components/BidHistory'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, ShieldCheck, Trophy, Info, Wallet, Zap } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSounds } from '@/hooks/useSounds'
import { triggerHaptic } from '@/lib/haptics'
import ChatBox from '@/components/ChatBox'

export default function AuctionDetail() {
  const params = useParams()
  const router = useRouter()
  const auctionId = params.id as string
  const { socket, isConnected } = useSocket()
  const { playSound } = useSounds()
  const [user, setUser] = useState<any>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [hasConfettiRun, setHasConfettiRun] = useState(false)
  const [isAutoBidActive, setIsAutoBidActive] = useState(false)
  const [autoBidMax, setAutoBidMax] = useState<number | null>(null)

  const {
    auction,
    bids,
    participantCount,
    timeRemaining,
    isEnded,
    error,
    isLoading,
    showExtended,
    placeBid
  } = useAuction({
    auctionId,
    socket,
    userId: user?.id
  })

  // Soft Auto-Bid Logic
  useEffect(() => {
    if (isAutoBidActive && autoBidMax && auction && !isEnded && user) {
      const isWinner = auction.currentWinner === user.id;
      const nextBid = auction.currentBid + 1; // Assuming +1 minimum increment for soft-bid

      if (!isWinner && nextBid <= autoBidMax && nextBid <= user.balance) {
        // Delay slightly for natural feel and to avoid race conditions with socket updates
        const timer = setTimeout(() => {
          placeBid(nextBid, user.username);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isAutoBidActive, autoBidMax, auction?.currentBid, auction?.currentWinner, isEnded, user, placeBid]);

  useEffect(() => {
    setHasMounted(true)
    setUser(getAuthUser())
  }, [])

  // Event Driven Sounds
  useEffect(() => {
    if (bids.length > 0 && !isEnded) {
      const latestBid = bids[0];
      if (latestBid.userId === user?.id) {
        playSound('bid');
        triggerHaptic('light');
      } else {
        playSound('outbid');
        triggerHaptic('medium');
      }
    }
  }, [bids.length, user?.id, isEnded, playSound]);

  useEffect(() => {
    if (showExtended) {
      playSound('gavel');
      triggerHaptic('heavy');
    }
  }, [showExtended, playSound]);

  useEffect(() => {
    if (isEnded) {
      if (user && auction?.currentWinner === user.id) {
        if (!hasConfettiRun) {
          playSound('success');
          triggerHaptic('success');
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ffffff', '#3b82f6', '#10b981']
          });
          setHasConfettiRun(true);
        }
      } else {
        playSound('gavel');
        triggerHaptic('medium');
      }
    }
  }, [isEnded, user, auction?.currentWinner, hasConfettiRun, playSound]);

  const handlePlaceBid = (amount: number) => {
    if (!user) {
      router.push(`/login?redirectTo=/auction/${auctionId}`)
      return
    }
    if (user.balance < amount) {
      playSound('error');
      triggerHaptic('error');
    }
    placeBid(amount, user.username)
  }

  const isWinner = user && auction?.currentWinner === user.id

  if (!hasMounted) return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />
  if (isLoading) return <div style={{ textAlign: 'center', padding: '10rem' }} className="pulsate">Gathering auction data...</div>
  if (!auction) return <div style={{ textAlign: 'center', padding: '10rem' }}>Auction not found</div>

  return (
    <div className="container" style={{ paddingTop: '8rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}
        >
          <ArrowLeft size={16} />
          Back to Lobby
        </motion.button>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass"
            style={{ padding: '0.1rem' }} // Slim wrapper
          >
            <Link href="/wallet">
              <div
                className="glass-hover"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Wallet size={16} color="var(--primary)" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wallet:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>${user.balance}</span>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {auction.auctionType === 'rapid' && !isEnded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pulsate"
            style={{
              background: 'linear-gradient(90deg, #ef4444, #991b1b)',
              padding: '12px',
              textAlign: 'center',
              borderRadius: '12px',
              marginBottom: '2rem',
              color: 'white',
              fontWeight: 900,
              fontSize: '1rem',
              letterSpacing: '0.2em',
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <Zap size={20} fill="white" />
              <span>RAPID AUCTION ACTIVE: BID FAST!</span>
              <Zap size={20} fill="white" />
            </div>
          </motion.div>
        )}
        {showExtended && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            style={{
              position: 'fixed',
              top: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              background: 'var(--primary)',
              color: 'black',
              padding: '1rem 2rem',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 10px 30px rgba(255, 255, 255, 0.2)',
              fontWeight: 700
            }}
          >
            <Zap size={20} fill="white" />
            ANTI-SNIPE TRIGGERED: +60s ADDED!
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem', alignItems: 'start' }}>
        {/* Left Column: Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          <div className="card glass" style={{ padding: '0', overflow: 'hidden', height: '500px' }}>
            {auction.imageUrl ? (
              <img src={auction.imageUrl} alt={auction.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ color: 'var(--text-muted)' }}>No Preview Available</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{auction.title}</h1>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? 'var(--success)' : 'var(--error)' }} />
                  {isConnected ? 'LIVE' : 'OFFLINE'}
                </div>
                <div className="glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <Users size={14} color="var(--primary)" />
                  <span className="pulsate">{participantCount} watching</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{auction.description}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)' }}>
                <ShieldCheck color="var(--success)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Verified Item</span>
                <span style={{ fontWeight: 600 }}>Authenticity Guaranteed</span>
              </div>
            </div>
            <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)' }}>
                <Info color="var(--secondary)" />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Shipping</span>
                <span style={{ fontWeight: 600 }}>Worldwide Express</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Bidding Action */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '7rem' }}
        >
          {isEnded && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card"
              style={{
                background: isWinner ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--surface)',
                textAlign: 'center',
                padding: '1.5rem'
              }}
            >
              {isWinner ? (
                <>
                  <Trophy size={40} color="white" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>You Won!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.8)' }}>Check your dashboard for checkout details.</p>
                </>
              ) : (
                <h2 style={{ color: 'var(--text-muted)' }}>Auction Ended</h2>
              )}
            </motion.div>
          )}

          <AuctionTimer timeRemaining={timeRemaining} isEnded={isEnded} />

          <div className="card glass" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Starting Bid</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600, opacity: 0.6 }}>${auction.startingBid}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Current Price</span>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>${auction.currentBid}</span>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              style={{ color: 'var(--error)', fontSize: '0.9rem', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px' }}
            >
              {error}
            </motion.div>
          )}

          <BidInput
            currentBid={auction.currentBid}
            onPlaceBid={handlePlaceBid}
            disabled={!user || isEnded}
            isEnded={isEnded}
            balance={user?.balance}
            isAutoBidActive={isAutoBidActive}
            setIsAutoBidActive={setIsAutoBidActive}
            autoBidMax={autoBidMax}
            setAutoBidMax={setAutoBidMax}
          />

          <div style={{ height: '400px' }}>
            <BidHistory bids={bids} currentUserId={user?.id} />
          </div>

          {isEnded && (isWinner || (user && (typeof auction.createdBy === 'string' ? auction.createdBy === user.id : auction.createdBy.id === user.id))) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ height: '500px', marginTop: '1rem' }}
            >
              <ChatBox
                auctionId={auctionId}
                currentUser={user}
                socket={socket}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
