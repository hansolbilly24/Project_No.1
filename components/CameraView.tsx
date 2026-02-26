
import React, { useRef, useEffect, useState } from 'react';
import { Camera, X, RefreshCcw } from 'lucide-react';

interface CameraViewProps {
  onCapture: (base64: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        onCapture(base64);
      }
    }
  };

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-black">
        <p className="text-white mb-6">{error}</p>
        <button onClick={onCancel} className="bg-white px-6 py-2 rounded-lg font-bold">돌아가기</button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black relative flex flex-col overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      
      {/* Overlay Guides */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-64 h-64 border-2 border-white/50 rounded-2xl flex items-center justify-center">
            <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute top-[-2px] left-[-2px]"></div>
            <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute top-[-2px] right-[-2px]"></div>
            <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-[-2px] left-[-2px]"></div>
            <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-[-2px] right-[-2px]"></div>
        </div>
        <p className="text-white/70 text-sm mt-4">메뉴판이나 음식을 사각형 안에 맞춰주세요</p>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="absolute bottom-10 left-0 right-0 flex items-center justify-around px-12">
        <button 
          onClick={onCancel}
          className="w-12 h-12 flex items-center justify-center bg-white/20 rounded-full text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <button 
          onClick={capture}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white/30"
        >
          <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-full"></div>
        </button>

        <div className="w-12 h-12 flex items-center justify-center bg-transparent">
          {/* Placeholder for alignment */}
        </div>
      </div>
    </div>
  );
};

export default CameraView;
