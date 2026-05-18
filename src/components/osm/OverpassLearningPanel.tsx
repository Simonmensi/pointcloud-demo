"use client";

import { useMemo, useState } from "react";
import {
  overpassExamples,
  studyRegion,
  summarizeOverpass,
  type OverpassExample,
  type OverpassResponse,
} from "@/lib/osm-overpass";

type QueryState = {
  data: OverpassResponse | null;
  error: string | null;
  loading: boolean;
};

export function OverpassLearningPanel() {
  const [activeExampleId, setActiveExampleId] = useState<OverpassExample["id"]>("buildings");
  const [queryState, setQueryState] = useState<QueryState>({
    data: null,
    error: null,
    loading: false,
  });
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const activeExample = useMemo(
    () => overpassExamples.find((example) => example.id === activeExampleId) ?? overpassExamples[0],
    [activeExampleId],
  );

  const summary = useMemo(() => {
    if (!queryState.data) {
      return null;
    }

    return summarizeOverpass(queryState.data.elements);
  }, [queryState.data]);

  async function runExample(exampleId: OverpassExample["id"]) {
    setActiveExampleId(exampleId);
    setCopyStatus(null);
    setQueryState({ data: null, error: null, loading: true });

    try {
      const response = await fetch(`/api/overpass?example=${exampleId}`, {
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        data?: OverpassResponse;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        setQueryState({ data: null, error: payload.error ?? "Query failed.", loading: false });
        return;
      }

      setQueryState({ data: payload.data, error: null, loading: false });
    } catch (error) {
      setQueryState({
        data: null,
        error: error instanceof Error ? error.message : "Query failed.",
        loading: false,
      });
    }
  }

  async function copyQuery() {
    try {
      await navigator.clipboard.writeText(activeExample.query);
      setCopyStatus("Copied query");
    } catch {
      setCopyStatus("Clipboard unavailable");
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="space-y-6">
        <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Study Region</p>
          <h2 className="mt-2 text-2xl font-medium text-stone-50">{studyRegion.name}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
            {studyRegion.description}
          </p>
          <dl className="mt-5 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
              <dt className="text-stone-500">Center</dt>
              <dd className="mt-2">
                {studyRegion.center.latitude}, {studyRegion.center.longitude}
              </dd>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
              <dt className="text-stone-500">BBox</dt>
              <dd className="mt-2 text-xs leading-6 sm:text-sm">
                {studyRegion.bbox.south}, {studyRegion.bbox.west}, {studyRegion.bbox.north},{" "}
                {studyRegion.bbox.east}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Overpass Examples</p>
              <h2 className="mt-2 text-2xl font-medium text-stone-50">Run one query at a time</h2>
            </div>
            <button
              type="button"
              onClick={copyQuery}
              className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-200 transition hover:border-stone-500"
            >
              Copy Query
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {overpassExamples.map((example) => {
              const isActive = activeExample.id === example.id;

              return (
                <article
                  key={example.id}
                  className={`rounded-2xl border p-4 transition ${
                    isActive
                      ? "border-amber-500/50 bg-amber-500/8"
                      : "border-stone-800 bg-stone-950/70"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-stone-100">{example.title}</h3>
                      <p className="text-sm leading-6 text-stone-300">{example.description}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{example.focus}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => runExample(example.id)}
                      className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-200 transition hover:border-amber-400 hover:text-white"
                    >
                      Run {example.title}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950/80 p-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm uppercase tracking-[0.24em] text-stone-500">Active Query</h3>
              {copyStatus ? <span className="text-xs text-emerald-300">{copyStatus}</span> : null}
            </div>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-stone-300 sm:text-sm">
              {activeExample.query}
            </pre>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Results</p>
        <h2 className="mt-2 text-2xl font-medium text-stone-50">Readable summary first</h2>
        <p className="mt-3 text-sm leading-6 text-stone-300 sm:text-base">
          The goal here is to understand what comes back from OSM before we draw anything on a map.
        </p>

        {queryState.loading ? (
          <div className="mt-6 rounded-2xl border border-stone-800 bg-stone-950/70 p-5 text-sm text-stone-300">
            Querying Overpass...
          </div>
        ) : null}

        {queryState.error ? (
          <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm leading-6 text-rose-100">
            {queryState.error}
          </div>
        ) : null}

        {!queryState.loading && !queryState.error && !summary ? (
          <div className="mt-6 rounded-2xl border border-stone-800 bg-stone-950/70 p-5 text-sm leading-6 text-stone-300">
            Pick an example and run it. Start with buildings, then compare roads and POIs.
          </div>
        ) : null}

        {summary ? (
          <div className="mt-6 space-y-6">
            <div className="grid gap-3 sm:grid-cols-4">
              <SummaryCard label="Total features" value={summary.total.toString()} />
              <SummaryCard label="Nodes" value={summary.typeCounts.node.toString()} />
              <SummaryCard label="Ways" value={summary.typeCounts.way.toString()} />
              <SummaryCard label="Relations" value={summary.typeCounts.relation.toString()} />
            </div>

            <div className="overflow-hidden rounded-2xl border border-stone-800 bg-stone-950/80">
              <div className="grid grid-cols-[90px_90px_minmax(0,1fr)_minmax(0,1fr)_170px] gap-3 border-b border-stone-800 px-4 py-3 text-xs uppercase tracking-[0.2em] text-stone-500">
                <span>ID</span>
                <span>Type</span>
                <span>Name</span>
                <span>Main Tag</span>
                <span>Coordinate</span>
              </div>
              {summary.sampleRows.map((row) => (
                <div
                  key={`${row.type}-${row.id}`}
                  className="grid grid-cols-[90px_90px_minmax(0,1fr)_minmax(0,1fr)_170px] gap-3 border-b border-stone-900 px-4 py-3 text-sm text-stone-200 last:border-b-0"
                >
                  <span className="text-stone-400">{row.id}</span>
                  <span>{row.type}</span>
                  <span className="truncate">{row.name}</span>
                  <span className="truncate text-stone-300">{row.primaryTag}</span>
                  <span className="text-stone-400">{row.coordinate}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-stone-500">{label}</p>
      <p className="mt-3 text-2xl font-medium text-stone-50">{value}</p>
    </div>
  );
}
