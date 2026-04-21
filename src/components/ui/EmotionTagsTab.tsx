"use client";

import { useState } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { Button } from "./button";
import { GripVertical, Trash2, Sparkles } from "lucide-react";

interface EmotionTag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
}

interface SuggestedTag {
  name: string;
  description: string;
}

const MOCK_TAGS: EmotionTag[] = [
  { id: "1", name: "Disciplined", color: "#22c55e", usageCount: 28 },
  { id: "2", name: "Patient", color: "#3b82f6", usageCount: 12 },
  { id: "3", name: "FOMO", color: "#ef4444", usageCount: 8 },
  { id: "4", name: "Greedy", color: "#f59e0b", usageCount: 5 },
  { id: "5", name: "Panic Sold", color: "#8b5cf6", usageCount: 15 },
  { id: "6", name: "Hesitant", color: "#6b7280", usageCount: 3 },
];

const SUGGESTED_TAGS: SuggestedTag[] = [
  { name: "Confident", description: "High conviction trade" },
  { name: "Uncertain", description: "Unsure about the setup" },
  { name: "Revenge trading", description: "Trading to recover losses" },
  { name: "Overconfident", description: "Too much conviction" },
  { name: "Tired", description: "Fatigued decision making" },
  { name: "Excited", description: "Emotional euphoria" },
];

export default function EmotionTagsTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const [tags, setTags] = useState<EmotionTag[]>(MOCK_TAGS);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: EmotionTag = {
        id: Date.now().toString(),
        name: newTagName,
        color: newTagColor,
        usageCount: 0,
      };
      setTags([...tags, newTag]);
      setNewTagName("");
      setNewTagColor("#3b82f6");
    }
  };

  const handleDeleteTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  const handleAddSuggestedTag = (suggested: SuggestedTag) => {
    const newTag: EmotionTag = {
      id: Date.now().toString(),
      name: suggested.name,
      color: "#6b7280",
      usageCount: 0,
    };
    setTags([...tags, newTag]);
  };

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = tags.findIndex((t) => t.id === draggedId);
    const targetIndex = tags.findIndex((t) => t.id === targetId);

    const newTags = [...tags];
    [newTags[draggedIndex], newTags[targetIndex]] = [newTags[targetIndex], newTags[draggedIndex]];
    setTags(newTags);
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Emotion tags</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tags you apply to trades when logging. Drag to reorder. Click on a tag's name or color apply to all past trades automatically.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
            <Sparkles className="w-4 h-4" />
            Suggest tags
          </Button>
        </div>
      </div>

      {/* Your Tags */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Your Tags: {tags.length} tags</h3>
          <p className="text-xs text-muted-foreground">Drag rows to reorder</p>
        </div>

        <div className="space-y-2 mb-6">
          {tags.map((tag) => (
            <div
              key={tag.id}
              draggable
              onDragStart={() => handleDragStart(tag.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(tag.id)}
              className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border cursor-move transition-opacity hover:opacity-80 ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <div
                className="w-6 h-6 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{tag.name}</p>
                <p className="text-xs text-muted-foreground">{tag.usageCount} trades</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTag(tag.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Tag */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">Add New Tag</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Tag name..."
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            className={`flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
              isDark
                ? "bg-muted border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
            }`}
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-12 h-10 rounded-lg border border-border cursor-pointer"
            />
            <Button onClick={handleAddTag} className="whitespace-nowrap">
              Add tag
            </Button>
          </div>
        </div>
      </div>

      {/* Tag Usage Info */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Tag Usage in the Emotion Journal</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your tags appear in the Emotion Journal page, where you can filter trades by emotion and see patterns in your trading behavior. The usage count shows how many trades you've tagged with each emotion.
        </p>
      </div>

      {/* Suggested Tags */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Suggested Tags</h3>
        <p className="text-xs sm:text-sm text-muted-foreground mb-6">
          Common emotion patterns in trading. Click to add any that resonate with your style.
        </p>

        <div className="space-y-2">
          {SUGGESTED_TAGS.map((suggested, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border ${
                isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{suggested.name}</p>
                <p className="text-xs text-muted-foreground">{suggested.description}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddSuggestedTag(suggested)}
                className="whitespace-nowrap"
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Important Notes</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">Deleting a tag</span> removes it from the tag picker, but does not remove it from past trades — those records keep their tag data for historical analysis. Renaming a tag updates it everywhere immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
