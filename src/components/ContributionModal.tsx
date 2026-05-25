"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Contribution } from "@/lib/mock-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format "Oct 24, 2023 at 2:30 PM"
function formatFullDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContributionModal({
  contribution,
  onClose,
}: {
  contribution: Contribution | null;
  onClose: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Sync likes state and check local storage
  useEffect(() => {
    if (contribution) {
      setLikes(contribution.likes || 0);
      setCurrentMediaIndex(0); // Reset gallery index

      const likedContributions = JSON.parse(
        localStorage.getItem("concrete_liked") || "[]"
      );
      if (likedContributions.includes(contribution.id)) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [contribution]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (contribution) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [contribution]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contribution) return;

    const likedContributions = JSON.parse(
      localStorage.getItem("concrete_liked") || "[]"
    );

    if (isLiked) {
      setIsLiked(false);
      setLikes((prev) => prev - 1);
      const newLiked = likedContributions.filter((id: string) => id !== contribution.id);
      localStorage.setItem("concrete_liked", JSON.stringify(newLiked));
      
      await supabase
        .from("contributions")
        .update({ likes: likes - 1 })
        .eq("id", contribution.id);
    } else {
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      likedContributions.push(contribution.id);
      localStorage.setItem("concrete_liked", JSON.stringify(likedContributions));
      
      await supabase
        .from("contributions")
        .update({ likes: likes + 1 })
        .eq("id", contribution.id);
    }
  };

  if (!contribution) return null;

  const hasMultipleMedia = contribution.media_urls && contribution.media_urls.length > 1;

  const handleNextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleMedia) {
      setCurrentMediaIndex((prev) => (prev + 1) % contribution.media_urls.length);
    }
  };

  const handlePrevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasMultipleMedia) {
      setCurrentMediaIndex((prev) => (prev - 1 + contribution.media_urls.length) % contribution.media_urls.length);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
          className="bg-[#111111] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side: Media Gallery */}
          <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center group h-64 md:h-auto min-h-[300px]">
            {contribution.media_urls?.[currentMediaIndex]?.toLowerCase().endsWith('.mp4') ? (
              <video
                src={contribution.media_urls[currentMediaIndex]}
                className="w-full h-full object-contain max-h-[90vh]"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : (
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={contribution.media_urls?.[currentMediaIndex] || "/placeholder.jpg"}
                  alt={`Media ${currentMediaIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            )}

            {/* Gallery Controls */}
            {hasMultipleMedia && (
              <>
                <button
                  onClick={handlePrevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all border border-white/10 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all border border-white/10 md:opacity-0 md:group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  {contribution.media_urls.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        idx === currentMediaIndex ? "bg-concrete-yellow w-4" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Side: Details */}
          <div className="w-full md:w-2/5 p-6 md:p-8 flex flex-col h-full max-h-[50vh] md:max-h-[90vh] overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#141414] to-[#0a0a0a]">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {contribution.discord_name}
                </h3>
                <div className="flex flex-col gap-1">
                  <span className="text-white/50 text-sm">
                    {contribution.discord_username}
                  </span>
                  <a 
                    href={`https://x.com/${contribution.x_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-concrete-yellow hover:text-concrete-yellow/80 transition-colors text-sm font-medium flex items-center gap-1 w-fit"
                  >
                    {contribution.x_handle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {contribution.contribution_types?.map((tag) => (
                <span 
                  key={tag}
                  className="bg-concrete-yellow/10 border border-concrete-yellow/30 text-concrete-yellow px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8 flex-grow">
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Description</h4>
              <p className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {contribution.description}
              </p>
            </div>

            {/* Footer / Actions */}
            <div className="pt-6 border-t border-white/10 mt-auto flex items-center justify-between">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                  isLiked
                    ? "bg-concrete-yellow text-black shadow-[0_0_20px_rgba(255,209,0,0.4)]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                )}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart
                    className={cn("w-5 h-5", isLiked && "fill-black stroke-black")}
                  />
                </motion.div>
                <span className="font-semibold">{likes}</span>
              </button>

              <div className="text-right">
                <span className="text-xs text-white/40 font-medium block">
                  Submitted
                </span>
                <span className="text-xs text-white/60">
                  {formatFullDate(contribution.created_at)}
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
