import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Sparkles, 
  Flame, 
  Clock, 
  TrendingUp, 
  Plus, 
  Award, 
  Activity, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Home,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Compass,
  ArrowRight,
  Heart,
  MessageSquare,
  Lock,
  Zap,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePatient } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import PostFeedCard from "@/components/community/PostFeedCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import { 
  INITIAL_POSTS, 
  MOCK_DOCTORS, 
  Post, 
  CommunityGroup 
} from "@/lib/communityMockData";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Mental Health", "Chronic Conditions", "Nutrition", "Recovery", "Lifestyle", "Fitness"];

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 110,
      damping: 15
    }
  }
};

type MobileTab = "feed" | "groups" | "doctors" | "karma";

const CommunityPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, joinedGroups, joinGroup, leaveGroup, groups, createGroup } = usePatient();
  const displayName = profile?.fullName?.split(" ")[0] || "Patient";

  // State Management
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [feedFilter, setFeedFilter] = useState<"all" | "joined">("all");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top" | "doctor">("hot");
  const [mobileTab, setMobileTab] = useState<MobileTab>("feed");
  
  // Gamification & Reputation
  const [karma, setKarma] = useState(140);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Voting Callback
  const handleVoteToggle = (postId: string, voteType: "up" | "down" | null) => {
    if (voteType === "up" && !hasUpvoted) {
      setHasUpvoted(true);
      setKarma(prev => prev + 10);
      toast({
        title: "Achievement: Peer Supporter",
        description: "Gained +10 Healing Karma points.",
        duration: 2500,
      });
    }
  };

  // Comment Submission Callback
  const handleCommentSubmit = (postId: string) => {
    if (!hasCommented) {
      setHasCommented(true);
      setKarma(prev => prev + 25);
      toast({
        title: "Achievement: Care Helper",
        description: "Gained +25 Healing Karma points.",
        duration: 2500,
      });
    } else {
      setKarma(prev => prev + 5);
    }

    setPosts(prevPosts => 
      prevPosts.map(p => 
        p.id === postId 
          ? { ...p, commentsCount: p.commentsCount + 1 }
          : p
      )
    );
  };

  // Add new post from modal
  const handleCreatePost = (postData: {
    title: string;
    content: string;
    groupId: string;
    groupName: string;
    tags: string[];
    anonymous: boolean;
  }) => {
    const newPost: Post = {
      id: `p_${Math.random().toString(36).substr(2, 9)}`,
      groupId: postData.groupId,
      groupName: postData.groupName,
      author: {
        name: postData.anonymous ? "Anonymous Patient" : (profile?.fullName || "Patient"),
        role: "patient",
        avatarColor: postData.anonymous ? "bg-gray-500/20 text-gray-300" : "bg-primary/20 text-primary"
      },
      timeAgo: "Just now",
      title: postData.title,
      content: postData.content,
      likes: 1,
      userVote: "up",
      commentsCount: 0,
      comments: [],
      category: groups.find(g => g.id === postData.groupId)?.category || "General",
      tags: postData.tags
    };

    setPosts(prev => [newPost, ...prev]);
    setKarma(prev => prev + 50);
    toast({
      title: "Post Published!",
      description: `Your post is live in m/${postData.groupName}. +50 Karma!`,
      duration: 3500,
    });
  };

  // Filtered and Sorted Posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.content.toLowerCase().includes(query) ||
        p.groupName.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (feedFilter === "joined") {
      result = result.filter(p => joinedGroups?.includes(p.groupId) || false);
    }

    if (sortBy === "hot") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "new") {
      result.sort((a, b) => {
        if (a.timeAgo === "Just now") return -1;
        if (b.timeAgo === "Just now") return 1;
        return b.id.localeCompare(a.id);
      });
    } else if (sortBy === "top") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "doctor") {
      result = result.filter(p => p.comments.some(c => c.author.role === "doctor"));
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, searchQuery, selectedCategory, feedFilter, sortBy, joinedGroups]);

  const myJoinedGroupsList = useMemo(() => {
    return groups.filter(g => joinedGroups?.includes(g.id) || false);
  }, [joinedGroups, groups]);

  const recommendedGroupsList = useMemo(() => {
    return groups.filter(g => !joinedGroups?.includes(g.id)).slice(0, 4);
  }, [joinedGroups, groups]);

  return (
    <PatientPageLayout className="w-full">
      <div className="w-full space-y-6 lg:space-y-8 pb-12">
        
        {/* --- PAGE HEADER WITH COMMUNITY STATS & CREATE POST CTA --- */}
        <PageHeader
          title="Peer Care & Support Network"
          subtitle="Connect with patients, join specialized health groups, and get answers from verified doctors."
        >
          <div className="flex items-center gap-3 mt-3 sm:mt-0 flex-wrap">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>AES Encrypted & Private</span>
            </div>
            
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm gap-2 shadow-lg shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </div>
        </PageHeader>

        {/* --- MOBILE SEGMENTED TAB SWITCHER (<1024px) --- */}
        <div className="lg:hidden flex items-center p-1 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 gap-1 overflow-x-auto">
          {[
            { id: "feed", label: "Feed", icon: Home },
            { id: "groups", label: "Groups", icon: Users },
            { id: "doctors", label: "Doctor Q&A", icon: Stethoscope },
            { id: "karma", label: "Karma & Badges", icon: Award },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id as MobileTab)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                mobileTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- MAIN 3-COLUMN LAYOUT --- */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT SIDEBAR (Desktop: Navigation & Categories) ================= */}
          <aside className={cn(
            "col-span-12 lg:col-span-3 flex-col gap-6 lg:sticky lg:top-[90px] max-h-[85vh] overflow-y-auto pr-1",
            mobileTab === "groups" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Feeds Group Navigation */}
            <GlassCard className="p-4 flex flex-col gap-1 bg-card/60 backdrop-blur-xl border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-primary" />
                <span>Feeds</span>
              </h3>
              
              <Button 
                variant={feedFilter === "all" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start rounded-xl gap-2.5 text-xs font-semibold h-10",
                  feedFilter === "all" ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-muted"
                )}
                onClick={() => setFeedFilter("all")}
              >
                <Home className="h-4 w-4 shrink-0" />
                <span>All Discussions</span>
              </Button>
              
              <Button 
                variant={feedFilter === "joined" ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start rounded-xl gap-2.5 text-xs font-semibold h-10",
                  feedFilter === "joined" ? "bg-primary/10 text-primary font-bold" : "text-foreground/80 hover:bg-muted"
                )}
                onClick={() => setFeedFilter("joined")}
              >
                <Heart className="h-4 w-4 shrink-0" />
                <span>Joined Groups</span>
                {joinedGroups.length > 0 && (
                  <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {joinedGroups.length}
                  </span>
                )}
              </Button>
            </GlassCard>

            {/* My Groups List */}
            <GlassCard className="p-4 flex flex-col gap-2 bg-card/60 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between px-2 mb-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>My Communities</span>
                </h3>
                <button 
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="h-6 w-6 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
                  title="Create a new community"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {myJoinedGroupsList.length === 0 ? (
                <div className="text-center py-4 px-3 text-xs text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-background/20">
                  <p className="mb-2">You haven't joined any groups yet.</p>
                  <Button variant="link" className="h-auto p-0 text-primary text-xs font-semibold" onClick={() => setSelectedCategory("All")}>
                    Explore Groups Below
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-1 max-h-[180px] overflow-y-auto pr-1">
                  {myJoinedGroupsList.map(g => (
                    <Link 
                      key={g.id} 
                      to={`/patient/community/${g.id}`}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground rounded-xl hover:bg-muted/60 transition-colors group"
                    >
                      <div className="h-6 w-6 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-xs font-bold">
                        {g.name.charAt(0)}
                      </div>
                      <span className="truncate flex-1">m/{g.name}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Health Categories */}
            <GlassCard className="p-4 flex flex-col gap-1 bg-card/60 backdrop-blur-xl border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>Health Categories</span>
              </h3>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start rounded-xl text-xs h-9 font-medium",
                      selectedCategory === cat 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-foreground/80 hover:bg-muted"
                    )}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span className="truncate">{cat}</span>
                  </Button>
                ))}
              </div>
            </GlassCard>

          </aside>

          {/* ================= CENTER COLUMN (Core Feed & Discussions) ================= */}
          <main className={cn(
            "col-span-12 lg:col-span-6 flex flex-col gap-6",
            mobileTab === "feed" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Community Hero Card */}
            <GlassCard className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-primary/15 via-purple-500/5 to-transparent border-primary/20">
              <div className="space-y-2 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Peer Health & Support</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Safe, Supportive & Doctor-Verified
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
                  Share experiences, ask medical questions anonymously, and earn Healing Karma for supporting peers.
                </p>
              </div>
            </GlassCard>

            {/* Search & Sort Controls */}
            <div className="space-y-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search posts, health topics, or conditions..." 
                  className="w-full pl-10 h-11 bg-card/60 border-border/50 rounded-2xl text-sm shadow-sm focus-visible:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Feed Filter Badges */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "hot", label: "Hot Discussions", icon: Flame },
                  { id: "new", label: "Latest", icon: Sparkles },
                  { id: "top", label: "Top Voted", icon: Award },
                  { id: "doctor", label: "Doctor Verified", icon: Stethoscope },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSortBy(filter.id as any)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap border shrink-0",
                      sortBy === filter.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card/40 border-border/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <filter.icon className="w-3.5 h-3.5" />
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {filteredAndSortedPosts.length === 0 ? (
                <GlassCard className="p-8 text-center space-y-3 bg-card/40 border-border/50">
                  <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
                  <h4 className="font-bold text-base text-foreground">No posts found</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Try adjusting your search query or reset category filters to view more discussions.
                  </p>
                  <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSortBy("hot"); }}>
                    Reset Filters
                  </Button>
                </GlassCard>
              ) : (
                filteredAndSortedPosts.map((post) => (
                  <PostFeedCard 
                    key={post.id} 
                    post={post} 
                    currentUserName={displayName}
                    onVoteToggle={handleVoteToggle}
                    onCommentSubmit={handleCommentSubmit}
                  />
                ))
              )}
            </div>

          </main>

          {/* ================= RIGHT SIDEBAR (Desktop: Karma & Doctors) ================= */}
          <aside className={cn(
            "col-span-12 lg:col-span-3 flex-col gap-6 lg:sticky lg:top-[90px] max-h-[85vh] overflow-y-auto pl-1",
            mobileTab === "doctors" || mobileTab === "karma" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Healing Karma Card */}
            <GlassCard className="p-5 flex flex-col gap-4 bg-gradient-to-br from-amber-500/10 via-card/60 to-card/80 border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Healing Karma</h4>
                    <span className="text-[11px] text-muted-foreground">Level 3 Peer Supporter</span>
                  </div>
                </div>
                <span className="text-lg font-extrabold text-amber-400">{karma} pts</span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                  <span>Progress to Level 4</span>
                  <span>{karma} / 250</span>
                </div>
                <Progress value={(karma / 250) * 100} className="h-2 bg-muted/60" />
              </div>

              <div className="pt-3 border-t border-border/40 space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Upvote Peer Advice</span>
                  </span>
                  <span className="font-bold text-foreground">+10 Karma</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publish Supportive Comment</span>
                  </span>
                  <span className="font-bold text-foreground">+25 Karma</span>
                </div>
              </div>
            </GlassCard>

            {/* Verified Doctors Directory Widget */}
            <GlassCard className="p-5 flex flex-col gap-4 bg-card/60 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-primary" />
                  <span>Doctors Online</span>
                </h3>
                <Badge variant="outline" className="text-[10px] font-bold text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
                  {MOCK_DOCTORS.filter(d => d.isOnline).length} Active
                </Badge>
              </div>

              <div className="space-y-3">
                {MOCK_DOCTORS.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-card/40 border border-border/40 hover:border-primary/30 transition-all">
                    <div className="relative">
                      <Avatar className="h-9 w-9 border border-primary/20">
                        <AvatarFallback className={doc.avatarColor}>
                          {doc.name.replace("Dr. ", "").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {doc.isOnline && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-foreground truncate">{doc.name}</h4>
                        <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                      </div>
                      <p className="text-[11px] text-muted-foreground truncate">{doc.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/patient/consultations">
                <Button variant="outline" className="w-full h-9 rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                  <span>Book Consultation</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </GlassCard>

            {/* Recommended Groups to Join */}
            <GlassCard className="p-5 flex flex-col gap-3 bg-card/60 backdrop-blur-xl border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>Recommended Groups</span>
              </h3>

              <div className="space-y-2.5">
                {recommendedGroupsList.map((g) => (
                  <div key={g.id} className="flex items-center justify-between gap-2 p-2 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate">m/{g.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{g.members.toLocaleString()} members</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        joinGroup(g.id);
                        toast({ title: "Joined Group", description: `You joined m/${g.name}!` });
                      }}
                      className="h-7 px-3 rounded-full text-[11px] font-bold border-primary/30 text-primary hover:bg-primary/10 shrink-0"
                    >
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </GlassCard>

          </aside>

        </div>

      </div>

      {/* MODALS */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        groups={groups}
      />

      <CreateCommunityModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={(groupData) => {
          createGroup(groupData);
          toast({ title: "Group Created!", description: `m/${groupData.name} is now live.` });
        }}
      />
    </PatientPageLayout>
  );
};

export default CommunityPage;
