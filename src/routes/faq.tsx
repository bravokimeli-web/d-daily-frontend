import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Do you have a physical store?", a: "Yes — visit us in Embakasi, Nairobi." },
  { q: "How long does delivery take?", a: "1–3 business days within Nairobi, 2–5 days countrywide via Swatin, Bolt, G4S or Fargo." },
  { q: "Can I pay with M-PESA?", a: "Yes — at checkout you'll receive an STK push to confirm the payment from your phone." },
  { q: "Are your products safe?", a: "Yes, when used as directed. Each product page includes detailed safety precautions." },
  { q: "Do you offer wholesale or reseller pricing?", a: "Yes — apply via the Reseller program page to access wholesale pricing and commissions." },
];

export const Route = createFileRoute("/faq")({
  component: () => (
    <div className="container-px mx-auto max-w-3xl py-20">
      <h1 className="font-display text-4xl md:text-5xl font-bold">Questions, answered.</h1>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger className="text-left text-base font-semibold">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ),
});
