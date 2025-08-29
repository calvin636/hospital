// Telehealth video room component using Agora
import { useState, useEffect } from 'react'

interface VideoRoomProps {
  channelName: string
  token: string
  uid: string
  onLeave: () => void
}

export function VideoRoom({ channelName, token, uid, onLeave }: VideoRoomProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  useEffect(() => {
    // Initialize Agora client here
    // This is a placeholder - you'll need to implement the full Agora SDK integration
    console.log('Video room initialized:', { channelName, token, uid })
    
    // Simulate connection
    const timer = setTimeout(() => {
      setIsConnected(true)
    }, 1000)

    return () => {
      clearTimeout(timer)
      // Cleanup Agora client
    }
  }, [channelName, token, uid])

  const toggleMute = () => {
    setIsMuted(!isMuted)
    // Implement Agora mute/unmute
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    // Implement Agora video on/off
  }

  const handleLeave = () => {
    // Cleanup and leave channel
    onLeave()
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      {/* Video container */}
      <div className="relative h-96 bg-gray-900">
        {!isConnected ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p>Connecting to video call...</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-4xl font-bold mb-4">
                {uid?.slice(-2)}
              </div>
              <p>Video call active</p>
              <p className="text-sm text-gray-300">Channel: {channelName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 p-4 bg-gray-800">
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full ${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
          } text-white transition-colors`}
        >
          {isMuted ? '🔇' : '🎤'}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full ${
            isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
          } text-white transition-colors`}
        >
          {isVideoOff ? '📷' : '📹'}
        </button>
        
        <button
          onClick={handleLeave}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          📞
        </button>
      </div>
    </div>
  )
}
