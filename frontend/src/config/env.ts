// Environment configuration for BridgeLearn
export const config = {
  // API URLs
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  moodleUrl: import.meta.env.VITE_MOODLE_URL || 'http://localhost:8080',
  
  // WebRTC Configuration
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      // Add TURN servers here for production
      // { urls: 'turn:your-turn-server.com:3478', username: 'user', credential: 'pass' }
    ],
  },
  
  // Socket.IO
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
  
  // AWS Configuration
  aws: {
    region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
    cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
      clientId: import.meta.env.VITE_COGNITO_CLIENT_ID || '',
    },
    s3: {
      bucket: import.meta.env.VITE_S3_BUCKET || '',
      region: import.meta.env.VITE_S3_REGION || 'us-east-1',
    },
  },
  
  // Video Quality Settings
  videoQuality: {
    low: { width: 320, height: 240, frameRate: 15 },
    medium: { width: 640, height: 480, frameRate: 24 },
    high: { width: 1280, height: 720, frameRate: 30 },
    hd: { width: 1920, height: 1080, frameRate: 30 },
  },
} as const;

