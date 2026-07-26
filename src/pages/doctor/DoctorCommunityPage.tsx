import React, { useState, useMemo } from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import DoctorCommunityHero from "@/components/doctor-dashboard/community/DoctorCommunityHero";
import DoctorModerationQueue from "@/components/doctor-dashboard/community/DoctorModerationQueue";
import DoctorEducationManagement from "@/components/doctor-dashboard/community/DoctorEducationManagement";
import DoctorEventManagement from "@/components/doctor-dashboard/community/DoctorEventManagement";
import CreateAnnouncementModal from "@/components/doctor-dashboard/community/CreateAnnouncementModal";

import PostFeedCard from "@/components/community/PostFeedCard";
import GroupCard from "@/components/community/GroupCard";
import CreatePostModal from "@/components/community/CreatePostModal";
import CreateCommunityModal from "@/components/community/CreateCommunityModal";

import { Search, Filter, Sparkles, Plus, Flame, Clock, TrendingUp, ShieldCheck, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { INITIAL_POSTS, MOCK_GROUPS, Post } from "@/lib/communityMockData";
import { toast } from "sonner";

const CATEGORIES = ["All", "Mental Health", "Chronic Conditions", "Nutrition", "Recovery", "Lifestyle", "Fitness"];

export const DoctorCommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"feed" | "moderation" | "education" | "events">("feed");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");

  // Modals
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);

  // Filtered Posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.groupName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <DoctorLayout doctorName="Dr. Sarah Jenkins" specialty="Cardiology & Internal Medicine">
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: DOCTOR COMMUNITY HERO */}
          <DoctorCommunityHero
            doctorName="Dr. Sarah Jenkins"
            specialty="Cardiology & Internal Medicine"
            pendingReportsCount={3}
            verifiedAnswersCount={12}
            onCreateAnnouncement={() => setIsAnnouncementModalOpen(true)}
          />

          {/* COMMUNITY WORKSPACE TABS */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3 flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: "feed", label: "Community Feed & Discussions", icon: Users },
                { id: "moderation", label: "Moderation Queue (3 Flags)", icon: ShieldCheck },
                { id: "education", label: "Educational Articles", icon: BookOpen },
                { id: "events", label: "Live Events & Webinars", icon: Sparkles },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                        : "bg-card/60 hover:bg-card border border-border/50 text-foreground"
                    }`}
                  >
                    <IconComp className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === "feed" && (
              <Button
                onClick={() => setIsCreatePostModalOpen(true)}
                className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold h-9 px-3.5 gap-1.5 shadow-md"
              >
                <Plus className="h-4 w-4" />
                <span>+ Create Post</span>
              </Button>
            )}
          </div>

          {/* TAB CONTENT RENDERING */}
          {activeTab === "moderation" && <DoctorModerationQueue />}

          {activeTab === "education" && <DoctorEducationManagement />}

          {activeTab === "events" && <DoctorEventManagement />}

          {activeTab === "feed" && (
            <div className="space-y-6">
              {/* Search & Category Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/60 p-4 rounded-3xl border border-border/60 backdrop-blur-xl">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search discussions, groups & topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-3 py-2 rounded-xl bg-background border-border/60 text-xs font-medium text-foreground focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-background/60 hover:bg-background border border-border/40 text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Community Grid: Posts Feed (8 cols) & Groups Sidebar (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Posts Feed Column */}
                <div className="lg:col-span-8 space-y-4">
                  {filteredPosts.map((post) => (
                    <PostFeedCard
                      key={post.id}
                      post={post}
                      currentUserName="Dr. Sarah Jenkins, MD"
                    />
                  ))}
                </div>

                {/* Groups & Community Sidebar Column */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="p-5 rounded-3xl bg-card/60 border border-border/60 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-3">
                      <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Managed Health Groups</span>
                      </h3>
                      <button
                        onClick={() => setIsCreateGroupModalOpen(true)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        + Create Group
                      </button>
                    </div>

                    <div className="space-y-3">
                      {MOCK_GROUPS.slice(0, 4).map((grp) => (
                        <GroupCard
                          key={grp.id}
                          group={grp}
                          isJoined={true}
                          onJoinToggle={() => toast.info(`Managing group: ${grp.name}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Announcement Modal */}
          <CreateAnnouncementModal
            isOpen={isAnnouncementModalOpen}
            onClose={() => setIsAnnouncementModalOpen(false)}
          />

          {/* Create Post Modal */}
          <CreatePostModal
            isOpen={isCreatePostModalOpen}
            onClose={() => setIsCreatePostModalOpen(false)}
            groups={MOCK_GROUPS}
            onSubmit={(postData) => {
              const newPost = {
                id: `post-${Date.now()}`,
                groupId: postData.groupId || "general",
                groupName: postData.groupName || "General Cardiology",
                author: {
                  name: "Dr. Sarah Jenkins",
                  role: "doctor" as const,
                  specialty: "Cardiology",
                  avatarColor: "bg-emerald-500",
                },
                timeAgo: "Just now",
                title: postData.title,
                content: postData.content,
                likes: 0,
                userVote: null,
                category: postData.groupName || "General Cardiology",
                commentsCount: 0,
                comments: [],
                tags: postData.tags,
              };
              setPosts((prev) => [newPost, ...prev]);
              toast.success("Doctor post published to community!");
            }}
          />

          {/* Create Group Modal */}
          <CreateCommunityModal
            isOpen={isCreateGroupModalOpen}
            onClose={() => setIsCreateGroupModalOpen(false)}
            onSubmit={(groupData) => {
              toast.success(`Group "${groupData.name}" submitted for medical board review.`);
            }}
          />

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorCommunityPage;
