"use client";

import { useState, useEffect } from "react";
import { useThemeStore } from "@/stores/themeStore";
import { useEmotionTagStore } from "@/stores/emotionTagStore";
import { Button } from "./button";
import { GripVertical, Trash2, Sparkles, Pencil, X, Check } from "lucide-react";

export default function EmotionTagsTab() {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  
  // Zustand store
  const {
    tags,
    suggestedTags,
    loading,
    saving,
    deletingId,
    editingId,
    errors,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    addSuggestedTag,
    setEditingId,
    clearErrors,
  } = useEmotionTagStore();

  // Local state for new tag form
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#4f8ef7");

  // Local state for edit form
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  // Local state for delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Load tags on mount
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  // Handle add new tag
  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      await createTag({ name: newTagName.trim(), color: newTagColor });
      // Clear form on success
      setNewTagName("");
      setNewTagColor("#4f8ef7");
    } catch (error) {
      // Errors are handled by the store
    }
  };

  // Handle start editing
  const handleStartEdit = (tagId: number) => {
    const tag = tags.find((t) => t.id === tagId);
    if (tag) {
      setEditName(tag.name);
      setEditColor(tag.color);
      setEditingId(tagId);
    }
  };

  // Handle save edit
  const handleSaveEdit = async (tagId: number) => {
    if (!editName.trim()) return;
    
    try {
      await updateTag(tagId, { name: editName.trim(), color: editColor });
    } catch (error) {
      // Errors are handled by the store
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    clearErrors();
  };

  // Handle delete with confirmation
  const handleDeleteClick = (tagId: number) => {
    setDeleteConfirmId(tagId);
  };

  const handleConfirmDelete = async (tagId: number) => {
    await deleteTag(tagId);
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Handle add suggested tag
  const handleAddSuggestedTag = async (suggested: { name: string; color: string }) => {
    try {
      await addSuggestedTag(suggested);
    } catch (error) {
      // Errors are handled by the store
    }
  };

  // Format win rate
  const formatWinRate = (winRate: number) => {
    return `${Math.round(winRate)}%`;
  };

  // Format P&L
  const formatPnL = (pnl: number) => {
    if (pnl === 0) return "$0.00";
    const abs = Math.abs(pnl).toFixed(2);
    return pnl > 0 ? `+$${abs}` : `-$${abs}`;
  };

  // Calculate max trade count for usage chart
  const maxTradeCount = Math.max(...tags.map((t) => t.trade_count), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading emotion tags...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">Emotion tags</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tags you apply to trades when logging. Click edit to modify. These tags help you track emotional patterns in your trading.
            </p>
          </div>
        </div>
      </div>

      {/* Your Tags */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Your Tags: {tags.length} tags</h3>
        </div>

        <div className="space-y-2 mb-6">
          {tags.map((tag) => (
            <div key={tag.id}>
              {editingId === tag.id ? (
                // Edit mode
                <div className={`p-3 sm:p-4 rounded-lg border ${isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          isDark
                            ? "bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                            : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none"
                        }`}
                        placeholder="Tag name..."
                      />
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveEdit(tag.id)}
                        disabled={saving}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    {errors?.name && (
                      <p className="text-xs text-destructive">{errors.name[0]}</p>
                    )}
                    {errors?.color && (
                      <p className="text-xs text-destructive">{errors.color[0]}</p>
                    )}
                    {errors?.detail && (
                      <p className="text-xs text-destructive">{errors.detail}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: editColor }}
                      />
                      <span className="text-sm font-medium text-foreground">{editName || "Preview"}</span>
                    </div>
                  </div>
                </div>
              ) : deleteConfirmId === tag.id ? (
                // Delete confirmation mode
                <div className={`p-3 sm:p-4 rounded-lg border ${isDark ? "bg-destructive/10 border-destructive/50" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-foreground">Delete "{tag.name}"? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfirmDelete(tag.id)}
                        disabled={deletingId === tag.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId === tag.id ? "Deleting..." : "Delete"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelDelete}
                        disabled={deletingId === tag.id}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                // Normal display mode
                <div
                  className={`flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-opacity ${
                    isDark ? "bg-muted/50 border-border" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{tag.name}</p>
                    <p className="text-xs text-muted-foreground">{tag.trade_count} trades</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(tag.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(tag.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Tag */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">Add New Tag</h3>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Tag name..."
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
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
              <Button onClick={handleAddTag} disabled={saving} className="whitespace-nowrap">
                {saving ? "Adding..." : "Add tag"}
              </Button>
            </div>
          </div>
          {errors?.name && (
            <p className="text-xs text-destructive">{errors.name[0]}</p>
          )}
          {errors?.color && (
            <p className="text-xs text-destructive">{errors.color[0]}</p>
          )}
          {errors?.detail && !errors?.name && !errors?.color && (
            <p className="text-xs text-destructive">{errors.detail}</p>
          )}
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: newTagColor }}
            />
            <span className="text-sm text-muted-foreground">{newTagName || "Preview"}</span>
          </div>
        </div>
      </div>

      {/* Tag Usage Chart */}
      <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-6">Tag Usage Statistics</h3>
        
        {tags.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tags yet. Add your first tag above.</p>
        ) : (
          <div className="space-y-3">
            {tags.map((tag) => {
              const barWidth = ((tag.trade_count / maxTradeCount) * 100).toFixed(0);
              return (
                <div key={tag.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <span className="text-sm font-medium text-foreground">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{tag.trade_count} trades</span>
                      <span>Win: {formatWinRate(tag.win_rate)}</span>
                      <span className={tag.avg_pnl >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatPnL(tag.avg_pnl)}
                      </span>
                    </div>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-muted" : "bg-slate-200"}`}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${barWidth}%`,
                        backgroundColor: tag.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Suggested Tags */}
      {suggestedTags.length > 0 && (
        <div className={`rounded-lg border p-6 sm:p-8 ${isDark ? "bg-background border-border" : "bg-white border-slate-200"}`}>
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Suggested Tags</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6">
            Common emotion patterns in trading. Click to add any that resonate with your style.
          </p>

          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((suggested, idx) => (
              <button
                key={idx}
                onClick={() => handleAddSuggestedTag(suggested)}
                disabled={saving}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  saving
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-80 cursor-pointer"
                } ${isDark ? "bg-muted/50 border-border text-foreground" : "bg-slate-50 border-slate-200 text-slate-900"}`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: suggested.color }}
                />
                {suggested.name}
              </button>
            ))}
          </div>
        </div>
      )}

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
