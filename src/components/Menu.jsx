import React from 'react';
import { RotateCcw, Sun, Moon, Loader2, KeyRound } from 'lucide-react';
import { AI_PROVIDERS } from '../services/providers';

export default function Menu({
  noteCount,
  isDark,
  isAnswering,
  activeProvider,
  onProviderChange,
  onOpenSettings,
  onToggleTheme,
  onClear,
}) {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-3.5 py-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-full text-xs text-neutral-600 dark:text-neutral-300 select-none transition-colors">
      <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-100">
        <span className={`w-2 h-2 rounded-full ${isAnswering ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
        <span>Canvas</span>
      </div>

      <span className="text-neutral-300 dark:text-neutral-700">|</span>
      <span className="font-mono text-neutral-500 dark:text-neutral-400">
        {noteCount} {noteCount === 1 ? 'note' : 'notes'}
      </span>

      <span className="text-neutral-300 dark:text-neutral-700">|</span>
      <label className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300" title="Choose an AI provider">
        {isAnswering ? (
          <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
        ) : null}
        <select value={activeProvider} onChange={(e) => onProviderChange(e.target.value)} disabled={isAnswering} aria-label="AI provider" className="max-w-[110px] cursor-pointer bg-transparent outline-none disabled:opacity-60">
          {AI_PROVIDERS.map((provider) => <option key={provider.id} value={provider.id}>{provider.label}</option>)}
        </select>
      </label>

      <button type="button" onClick={onOpenSettings} title="Configure API keys" aria-label="Configure API keys" className="rounded-full p-1 text-neutral-600 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800">
        <KeyRound className="h-3.5 w-3.5" />
      </button>

      <span className="text-neutral-300 dark:text-neutral-700">|</span>
      <button
        type="button"
        onClick={onToggleTheme}
        className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition cursor-pointer"
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      {noteCount > 0 && (
        <>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <button
            type="button"
            onClick={onClear}
            className="hover:text-red-500 p-1 text-neutral-400 transition cursor-pointer"
            title="Clear canvas"
            aria-label="Clear canvas"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </>
      )}
    </header>
  );
}
