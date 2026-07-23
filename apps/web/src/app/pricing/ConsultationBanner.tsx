import { GridTick, PhoneIcon } from "./icons";

export default function ConsultationBanner() {
  return (
    <section className="relative border-t border-neutral-200/80 px-8 py-14">
      <GridTick position="top-left" />
      <GridTick position="top-right" />

      <div className="mx-auto max-w-4xl relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-r from-amber-100/70 via-pink-100/70 via-purple-100/60 to-sky-200/70 p-8 sm:p-12 text-center shadow-lg backdrop-blur-2xl">
        <div className="flex justify-center mb-4">
          <div className="flex items-center -space-x-2">
            <div className="relative h-12 w-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-neutral-200">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Strategy Advisor"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-neutral-900 shadow-md">
              <PhoneIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">Not sure which plan is right for you?</h2>
        <p className="mt-1.5 text-xs sm:text-sm text-neutral-600">Book a free 30-minute AI strategy session.</p>

        <div className="mt-6 flex justify-center">
          <a
            href="/consultation"
            className="inline-flex items-center gap-2 rounded-full bg-[#09090b] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 shadow-md active:scale-[0.99]"
          >
            Book a Free Consultation
            <span className="text-base leading-none">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
