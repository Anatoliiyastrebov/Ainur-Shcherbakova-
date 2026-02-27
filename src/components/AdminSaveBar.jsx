import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useContent } from "@/context/ContentContext";
import { toast } from "sonner";

export const AdminSaveBar = () => {
  const { isAdmin, editMode, setEditMode, logout } = useAdmin();
  const { saveContent, reloadContent, hasUnsavedChanges } = useContent();
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  if (!isAdmin) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent();
      toast.success("Изменения сохранены на сервере");
    } catch (_error) {
      toast.error("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      if (hasUnsavedChanges) {
        await saveContent();
      }
      await reloadContent();
      toast.success("Изменения применены");
      window.location.reload();
    } catch (_error) {
      toast.error("Не удалось применить изменения");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] w-[95vw] max-w-3xl">
      <div className="card-wellness border border-primary/20 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm">
            <p className="font-semibold text-foreground">Панель редактора</p>
            <p className="text-muted-foreground">
              {hasUnsavedChanges ? "Есть несохранённые изменения" : "Все изменения сохранены"}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {editMode ? (
              <button className="btn-secondary" onClick={() => setEditMode(false)}>
                Выйти из режима
              </button>
            ) : (
              <button className="btn-secondary" onClick={() => setEditMode(true)}>
                Редактировать
              </button>
            )}
            <button className="btn-secondary" onClick={logout}>
              Разлогиниться
            </button>
            <button
              className="btn-primary"
              onClick={handleSave}
              disabled={saving || !editMode || !hasUnsavedChanges}
            >
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>
            <button
              className="btn-primary"
              onClick={handleApply}
              disabled={applying || !editMode}
            >
              {applying ? "Применение..." : "Применить изменения"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
