"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { Contribution } from "@/lib/mock-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { supabase } from "@/lib/supabase";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format "2 hours ago"
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function isVideoUrl(url?: string) {
  if (!url) return false;
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    return pathname.endsWith('.mp4') || pathname.endsWith('.webm') || pathname.endsWith('.ogg') || pathname.endsWith('.mov') || pathname.endsWith('.mkv') || pathname.endsWith('.m4v');
  } catch {
    const lowerUrl = url.toLowerCase();
    return lowerUrl.includes('.mp4') || lowerUrl.includes('.webm') || lowerUrl.includes('.ogg') || lowerUrl.includes('.mov') || lowerUrl.includes('.mkv') || lowerUrl.includes('.m4v');
  }
}

export function ContributionCard({
  contribution,
  index,
  onClick,
}: {
  contribution: Contribution;
  index: number;
  onClick?: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(contribution.likes || 0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load liked state from localStorage on mount
  useEffect(() => {
    const likedContributions = JSON.parse(
      localStorage.getItem("concrete_liked") || "[]"
    );
    if (likedContributions.includes(contribution.id)) {
      setTimeout(() => setIsLiked(true), 0);
    }
  }, [contribution.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening when clicking like
    const likedContributions = JSON.parse(
      localStorage.getItem("concrete_liked") || "[]"
    );

    if (isLiked) {
      // Unlike
      setIsLiked(false);
      setLikes((prev) => prev - 1);
      const newLiked = likedContributions.filter((id: string) => id !== contribution.id);
      localStorage.setItem("concrete_liked", JSON.stringify(newLiked));
      
      // Update Supabase
      await supabase
        .from("contributions")
        .update({ likes: likes - 1 })
        .eq("id", contribution.id);
    } else {
      // Like
      setIsLiked(true);
      setLikes((prev) => prev + 1);
      likedContributions.push(contribution.id);
      localStorage.setItem("concrete_liked", JSON.stringify(likedContributions));
      
      // Update Supabase
      await supabase
        .from("contributions")
        .update({ likes: likes + 1 })
        .eq("id", contribution.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onClick={onClick}
      className="glass-panel glass-panel-hover overflow-hidden flex flex-col h-full group cursor-pointer"
    >
      {/* Image/Video Section */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/40">
        {isVideoUrl(contribution.media_urls?.[0]) ? (
          <video
            src={contribution.media_urls[0]}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            controls={false}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={contribution.media_urls?.[0] || "/placeholder.jpg"}
            alt={contribution.description}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Multiple Media Indicator */}
        {contribution.media_urls?.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-xs font-semibold text-white flex items-center gap-1 z-10">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            +{contribution.media_urls.length - 1}
          </div>
        )}
        {/* Category Tag */}
        <div className="absolute top-3 left-3 flex gap-2 z-10 flex-wrap max-w-[80%]">
          {contribution.contribution_types?.slice(0, 2).map(tag => (
            <div key={tag} className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-xs font-semibold text-concrete-yellow uppercase tracking-wide">
              {tag}
            </div>
          ))}
          {contribution.contribution_types?.length > 2 && (
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 text-xs font-semibold text-concrete-yellow uppercase tracking-wide">
              +{contribution.contribution_types.length - 2}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider shrink-0">Discord:</span>
            <span className="text-white font-bold text-sm truncate">{contribution.discord_name}</span>
          </div>
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider shrink-0">X (Twitter):</span>
            <span className="text-concrete-yellow text-xs font-medium truncate">{contribution.x_handle}</span>
          </div>
          {contribution.discord_level != null && (
            <div className="flex items-center gap-2 overflow-hidden mt-0.5">
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider shrink-0">Server Level:</span>
              <span className="text-white/80 text-xs font-bold bg-white/10 px-1.5 py-0.5 rounded">{contribution.discord_level}</span>
            </div>
          )}
        </div>

        <p
          className={cn(
            "text-concrete-muted text-sm leading-relaxed cursor-pointer transition-all",
            !isExpanded && "line-clamp-3"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {contribution.description}
        </p>
      </div>

      {/* Footer Section */}
      <div className="px-5 py-4 border-t border-white/5 flex items-center justify-between mt-auto">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300",
            isLiked
              ? "bg-concrete-yellow/20 text-concrete-yellow border border-concrete-yellow/30 shadow-[0_0_15px_rgba(255,209,0,0.2)]"
              : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          <motion.div
            animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={cn("w-4 h-4", isLiked && "fill-concrete-yellow")}
            />
          </motion.div>
          <span className="font-medium text-sm">{likes}</span>
        </button>

        <span className="text-xs text-white/40 font-medium">
          {formatTimeAgo(contribution.created_at)}
        </span>
      </div>
    </motion.div>
  );
}
