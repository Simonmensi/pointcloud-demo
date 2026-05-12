"use client";

import { viewerModeLabels, viewerModes, type ViewerMode } from "@/components/viewer/types";

type TopLeftTogglePanelProps = {
  value: ViewerMode;
  onChange: (mode: ViewerMode) => void;
};

export function TopLeftTogglePanel({ value, onChange }: TopLeftTogglePanelProps) {
  return (
    <div className="rounded-3xl border border-stone-800 bg-stone-950/90 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Top-left Toggle Panel</p>
      <label className="mt-3 block text-sm text-stone-300" htmlFor="viewer-mode">
        Viewer mode
      </label>
      <select
        id="viewer-mode"
        className="mt-2 w-full rounded-2xl border border-stone-700 bg-stone-900 px-4 py-3 text-sm text-stone-100 outline-none transition focus:border-amber-400"
        value={value}
        onChange={(event) => onChange(event.target.value as ViewerMode)}
      >
        {viewerModes.map((mode) => (
          <option key={mode} value={mode}>
            {viewerModeLabels[mode]}
          </option>
        ))}
      </select>
    </div>
  );
}
