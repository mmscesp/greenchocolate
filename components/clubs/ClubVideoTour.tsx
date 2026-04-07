'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize, Volume2, VolumeX } from '@/lib/icons';
import { useLanguage } from '@/hooks/useLanguage';
import { ClubVideoMediaItem } from '@/lib/club-media';

interface ClubVideoTourProps {
  video: ClubVideoMediaItem;
  clubName: string;
}

export default function ClubVideoTour({ video, clubName }: ClubVideoTourProps) {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const togglePlay = async () => {
    if (!videoRef.current) {
      return;
    }

    if (videoRef.current.paused || videoRef.current.ended) {
      try {
        await videoRef.current.play();
      } catch {
        // Playback is blocked until a trusted user gesture in some browsers.
      }
      return;
    }

    videoRef.current.pause();
  };

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    void togglePlay();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      if (!Number.isFinite(duration) || duration <= 0) {
        setProgress(0);
        return;
      }
      const currentProgress = (currentTime / duration) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    }
  };

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) {
      return;
    }

    try {
      if (document.fullscreenElement === container) {
        await document.exitFullscreen();
        return;
      }

      if (container.requestFullscreen) {
        await container.requestFullscreen();
        return;
      }

      const iosVideo = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
      iosVideo?.webkitEnterFullscreen?.();
    } catch {
      // Ignore fullscreen failures (permissions, browser support, or platform restrictions).
    }
  };

  /* Premium Liquid Glass Reusable Class */
  const glassCardClass = "relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-bg-surface/70 supports-[backdrop-filter]:bg-bg-surface/55 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.1)] backdrop-blur-2xl [transform:translateZ(0)]";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-2">
        <div className="h-[1px] flex-grow bg-white/10" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand font-bold">
          {t('club_profile.virtual_tour')}
        </span>
        <div className="h-[1px] w-12 bg-white/10" />
      </div>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`${glassCardClass} group cursor-pointer aspect-[9/16] sm:aspect-[4/5] max-w-2xl mx-auto`}
        onClick={() => {
          void togglePlay();
        }}
      >
        <video
          ref={videoRef}
          poster={video.poster}
          className="h-full w-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          muted={isMuted}
          preload="metadata"
        >
          <source src={video.src} type="video/webm" />
          {video.mp4Fallback && <source src={video.mp4Fallback} type="video/mp4" />}
        </video>

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Play/Pause Large Center Icon */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-brand text-bg-base shadow-[0_0_30px_rgba(var(--brand-rgb),0.4)]">
                <Play className="h-8 w-8 fill-current ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 translate-y-0 opacity-100 transition-all duration-300 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100">
          {/* Progress Line */}
          <div className="relative h-1 w-full rounded-full bg-white/20 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-brand"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePlayButtonClick}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="text-white hover:text-brand transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                {t('club_profile.video_inside_prefix')} {clubName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="text-white hover:text-brand transition-colors"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <button
                type="button"
                onClick={(e) => void toggleFullscreen(e)}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="text-white hover:text-brand transition-colors"
              >
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-6 left-8 flex items-center gap-4">
           <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 drop-shadow-md">
             {t('club_profile.press_to_play')}
           </span>
           <button
             type="button"
             onClick={(e) => void toggleFullscreen(e)}
             aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
             className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-brand/60 hover:text-brand transition-colors drop-shadow-md"
           >
             <Maximize className="h-3 w-3" />
             {t('club_profile.fullscreen_recommended')}
           </button>
        </div>
      </motion.div>
    </div>
  );
}
