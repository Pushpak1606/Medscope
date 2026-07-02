import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Share2, 
  Flag, 
  MoreHorizontal, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Send,
  CornerDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Post, Comment } from "@/lib/communityMockData";
import { useToast } from "@/components/ui/use-toast";

interface PostFeedCardProps {
  post: Post;
  currentUserName?: string;
  onVoteToggle?: (postId: string, voteType: "up" | "down" | null) => void;
  onCommentSubmit?: (postId: string) => void;
}

const PostFeedCard = ({ post, currentUserName = "Patient", onVoteToggle, onCommentSubmit }: PostFeedCardProps) => {
  const { toast } = useToast();
  const [vote, setVote] = useState<"up" | "down" | null>(post.userVote);
  const [score, setScore] = useState(post.likes);
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newCommentText, setNewCommentText] = useState("");
  const [shared, setShared] = useState(false);

  const handleVote = (type: "up" | "down") => {
    let newVote: "up" | "down" | null = type;
    let delta = 0;

    if (vote === type) {
      // Undo current vote
      newVote = null;
      delta = type === "up" ? -1 : 1;
    } else {
      // Apply new vote or change existing vote
      if (vote === null) {
        delta = type === "up" ? 1 : -1;
      } else {
        // Changing vote from up to down, or down to up
        delta = type === "up" ? 2 : -2;
      }
    }

    setVote(newVote);
    setScore(prev => prev + delta);
    
    if (onVoteToggle) {
      onVoteToggle(post.id, newVote);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/patient/community/${post.groupId}`);
    setShared(true);
    toast({
      title: "Link Copied!",
      description: "Community link copied to clipboard.",
      duration: 2500,
    });
    setTimeout(() => setShared(false), 2000);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment: Comment = {
      id: `c_${Math.random().toString(36).substr(2, 9)}`,
      author: {
        name: currentUserName,
        role: "patient",
        avatarColor: "bg-primary/20 text-primary"
      },
      timeAgo: "Just now",
      content: newCommentText.trim(),
      likes: 0
    };

    setComments(prev => [...prev, newComment]);
    setNewCommentText("");
    
    if (onCommentSubmit) {
      onCommentSubmit(post.id);
    }

    toast({
      title: "Comment Published",
      description: "Your thought was added to this discussion.",
      duration: 2000,
    });
  };

  // Check if any comments are from doctors
  const hasDoctorResponse = comments.some(c => c.author.role === "doctor");

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`bg-card/30 backdrop-blur-md border rounded-3xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md ${
        hasDoctorResponse 
          ? "border-emerald-500/30 shadow-emerald-500/[0.03] dark:border-emerald-500/40 bg-gradient-to-br from-emerald-500/[0.02] via-card/30 to-transparent" 
          : "border-border/30 hover:border-primary/20"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        
        {/* VOTE SIDEBAR (Desktop) */}
        <div className="hidden md:flex flex-col items-center justify-start bg-background/10 px-3 py-4 border-r border-border/20 shrink-0 w-[50px]">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-9 w-9 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-orange-500/15 ${
              vote === "up" ? "text-orange-500 bg-orange-500/10 hover:bg-orange-500/20" : "text-muted-foreground hover:text-orange-500"
            }`}
            onClick={() => handleVote("up")}
          >
            <ArrowBigUp className={`h-6 w-6 ${vote === "up" ? "fill-orange-500" : ""}`} />
          </Button>
          
          <span className={`text-xs font-bold my-1 select-none ${
            vote === "up" ? "text-orange-500" : vote === "down" ? "text-blue-400" : "text-foreground/85"
          }`}>
            {score}
          </span>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-9 w-9 rounded-xl transition-all duration-200 hover:scale-105 hover:bg-blue-500/15 ${
              vote === "down" ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" : "text-muted-foreground hover:text-blue-400"
            }`}
            onClick={() => handleVote("down")}
          >
            <ArrowBigDown className={`h-6 w-6 ${vote === "down" ? "fill-blue-400" : ""}`} />
          </Button>
        </div>

        {/* POST BODY (Center Container) */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
          
          {/* Header Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-bold text-[10px] tracking-wider rounded-lg px-2.5 py-0.5">
                m/{post.groupName}
              </Badge>
              <span className="text-muted-foreground/45">•</span>
              <span className="text-muted-foreground font-medium">Posted by</span>
              <div className="flex items-center gap-1">
                <span className={`font-semibold ${
                  post.author.role === "doctor" 
                    ? "text-emerald-500 dark:text-emerald-400" 
                    : post.author.role === "moderator" 
                      ? "text-amber-500" 
                      : "text-foreground/80"
                }`}>
                  {post.author.role === "doctor" ? post.author.name : `u/${post.author.name}`}
                </span>
                {post.author.role === "doctor" && (
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500/10" />
                )}
                {post.author.role === "moderator" && (
                  <ShieldCheck className="h-3.5 w-3.5 text-amber-500 fill-amber-500/10" />
                )}
              </div>
              {post.author.specialty && (
                <span className="text-[10px] bg-muted/65 text-muted-foreground/90 px-1.5 py-0.5 rounded-sm border border-border/30">
                  {post.author.specialty}
                </span>
              )}
              <span className="text-muted-foreground/45">•</span>
              <span>{post.timeAgo}</span>

              {post.isPinned && (
                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-500 border border-amber-500/20 hover:bg-amber-500/15 font-bold text-[9px] rounded-md px-1.5 py-0">
                  PINNED
                </Badge>
              )}
            </div>

            {/* Actions Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 rounded-xl bg-card border-border/50 backdrop-blur-xl">
                <DropdownMenuItem className="text-muted-foreground hover:text-foreground rounded-lg cursor-pointer gap-2" onClick={handleShare}>
                  <Share2 className="h-4 w-4" /> Share Post
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer gap-2">
                  <Flag className="h-4 w-4" /> Report Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title & Post Content */}
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight leading-tight select-text hover:text-primary/95 transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line select-text font-light">
              {post.content}
            </p>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.tags.map(tag => (
                <span key={tag} className="text-[11px] bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors px-2.5 py-0.5 rounded-full text-primary font-medium cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Doctor Badge Highlight */}
          {hasDoctorResponse && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 px-3.5 py-2 border border-emerald-500/25 rounded-2xl w-fit">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-emerald-500" />
              <span>Contains Doctor Consultation Details</span>
            </div>
          )}

          {/* Footer Interactive Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/20 pt-4">
            
            {/* MOBILE ONLY VOTE */}
            <div className="flex md:hidden items-center bg-background/40 px-2.5 py-1 rounded-2xl border border-border/50">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-lg ${vote === "up" ? "text-orange-500" : "text-muted-foreground"}`}
                onClick={() => handleVote("up")}
              >
                <ArrowBigUp className={`h-5 w-5 ${vote === "up" ? "fill-orange-500" : ""}`} />
              </Button>
              <span className={`text-xs font-bold px-1.5 select-none ${
                vote === "up" ? "text-orange-500" : vote === "down" ? "text-blue-400" : "text-foreground/85"
              }`}>
                {score}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 rounded-lg ${vote === "down" ? "text-blue-400" : "text-muted-foreground"}`}
                onClick={() => handleVote("down")}
              >
                <ArrowBigDown className={`h-5 w-5 ${vote === "down" ? "fill-blue-400" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-xl px-4 h-9 gap-2 transition-colors ${
                  commentsExpanded 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={() => setCommentsExpanded(!commentsExpanded)}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="text-xs font-bold">{comments.length} Comments</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className={`rounded-xl px-4 h-9 gap-2 transition-all ${
                  shared 
                    ? "text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs font-bold">{shared ? "Copied" : "Share"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* COMMENTS EXPANDED PANEL */}
      <AnimatePresence>
        {commentsExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border/20 bg-background/10"
          >
            <div className="p-5 sm:p-6 flex flex-col gap-6">
              
              {/* Comment Input Box */}
              <div className="flex items-start gap-3 bg-background/20 border border-border/30 rounded-2xl p-4">
                <Avatar className="h-8 w-8 mt-1 border border-border/60 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {currentUserName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 flex flex-col gap-2 relative">
                  <Textarea
                    placeholder="Write a supportive comment, reply, or suggestion..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="min-h-[75px] bg-background/50 border-border/40 focus-visible:ring-primary/20 rounded-2xl text-sm pr-12 focus:border-border/65 py-2.5"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment();
                      }
                    }}
                  />
                  <Button 
                    size="icon" 
                    disabled={!newCommentText.trim()}
                    onClick={handleAddComment}
                    className="absolute right-2 bottom-2 h-8 w-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comment Thread List */}
              <div className="flex flex-col gap-4 mt-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1 border-l-2 border-primary/60">
                  Discussion Thread
                </h4>
                
                {comments.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground/60 border border-dashed border-border/30 rounded-2xl bg-card/10">
                    No comments yet. Start the supportive conversation!
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="group/item relative flex items-start gap-3 pl-1">
                        
                        {/* Nested visual link */}
                        <div className="absolute left-[15px] top-[34px] bottom-[-15px] w-0.5 bg-border/20 group-last/item:hidden" />
                        
                        <Avatar className="h-8 w-8 border border-border/50 shrink-0">
                          <AvatarFallback className={`text-xs font-semibold ${comment.author.avatarColor || "bg-primary/10 text-primary"}`}>
                            {comment.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Comment Content Card */}
                        <div className={`flex-1 p-3.5 rounded-2xl border transition-all ${
                          comment.author.role === "doctor"
                            ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-emerald-500/[0.01] hover:border-emerald-500/30"
                            : comment.author.role === "moderator"
                              ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/30"
                              : "bg-background/45 border-border/30 hover:border-border/50"
                        }`}>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <span className={`font-bold ${
                                comment.author.role === "doctor"
                                  ? "text-emerald-500 dark:text-emerald-400"
                                  : comment.author.role === "moderator"
                                    ? "text-amber-500"
                                    : "text-foreground/90"
                              }`}>
                                {comment.author.name}
                              </span>
                              
                              {comment.author.role === "doctor" && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-bold text-[9px] scale-95 py-0 px-1 hover:bg-emerald-500/15">
                                  DOCTOR
                                </Badge>
                              )}
                              {comment.author.role === "moderator" && (
                                <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10 font-bold text-[9px] scale-95 py-0 px-1 hover:bg-amber-500/15">
                                  MOD
                                </Badge>
                              )}
                              
                              {comment.author.specialty && (
                                <span className="text-[10px] text-muted-foreground/80 font-medium">
                                  ({comment.author.specialty})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground/60">{comment.timeAgo}</span>
                          </div>
                          
                          <p className="text-xs text-foreground/80 leading-relaxed font-light select-text">
                            {comment.content}
                          </p>

                          <div className="flex items-center gap-3 mt-2.5 pt-1.5 border-t border-border/10">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 rounded-full text-muted-foreground/70 hover:text-rose-500 hover:bg-rose-500/10"
                            >
                              <Heart className="h-3 w-3" />
                            </Button>
                            <span className="text-[10px] font-bold text-muted-foreground/70">{comment.likes}</span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostFeedCard;
