import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldAlert, Sparkles, Tag, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CATEGORIES = ["Mental Health", "Chronic Conditions", "Nutrition", "Recovery", "Lifestyle", "Fitness", "General"];

const CREATION_RULES = [
  {
    title: "Supportive Focus",
    description: "The group must center around mutual patient support, shared experiences, or wellness goals."
  },
  {
    title: "No Prescriptive Clinical Advice",
    description: "Ensure that members know to share personal advice, and never diagnose or prescribe treatments."
  },
  {
    title: "Strict Privacy First",
    description: "Never expose personal identifiable information (PII) or patient records of other individuals."
  },
  {
    title: "Respectful Moderation",
    description: "As creator, you agree to report and delete hateful language, harassment, or medical misinformation."
  }
];

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: {
    name: string;
    description: string;
    category: string;
    tags: string[];
    rules: string[];
    icon: string;
  }) => void;
}

const CreateCommunityModal = ({ isOpen, onClose, onSubmit }: CreateCommunityModalProps) => {  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tagsInput, setTagsInput] = useState("");
  const [addedTags, setAddedTags] = useState<string[]>([]);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setDescription("");
      setCategory("General");
      setTagsInput("");
      setAddedTags([]);
      setRulesAccepted(false);
      setError("");
    }
  }, [isOpen]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const cleaned = tagsInput.trim().replace(/#/g, "").toLowerCase();
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
    if (!name.trim()) {
      setError("Please specify a community name.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Community name must be at least 3 characters.");
      return;
    }
    if (!description.trim()) {
      setError("Please describe the focus of your community.");
      return;
    }
    if (description.trim().length < 15) {
      setError("Description should be at least 15 characters to explain the purpose.");
      return;
    }
    if (!rulesAccepted) {
      setError("You must read and accept the community creation guidelines.");
      return;
    }

    // Default icon choice based on category
    const iconMap: Record<string, string> = {
      "Mental Health": "BrainCircuit",
      "Chronic Conditions": "ShieldAlert",
      "Nutrition": "Apple",
      "Recovery": "Activity",
      "Lifestyle": "Smile",
      "Fitness": "Flame",
      "General": "Users"
    };

    onSubmit({
      name: name.trim().replace(/\s+/g, ""), // clean m/ spaces
      description: description.trim(),
      category,
      tags: addedTags.length > 0 ? addedTags : [category.toLowerCase()],
      rules: [
        "Be empathetic and kind. Avoid judgment.",
        "Do not give prescriptive medical advice; share what worked for you.",
        "Do not share personal identifiable information (PHI)."
      ],
      icon: iconMap[category] || "Users"
    });
    
    toast.success("Community Created!", {
      description: `m/${name.trim().replace(/\s+/g, "")} has been successfully created.`,
      duration: 3500,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card/95 border border-border/80 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 text-foreground overflow-y-auto max-h-[90vh] shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">Create a Support Community</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Form a new focus group. Connect patients experiencing similar conditions, goals, or lifestyle focus.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 my-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex gap-2 items-center">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Guidelines Box */}
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4" /> Community Creation Guidelines
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {CREATION_RULES.map((rule, idx) => (
                <div key={idx} className="flex gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">{rule.title}</span>
                    <span className="text-muted-foreground text-[10px] leading-relaxed block">{rule.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="comm-name" className="text-xs font-bold text-foreground uppercase tracking-wider">
              Community Name
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/60 select-none">
                m/
              </span>
              <Input
                id="comm-name"
                placeholder="e.g. AnxietySupport"
                className="pl-8 bg-background/50 border-border/60 rounded-xl focus-visible:ring-primary/20 h-10"
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">Only letters, numbers, and underscores are allowed. No spaces.</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-foreground uppercase tracking-wider">Category</Label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === cat
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background/40 hover:bg-muted border-border/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="comm-desc" className="text-xs font-bold text-foreground uppercase tracking-wider">
              Description / Focus Statement
            </Label>
            <Textarea
              id="comm-desc"
              placeholder="What is this support group about? Who should join, and what topics will be discussed?"
              rows={3}
              className="bg-background/50 border-border/60 rounded-xl focus-visible:ring-primary/20 resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="comm-tags" className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Discussion Tags</span>
              <span className="text-[10px] text-muted-foreground/60 normal-case">Max 5 tags</span>
            </Label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-background/50 border border-border/60 rounded-xl min-h-[42px]">
              {addedTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/5 font-semibold text-xs px-2 py-0.5 rounded-lg flex items-center gap-1"
                >
                  #{tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive font-black text-[10px]">
                    ×
                  </button>
                </Badge>
              ))}
              {addedTags.length < 5 && (
                <input
                  id="comm-tags"
                  placeholder={addedTags.length === 0 ? "Type tag and press Enter..." : "Add tag..."}
                  className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-xs focus:ring-0 p-0.5"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              )}
            </div>
          </div>

          {/* Acceptance Checklist */}
          <div className="flex items-start gap-2.5 pt-1.5">
            <Checkbox
              id="accept-rules"
              checked={rulesAccepted}
              onCheckedChange={(checked) => setRulesAccepted(checked === true)}
              className="rounded border-border/80 h-4.5 w-4.5 mt-0.5 data-[state=checked]:bg-primary"
            />
            <div className="grid gap-0.5 leading-none">
              <label htmlFor="accept-rules" className="text-xs font-bold text-foreground cursor-pointer select-none">
                I have read and agree to follow the Medscope Community Creation Rules.
              </label>
              <p className="text-[10px] text-muted-foreground">
                As founder, I take responsibility for keeping this community a safe, helpful clinical support space.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-6">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-border/80 bg-background/50">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-1">
            <Sparkles className="h-4 w-4" /> Create Community
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunityModal;
