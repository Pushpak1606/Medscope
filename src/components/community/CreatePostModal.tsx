import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CommunityGroup } from "@/lib/communityMockData";
import { AlertCircle, HelpCircle, PenTool, Sparkles, Tag, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: CommunityGroup[];
  onSubmit: (postData: {
    title: string;
    content: string;
    groupId: string;
    groupName: string;
    tags: string[];
    anonymous: boolean;
  }) => void;
  defaultGroupId?: string;
}

const CreatePostModal = ({
  isOpen,
  onClose,
  groups,
  onSubmit,
  defaultGroupId
}: CreatePostModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");

  // Sync default group ID when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedGroupId(defaultGroupId || groups[0]?.id || "");
      setTitle("");
      setContent("");
      setTagsInput("");
      setAddedTags([]);
      setIsAnonymous(false);
      setError("");
    }
  }, [isOpen, defaultGroupId, groups]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagsInput.trim().replace(/#/g, "");
      if (cleaned && !addedTags.includes(cleaned) && addedTags.length < 5) {
        setAddedTags([...addedTags, cleaned]);
        setTagsInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setAddedTags(addedTags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!selectedGroupId) {
      setError("Please select a community group.");
      return;
    }
    if (!title.trim()) {
      setError("Please add a title for your post.");
      return;
    }
    if (!content.trim()) {
      setError("Please write some content.");
      return;
    }

    const group = groups.find(g => g.id === selectedGroupId);
    if (!group) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      groupId: selectedGroupId,
      groupName: group.name,
      tags: addedTags.length > 0 ? addedTags : [group.category],
      anonymous: isAnonymous
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card/95 border border-border/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-foreground overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4 text-left">
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-foreground">
            <PenTool className="h-6 w-6 text-primary" /> Create a Post
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Share your story, ask questions, or provide support to the community.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-2xl flex items-center gap-2 mb-2 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Group Choice */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="group-select" className="text-sm font-semibold flex items-center gap-1.5 text-foreground/90">
              <Users className="h-4 w-4 text-primary" /> Choose a Community
            </Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger id="group-select" className="w-full">
                <SelectValue placeholder="Select a community group..." />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    m/{g.name} ({g.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-title" className="text-sm font-semibold text-foreground/90">Title</Label>
            <Input
              id="post-title"
              placeholder="An interesting title summarizing your thought..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              className="h-11 bg-background/50 border-border/60 rounded-xl focus-visible:ring-primary/30"
              maxLength={100}
            />
            <div className="text-right text-[10px] text-muted-foreground mt-0.5">
              {title.length}/100 characters
            </div>
          </div>

          {/* Body Content */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="post-content" className="text-sm font-semibold text-foreground/90">Body Content</Label>
            <Textarea
              id="post-content"
              placeholder="What's on your mind? Share detailed context, questions, or experiences..."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError("");
              }}
              className="min-h-[160px] bg-background/50 border-border/60 rounded-2xl resize-y py-3 focus-visible:ring-primary/30 text-base"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags-input" className="text-sm font-semibold flex items-center gap-1.5 text-foreground/90">
              <Tag className="h-4 w-4 text-primary" /> Tags <span className="text-[10px] font-normal text-muted-foreground">(press Enter or comma to add, max 5)</span>
            </Label>
            <Input
              id="tags-input"
              placeholder="e.g. mentalhealth, diet, sleep"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="h-11 bg-background/50 border-border/60 rounded-xl focus-visible:ring-primary/30"
              disabled={addedTags.length >= 5}
            />
            {addedTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {addedTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="pl-3 pr-2 py-1 bg-surface border border-border/50 text-xs text-muted-foreground flex items-center gap-1.5 rounded-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer transition-colors"
                    onClick={() => removeTag(tag)}
                  >
                    #{tag} <span className="text-[10px] font-bold">×</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center justify-between p-4 bg-background/30 rounded-2xl border border-border/40">
            <div className="flex flex-col gap-1 pr-4">
              <span className="text-sm font-bold text-foreground">Post Anonymously</span>
              <span className="text-xs text-muted-foreground">Hide your full name and profile avatar. Your post will show as 'Anonymous Patient'.</span>
            </div>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Medical Disclaimer Reminder */}
          <div className="flex gap-2.5 p-3.5 bg-amber-500/10 border border-amber-500/20 text-[11px] sm:text-xs text-amber-600/90 dark:text-amber-500/90 rounded-2xl">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Patient Safety Reminder:</strong> Avoid diagnosing others, recommending precise pharmaceutical dosages, or sharing personal contact info. Keep discussion supportive and reference-based where possible.
            </div>
          </div>
        </div>

        <DialogFooter className="mt-8 flex flex-row justify-end items-center gap-3 w-full border-t border-border/40 pt-4">
          <Button variant="ghost" className="rounded-xl px-5 h-11" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="rounded-xl px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex items-center gap-1.5 shadow-md shadow-primary/10"
            onClick={handleSubmit}
          >
            <Sparkles className="h-4 w-4" /> Publish Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostModal;
