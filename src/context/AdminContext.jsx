import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const AdminContext = createContext(undefined);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/admin/status", {
          credentials: "include",
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data?.isAdmin) {
          setIsAdmin(true);
          setEditMode(true);
        }
      } catch (_error) {
        // Ignore silently in case backend is not running.
      }
    };

    checkSession();
  }, []);

  const login = useCallback(async (password) => {
    const response = await fetch("/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      throw new Error("Invalid password");
    }

    setIsAdmin(true);
    setEditMode(true);
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAdmin(false);
      setEditMode(false);
    }
  }, []);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        editMode,
        setEditMode,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return context;
};
