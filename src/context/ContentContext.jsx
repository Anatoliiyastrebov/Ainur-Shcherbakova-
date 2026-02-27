import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

const ContentContext = createContext(undefined);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/content", { credentials: "include" });
        if (!response.ok) {
          setLoading(false);
          return;
        }

        const data = await response.json();
        setContent(data || {});
      } catch (_error) {
        // Keep default content if backend is not available.
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const updateContent = useCallback((contentKey, value) => {
    setContent((prev) => ({ ...prev, [contentKey]: value }));
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
    const response = await fetch("/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error("Failed to save content");
    }

    return true;
  }, [content]);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateContent,
        getContentValue,
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
