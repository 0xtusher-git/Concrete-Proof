"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ContributionCard } from "@/components/ContributionCard";
import { ContributionModal } from "@/components/ContributionModal";
import { supabase } from "@/lib/supabase";
import type { Contribution } from "@/lib/mock-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "All",
  "Art",
  "Screenshot",
  "Thread",
  "Meme",
  "Video",
  "Other",
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  // Fetch contributions on load
  const fetchContributions = async () => {
    try {
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contributions:", error);
      } else if (data) {
        setContributions(data as Contribution[]);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();

    // Optional: Real-time subscription could go here
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "contributions" },
        () => {
          fetchContributions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredContributions = useMemo(() => {
    return contributions.filter((c) => {
      const matchesSearch =
        c.discord_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.x_handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        activeCategory === "All" || (c.contribution_types && c.contribution_types.includes(activeCategory));

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, contributions]);

  const totalLikes = useMemo(
    () => contributions.reduce((sum, c) => sum + (c.likes || 0), 0),
    [contributions]
  );

  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center min-h-[80vh]">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 leading-tight">
            <span className="text-white block">Show your work.</span>
            <span className="text-concrete-yellow block">Earn your place.</span>
          </h1>
          <p className="text-concrete-muted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Explore real contributions from the Concrete community. Submit yours and get discovered.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-concrete-muted group-focus-within:text-concrete-yellow transition-colors" />
            </div>
            <input
              type="text"
              className="glass-input w-full pl-12 pr-4 py-4 text-lg rounded-2xl shadow-lg"
              placeholder="Search by name, handle, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="w-full flex flex-col items-center mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "glass-pill",
                  activeCategory === category && "glass-pill-active"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-4 text-sm text-concrete-muted bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
            <span><strong className="text-white">{contributions.length}</strong> Submissions</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span><strong className="text-concrete-yellow">{totalLikes}</strong> Likes</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Updated live
            </span>
          </div>
        </div>

        {/* Contribution Grid */}
        {isLoading ? (
          <div className="w-full flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-concrete-yellow/30 border-t-concrete-yellow rounded-full animate-spin"></div>
          </div>
        ) : filteredContributions.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {filteredContributions.map((contribution, index) => (
              <ContributionCard
                key={contribution.id}
                contribution={contribution}
                index={index}
                onClick={() => setSelectedContribution(contribution)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-concrete-yellow/10 flex items-center justify-center border border-concrete-yellow/20">
              <Search className="w-10 h-10 text-concrete-yellow/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No contributions found</h3>
            <p className="text-concrete-muted max-w-md">
              We couldn&apos;t find any contributions matching your search or filter. Be the first to submit something new!
            </p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <ContributionModal 
        contribution={selectedContribution} 
        onClose={() => setSelectedContribution(null)} 
      />
    </>
  );
}
