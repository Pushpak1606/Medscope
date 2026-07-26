import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Megaphone, Send } from "lucide-react";
import { toast } from "sonner";

export interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateAnnouncementModal: React.FC<CreateAnnouncementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("Managing Anxiety");
  const [content, setContent] = useState("");

  const handlePostAnnouncement = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please enter both a title and announcement content.");
      return;
    }

    toast.success(`Official Doctor Announcement published to m/${group}!`);
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl bg-card/95 border-border/80 backdrop-blur-2xl shadow-2xl space-y-4">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Official Practitioner Announcement</span>
          </div>
          <DialogTitle className="text-xl font-extrabold font-heading text-foreground">
            Post Community Announcement
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Target Community Group</label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select community group..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Managing Anxiety">m/Managing Anxiety</SelectItem>
                <SelectItem value="PCOS Warriors">m/PCOS Warriors</SelectItem>
                <SelectItem value="Diabetes Diet & Tech">m/Diabetes Diet & Tech</SelectItem>
                <SelectItem value="Cardiac Rehab & Recovery">m/Cardiac Rehab & Recovery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Announcement Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Important Clinical Guidance on Hot Weather & Blood Pressure"
              className="mt-1 rounded-xl bg-background border-border/60 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-muted-foreground uppercase text-[10px]">Clinical Message & Instructions</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Write official guidance for community members..."
              className="mt-1 rounded-xl bg-background border-border/60 text-xs font-medium"
            />
          </div>
        </div>

        <DialogFooter className="pt-2 flex items-center justify-end gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-xl border-border/60 hover:bg-muted text-foreground text-xs font-semibold h-9 px-4"
          >
            Cancel
          </Button>

          <Button
            onClick={handlePostAnnouncement}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Publish Announcement</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementModal;
