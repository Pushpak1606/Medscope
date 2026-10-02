import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Info, 
  Plus, 
  ShieldAlert, 
  Pin, 
  Users, 
  Home, 
  Heart, 
  BookOpen, 
  Stethoscope, 
  Flame, 
  Clock, 
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePatient } from "@/context/PatientContext";
import AnimatedBackground from "@/components/ui/animated-background";
import PostFeedCard from "@/components/community/PostFeedCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";
import { GlobalCommand } from "@/components/ui/global-command";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import BorderGlow from "@/components/ui/BorderGlow";
import { 
  INITIAL_POSTS, 
  MOCK_DOCTORS, 
  Post, 
  CommunityGroup 
} from "@/lib/communityMockData";
import { toast } from "sonner";

const CATEGORIES = ["All", "Mental Health", "Chronic Conditions", "Nutrition", "Recovery", "Lifestyle", "Fitness"];

const fadeInOptions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 }
};

const BannerGradientMap: Record<string, string> = {
  "Mental Health": "from-purple-600/30 to-teal-500/20",
  "Chronic Conditions": "from-pink-600/30 to-rose-500/20",
  "Nutrition": "from-emerald-600/30 to-amber-500/20",
  "Recovery": "from-sky-600/30 to-blue-500/20",
  "Lifestyle": "from-amber-600/30 to-orange-500/20",
  "Fitness": "from-orange-600/30 to-rose-500/20"
};

const CommunityGroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();  
  const { profile, joinedGroups, joinGroup, leaveGroup, groups, createGroup } = usePatient();
  const displayName = profile?.fullName?.split(" ")[0] || "Patient";

  // State Management
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top" | "doctor">("hot");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isMobileInfoOpen, setIsMobileInfoOpen] = useState(false);

  // Gamification & Onboarding Checklist States
  const [karma, setKarma] = useState(120);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [hasCommented, setHasCommented] = useState(false);

  // Retrieve current group
  const group = useMemo(() => {
    return groups.find(g => g.id === id) || groups[0];
  }, [id, groups]);

  const isJoined = joinedGroups.includes(group.id);

  // Leave / Join toggling with toasts
  const handleJoinToggle = () => {
    if (isJoined) {
      leaveGroup(group.id);
      toast.info("Left Group", {
        description: `You left m/${group.name}. You will no longer see updates in your Home Feed.`,
        duration: 3000,
      });
    } else {
      joinGroup(group.id);
      setKarma(prev => prev + 15); // 15 karma points for joining!
      toast.success("Joined Group! +15 Karma", {
        description: `Welcome to m/${group.name}. Feel free to participate in conversations.`,
        duration: 3000,
      });
    }
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
    toast.success("Post Published!", {
      description: `Your post is live in m/${postData.groupName}. +50 Karma!`,
      duration: 3500,
    });
  };

  // Filtered and sorted group posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(p => p.groupId === group.id);

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
  }, [posts, group.id, sortBy]);

  // Sidebar navigations
  const myJoinedGroupsList = useMemo(() => {
    return groups.filter(g => joinedGroups?.includes(g.id) || false);
  }, [joinedGroups, groups]);

  // Voting Callback
  const handleVoteToggle = (postId: string, voteType: "up" | "down" | null) => {
    if (voteType === "up" && !hasUpvoted) {
      setHasUpvoted(true);
      setKarma(prev => prev + 10);
      toast.success("Achievement: Supportive Peer!", {
        description: "You gained 10 Healing Karma points.",
        duration: 2500,
      });
    }
  };

  // Comment Submission Callback
  const handleCommentSubmit = (postId: string) => {
    if (!hasCommented) {
      setHasCommented(true);
      setKarma(prev => prev + 25);
      toast.success("Achievement: Coping Helper!", {
        description: "You gained 25 Healing Karma points.",
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

  const bannerGradient = BannerGradientMap[group.category] || "from-primary/30 to-violet-500/20";

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

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-0 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none z-0" />

      <motion.div 
        className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        
        {/* HEADER ZONE */}
        <motion.div variants={fadeInOptions}>
          <DashboardHeader profile={{ fullName: profile?.fullName || "Patient", profileCompleteness: profile?.profileCompleteness || 85 }} />
        </motion.div>

        {/* SUB-HEADER / BREADCRUMB ZONE */}
        <motion.div variants={fadeInOptions} className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="rounded-full gap-2 px-3 text-muted-foreground hover:text-foreground bg-card/45 backdrop-blur-sm border border-border/30 hover:bg-card" 
            onClick={() => navigate('/patient/community')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Feed
          </Button>
        </motion.div>

        {/* MAIN THREE-COLUMN REDDIT GRID */}
        <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDEBAR (Desktop: Navigation & Categories) */}
            <motion.aside variants={fadeInOptions} className="hidden lg:flex flex-col gap-6 lg:col-span-3 sticky top-[100px] max-h-[82vh] overflow-y-auto pr-2">
              
              {/* Feeds Group Navigation */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-4 flex flex-col gap-1.5 hover:bg-card/50 transition-all duration-300">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Feeds</h3>
                <Button 
                  variant="ghost"
                  className="w-full justify-start rounded-xl gap-3 text-sm h-10 text-foreground/80 hover:bg-muted/40"
                  asChild
                >
                  <Link to="/patient/community">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>All Communities</span>
                  </Link>
                </Button>
                
                <Button 
                  variant={isJoined ? "secondary" : "ghost"}
                  className={`w-full justify-start rounded-xl gap-3 text-sm h-10 ${
                    isJoined 
                      ? "bg-primary/10 text-primary font-bold hover:bg-primary/15" 
                      : "text-foreground/85 hover:bg-muted/40"
                  }`}
                  onClick={handleJoinToggle}
                >
                  <Heart className="h-4 w-4 shrink-0" />
                  <span>{isJoined ? "Joined Group" : "Join Group"}</span>
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
                  <div className="text-center py-4 text-xs text-muted-foreground/60 border border-dashed border-border/30 rounded-2xl">
                    No joined groups.
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto pr-1">
                    {myJoinedGroupsList.map(g => (
                      <Link 
                        key={g.id} 
                        to={`/patient/community/${g.id}`}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-all ${
                          g.id === group.id 
                            ? "bg-background/80 border border-border/50 text-primary font-bold shadow-sm"
                            : "text-foreground/85 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          g.id === group.id ? "bg-primary text-primary-foreground" : "bg-surface border border-border/50 text-primary"
                        }`}>
                          {g.name.charAt(0)}
                        </div>
                        <span className="truncate flex-1">m/{g.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Back Link to Feed */}
              <Button variant="outline" className="rounded-2xl border-border/45" asChild>
                <Link to="/patient/community" className="flex items-center justify-center gap-2">
                  <Compass className="h-4 w-4" /> Explore All Groups
                </Link>
              </Button>

            </motion.aside>

            {/* MIDDLE COLUMN (Core Group Feed) */}
            <motion.main variants={itemVariants} className="col-span-12 lg:col-span-6 flex flex-col gap-6">
              
              {/* MOBILE ONLY: Horizontal Joined Communities Carousel */}
              {joinedGroups.length > 0 && (
                <div className="lg:hidden flex flex-col gap-2 bg-card/35 border border-border/30 rounded-3xl p-4 overflow-hidden">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">My Groups</h3>
                    <Button variant="link" className="h-auto p-0 text-xs text-primary" asChild>
                      <Link to="/patient/community">View Feed</Link>
                    </Button>
                  </div>
                  <div className="flex gap-2.5 overflow-x-auto pb-1.5 scrollbar-hide">
                    {myJoinedGroupsList.map(g => (
                      <Link 
                        key={g.id} 
                        to={`/patient/community/${g.id}`}
                        className={`flex items-center gap-2 border rounded-2xl px-3.5 py-2 whitespace-nowrap text-sm shrink-0 shadow-sm transition-all ${
                          g.id === group.id
                            ? "bg-primary/10 border-primary text-primary font-bold"
                            : "bg-background/50 hover:bg-background/80 border-border/50 text-foreground"
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                          g.id === group.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                        }`}>
                          {g.name.charAt(0)}
                        </div>
                        <span>m/{g.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* GROUP HERO BANNER */}
              <div className="rounded-3xl border border-border/30 bg-card/35 backdrop-blur-md overflow-hidden shadow-sm relative w-full hover:bg-card/50 transition-all duration-300">
                <div className={`h-28 w-full bg-gradient-to-r ${bannerGradient} absolute top-0 left-0 z-0`} />
                <div className="relative z-10 p-5 sm:p-6 mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold tracking-wide rounded-md">
                        {group.category}
                      </Badge>
                      <span className="text-[10px] flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-md font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {group.members > 15 ? Math.floor(group.members * 0.05) : 3} Healing Now
                      </span>
                    </div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">m/{group.name}</h1>
                    <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{group.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground/80 mt-1">
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-background/40 backdrop-blur-sm rounded-lg border border-border/40">
                        <Users className="h-3.5 w-3.5 text-primary" /> {group.members.toLocaleString()} members
                      </span>
                    </div>
                  </div>
                  
                  {/* Join / Leave Actions */}
                  <div className="shrink-0 w-full sm:w-auto">
                    {isJoined ? (
                      <Button 
                        variant="outline" 
                        className="w-full rounded-xl bg-card/60 backdrop-blur-md border-border/60 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-semibold"
                        onClick={handleJoinToggle}
                      >
                        Leave Group
                      </Button>
                    ) : (
                      <LiquidGlassButton 
                        className="w-full shadow-md font-semibold"
                        onClick={handleJoinToggle}
                      >
                        Join Group
                      </LiquidGlassButton>
                    )}
                  </div>
                </div>
              </div>

              {/* REDDIT "CREATE POST" composer specifically for this group */}
              {isJoined ? (
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
                    <span>Write something to m/{group.name}...</span>
                    <Plus className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                </div>
              ) : (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-4 text-xs text-amber-600 dark:text-amber-500 text-center font-medium leading-normal">
                  You must be a member of this community to publish posts. Join above!
                </div>
              )}

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
                
                {/* Mobile Info Sheet Button */}
                <Button 
                  size="icon"
                  variant="outline"
                  className="lg:hidden h-9 w-9 shrink-0 rounded-xl bg-card border-border/50 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsMobileInfoOpen(true)}
                >
                  <Info className="h-4 w-4" />
                </Button>
              </div>

              {/* PINNED GROUP GUIDELINE */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex gap-3 shadow-sm">
                <div className="shrink-0 mt-0.5">
                  <Pin className="h-5 w-5 text-primary fill-primary/20" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">Welcome to m/{group.name} Guidelines</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    This is a private space for patient support. Do not prescribe medicines, post doctors' real addresses, or engage in medical shaming. Respect the moderators.
                  </p>
                </div>
              </div>

              {/* GROUP FEED POSTS */}
              <div className="flex flex-col gap-4">
                {filteredAndSortedPosts.length === 0 ? (
                  <div className="flex border border-border/30 flex-col items-center justify-center py-20 bg-card/25 backdrop-blur-md rounded-3xl p-6">
                    <ShieldAlert className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <p className="text-lg font-semibold text-foreground">No discussions yet</p>
                    <p className="text-sm text-muted-foreground text-center max-w-sm mt-2">
                      {isJoined 
                        ? "Be the first to share an update, cope-win, or question in this group!"
                        : "Join this group to see descriptions, questions, and responses."}
                    </p>
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

            {/* RIGHT SIDEBAR (Desktop: Rules & disclaimer) */}
            <motion.aside variants={itemVariants} className="hidden lg:flex flex-col gap-6 lg:col-span-3 sticky top-[100px] max-h-[82vh] overflow-y-auto pl-2">
              
              {/* About Community Details */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-5 shadow-sm hover:bg-card/50 transition-all duration-300">
                <h3 className="font-bold text-foreground text-sm mb-3.5 tracking-tight">About Community</h3>
                <div className="space-y-4 text-xs">
                  <p className="text-muted-foreground leading-relaxed">{group.description}</p>
                  
                  <div className="border-t border-border/30 pt-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Members:</span>
                      <span className="font-bold text-foreground">{group.members.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Healing online:</span>
                      <span className="font-bold text-emerald-500 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {group.members > 15 ? Math.floor(group.members * 0.05) : 3}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-bold text-foreground">{group.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Rules */}
              <div className="bg-card/35 backdrop-blur-md border border-border/30 rounded-3xl p-5 shadow-sm hover:bg-card/50 transition-all duration-300">
                <h3 className="font-bold text-foreground text-sm mb-3.5 tracking-tight">m/{group.name} Rules</h3>
                <ol className="space-y-3.5 text-xs text-muted-foreground">
                  {group.rules?.map((rule, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-primary">{idx + 1}.</span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  )) || (
                    <span className="text-xs text-muted-foreground">Be respectful and helpful.</span>
                  )}
                </ol>
              </div>

              {/* Healing Journey Karma Widget (Synced) */}
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
                    <h3 className="font-bold text-foreground text-xs tracking-tight uppercase text-muted-foreground">Healing Status</h3>
                    <Badge className="bg-primary/15 text-primary border border-primary/10 font-black text-xs px-2 rounded-full">
                      {karma} Karma
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Journey Tasks</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-muted/60" />
                  </div>
                </div>
              </BorderGlow>

              {/* Medical Disclaimer */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-4 text-[10px] sm:text-xs leading-relaxed text-amber-600/95 dark:text-amber-500/95 flex gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <strong>Medical Disclaimer:</strong> Peer recommendations do not replace direct consultation with doctors. Seek clinical advice before making medication adjustments.
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
        defaultGroupId={group.id}
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

      {/* MOBILE SHEET/DRAWER */}
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
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto" />
              
              <div className="flex items-center justify-between border-b border-border/30 pb-3">
                <h3 className="font-bold text-foreground text-lg">About m/{group.name}</h3>
                <Badge variant="outline" className="text-xs font-bold text-muted-foreground">{group.category}</Badge>
              </div>

              <div className="space-y-4 text-sm">
                <p className="text-muted-foreground leading-relaxed">{group.description}</p>
                
                <div className="grid grid-cols-2 gap-4 bg-background/50 border border-border/40 p-4 rounded-2xl">
                  <div>
                    <span className="text-xs text-muted-foreground block">Members</span>
                    <span className="text-base font-bold text-foreground">{group.members.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Active online</span>
                    <span className="text-base font-bold text-emerald-500 flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {group.members > 15 ? Math.floor(group.members * 0.05) : 3}
                    </span>
                  </div>
                </div>
              </div>

              {/* Group Rules */}
              <div className="flex flex-col gap-3">
                <h4 className="font-bold text-foreground text-sm">m/{group.name} Rules</h4>
                <ol className="space-y-3 text-xs text-muted-foreground bg-background/25 border border-border/40 p-4 rounded-2xl">
                  {group.rules?.map((rule, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="font-bold text-primary">{idx + 1}.</span>
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  )) || (
                    <span className="text-xs text-muted-foreground">Be respectful and helpful.</span>
                  )}
                </ol>
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

export default CommunityGroupPage;
