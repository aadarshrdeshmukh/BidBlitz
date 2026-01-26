import { useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'
import { getSocket, connectSocket, disconnectSocket } from '@/lib/socket'

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = connectSocket()
    setSocket(socketInstance)

    const onConnect = () => {
      console.log('Socket connected')
      setIsConnected(true)
    }

    const onDisconnect = () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    }

    const onError = (error: any) => {
      console.error('Socket error:', error)
    }

    socketInstance.on('connect', onConnect)
    socketInstance.on('disconnect', onDisconnect)
    socketInstance.on('error', onError)

    return () => {
      socketInstance.off('connect', onConnect)
      socketInstance.off('disconnect', onDisconnect)
      socketInstance.off('error', onError)
      disconnectSocket()
    }
  }, [])

  return { socket, isConnected }
}
