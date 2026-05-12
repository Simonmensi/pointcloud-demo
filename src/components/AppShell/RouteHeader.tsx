import Link from "next/link";

type RouteHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function RouteHeader({ eyebrow, title, description }: RouteHeaderProps) {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-400">{eyebrow}</p>
        <Link
          href="/"
          className="rounded-full border border-stone-800 px-4 py-2 text-sm text-stone-300 transition hover:border-stone-600 hover:text-stone-100"
        >
          Back Home
        </Link>
      </div>
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-50 sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-stone-300 sm:text-lg">{description}</p>
      </div>
    </header>
  );
}
