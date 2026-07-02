import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronLeft, 
  Filter, 
  Sparkles, 
  Flame, 
  Clock, 
  TrendingUp, 
  Plus, 
  Award, 
  Activity, 
  BookOpen, 
  ShieldAlert, 
  Users, 
  Home,
  CheckCircle,
  HelpCircle,
  Stethoscope,
  Compass,
  ArrowRight,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePatient } from "@/context/PatientContext";
import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import PostFeedCard from "@/components/community/PostFeedCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { GlobalCommand } from "@/components/ui/global-command";
import BorderGlow from "@/components/ui/BorderGlow";
import { ShinyButton } from "@/components/ui/shiny-button";
import { 
  INITIAL_POSTS, 
  MOCK_DOCTORS, 
  Post, 
  CommunityGroup 
} from "@/lib/communityMockData";
import { useToast } from "@/components/ui/use-toast";

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
  
  // Gamification & Onboarding Checklist States
  const [karma, setKarma] = useState(120);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);
  
  // Modals & Mobile Drawers
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  // Voting Callback
  const handleVoteToggle = (postId: string, voteType: "up" | "down" | null) => {
    if (voteType === "up" && !hasUpvoted) {
      setHasUpvoted(true);
      setKarma(prev => prev + 10); // 10 Karma for upvoting first time
      toast({
        title: "Achievement: Supportive Peer!",
        description: "You gained 10 Healing Karma points.",
        duration: 2500,
      });
    }
  };

  // Comment Submission Callback
  const handleCommentSubmit = (postId: string) => {
    if (!hasCommented) {
      setHasCommented(true);
      setKarma(prev => prev + 25); // 25 Karma for commenting first time
      toast({
        title: "Achievement: Coping Helper!",
        description: "You gained 25 Healing Karma points.",
        duration: 2500,
      });
    } else {
      setKarma(prev => prev + 5); // 5 Karma for subsequent comments
    }

    // Update comment counts in state
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
    setKarma(prev => prev + 50); // 50 Karma for writing a post!
    toast({
      title: "Post Published!",
      description: `Your post is live in m/${postData.groupName}. +50 Karma!`,
      duration: 3500,
    });
  };

  // Filtered and Sorted Posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.content.toLowerCase().includes(query) ||
        p.groupName.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Feed filter (All vs Joined)
    if (feedFilter === "joined") {
      result = result.filter(p => joinedGroups?.includes(p.groupId) || false);
    }

    // Sort operations
    if (sortBy === "hot") {
      // Sort by likes score descending (Default)
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "new") {
      // Just now / newer posts first
      result.sort((a, b) => {
        if (a.timeAgo === "Just now") return -1;
        if (b.timeAgo === "Just now") return 1;
        return b.id.localeCompare(a.id); // fallback to ID sorting for newer
      });
    } else if (sortBy === "top") {
      // Highest positive likes
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "doctor") {
      // Only show posts that contain comments by doctors, sorted by likes
      result = result.filter(p => p.comments.some(c => c.author.role === "doctor"));
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [posts, searchQuery, selectedCategory, feedFilter, sortBy, joinedGroups]);

  // Joined groups detail for sidebar
  const myJoinedGroupsList = useMemo(() => {
    return groups.filter(g => joinedGroups?.includes(g.id) || false);
  }, [joinedGroups, groups]);

  // Recommended groups checklist
  const recommendedGroupsList = useMemo(() => {
    return groups.filter(g => !joinedGroups?.includes(g.id)).slice(0, 3);
  }, [joinedGroups, groups]);

  // Checklist items completion calculation (Zeigarnik Effect)
  const checklistItems = [
    { label: "Join a Support Group", done: (joinedGroups?.length || 0) > 0, tip: "Connect with patients sharing your focus." },
    { label: "Upvote a helpful advice", done: hasUpvoted, tip: "Reward supportive insights." },
    { label: "Publish a post or comment", done: hasCommented, tip: "Share your voice with others." },
    { label: "Complete Medical Profile (85%)", done: (profile?.profileCompleteness || 85) >= 90, tip: "Ensure accurate emergency assistance.", path: "/patient/profile/edit" }
  ];

  const completedCount = checklistItems.filter(item => item.done).length;
  const progressPercent = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />

      {/* Decorative Radial Glowing Accents */}
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 left-0 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-[140px] pointer-events-none z-0" />

      <motion.div 
        className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8"
        initial="initial"
        animate="animate"
        variants={containerVariants}
      >
        
        {/* HEADER ZONE */}
        <motion.div variants={itemVariants}>
          <DashboardHeader profile={{ fullName: profile?.fullName || "Patient", profileCompleteness: profile?.profileCompleteness || 85 }} />
        </motion.div>

        {/* SUB-HEADER / BREADCRUMB ZONE */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-full bg-card/45 backdrop-blur-sm border border-border/30 hover:bg-card" 
            onClick={() => navigate('/patient/dashboard')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Community Feed</h1>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">Support, knowledge sharing, and expert guidance.</p>
          </div>
        </motion.div>

        {/* MAIN THREE-COLUMN REDDIT GRID */}
        <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR (Desktop: Navigation & Categories) */}
            <motion.aside variants={itemVariants} className="hidden lg:flex flex-col gap-6 lg:col-span-3 sticky top-[100px] max-h-[82vh] overflow-y-auto pr-2">
              
              {/* Feeds Group Navigation */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-4 flex flex-col gap-1.5 hover:bg-card/50 transition-all duration-300">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Feeds</h3>
                <Button 
                  variant={feedFilter === "all" ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-xl gap-3 text-sm h-10 ${feedFilter === "all" ? "bg-primary/10 text-primary font-bold hover:bg-primary/15" : "text-foreground/80 hover:bg-muted/40"}`}
                  onClick={() => { setFeedFilter("all"); }}
                >
                  <Home className="h-4 w-4 shrink-0" />
                  <span>All Communities</span>
                </Button>
                
                <Button 
                  variant={feedFilter === "joined" ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-xl gap-3 text-sm h-10 ${feedFilter === "joined" ? "bg-primary/10 text-primary font-bold hover:bg-primary/15" : "text-foreground/80 hover:bg-muted/40"}`}
                  onClick={() => { setFeedFilter("joined"); }}
                >
                  <Heart className="h-4 w-4 shrink-0" />
                  <span>Joined Communities</span>
                  {joinedGroups.length > 0 && (
                    <span className="ml-auto bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {joinedGroups.length}
                    </span>
                  )}
                </Button>
              </div>

              {/* My Communities List */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-4 flex flex-col gap-1.5 hover:bg-card/50 transition-all duration-300">
                <div className="flex items-center justify-between px-3 mb-2">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Groups</h3>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setIsCreateGroupModalOpen(true)}
                      className="h-5 w-5 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      title="Create a new community"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                    <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">{joinedGroups.length}</Badge>
                  </div>
                </div>

                {myJoinedGroupsList.length === 0 ? (
                  <div className="text-center py-5 px-3 text-xs text-muted-foreground/60 border border-dashed border-border/30 rounded-2xl bg-background/20">
                    <p className="mb-2">You haven't joined any groups yet.</p>
                    <Button variant="link" className="h-auto p-0 text-primary text-xs font-semibold" onClick={() => setSelectedCategory("All")}>
                      Explore recommended
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
                    {myJoinedGroupsList.map(g => (
                      <Link 
                        key={g.id} 
                        to={`/patient/community/${g.id}`}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground/85 rounded-xl hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-6 w-6 rounded-lg bg-surface border border-border/50 flex items-center justify-center text-xs font-bold text-primary">
                          {g.name.charAt(0)}
                        </div>
                        <span className="truncate flex-1">m/{g.name}</span>
                        <ArrowRight className="h-3 w-3 text-muted-foreground/45 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Sidebar */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-4 flex flex-col gap-1.5 hover:bg-card/50 transition-all duration-300">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Categories</h3>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "secondary" : "ghost"}
                      className={`w-full justify-start rounded-xl text-sm h-10 ${
                        selectedCategory === cat 
                          ? "bg-primary/10 text-primary font-bold hover:bg-primary/15" 
                          : "text-foreground/85 hover:bg-muted/40"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <BookOpen className="h-4 w-4 shrink-0 mr-1.5 opacity-60" />
                      <span>{cat}</span>
                    </Button>
                  ))}
                </div>
              </div>

            </motion.aside>

            {/* MIDDLE COLUMN (Core Feed Area) */}
            <motion.main variants={itemVariants} className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              
              {/* Beautiful Welcome Hero */}
              <div className="relative overflow-hidden rounded-3xl border border-border/30 bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent p-6 sm:p-8">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className="absolute left-1/3 bottom-0 -ml-16 -mb-16 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Medscope Community Hub</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Connect, share, and heal together.
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
                    Join discussion groups, consult verified medical professionals, share your health journey, and earn karma points for supportive peer advice.
                  </p>
                </div>
              </div>

              {/* MOBILE SEARCH & ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search posts, topics, or conditions..." 
                    className="w-full pl-10 h-12 bg-card/35 border-border/30 rounded-2xl text-base shadow-sm focus-visible:ring-primary/20"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* Mobile action keys */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                  <Button 
                    variant="outline" 
                    className="h-12 flex-1 sm:flex-none px-4 rounded-2xl bg-card/35 border-border/30 gap-2"
                    onClick={() => setSelectedCategory("All")}
                  >
                    <Filter className="h-4 w-4" />
                    Reset Filters
                  </Button>
                  
                  <Button 
                    className="h-12 w-12 sm:hidden rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-md"
                    onClick={() => setIsMobileInfoOpen(true)}
                  >
                    <Activity className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* MOBILE ONLY: Horizontal Joined Communities Carousel */}
              {joinedGroups.length > 0 && (
                <div className="lg:hidden flex flex-col gap-2 bg-card/35 border border-border/30 rounded-3xl p-4 overflow-hidden">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Groups</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] gap-1 px-2 text-primary font-semibold hover:bg-primary/5"
                      onClick={() => setIsCreateGroupModalOpen(true)}
                    >
                      <Plus className="h-3 w-3" /> Create Group
                    </Button>
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
                    {myJoinedGroupsList.map(g => (
                      <Link 
                        key={g.id} 
                        to={`/patient/community/${g.id}`}
                        className="flex items-center gap-2 bg-background/50 hover:bg-background/80 border border-border/50 rounded-2xl px-3.5 py-2 whitespace-nowrap text-sm text-foreground shrink-0 shadow-sm transition-all"
                      >
                        <div className="h-5 w-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                          {g.name.charAt(0)}
                        </div>
                        <span>m/{g.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* REDDIT "CREATE POST" QUICK Composer Box */}
              <div className="bg-card/35 border border-border/30 rounded-3xl p-4 flex items-center gap-3 shadow-sm hover:bg-card/55 hover:border-primary/20 transition-all duration-300">
                <Avatar className="h-9 w-9 border border-border/50 shrink-0">
                  <AvatarFallback className="bg-primary/15 text-primary text-sm font-bold">
                    {displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex-1 bg-background/45 hover:bg-background/85 border border-border/30 hover:border-border/50 rounded-2xl px-4 py-2.5 text-sm text-muted-foreground/85 cursor-pointer transition-all select-none flex items-center justify-between"
                >
                  <span>Share an update, ask a question, or vent...</span>
                  <Plus className="h-4 w-4 text-muted-foreground/60" />
                </div>
              </div>

              {/* SORT FEED CONTROLS BAR */}
              <div className="bg-card/35 border border-border/30 rounded-3xl p-2 flex items-center justify-between overflow-x-auto gap-2 scrollbar-hide">
                <div className="flex items-center gap-1.5">
                  <Button
                    variant={sortBy === "hot" ? "secondary" : "ghost"}
                    className={`rounded-xl px-4 h-9 gap-1.5 text-xs font-bold whitespace-nowrap ${
                      sortBy === "hot" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSortBy("hot")}
                  >
                    <Flame className="h-3.5 w-3.5" /> Hot
                  </Button>
                  
                  <Button
                    variant={sortBy === "new" ? "secondary" : "ghost"}
                    className={`rounded-xl px-4 h-9 gap-1.5 text-xs font-bold whitespace-nowrap ${
                      sortBy === "new" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSortBy("new")}
                  >
                    <Clock className="h-3.5 w-3.5" /> New
                  </Button>
                  
                  <Button
                    variant={sortBy === "top" ? "secondary" : "ghost"}
                    className={`rounded-xl px-4 h-9 gap-1.5 text-xs font-bold whitespace-nowrap ${
                      sortBy === "top" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setSortBy("top")}
                  >
                    <TrendingUp className="h-3.5 w-3.5" /> Top
                  </Button>

                  <Button
                    variant={sortBy === "doctor" ? "secondary" : "ghost"}
                    className={`rounded-xl px-4 h-9 gap-1.5 text-xs font-bold whitespace-nowrap border ${
                      sortBy === "doctor" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" 
                        : "text-muted-foreground hover:text-emerald-500 border-transparent hover:bg-emerald-500/5 hover:border-emerald-500/15"
                    }`}
                    onClick={() => setSortBy("doctor")}
                  >
                    <Stethoscope className="h-3.5 w-3.5" /> Doctor Approved
                  </Button>
                </div>
              </div>

              {/* DYNAMIC POST FEED */}
              <div className="flex flex-col gap-4">
                {filteredAndSortedPosts.length === 0 ? (
                  <div className="flex border border-border/30 flex-col items-center justify-center py-20 bg-card/25 backdrop-blur-md rounded-3xl p-6">
                    <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-semibold text-foreground">No discussions found</p>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                      Try adjusting your search criteria, clearing categories, or switching sort tabs.
                    </p>
                    <Button variant="outline" className="mt-6 rounded-xl border-border/50 bg-card/50" onClick={() => { setSelectedCategory("All"); setSortBy("hot"); setSearchQuery(""); setFeedFilter("all"); }}>
                      Reset Feed Filter
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filteredAndSortedPosts.map(post => (
                      <PostFeedCard 
                        key={post.id} 
                        post={post}
                        currentUserName={profile?.fullName || "Patient"}
                        onVoteToggle={handleVoteToggle}
                        onCommentSubmit={handleCommentSubmit}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

            </motion.main>

            {/* RIGHT SIDEBAR (Desktop: Karma Checklist & Online Doctors) */}
            <motion.aside variants={itemVariants} className="hidden lg:flex flex-col gap-6 lg:col-span-3 sticky top-[100px] max-h-[82vh] overflow-y-auto pl-2">
              
              {/* Healing Journey Widget wrapped in BorderGlow */}
              <BorderGlow
                edgeSensitivity={20}
                glowColor="260 80 60"
                backgroundColor="hsl(var(--card))"
                borderRadius={24}
                glowRadius={50}
                glowIntensity={0.6}
                coneSpread={30}
                animated={true}
                colors={['#8b5cf6', '#6366f1', '#a78bfa']}
                fillOpacity={0.12}
                className="w-full shadow-sm"
              >
                <div className="p-5 relative flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-foreground text-sm tracking-tight">Healing Journey</h3>
                    </div>
                    <Badge className="bg-primary/15 text-primary border border-primary/10 font-black text-xs px-2.5 py-0.5 rounded-full">
                      {karma} Karma
                    </Badge>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                      <span>Task Checklist</span>
                      <span>{progressPercent}% Complete</span>
                    </div>
                    <Progress value={progressPercent} className="h-2 bg-muted/60 data-[value]:bg-primary" />
                  </div>

                  {/* Checklist list */}
                  <div className="space-y-3">
                    {checklistItems.map((item, idx) => (
                      <div key={idx} className="flex gap-2.5 items-start text-xs">
                        {item.done ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-border shrink-0 mt-0.5" />
                        )}
                        
                        <div className="flex flex-col gap-0.5">
                          {item.path && !item.done ? (
                            <Link to={item.path} className="font-bold text-foreground/80 hover:text-primary hover:underline transition-colors flex items-center gap-0.5">
                              {item.label} <Compass className="h-3 w-3 inline text-primary" />
                            </Link>
                          ) : (
                            <span className={`font-bold ${item.done ? "text-muted-foreground/70 line-through font-normal" : "text-foreground/85"}`}>
                              {item.label}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground/85 leading-relaxed">{item.tip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>

              {/* Online Doctors List wrapped in BorderGlow */}
              <BorderGlow
                edgeSensitivity={20}
                glowColor="170 80 50"
                backgroundColor="hsl(var(--card))"
                borderRadius={24}
                glowRadius={55}
                glowIntensity={0.5}
                coneSpread={30}
                animated={false}
                colors={['#14b8a6', '#0d9488', '#2dd4bf']}
                fillOpacity={0.1}
                className="w-full shadow-sm"
              >
                <div className="p-5 relative flex flex-col justify-between">
                  <h3 className="font-bold text-foreground text-sm mb-4 tracking-tight flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-teal-500" /> Medical Experts Online
                  </h3>
                  
                  <div className="space-y-4">
                    {MOCK_DOCTORS.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <div className={`h-8 w-8 rounded-full border border-border/40 flex items-center justify-center font-bold text-[10px] ${doc.avatarColor}`}>
                              {doc.name.split(" ")[1]?.charAt(0) || "D"}
                            </div>
                            {doc.isOnline && (
                              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-card ring-2 ring-emerald-500/30 animate-pulse" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground/90 truncate">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{doc.specialty}</p>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 rounded-lg text-[10px] px-2 text-teal-500 border border-teal-500/20 hover:bg-teal-500/10 shrink-0 font-bold"
                          asChild
                        >
                          <Link to="/patient/consultations">Consult</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </BorderGlow>

              {/* Recommended Groups list */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-5 shadow-sm hover:bg-card/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-foreground text-sm tracking-tight">Recommended Groups</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-[10px] px-2 text-primary font-bold gap-1 hover:bg-primary/5"
                    onClick={() => setIsCreateGroupModalOpen(true)}
                  >
                    <Plus className="h-3 w-3" /> Create
                  </Button>
                </div>
                <div className="space-y-3">
                  {recommendedGroupsList.map(g => (
                    <div key={g.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <Link to={`/patient/community/${g.id}`} className="font-bold text-foreground/80 hover:text-primary transition-colors block truncate">
                          m/{g.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">{g.members.toLocaleString()} members</span>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-7 rounded-lg text-[10px] px-3 font-semibold"
                        onClick={() => { joinGroup(g.id); }}
                      >
                        Join
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 text-[10px] sm:text-xs leading-relaxed text-amber-600/95 dark:text-amber-500/95 flex gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <strong>Medical Disclaimer:</strong> This board contains peer opinions. Consult a qualified professional for clinical treatments.
                </div>
              </div>

            </motion.aside>

          </div>
        </motion.div>

      {/* CREATE POST MODAL PORTAL */}
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        groups={groups}
        onSubmit={handleCreatePost}
      />

      {/* CREATE COMMUNITY MODAL PORTAL */}
      <CreateCommunityModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onSubmit={createGroup}
      />

      {/* Shared Mobile Navigation */}
      <MobileNavDock />
      <GlobalCommand />

      {/* MOBILE DRAWERS */}
      <AnimatePresence>
        {isMobileInfoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center lg:hidden"
            onClick={() => setIsMobileInfoOpen(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-card border-t border-border/80 w-full rounded-t-3xl max-h-[80vh] overflow-y-auto p-6 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag bar indicator */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto" />
              
              {/* Mobile Info Header */}
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-foreground text-lg">My Healing Progress</h3>
                </div>
                <Badge className="bg-primary/20 text-primary font-black px-3 py-1 rounded-full text-xs">
                  {karma} Karma Points
                </Badge>
              </div>

              {/* Checklist progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Task Checklist</span>
                  <span>{progressPercent}% Complete</span>
                </div>
                <Progress value={progressPercent} className="h-2.5 bg-muted/60" />
                
                <div className="space-y-3.5 mt-4">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-sm">
                      {item.done ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5 fill-emerald-500/10" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-border shrink-0 mt-0.5" />
                      )}
                      <div className="flex flex-col">
                        {item.path && !item.done ? (
                          <Link to={item.path} className="font-bold text-foreground/90 hover:text-primary hover:underline flex items-center gap-0.5" onClick={() => setIsMobileInfoOpen(false)}>
                            {item.label} <Compass className="h-3.5 w-3.5 inline text-primary" />
                          </Link>
                        ) : (
                          <span className={`font-bold ${item.done ? "text-muted-foreground/70 line-through font-normal" : "text-foreground/95"}`}>
                            {item.label}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Online Doctors */}
              <div className="border-t border-border/30 pt-4 flex flex-col gap-3">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-teal-500" /> Medical Experts Online
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MOCK_DOCTORS.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 text-xs bg-background/50 border border-border/40 p-3 rounded-2xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative shrink-0">
                          <div className={`h-8 w-8 rounded-full border border-border/40 flex items-center justify-center font-bold text-[10px] ${doc.avatarColor}`}>
                            {doc.name.split(" ")[1]?.charAt(0) || "D"}
                          </div>
                          {doc.isOnline && (
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-card ring-2 ring-emerald-500/30" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-foreground/90 truncate">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{doc.specialty}</p>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 rounded-lg text-[10px] px-2 text-teal-500 border border-teal-500/20 hover:bg-teal-500/10 shrink-0 font-bold"
                        onClick={() => { setIsMobileInfoOpen(false); navigate("/patient/consultations"); }}
                      >
                        Consult
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full rounded-2xl h-11 font-semibold" onClick={() => setIsMobileInfoOpen(false)}>
                Close Panel
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CommunityPage;
