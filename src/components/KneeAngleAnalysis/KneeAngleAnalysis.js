import React, { useState, useRef, useEffect } from 'react';
import VideoUpload from './VideoUpload';
import { Pose } from '@mediapipe/pose';
import * as poseModule from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const KneeAngleAnalysis = () => {
  const [mode, setMode] = useState('upload'); // 'upload' or 'camera'
  const [video, setVideo] = useState(null);
  const canvasRef = useRef(null);
  const [kneeAngle, setKneeAngle] = useState(0);
  const [camera, setCamera] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    if (mode === 'camera') {
      if (camera) camera.stop();
      const videoElement = videoRef.current;
      const newCamera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({image: videoElement});
        },
        width: 640,
        height: 480
      });
      newCamera.start();
      setCamera(newCamera);
    } else if (mode === 'upload' && video) {
      const runPose = async () => {
        await pose.send({image: video});
        if (video.paused) return;
        requestAnimationFrame(runPose);
      };
      video.play();
      runPose();
    }

    return () => {
      if (camera) camera.stop();
    };
  }, [mode, video]);

  const onResults = (results) => {
    if (canvasRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, poseModule.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1 });
        
        const hip = results.poseLandmarks[23]; // Right hip
        const knee = results.poseLandmarks[25]; // Right knee
        const ankle = results.poseLandmarks[27]; // Right ankle
        
        const angle = calculateAngle(hip, knee, ankle);
        setKneeAngle(angle);
      }
      canvasCtx.restore();
    }
  };

  const calculateAngle = (hip, knee, ankle) => {
    const radians = Math.atan2(ankle.y - knee.y, ankle.x - knee.x) - 
                    Math.atan2(hip.y - knee.y, hip.x - knee.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return Math.round(angle);
  };

  const handleVideoLoaded = (videoElement) => {
    setVideo(videoElement);
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'upload' ? 'camera' : 'upload');
    setVideo(null);
  };

  return (
    <div className="knee-angle-analysis">
      <h2>Knee Angle Analysis</h2>
      <button onClick={toggleMode}>
        Switch to {mode === 'upload' ? 'Camera' : 'Video Upload'}
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ width: '30%' }}>
          {mode === 'upload' ? (
            <VideoUpload onVideoLoaded={handleVideoLoaded} />
          ) : (
            <video
              ref={videoRef}
              style={{ display: 'none' }}
            />
          )}
          {mode === 'upload' && video && (
            <video 
              src={video.src} 
              controls 
              style={{ width: '100%', marginTop: '10px' }}
            />
          )}
        </div>
        <div style={{ width: '65%' }}>
          <canvas 
            ref={canvasRef}
            width={640}
            height={480}
            style={{ width: '100%', height: 'auto' }}
          />
          <p>Current Knee Angle: {kneeAngle}°</p>
        </div>
      </div>
    </div>
  );
};

export default KneeAngleAnalysis;