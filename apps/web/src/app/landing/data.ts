// Landing page copy — kept as plain data so section components stay pure layout.
// Placeholder content below (marked TODO) — fill in your own wording. Array
// length is free to change; each section maps over these arrays.
export const DEMO_NUMBER = "+16895882988";
export const DEMO_NUMBER_DISPLAY = "(689) 588-2988";

export const FEATURES = [
  { title: "TODO: feature 1 title", body: "TODO: feature 1 description" },
  { title: "TODO: feature 2 title", body: "TODO: feature 2 description" },
  { title: "TODO: feature 3 title", body: "TODO: feature 3 description" },
  { title: "TODO: feature 4 title", body: "TODO: feature 4 description" },
  { title: "TODO: feature 5 title", body: "TODO: feature 5 description" },
  { title: "TODO: feature 6 title", body: "TODO: feature 6 description" },
];

export const STEPS = [
  { n: "1", title: "TODO: step 1 title", body: "TODO: step 1 description" },
  { n: "2", title: "TODO: step 2 title", body: "TODO: step 2 description" },
  { n: "3", title: "TODO: step 3 title", body: "TODO: step 3 description" },
];

export const FAQS = [
  { q: "TODO: question 1", a: "TODO: answer 1" },
  { q: "TODO: question 2", a: "TODO: answer 2" },
  { q: "TODO: question 3", a: "TODO: answer 3" },
  { q: "TODO: question 4", a: "TODO: answer 4" },
  { q: "TODO: question 5", a: "TODO: answer 5" },
  { q: "TODO: question 6", a: "TODO: answer 6" },
];

// Pricing kept as real facts (Stripe products already live in test mode,
// see CLAUDE.md Phase 1) — not copy, so not placeholder'd.
export const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "PipeLine",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "TODO: one-line product description for search/AI answer engines",
      offers: [
        { "@type": "Offer", name: "Solo", price: "59", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
        { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};
