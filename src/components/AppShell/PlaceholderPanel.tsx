type PlaceholderPanelProps = {
  title: string;
  bullets: string[];
};

export function PlaceholderPanel({ title, bullets }: PlaceholderPanelProps) {
  return (
    <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <h2 className="text-xl font-medium text-stone-100">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300 sm:text-base">
        {bullets.map((bullet) => (
          <li key={bullet} className="rounded-2xl border border-stone-800/80 bg-stone-950/60 px-4 py-3">
            {bullet}
          </li>
        ))}
      </ul>
    </section>
  );
}
