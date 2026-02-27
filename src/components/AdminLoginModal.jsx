import React, { useState } from "react";
import { useAdmin } from "@/context/AdminContext";

export const AdminLoginModal = ({ open, onClose }) => {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(password);
      setPassword("");
      onClose();
    } catch (_err) {
      setError("Неверный пароль");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="card-wellness w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Вход администратора</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            className="input-field"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Вход..." : "Войти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
