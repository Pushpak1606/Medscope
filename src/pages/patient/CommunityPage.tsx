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
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Mental Health", "Chronic Conditions", "Nutrition", "Recovery", "Lifestyle", "Fitness"];

const fadeInOptions = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

type MobileTab = "feed" | "groups" | "doctors" | "karma";

const CommunityPage = () => {
  const navigate = useNavigate();  
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
      toast.success("Achievement: Peer Supporter", {
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
      toast.success("Achievement: Care Helper", {
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
    toast.success("Post Published!", {
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
      <motion.div 
        className="w-full space-y-6 lg:space-y-8 pb-12"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        
        {/* --- PAGE HEADER WITH COMMUNITY STATS & CREATE POST CTA --- */}
        <motion.div variants={fadeInOptions}>
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
        </motion.div>

        {/* --- MOBILE SEGMENTED TAB SWITCHER (<1024px) --- */}
        <motion.div variants={fadeInOptions} className="lg:hidden flex items-center p-1 bg-card/60 backdrop-blur-md rounded-2xl border border-border/50 gap-1 overflow-x-auto">
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
        </motion.div>

        {/* --- MAIN 3-COLUMN LAYOUT --- */}
        <motion.div variants={fadeInOptions} className="grid grid-cols-12 gap-6 items-start">
          
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
                <Users className="h-4 w-4 shrink-0" />
                <span>My Groups ({myJoinedGroupsList.length})</span>
              </Button>
            </GlassCard>

            {/* Health Topics & Categories */}
            <GlassCard className="p-4 flex flex-col gap-1 bg-card/60 backdrop-blur-xl border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primary" />
                <span>Health Topics</span>
              </h3>

              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all",
                      selectedCategory === cat
                        ? "bg-primary/15 text-primary font-bold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Joined Communities Quick List */}
            <GlassCard className="p-4 flex flex-col gap-2.5 bg-card/60 backdrop-blur-xl border-border/50">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-primary" />
                  <span>My Communities</span>
                </h3>
                <button 
                  onClick={() => setIsCreateGroupModalOpen(true)}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> Create
                </button>
              </div>

              <div className="space-y-1">
                {myJoinedGroupsList.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic px-2 py-1">No groups joined yet.</p>
                ) : (
                  myJoinedGroupsList.map((group) => (
                    <Link
                      key={group.id}
                      to={`/patient/community/group/${group.id}`}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                          {group.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            m/{group.name}
                          </h4>
                          <span className="text-[10px] text-muted-foreground">{group.members.toLocaleString()} members</span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </Link>
                  ))
                )}
              </div>
            </GlassCard>

          </aside>

          {/* ================= CENTER FEED (Main Discussion Stream) ================= */}
          <main className={cn(
            "col-span-12 lg:col-span-6 flex-col gap-4",
            mobileTab === "feed" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Feed Sort & Search Toolbar */}
            <GlassCard className="p-3 sm:p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-card/60 backdrop-blur-xl border-border/50">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions, symptoms, medications..."
                  className="pl-10 h-10 rounded-xl bg-card border-border/50 text-xs font-medium focus-visible:ring-primary"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "hot", label: "Hot", icon: Flame },
                  { id: "new", label: "New", icon: Clock },
                  { id: "top", label: "Top", icon: TrendingUp },
                  { id: "doctor", label: "Doctor Replied", icon: Stethoscope },
                ].map((sort) => (
                  <button
                    key={sort.id}
                    onClick={() => setSortBy(sort.id as any)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border",
                      sortBy === sort.id
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card/40 border-border/40 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <sort.icon className="w-3.5 h-3.5" />
                    <span>{sort.label}</span>
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* Active Filter Badges Indicator */}
            {(selectedCategory !== "All" || searchQuery || feedFilter === "joined") && (
              <div className="flex items-center gap-2 px-1 flex-wrap">
                <span className="text-xs text-muted-foreground font-semibold">Active Filters:</span>
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="gap-1.5 rounded-lg text-xs font-semibold">
                    Topic: {selectedCategory}
                    <button onClick={() => setSelectedCategory("All")} className="hover:text-destructive">✕</button>
                  </Badge>
                )}
                {feedFilter === "joined" && (
                  <Badge variant="secondary" className="gap-1.5 rounded-lg text-xs font-semibold">
                    My Groups Only
                    <button onClick={() => setFeedFilter("all")} className="hover:text-destructive">✕</button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1.5 rounded-lg text-xs font-semibold">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery("")} className="hover:text-destructive">✕</button>
                  </Badge>
                )}
              </div>
            )}

            {/* Post Feed List */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-12 text-center rounded-3xl bg-card/40 border border-border/40 space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto text-muted-foreground">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">No discussions found</h3>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Try clearing search filters or create a new post to start a conversation with the community.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("All");
                        setFeedFilter("all");
                      }}
                      variant="outline"
                      className="rounded-xl font-bold text-xs border-primary/30 text-primary"
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                ) : (
                  filteredAndSortedPosts.map((post) => (
                    <PostFeedCard
                      key={post.id}
                      post={post}
                      onVoteToggle={handleVoteToggle}
                      onCommentSubmit={handleCommentSubmit}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* ================= RIGHT SIDEBAR (Gamification, Karma & Recommended) ================= */}
          <aside className={cn(
            "col-span-12 lg:col-span-3 flex-col gap-6 lg:sticky lg:top-[90px] max-h-[85vh] overflow-y-auto pl-1",
            mobileTab === "doctors" || mobileTab === "karma" ? "flex" : "hidden lg:flex"
          )}>
            
            {/* Healing Karma & Badges Card */}
            <GlassCard className="p-5 flex flex-col gap-4 bg-gradient-to-br from-card/80 via-card/50 to-primary/5 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Reputation Level
                    </span>
                    <h4 className="text-sm font-extrabold text-foreground">Level 3: Supportive Peer</h4>
                  </div>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-extrabold text-xs">
                  {karma} Karma
                </Badge>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Progress to Level 4 (Advocate)</span>
                  <span className="text-primary font-bold">140 / 300</span>
                </div>
                <Progress value={46} className="h-2 rounded-full bg-muted" />
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
                        toast.success("Joined Group", { description: `You joined m/${g.name}!` });
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

        </motion.div>

      </motion.div>

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
          toast.success("Group Created!", { description: `m/${groupData.name} is now live.` });
        }}
      />
    </PatientPageLayout>
  );
};

export default CommunityPage;
