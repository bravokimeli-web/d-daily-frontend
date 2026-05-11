import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: () => (
    <div className="container-px mx-auto max-w-3xl py-20">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">About</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl font-bold">Built for Kenyan homes & farms.</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
        D-Daily Ltd is a Kenyan company on a mission to make trusted home and farm protection accessible to everyone.
        From the dukas of Nairobi to farms across Rift Valley, we deliver products that work — and education on how to use them safely.
      </p>
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        {[
          { n: "2,400+", t: "Happy customers" },
          { n: "47", t: "Counties served" },
          { n: "9", t: "Trusted products" },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl border bg-card p-6">
            <div className="font-display text-3xl font-bold text-primary">{s.n}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.t}</div>
          </div>
        ))}
      </div>
    </div>
  ),
});
