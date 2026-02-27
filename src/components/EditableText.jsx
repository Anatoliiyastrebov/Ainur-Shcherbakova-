import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { useContent } from "@/context/ContentContext";

export const EditableText = ({ value = "", contentKey, multiline = false, className = "" }) => {
  const { editMode } = useAdmin();
  const { content, updateContent } = useContent();

  const currentValue = content?.[contentKey] ?? value;

  if (!editMode) {
    return <>{currentValue}</>;
  }

  if (multiline) {
    return (
      <textarea
        className={`input-field min-h-[90px] ${className}`}
        value={currentValue}
        onChange={(e) => updateContent(contentKey, e.target.value)}
      />
    );
  }

  return (
    <input
      className={`input-field ${className}`}
      value={currentValue}
      onChange={(e) => updateContent(contentKey, e.target.value)}
    />
  );
};
