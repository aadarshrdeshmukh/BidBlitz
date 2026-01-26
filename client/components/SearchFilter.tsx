'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Search,
    SlidersHorizontal,
    X,
    DollarSign,
    LayoutGrid,
    Smartphone,
    Shirt,
    Sparkles,
    Palette,
    Trophy,
    Home,
    Car,
    Box
} from 'lucide-react'

interface SearchFilterProps {
    onSearch: (filters: FilterState) => void
}

export interface FilterState {
    search: string
    category: string
    minPrice: string
    maxPrice: string
    sortBy: string
    auctionType: string
}

// ... existing code ...

const CATEGORIES = [
    { value: 'All', label: 'All Categories', icon: LayoutGrid, color: 'var(--primary)' },
    { value: 'Electronics', label: 'Electronics', icon: Smartphone, color: '#3b82f6' },
    { value: 'Fashion', label: 'Fashion', icon: Shirt, color: '#ec4899' },
    { value: 'Collectibles', label: 'Collectibles', icon: Sparkles, color: '#eab308' },
    { value: 'Art', label: 'Art', icon: Palette, color: '#8b5cf6' },
    { value: 'Sports', label: 'Sports', icon: Trophy, color: '#f97316' },
    { value: 'Home', label: 'Home & Garden', icon: Home, color: '#10b981' },
    { value: 'Automotive', label: 'Automotive', icon: Car, color: '#ef4444' },
    { value: 'Other', label: 'Other', icon: Box, color: 'var(--text-muted)' }
]

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
]

export default function SearchFilter({ onSearch }: SearchFilterProps) {
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: 'All',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest',
        auctionType: ''
    })
    const [showAdvanced, setShowAdvanced] = useState(false)

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [key]: value }
        setFilters(newFilters)
        onSearch(newFilters)
    }

    const clearFilters = () => {
        const resetFilters: FilterState = {
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
            auctionType: ''
        }
        setFilters(resetFilters)
        onSearch(resetFilters)
    }

    const hasActiveFilters = filters.search || filters.category !== 'All' || filters.minPrice || filters.maxPrice

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {/* Main Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Search auctions by title or description..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="glass"
                        style={{
                            width: '100%',
                            padding: '1rem 3rem 1rem 3rem',
                            borderRadius: '16px',
                            border: '1px solid var(--border)',
                            background: 'rgba(255,255,255,0.03)',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    {filters.search && (
                        <button
                            onClick={() => handleFilterChange('search', '')}
                            style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px'
                            }}
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFilterChange('auctionType', filters.auctionType === 'rapid' ? '' : 'rapid')}
                    className="glass"
                    style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '16px',
                        border: `1px solid ${filters.auctionType === 'rapid' ? 'var(--error)' : 'var(--border)'}`,
                        background: filters.auctionType === 'rapid' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.03)',
                        color: filters.auctionType === 'rapid' ? '#ff4d4d' : 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 900,
                        fontSize: '0.9rem',
                        boxShadow: filters.auctionType === 'rapid' ? '0 0 20px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                >
                    ⚡ RAPID
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="glass"
                    style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '16px',
                        border: `1px solid ${showAdvanced ? 'var(--primary)' : 'var(--border)'}`,
                        background: showAdvanced ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
                        color: showAdvanced ? 'var(--primary)' : 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        fontSize: '0.9rem'
                    }}
                >
                    <SlidersHorizontal size={18} />
                    Filters
                </motion.button>
            </div>

            {/* Quick Category Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Categories:
                </span>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isActive = filters.category === cat.value
                    return (
                        <motion.button
                            key={cat.value}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFilterChange('category', cat.value)}
                            className="glass"
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                border: `1px solid ${isActive ? cat.color : 'var(--border)'}`,
                                background: isActive ? `${cat.color}15` : 'rgba(255,255,255,0.03)',
                                color: isActive ? cat.color : 'var(--text)',
                                fontSize: '0.85rem',
                                fontWeight: isActive ? 800 : 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: '0.2s ease'
                            }}
                        >
                            <Icon size={14} color={isActive ? cat.color : 'inherit'} />
                            {cat.label}
                        </motion.button>
                    )
                })}
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="glass"
                    style={{
                        padding: '1.5rem',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Advanced Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        {/* Price Range */}
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Min Price
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <DollarSign size={16} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Max Price
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="number"
                                    placeholder="∞"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.75rem 0.75rem 2rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                                <DollarSign size={16} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                                Sort By
                            </label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    outline: 'none',
                                    appearance: 'none'
                                }}
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
