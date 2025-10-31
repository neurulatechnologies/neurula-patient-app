import React, { createContext, useContext, useState } from 'react';

const VideoCallContext = createContext();

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context) {
    throw new Error('useVideoCall must be used within VideoCallProvider');
  }
  return context;
};

export const VideoCallProvider = ({ children }) => {
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [videoCallData, setVideoCallData] = useState(null);

  const startVideoCall = (data) => {
    setIsVideoCallActive(true);
    setVideoCallData(data);
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
    setVideoCallData(null);
  };

  const minimizeVideoCall = () => {
    // Video call continues but in minimized/popup mode
    setIsVideoCallActive(true);
  };

  const value = {
    isVideoCallActive,
    videoCallData,
    startVideoCall,
    endVideoCall,
    minimizeVideoCall,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};
