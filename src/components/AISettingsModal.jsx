import React, { useEffect, useState } from "react";
import { KeyRound, X } from "lucide-react";
import { API_PROVIDERS } from "../services/providers";

export default function AISettingsModal({ isOpen, apiKeys, onClose, onSave }) {
  const [draft, setDraft] = useState(apiKeys);
  useEffect(() => setDraft(apiKeys), [apiKeys, isOpen]);
  if (!isOpen) return null;

  const save = (event) => {
    event.preventDefault();
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-800 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-amber-500" /> AI provider keys</div>
          <button type="button" onClick={onClose} aria-label="Close settings" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-4 w-4" /></button>
        </header>
        {API_PROVIDERS.map((provider) => (
          <label key={provider.id} className="block space-y-1.5 text-xs font-medium">
            {provider.label}
            <input
              type="password"
              autoComplete="off"
              value={draft[provider.id] || ""}
              onChange={(e) => setDraft((keys) => ({ ...keys, [provider.id]: e.target.value }))}
              placeholder={provider.placeholder}
              className="w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 font-normal outline-none focus:border-neutral-500 dark:border-neutral-700"
            />
            <a href={provider.link} target="_blank" rel="noreferrer" className="font-normal text-neutral-500 underline underline-offset-2">Get a key</a>
          </label>
        ))}
        <p className="text-[11px] leading-relaxed text-neutral-500">Keys are saved in this browser and sent directly to the provider you select. Ollama runs locally and needs no key.</p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 text-xs hover:bg-neutral-100 dark:hover:bg-neutral-800">Cancel</button>
          <button type="submit" className="rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900">Save keys</button>
        </div>
      </form>
    </div>
  );
}
