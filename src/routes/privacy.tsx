import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <div className="container-px mx-auto max-w-3xl py-20">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">We respect your privacy. Personal details are only used to fulfil your orders and respond to your enquiries. We never sell your data.</p>
    </div>
  ),
});
