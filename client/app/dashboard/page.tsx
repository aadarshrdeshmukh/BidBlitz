'use client'

import { useEffect, useState } from 'react'
import { getAuthUser, getAuthToken } from '@/lib/auth'
import { Auction } from '@/types/auction'
import ProductCard from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Activity, History, ArrowRight, Wallet, Clock, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSocket } from '@/hooks/useSocket'

interface UserStats {
  won: Auction[]
  winning: Auction[]
  participating: Auction[]
}

import { StatCardSkeleton, ProductCardSkeleton } from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function UserDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const user = getAuthUser()
  const router = useRouter()
  const { socket } = useSocket()

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/stats`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchStats()
  }, [])

  // Real-time integration
  useEffect(() => {
    if (!socket) return

    socket.on('bidAccepted', () => {
      fetchStats()
    })

    socket.on('auctionEnded', () => {
      fetchStats()
    })

    return () => {
      socket.off('bidAccepted')
      socket.off('auctionEnded')
    }
  }, [socket])

  const endingSoon = stats?.participating.filter((item: Auction) => {
    const remaining = new Date(item.endTime).getTime() - new Date().getTime()
    return remaining > 0 && remaining < 1000 * 60 * 15 // 15 mins
  }) || []

  const history = stats?.won || []

  if (isLoading) {
    return (
      <div className="container" style={{ paddingTop: '8rem' }}>
        <header style={{ marginBottom: '4rem' }}>
          <div style={{ width: '400px', height: '48px', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="pulsate" />
          <div style={{ width: '300px', height: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }} className="pulsate" />
        </header>

        <div style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
          {[1, 2, 3].map(i => <StatCardSkeleton key={i} />)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          {[1, 2].map(i => (
            <div key={i}>
              <div style={{ width: '200px', height: '32px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }} className="pulsate" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {[1, 2, 3].map(j => <ProductCardSkeleton key={j} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ paddingTop: '8rem' }}>
      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Collector Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time overview of your auction activity and collectibles.</p>
        </div>
        <div className="glass" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} className="pulsate" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>LIVE UPDATES ACTIVE</span>
        </div>
      </header>

      <div style={{ gridTemplateColumns: 'repeat(3, 1fr)', display: 'grid', gap: '1.5rem', marginBottom: '4rem' }}>
        <StatCard
          icon={<Activity color="var(--success)" />}
          label="Winning Now"
          value={stats?.winning.length || 0}
          color="var(--success)"
        />
        <StatCard
          icon={<Clock color="var(--warning)" />}
          label="Ending Soon"
          value={endingSoon.length}
          color="var(--warning)"
        />
        <StatCard
          icon={<Trophy color="var(--primary)" />}
          label="Secured Items"
          value={history.length}
          color="var(--primary)"
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        <Section
          title="Winning Leader"
          description="High-value items where you hold the top bid."
          icon={<Activity size={24} color="var(--success)" />}
          items={stats?.winning || []}
          emptyMessage="You aren't leading any auctions yet. Start bidding to win!"
        />

        {endingSoon.length > 0 && (
          <Section
            title="Ending Soon"
            description="Auctions you've bid on that are closing in under 15 minutes."
            icon={<Clock size={24} color="var(--warning)" />}
            items={endingSoon}
            emptyMessage=""
          />
        )}

        <Section
          title="Recently Outbid"
          description="Keep an eye on these items to regain your lead."
          icon={<AlertCircle size={24} color="var(--error)" />}
          items={stats?.participating.filter((p: Auction) => !endingSoon.find((e: Auction) => e._id === p._id)) || []}
          emptyMessage="No recent outbids to show."
        />

        <Section
          title="Acquisition History"
          description="Collection of items you have successfully won."
          icon={<Trophy size={24} color="var(--primary)" />}
          items={history}
          emptyMessage="Your won auctions will appear here."
        />
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
  return (
    <div className="card glass" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
      <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
        {icon}
      </div>
      <div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{label}</span>
        <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  )
}

function Section({ title, description, icon, items, emptyMessage }: { title: string, description: string, icon: React.ReactNode, items: Auction[], emptyMessage: string }) {
  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {icon}
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>{title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{description}</p>
          </div>
        </div>
        {items.length > 0 && (
          <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {items.length} items <ArrowRight size={16} />
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div style={{ marginTop: '2rem' }}>
          <EmptyState description={emptyMessage} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {items.map(item => (
              <ProductCard key={item._id} auction={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}
