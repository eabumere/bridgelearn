import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  toggleCamera,
  toggleMic,
  toggleScreenShare,
  setVideoQuality,
  setLocalStream,
  addParticipant,
} from '../../store/classroomSlice';
import { config } from '../../config/env';
import type { VideoQuality } from '../../store/classroomSlice';
import { Video, VideoOff, Mic, MicOff, Monitor, MonitorOff, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function VideoContainer() {
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const {
    localStream,
    isCameraEnabled,
    isMicEnabled,
    isScreenSharing,
    videoQuality,
    currentSession,
  } = useAppSelector((state) => state.classroom);

  // Initialize media stream
  useEffect(() => {
    const initMedia = async () => {
      if (!localStream && !isInitializing) {
        setIsInitializing(true);
        try {
          const constraints = config.videoQuality[videoQuality];
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: constraints.width },
              height: { ideal: constraints.height },
              frameRate: { ideal: constraints.frameRate },
            },
            audio: true,
          });
          
          dispatch(setLocalStream(stream));
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing media devices:', error);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [dispatch, localStream, isInitializing, videoQuality]);

  // Update video element when stream changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleToggleCamera = () => {
    dispatch(toggleCamera());
  };

  const handleToggleMic = () => {
    dispatch(toggleMic());
  };

  const handleToggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        
        if (localStream && videoRef.current) {
          const videoTrack = screenStream.getVideoTracks()[0];
          const oldVideoTrack = localStream.getVideoTracks()[0];
          if (oldVideoTrack) {
            localStream.removeTrack(oldVideoTrack);
            oldVideoTrack.stop();
          }
          localStream.addTrack(videoTrack);
          videoRef.current.srcObject = localStream;
        }
        
        screenStream.getVideoTracks()[0].onended = () => {
          dispatch(toggleScreenShare());
        };
        
        dispatch(toggleScreenShare());
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      dispatch(toggleScreenShare());
    }
  };

  const handleQualityChange = (quality: VideoQuality) => {
    dispatch(setVideoQuality(quality));
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* Local Video */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "w-full h-full object-cover",
            !isCameraEnabled && "hidden"
          )}
        />
        
        {!isCameraEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-center">
              <VideoOff className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">Camera is off</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleCamera}
            className={cn(
              "p-3 rounded-full transition-colors",
              isCameraEnabled
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleMic}
            className={cn(
              "p-3 rounded-full transition-colors",
              isMicEnabled
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-red-600 text-white hover:bg-red-700"
            )}
          >
            {isMicEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleScreenShare}
            className={cn(
              "p-3 rounded-full transition-colors",
              isScreenSharing
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
          >
            {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
          </motion.button>

          <div className="relative group">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            {/* Quality Dropdown */}
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 min-w-[120px]">
              {(['low', 'medium', 'high', 'hd'] as VideoQuality[]).map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleQualityChange(quality)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-sm capitalize",
                    videoQuality === quality && "bg-blue-100 dark:bg-blue-900"
                  )}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Participant Grid (for other participants) */}
        {currentSession && currentSession.participants.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {currentSession.participants.map((participant) => (
              <div
                key={participant.id}
                className="w-32 h-24 bg-gray-800 rounded-lg overflow-hidden"
              >
                {/* Remote participant video would go here */}
                <div className="w-full h-full flex items-center justify-center text-white text-xs">
                  {participant.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

