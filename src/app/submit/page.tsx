/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Upload, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "@/lib/supabase";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CATEGORIES = [
  "Art",
  "Screenshot",
  "Thread",
  "Meme",
  "Video",
  "Other",
];

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form State
  const [discordName, setDiscordName] = useState("");
  const [discordUsername, setDiscordUsername] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [discordLevel, setDiscordLevel] = useState("");
  const [contributionTypes, setContributionTypes] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  
  // File state
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileChange(Array.from(e.target.files));
    }
  };

  const handleFileChange = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(f => {
      if (f.size > 50 * 1024 * 1024) {
        alert(`File ${f.name} is larger than 50MB`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
    
    const newUrls = validFiles.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }
    if (contributionTypes.length === 0) {
      alert("Please select at least one contribution type.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const uploadedUrls: string[] = [];

      // 1. Upload all images/videos to Supabase Storage
      for (const f of files) {
        const fileExt = f.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('proof-uploads')
          .upload(filePath, f);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('proof-uploads')
          .getPublicUrl(filePath);
          
        uploadedUrls.push(publicUrl);
      }

      // 3. Insert the record into the database with media_urls array
      const { error: insertError } = await supabase
        .from('contributions')
        .insert({
          discord_name: discordName,
          discord_username: discordUsername,
          x_handle: xHandle,
          discord_level: discordLevel ? parseInt(discordLevel, 10) : null,
          contribution_types: contributionTypes,
          description: description,
          media_urls: uploadedUrls,
          likes: 0
        });

      if (insertError) {
        throw insertError;
      }

      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error submitting proof:", JSON.stringify(error, null, 2), error);
      alert("Error submitting proof: " + (error?.message || error?.error_description || "Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-white">Submit Your </span>
            <span className="text-concrete-yellow">Proof</span>
          </h1>
          <p className="text-concrete-muted text-lg">
            Share what you&apos;ve built, created, or contributed to the Concrete ecosystem.
          </p>
        </div>

        <div className="glass-panel p-6 md:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center h-full"
              >
                <div className="w-20 h-20 bg-concrete-yellow/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-concrete-yellow" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Proof Submitted!</h2>
                <p className="text-concrete-muted text-lg max-w-md mx-auto mb-8">
                  Your contribution has been added. The community can now see your work.
                </p>
                <Link
                  href="/"
                  className="glass-button flex items-center gap-2"
                >
                  Return to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Discord Name</label>
                    <input
                      required
                      type="text"
                      className="glass-input"
                      placeholder="Your display name"
                      value={discordName}
                      onChange={(e) => setDiscordName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Discord Username</label>
                    <input
                      required
                      type="text"
                      className="glass-input"
                      placeholder="e.g. username#0000"
                      value={discordUsername}
                      onChange={(e) => setDiscordUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">X (Twitter) Handle</label>
                    <input
                      required
                      type="text"
                      className="glass-input"
                      placeholder="e.g. @yourhandle"
                      value={xHandle}
                      onChange={(e) => setXHandle(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-white/90">Concrete Discord Level</label>
                    <input
                      type="number"
                      min="0"
                      className="glass-input"
                      placeholder="e.g. 5"
                      value={discordLevel}
                      onChange={(e) => setDiscordLevel(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-white/90">Contribution Types</label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.map((cat) => {
                        const isSelected = contributionTypes.includes(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setContributionTypes(prev => prev.filter(t => t !== cat));
                              } else {
                                setContributionTypes(prev => [...prev, cat]);
                              }
                            }}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                              isSelected
                                ? "bg-concrete-yellow text-black border-concrete-yellow shadow-[0_0_15px_rgba(255,209,0,0.3)]"
                                : "bg-white/5 text-white/70 border-concrete-yellow/30 hover:bg-white/10 hover:border-concrete-yellow/50"
                            )}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="glass-input resize-none"
                    placeholder="Describe your contribution. What did you make, share, or do for the Concrete community?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-white/90">Upload Media</label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 relative",
                      isDragging 
                        ? "border-concrete-yellow bg-concrete-yellow/5" 
                        : "border-white/20 bg-white/[0.02] hover:bg-white/[0.05] hover:border-concrete-yellow/50"
                    )}
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,video/mp4"
                      multiple
                      className="hidden"
                      onChange={handleFileInput}
                      required={files.length === 0}
                    />
                    
                    {previewUrls.length > 0 ? (
                      <div className="w-full flex flex-col gap-4">
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {previewUrls.map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/40">
                              {files[i]?.type.startsWith("video/") ? (
                                <video 
                                  src={url} 
                                  className="w-full h-full object-cover" 
                                  autoPlay 
                                  loop 
                                  muted 
                                  playsInline 
                                />
                              ) : (
                                <img 
                                  src={url} 
                                  alt={`Preview ${i}`} 
                                  className="w-full h-full object-cover" 
                                />
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-concrete-yellow font-medium mt-2">
                          Click or drag more files to add
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-6 h-6 text-concrete-muted" />
                        </div>
                        <p className="text-white font-medium mb-1">
                          Drag & drop files here or click to browse
                        </p>
                        <p className="text-sm text-concrete-muted">
                          Supports JPG, PNG, GIF, MP4 — Max size: 50MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glass-button w-full mt-4 flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Submitting...</span>
                  ) : (
                    <>
                      Submit Proof
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
