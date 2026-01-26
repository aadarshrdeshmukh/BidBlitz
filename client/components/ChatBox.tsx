'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, User, Clock } from 'lucide-react'
import { Socket } from 'socket.io-client'

interface Message {
    _id: string
    senderId: {
        _id: string
        username: string
    }
    content: string
    createdAt: string
}

interface ChatBoxProps {
    auctionId: string
    currentUser: { id: string; username: string }
    socket: Socket | null
}

export default function ChatBox({ auctionId, currentUser, socket }: ChatBoxProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${auctionId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await response.json()
                if (data.success) {
                    setMessages(data.messages)
                }
            } catch (error) {
                console.error('Error fetching messages:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessages()

        if (socket) {
            socket.on('newMessage', (message: Message) => {
                setMessages(prev => [...prev, message])
            })
        }

        return () => {
            if (socket) {
                socket.off('newMessage')
            }
        }
    }, [auctionId, socket])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !socket) return

        socket.emit('sendMessage', {
            auctionId,
            senderId: currentUser.id,
            username: currentUser.username,
            content: newMessage
        })

        setNewMessage('')
    }

    return (
        <div className="card glass luxury-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px' }}>
                    <MessageSquare size={18} color="var(--secondary)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Transaction Channel</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Private conversation with the {currentUser.id === messages[0]?.senderId?._id ? 'winner' : 'seller'}</p>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }} className="custom-scrollbar">
                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }} className="pulsate">Connecting to channel...</div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No messages yet. Start a conversation to arrange logistics.
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId._id === currentUser.id
                        return (
                            <div key={msg._id} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: isMe ? 'flex-end' : 'flex-start',
                                gap: '4px'
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                    background: isMe ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: isMe ? 'black' : 'white',
                                    fontSize: '0.95rem',
                                    fontWeight: 500,
                                    boxShadow: isMe ? '0 4px 15px rgba(255,255,255,0.1)' : 'none'
                                }}>
                                    {msg.content}
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    {!isMe && <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{msg.senderId.username}</span>}
                                    <Clock size={10} /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                        flex: 1,
                        padding: '0.75rem 1.25rem',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        padding: '0.75rem',
                        background: 'var(--primary)',
                        color: 'black',
                        border: 'none',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <Send size={18} />
                </motion.button>
            </form>
        </div>
    )
}
