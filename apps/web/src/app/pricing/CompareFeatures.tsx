import { FEATURE_CATEGORIES } from "./data";
import { CATEGORY_ICONS, GridTick } from "./icons";

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  if (value === false) return <span className="text-neutral-300">—</span>;
  return <span className="text-sm font-normal text-neutral-600">{value}</span>;
}

export default function CompareFeatures() {
  return (
    <section className="relative border-t border-neutral-200/80 px-4 sm:px-8 pt-0 pb-14">
      <GridTick position="top-left" />
      <GridTick position="top-right" />

      <div className="mx-auto max-w-7xl">
        {/* Sticky column headers — full-bleed border so the line touches the outer left/right edges */}
        <div
          className="sticky top-[68px] z-10 -mx-4 border-b border-neutral-200 bg-cover bg-center px-4 backdrop-blur-md sm:-mx-8 sm:px-8"
          style={{
            backgroundImage: "url(https://i.pinimg.com/1200x/13/19/f4/1319f4d3f391acacc992ff9392f35c14.jpg)",
          }}
        >
          <div className="grid grid-cols-[1fr_140px_140px] items-end gap-4 py-12 sm:grid-cols-[1fr_200px_200px]">
            <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">Compare every feature</h2>
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-medium text-neutral-900">Solo</span>
              <a
                href="/onboarding"
                className="w-full rounded-full border border-neutral-200 bg-white py-1.5 text-center text-xs font-medium text-neutral-700 hover:border-neutral-300"
              >
                Start trial
              </a>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-lg font-medium text-neutral-900">Crew</span>
              <a
                href="/onboarding"
                className="w-full rounded-full bg-[#FFEA5D] py-1.5 text-center text-xs font-medium text-black hover:bg-[#FFEE33]"
              >
                Start trial
              </a>
            </div>
          </div>
        </div>

        {FEATURE_CATEGORIES.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center gap-2 pt-8 pb-3 text-neutral-900">
              {CATEGORY_ICONS[cat.icon]}
              <h3 className="text-sm font-semibold">{cat.name}</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {cat.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[1fr_140px_140px] items-center gap-4 py-4 sm:grid-cols-[1fr_200px_200px]">
                  <span className="text-sm text-neutral-600">{row.label}</span>
                  <div className="flex justify-center">
                    <FeatureCell value={row.solo} />
                  </div>
                  <div className="flex justify-center">
                    <FeatureCell value={row.crew} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="mt-10 text-center text-xs text-neutral-400">
          Not offered on either plan: CRM integrations, Zapier/Make, public API, multi-agent AI suite, browser
          dialer extension. This answers phones and books jobs for plumbers — that&apos;s the whole product.
        </p>
      </div>
    </section>
  );
}
