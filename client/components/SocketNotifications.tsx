'use client'

import React, { useEffect } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useToast } from './Toast'
import { getAuthUser } from '@/lib/auth'

export const SocketNotifications = () => {
    const { socket } = useSocket()
    const { showToast } = useToast()
    const user = getAuthUser()

    useEffect(() => {
        if (!socket || !user) return

        // Listen for outbid events
        const onOutbid = (data: { auctionId: string, title: string, amount: number, bidderId: string }) => {
            // Only notify if the current user was the one outbid (data should ideally include who was outbid or we check if we were top bidder)
            // For now, if the server emits to specific users, we just show it.
            // If it's a broadcast, we'd need more logic. 
            // Assuming 'outbid' is targeted or includes the previous bidder ID.
            showToast(`You've been outbid on "${data.title}"! Current bid: $${data.amount}`, 'warning')
        }

        // Listen for auction end events
        const onAuctionEnded = (data: { auctionId: string, title: string, winnerId: string, finalAmount: number }) => {
            if (data.winnerId === user.id) {
                showToast(`Congratulations! You won the auction for "${data.title}" at $${data.finalAmount}!`, 'success', 10000)
            } else {
                // Only show if user was a participant? 
                // For now, let's keep it simple.
            }
        }

        // Listen for new auctions (Broadcast)
        const onNewAuction = (data: { title: string, startingBid: number }) => {
            showToast(`New Auction Live: "${data.title}" starting at $${data.startingBid}`, 'info')
        }

        socket.on('outbid', onOutbid)
        socket.on('auctionEnded', onAuctionEnded)
        socket.on('newAuction', onNewAuction)

        return () => {
            socket.off('outbid', onOutbid)
            socket.off('auctionEnded', onAuctionEnded)
            socket.off('newAuction', onNewAuction)
        }
    }, [socket, user, showToast])

    return null // This component only manages side effects
}
