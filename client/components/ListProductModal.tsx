'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Clock, DollarSign, Tag, Sparkles, Loader2, Zap, Info, Activity, Image as ImageIcon } from 'lucide-react'
import { getAuthToken } from '@/lib/auth'
import { triggerHaptic } from '@/lib/haptics'

interface ListProductModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function ListProductModal({ isOpen, onClose, onSuccess }: ListProductModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        startingBid: '',
        durationMinutes: '60',
        durationSeconds: '15',
        auctionType: 'regular' as 'regular' | 'rapid',
        imageUrl: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const token = getAuthToken()
            if (!token) throw new Error('You must be logged in to list a product')

            const payload = {
                ...formData,
                startingBid: parseFloat(formData.startingBid),
                durationMinutes: formData.auctionType === 'regular' ? parseInt(formData.durationMinutes) : undefined,
                durationSeconds: formData.auctionType === 'rapid' ? parseInt(formData.durationSeconds) : undefined,
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()
            if (!data.success) throw new Error(data.message)

            triggerHaptic('success')
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message)
            triggerHaptic('error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000,
                    padding: '1.5rem'
                }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0,0,0,0.85)',
                            backdropFilter: 'blur(12px)',
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        style={{
                            width: '100%',
                            maxWidth: '1000px',
                            position: 'relative',
                            zIndex: 1,
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="card glass" style={{ padding: '2.5rem', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                                        <Sparkles size={18} color="var(--primary)" />
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Seller Studio</span>
                                    </div>
                                    <h2 className="luxo-gradient-text" style={{ fontSize: '2rem' }}>List an Item</h2>
                                </div>
                                <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', background: 'none', border: 'none' }}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                                {/* Form Side */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {error && (
                                        <div style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            color: 'var(--error)',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            fontSize: '0.9rem'
                                        }}>
                                            {error}
                                        </div>
                                    )}

                                    {/* Mode Toggle */}
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '8px',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '12px',
                                        padding: '4px'
                                    }}>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, auctionType: 'regular' })}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                background: formData.auctionType === 'regular' ? 'rgba(255,255,255,0.08)' : 'transparent',
                                                color: formData.auctionType === 'regular' ? 'white' : 'var(--text-muted)',
                                                transition: '0.2s'
                                            }}
                                        >
                                            Regular Mode
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, auctionType: 'rapid' })}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                background: formData.auctionType === 'rapid' ? 'var(--primary)' : 'transparent',
                                                color: formData.auctionType === 'rapid' ? 'black' : 'var(--text-muted)',
                                                transition: '0.2s'
                                            }}
                                        >
                                            Rapid Mode
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                placeholder="Product Title"
                                                required
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                            />
                                            <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <textarea
                                                placeholder="Description (story, provenance, details...)"
                                                required
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                style={{ width: '100%', padding: '1rem', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', resize: 'none' }}
                                            />
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', appearance: 'none' }}
                                            >
                                                <option value="Electronics">Electronics</option>
                                                <option value="Fashion">Fashion</option>
                                                <option value="Collectibles">Collectibles</option>
                                                <option value="Art">Art</option>
                                                <option value="Sports">Sports</option>
                                                <option value="Home">Home & Garden</option>
                                                <option value="Automotive">Automotive</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            <Tag size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    type="number"
                                                    placeholder="Starting Bid"
                                                    required
                                                    value={formData.startingBid}
                                                    onChange={e => setFormData({ ...formData, startingBid: e.target.value })}
                                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                                />
                                                <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                {formData.auctionType === 'regular' ? (
                                                    <select
                                                        value={formData.durationMinutes}
                                                        onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })}
                                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', appearance: 'none' }}
                                                    >
                                                        <option value="60">1 Hour</option>
                                                        <option value="1440">24 Hours</option>
                                                        <option value="4320">3 Days</option>
                                                        <option value="10080">7 Days</option>
                                                    </select>
                                                ) : (
                                                    <select
                                                        value={formData.durationSeconds}
                                                        onChange={e => setFormData({ ...formData, durationSeconds: e.target.value })}
                                                        style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none', appearance: 'none' }}
                                                    >
                                                        <option value="10">10 Seconds</option>
                                                        <option value="15">15 Seconds</option>
                                                        <option value="20">20 Seconds</option>
                                                        <option value="30">30 Seconds</option>
                                                        <option value="60">60 Seconds</option>
                                                    </select>
                                                )}
                                                <Clock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                            style={{
                                                width: '100%',
                                                height: '140px',
                                                border: '2px dashed var(--border)',
                                                borderRadius: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                cursor: 'pointer',
                                                background: formData.imageUrl ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)',
                                                transition: '0.2s',
                                                borderColor: formData.imageUrl ? 'var(--success)' : 'var(--border)',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                                                e.currentTarget.style.borderColor = 'var(--primary)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = formData.imageUrl ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)'
                                                e.currentTarget.style.borderColor = formData.imageUrl ? 'var(--success)' : 'var(--border)'
                                            }}
                                        >
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                                            ) : null}

                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Upload size={24} color={formData.imageUrl ? 'var(--success)' : 'var(--text-muted)'} />
                                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: formData.imageUrl ? 'var(--success)' : 'var(--text-muted)' }}>
                                                    {formData.imageUrl ? 'Image Selected ✓' : 'Click to Upload Asset Image'}
                                                </span>
                                            </div>

                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) {
                                                        const reader = new FileReader()
                                                        reader.onloadend = () => {
                                                            setFormData({ ...formData, imageUrl: reader.result as string })
                                                        }
                                                        reader.readAsDataURL(file)
                                                    }
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>OR</span>
                                            <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="url"
                                                placeholder="Asset URL (Direct Image Link)"
                                                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                                                onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' }}
                                            />
                                            <ImageIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="glow-btn"
                                            style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', justifyContent: 'center' }}
                                        >
                                            {isLoading ? <Loader2 className="pulsate" size={20} /> : (
                                                <>
                                                    Publish Auction
                                                    <Upload size={20} />
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                </div>

                                {/* Preview Side */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="card glass" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.01)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <ImageIcon size={16} color="var(--primary)" />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Buyer View Preview</span>
                                        </div>

                                        <div style={{ height: '180px', borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {formData.imageUrl ? (
                                                <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <ImageIcon size={40} color="var(--text-muted)" opacity={0.2} />
                                            )}
                                        </div>

                                        <div>
                                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', height: '1.5em', overflow: 'hidden' }}>{formData.title || 'Your Product Title'}</h3>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: formData.auctionType === 'rapid' ? 'var(--warning)' : 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Clock size={12} />
                                                    {formData.auctionType === 'regular'
                                                        ? `${parseInt(formData.durationMinutes) / 60}H DURATION`
                                                        : `${formData.durationSeconds}S FLASH DURATION`}
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>Starting Price</span>
                                                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${formData.startingBid || '0'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {formData.auctionType === 'regular' ? (
                                                    <Zap size={14} color="var(--warning)" />
                                                ) : (
                                                    <Activity size={14} color="var(--error)" />
                                                )}
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {formData.auctionType === 'regular'
                                                        ? 'Anti-Sniping Extensions Enabled'
                                                        : 'Lethal Rapid Mode: No Extensions'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="card glass" style={{ padding: '1.25rem', background: formData.auctionType === 'rapid' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)', border: formData.auctionType === 'rapid' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <Info size={18} color={formData.auctionType === 'rapid' ? 'var(--error)' : 'var(--secondary)'} />
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                                                <strong>{formData.auctionType === 'rapid' ? 'Rapid Tip:' : 'Selling Tip:'}</strong> {formData.auctionType === 'rapid'
                                                    ? "Rapid auctions succeed best for high-demand, low-inventory items."
                                                    : parseInt(formData.durationMinutes) > 1440
                                                        ? "Multi-day auctions tend to fetch 35% higher final bids."
                                                        : "Standard auctions give global bidders time to participate."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
