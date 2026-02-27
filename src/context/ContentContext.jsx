import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ContentContext = createContext(undefined);
const CONTENT_ENDPOINT = "/api/content";

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const reloadContent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(CONTENT_ENDPOINT, { credentials: "include" });
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setContent(data || {});
      setHasUnsavedChanges(false);
    } catch (_error) {
      // Keep default content if backend is not available.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadContent();
  }, [reloadContent]);

  const updateContent = useCallback((contentKey, value) => {
    setContent((prev) => ({ ...prev, [contentKey]: value }));
    setHasUnsavedChanges(true);
  }, []);

  const getContentValue = useCallback(
    (contentKey, fallbackValue = "") => {
      if (typeof contentKey !== "string" || !contentKey) return fallbackValue;
      const stored = content?.[contentKey];
      return typeof stored === "string" ? stored : fallbackValue;
    },
    [content]
  );

  const saveContent = useCallback(async () => {
    const response = await fetch(CONTENT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error("Failed to save content");
    }

    setHasUnsavedChanges(false);
    return true;
  }, [content]);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateContent,
        getContentValue,
        reloadContent,
        hasUnsavedChanges,
        saveContent,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }
  return context;
};
