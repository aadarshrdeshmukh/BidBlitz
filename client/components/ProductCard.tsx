'use client'

import {
  Clock,
  Tag,
  Trophy,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Smartphone,
  Shirt,
  Sparkles,
  Palette,
  Home,
  Car,
  Box,
  Zap
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Auction } from '@/types/auction'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

interface ProductCardProps {
  auction: Auction
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    'Electronics': Smartphone,
    'Fashion': Shirt,
    'Collectibles': Sparkles,
    'Art': Palette,
    'Sports': Trophy,
    'Home': Home,
    'Automotive': Car,
    'Other': Box
  }
  return iconMap[category] || Box
}

export default function ProductCard({ auction }: ProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/auction/${auction._id}`)
  }

  const [timeStr, setTimeStr] = useState('')

  useEffect(() => {
    const calcTime = () => {
      const now = new Date().getTime()
      const end = new Date(auction.endTime).getTime()
      const diff = end - now

      if (diff <= 0) return 'Ended'

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      return `${hours}h ${minutes}m ${seconds}s`
    }

    setTimeStr(calcTime())
    const interval = setInterval(() => {
      setTimeStr(calcTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [auction.endTime])

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        hover: { y: -8 }
      }}
      className="card"
      style={{
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden'
      }}
      onClick={handleClick}
    >
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        height: '200px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {auction.imageUrl ? (
          <motion.img
            src={auction.imageUrl}
            alt={auction.title}
            variants={{
              hover: { scale: 1.1 }
            }}
            transition={{ duration: 0.4 }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Tag size={48} color="var(--text-muted)" opacity={0.3} />
        )}

        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 2
        }}>
          <Clock size={12} color={auction.status === 'active' ? 'var(--success)' : 'var(--error)'} />
          {auction.status === 'active' ? timeStr : 'Ended'}
        </div>

        {/* Status Ribbon */}
        {getAuthUser() && auction.currentWinner && (
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            padding: '8px',
            background: auction.currentWinner === getAuthUser()?.id ? 'var(--success)' : 'var(--error)',
            color: 'white',
            fontSize: '0.7rem',
            textAlign: 'center',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            zIndex: 2
          }}>
            {auction.currentWinner === getAuthUser()?.id ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Trophy size={12} /> Leading
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> Outbid
              </div>
            )}
          </div>
        )}

        {/* Rapid Badge */}
        {auction.auctionType === 'rapid' && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--error)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.65rem',
            fontWeight: 900,
            zIndex: 2,
            boxShadow: '0 0 15px var(--error)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Zap size={10} fill="white" /> RAPID
          </div>
        )}

        {/* Hot Badge */}
        {auction.auctionType !== 'rapid' && auction.currentBid > auction.startingBid * 1.5 && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'white',
            color: 'black',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '0.65rem',
            fontWeight: 900,
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <TrendingUp size={10} /> HOT ITEM
          </div>
        )}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text)' }}>
            {auction.title}
          </h3>
          {auction.category && (() => {
            const CategoryIcon = getCategoryIcon(auction.category)
            return (
              <span style={{
                fontSize: '0.7rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                fontWeight: 600,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CategoryIcon size={12} /> {auction.category}
              </span>
            )
          })()}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Current Bid
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ${auction.currentBid}
              <TrendingUp size={16} />
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
              Starting
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              ${auction.startingBid}
            </span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'var(--primary)',
            color: 'black',
            borderRadius: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={(e) => {
            e.stopPropagation()
            const user = getAuthUser()
            if (!user) {
              router.push(`/login?redirectTo=/auction/${auction._id}`)
            } else {
              router.push(`/auction/${auction._id}`)
            }
          }}
        >
          {getAuthUser() ? (
            <>
              Bid Now
              <TrendingUp size={18} />
            </>
          ) : (
            <>
              Sign in to Bid
              <ChevronRight size={18} />
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
