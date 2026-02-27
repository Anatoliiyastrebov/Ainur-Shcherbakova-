import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import { useContent } from "@/context/ContentContext";
import { toast } from "sonner";

export const AdminSaveBar = () => {
  const { isAdmin, editMode, setEditMode, logout } = useAdmin();
  const { saveContent } = useContent();
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveContent();
      toast.success("Изменения сохранены");
      window.location.reload();
    } catch (_error) {
      toast.error("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
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
      <button className="btn-primary" onClick={handleSave} disabled={saving || !editMode}>
        {saving ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </div>
  );
};
