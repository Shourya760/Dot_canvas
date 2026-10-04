import React, { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

export default function NoteItem({ note, isActive, isAnswering, onSelect, onUpdate, onCommit, onAsk }) {
  const editor = useRef(null);

  useEffect(() => {
    if (!isActive || !editor.current) return;
    editor.current.style.height = "auto";
    editor.current.style.height = `${editor.current.scrollHeight}px`;
  }, [isActive, note.text]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") return onCommit();
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!isAnswering && note.text.trim()) onAsk(note.id, note.text.trim());
    }
  };

  return (
    <div
      data-note-id={note.id}
      style={{ left: `${note.x}px`, top: `${note.y}px`, maxWidth: `calc(100vw - ${note.x}px - 16px)` }}
      onClick={(event) => {
        event.stopPropagation();
        if (!note.isLoading && !note.isAi) onSelect(note.id);
      }}
      className={`group absolute z-10 select-none ${note.isDisintegrating ? "ash-away" : ""}`}
    >
      {note.isLoading ? (
        <div className="flex items-center gap-2 font-handwriting text-2xl italic text-neutral-500 dark:text-neutral-400">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" /><span className="animate-pulse">Thinking...</span>
        </div>
      ) : isActive ? (
        <div>
          <textarea
            ref={editor}
            autoFocus
            rows={1}
            value={note.text}
            onChange={(e) => onUpdate(note.id, e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={onCommit}
            className="min-w-[180px] max-w-md resize-none overflow-hidden border-none bg-transparent p-0 font-handwriting text-2xl leading-snug text-neutral-800 outline-none dark:text-neutral-100 placeholder:font-sans placeholder:text-xs placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />
        </div>
      ) : (
        <div className="max-w-md whitespace-pre-wrap font-handwriting text-2xl leading-snug text-neutral-800 dark:text-neutral-100">
          {note.isAi && note.answerSource && <div className="mb-1 font-sans text-[10px] font-medium tracking-wide text-neutral-400 dark:text-neutral-500">{note.answerSource}</div>}
          <div className={`min-w-[60px] ${note.isAi ? "text-amber-700 dark:text-amber-300" : ""}`}>{note.text}</div>
        </div>
      )}
    </div>
  );
}
