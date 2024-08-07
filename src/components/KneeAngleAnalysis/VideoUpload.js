import React, { useState, useRef, useEffect } from 'react';

const VideoUpload = ({ onVideoLoaded }) => {
  const videoRef = useRef(null);



  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video")
      video.src = videoUrl
      video.onloadeddata = () => {
        onVideoLoaded(video)
      }
    } else {
      alert('Please upload a valid video file.');
    }
  };

  return (
    <div className="video-upload">
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileUpload} 
      />
    </div>
  );
};

export default VideoUpload;