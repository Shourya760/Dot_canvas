import React, { useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import NoteItem from "./components/NoteItem";
import AISettingsModal from "./components/AISettingsModal";
import { askAI } from "./services/ai";

export default function App() {
  const canvasRef = useRef(null);

  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("canvas_notes") || "[]");
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [provider, setProvider] = useState(() => localStorage.getItem("canvas_ai_provider") || "ollama");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState(() => {
    try { return JSON.parse(localStorage.getItem("canvas_ai_keys") || "{}"); }
    catch { return {}; }
  });

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("canvas_dark_mode");
    return saved !== null
      ? saved === "true"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("canvas_dark_mode", isDark);
  }, [isDark]);

  useEffect(() => localStorage.setItem("canvas_ai_provider", provider), [provider]);

  // Save notes
  useEffect(() => {
    localStorage.setItem(
      "canvas_notes",
      JSON.stringify(
        notes.filter((n) => !n.isLoading && !n.isDisintegrating && n.text?.trim())
      )
    );
  }, [notes]);

  const id = () =>
    Date.now() + Math.random().toString(36).slice(2, 7);

  // Add note
  const addNote = (x, y) => {
    const newNote = {
      id: id(),
      x: Math.max(16, x),
      y: Math.max(16, y),
      text: "",
    };

    setNotes((prev) => [...prev, newNote]);
    setActiveId(newNote.id);
  };

  // Update note
  const updateNote = (id, text) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, text } : n
      )
    );
  };

  // Finish editing
  const commitNote = () => {
    setActiveId(null);

    setNotes((prev) =>
      prev.filter((n) => n.isLoading || n.text?.trim())
    );
  };

  // Animate answer
  const animateAnswer = (answerId, text, source) => {
    let i = 0;

    const timer = setInterval(() => {
      i += 2;

      setNotes((prev) =>
        prev.map((n) =>
          n.id === answerId
            ? {
              ...n,
              text: text.slice(0, i),
              answerSource: source,
              isLoading: false,
            }
            : n
        )
      );

      if (i >= text.length) {
        clearInterval(timer);
      }
    }, 15);
  };

  // Ask Ollama
  const handleAsk = async (questionId, questionText) => {
    if (!questionText.trim() || isAnswering) return;

    const question = notes.find(
      (n) => n.id === questionId
    );

    if (!question) return;

    setActiveId(null);
    setIsAnswering(true);

    const previousQuestionIds = new Set(
      notes.filter((n) => n.isAi).map((answer) => answer.questionId ||
        notes.find((n) => !n.isAi && n.text?.trim() === answer.questionText)?.id
      ).filter(Boolean)
    );
    const fadingIds = new Set(
      notes.filter((n) => n.id !== questionId && (previousQuestionIds.has(n.id) || (n.isAi && previousQuestionIds.has(n.questionId)))).map((n) => n.id)
    );
    if (fadingIds.size) {
      setNotes((prev) => prev.map((n) => fadingIds.has(n.id) ? { ...n, isDisintegrating: true } : n));
      window.setTimeout(() => setNotes((prev) => prev.filter((n) => !fadingIds.has(n.id))), 850);
    }

    const answerId = questionId;
    setNotes((prev) => prev.map((n) => n.id === questionId
      ? { ...n, text: "", isAi: true, isLoading: true, provider, questionText, questionId }
      : n
    ));

    try {
      const result = await askAI({ provider, prompt: questionText, apiKey: apiKeys[provider], apiKeys });
      animateAnswer(
        answerId,
        result.answer?.trim() || "The provider returned no answer.",
        result.source
      );
    } catch (error) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === answerId
            ? {
              ...n,
              text: error.message || "Could not get an AI answer. Check your connection and settings.",
              isLoading: false,
            }
            : n
        )
      );
    } finally {
      setIsAnswering(false);
    }
  };

  // Clear canvas
  const clearNotes = () => {
    if (
      notes.length &&
      window.confirm("Clear all notes on canvas?")
    ) {
      setNotes([]);
      setActiveId(null);
    }
  };

  // Click paper
  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current) {
      addNote(e.pageX, e.pageY);
    }
  };

  const canvasHeight = notes.reduce((height, note) =>
    Math.max(height, note.y + Math.max(120, Math.ceil((note.text?.length || 0) / 34) * 38 + 32)),
    window.innerHeight
  );

  return (
    <main
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ minHeight: canvasHeight }}
      className="
        relative
        w-screen
        min-h-screen
        overflow-x-hidden
        dot-grid
        cursor-text
      "
    >
      <Menu
        noteCount={notes.length}
        isDark={isDark}
        isAnswering={isAnswering}
        activeProvider={provider}
        onProviderChange={setProvider}
        onOpenSettings={() => setSettingsOpen(true)}
        onToggleTheme={() =>
          setIsDark((v) => !v)
        }
        onClear={clearNotes}
      />

      {notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          isActive={activeId === note.id}
          isAnswering={isAnswering}
          onSelect={setActiveId}
          onUpdate={updateNote}
          onCommit={commitNote}
          onAsk={handleAsk}
        />
      ))}
      <AISettingsModal
        isOpen={settingsOpen}
        apiKeys={apiKeys}
        onClose={() => setSettingsOpen(false)}
        onSave={(keys) => {
          setApiKeys(keys);
          localStorage.setItem("canvas_ai_keys", JSON.stringify(keys));
        }}
      />
    </main>
  );
}
