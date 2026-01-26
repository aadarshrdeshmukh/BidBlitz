'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { getAuthUser, clearAuthUser, type AuthUser } from '@/lib/auth'
import { Auction } from '@/types/auction'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User as UserIcon, LogIn, Sparkles, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ListProductModal from '@/components/ListProductModal'
import SearchFilter, { FilterState } from '@/components/SearchFilter'

import { ProductCardSkeleton } from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function AuctionLobby() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    auctionType: ''
  })
  const router = useRouter()

  useEffect(() => {
    setHasMounted(true)
    setUser(getAuthUser())
    fetchAuctions()
  }, [])

  const fetchAuctions = async (filterParams?: FilterState) => {
    try {
      const params = new URLSearchParams({ status: 'active' })

      if (filterParams) {
        if (filterParams.search) params.append('search', filterParams.search)
        if (filterParams.category && filterParams.category !== 'All') params.append('category', filterParams.category)
        if (filterParams.minPrice) params.append('minPrice', filterParams.minPrice)
        if (filterParams.maxPrice) params.append('maxPrice', filterParams.maxPrice)
        if (filterParams.sortBy) params.append('sortBy', filterParams.sortBy)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions?${params.toString()}`)
      const data = await response.json()
      if (data.success) {
        setAuctions(data.auctions)
        setFilteredAuctions(data.auctions)
      }
    } catch (error) {
      console.error('Error fetching auctions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setIsLoading(true)
    fetchAuctions(newFilters)
  }

  if (!hasMounted) return <div style={{ minHeight: '100vh', background: 'var(--background)' }} />

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                <Sparkles size={18} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Live Now</span>
              </div>
              <h1 style={{ fontSize: '3.5rem', lineHeight: 1 }}>Auction Lobby</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', fontSize: '1.1rem' }}>
                Discover and bid on exclusive premium items in real-time.
              </p>
            </div>

            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="glow-btn"
                style={{ padding: '0.8rem 1.5rem', fontSize: '1rem' }}
              >
                <Plus size={20} />
                List an Item
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>

      <ListProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchAuctions(filters)}
      />

      <SearchFilter onSearch={handleFilterChange} />

      {!isLoading && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {filteredAuctions.length === 0
              ? 'No auctions found'
              : `${filteredAuctions.length} ${filteredAuctions.length === 1 ? 'auction' : 'auctions'} found`}
          </span>
          {(filters.search || filters.category !== 'All' || filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() => {
                const resetFilters: FilterState = {
                  search: '',
                  category: 'All',
                  minPrice: '',
                  maxPrice: '',
                  sortBy: 'newest',
                  auctionType: ''
                }
                setFilters(resetFilters)
                fetchAuctions(resetFilters)
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div style={{ marginTop: '4rem' }}>
          <EmptyState
            title={filters.search || filters.category !== 'All' ? "No Matching Auctions" : "No Live Auctions"}
            description={filters.search || filters.category !== 'All'
              ? "Try adjusting your filters or search terms to find more auctions."
              : "All regular auctions have concluded. Check back later for new exclusive items."}
          />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {filteredAuctions.map(auction => (
              <ProductCard key={auction._id} auction={auction} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
