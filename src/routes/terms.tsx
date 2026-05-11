import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: () => (
    <div className="container-px mx-auto max-w-3xl py-20 prose-sm">
      <h1 className="font-display text-4xl font-bold">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">By using D-Daily Ltd's website and services you agree to our terms. Products are sold as described; please follow safety guidance on each item.</p>
    </div>
  ),
});
