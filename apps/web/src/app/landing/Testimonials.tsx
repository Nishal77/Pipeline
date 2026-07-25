import React from "react";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    quote: "I can DEFINITELY recommend PipeLine for EVERY local service business. It catches the emergency calls instantly, dispatches our plumbers, and books jobs directly in the calendar. It has completely paid for itself.",
    name: "Marcus Vance",
    role: "Owner, Vance Plumbing & Drain",
    initials: "MV"
  },
  {
    quote: "We used to lose 3-4 calls a day because we were out on site under houses or crawling in attics. PipeLine handles everything — now we don't miss a single job.",
    name: "Dave Miller",
    role: "Owner, Dave's HVAC & AC",
    initials: "DM"
  },
  {
    quote: "Emergency calls at 2 AM used to wake me up. Now, PipeLine answers, filters out the non-emergencies, and only rings my phone if it's a real lock-out. I finally sleep through the night.",
    name: "Kevin Torres",
    role: "CEO, Elite Lock & Key",
    initials: "KT"
  },
  {
    quote: "No dead air, no robotic answers. It sounds like an experienced receptionist who knows our pricing by heart. Our customers don't even realize they're talking to an AI.",
    name: "Sarah Jenkins",
    role: "Ops Manager, Jenkins Electrical",
    initials: "SJ"
  },
  {
    quote: "Before PipeLine, I'd be hanging a garage door and have to choose between letting a lead go to voicemail or dropping my tools. Now, it books them immediately. Absolute game-changer.",
    name: "Tom Henderson",
    role: "Founder, Henderson Garage Doors",
    initials: "TH"
  },
  {
    quote: "Customer called at 9 PM on a Sunday. PipeLine answered, checked our service area, quoted our basic cleanup rate, and booked Tuesday. Woke up to a new customer without lifting a finger.",
    name: "Rachel Green",
    role: "Owner, Green Gardens Landscaping",
    initials: "RG"
  }
];

// Reordered list for the second marquee to offset starting positions
const REORDERED_DATA: TestimonialItem[] = [
  ...TESTIMONIALS_DATA.slice(3),
  ...TESTIMONIALS_DATA.slice(0, 3)
];

interface ProfileProps {
  name: string;
  role: string;
  initials: string;
}

function Profile({ name, role, initials }: ProfileProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar Circle */}
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold border bg-neutral-100 border-neutral-200 text-neutral-600">
        {initials}
      </div>

      {/* Text Info */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold tracking-tight text-neutral-900">
            {name}
          </span>
          {/* Verified Badge */}
          <svg
            className="w-3.5 h-3.5 text-sky-500 fill-current shrink-0"
            viewBox="0 0 24 24"
            aria-label="Verified user"
          >
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <span className="text-[10px] text-neutral-500 font-medium">
          {role}
        </span>
      </div>
    </div>
  );
}

interface CardProps {
  item: TestimonialItem;
}

function Card({ item }: CardProps) {
  return (
    <div className="w-[360px] shrink-0 bg-white border border-neutral-200/60 p-6 rounded-2xl flex flex-col justify-between h-[220px]">
      <span className="text-neutral-300 text-5xl font-serif text-left select-none -mt-3">“</span>
      <p className="text-sm font-normal text-neutral-700 leading-relaxed text-left -mt-3 flex-1 overflow-hidden line-clamp-3">
        {item.quote}
      </p>
      <div className="border-t border-neutral-100 pt-3.5 mt-3">
        <Profile
          name={item.name}
          role={item.role}
          initials={item.initials}
        />
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative w-full bg-[#FBFBFA] pt-20 sm:pt-24 overflow-hidden flex flex-col items-center text-center">

      {/* Inject custom keyframe marquee animations inline */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 55s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 55s linear infinite;
        }
      ` }} />

      {/* Header Container */}
      <div className="px-6 sm:px-12 max-w-3xl flex flex-col items-center">
        {/* Eyebrow badge with corner ticks */}
        <span className="inline-flex items-center px-4 py-1.5 rounded-md text-xl font-normal tracking-tight text-lime-600 select-none">
          Testimonials
        </span>

        {/* Heading */}
        <h2 className="text-3xl font-normal tracking-tighter text-neutral-900 sm:text-5xl mt-4 leading-tight select-none">
          They didn&apos;t hire a  <span className="bg-[#FAFB86] text-neutral-900 px-2 rounded-sm inline-block">receptionist</span>They hired this.
        </h2>
      </div>

      {/* Gray container spanning edge-to-edge with double row marquee */}
      <div className="mt-16 w-full bg-neutral-100/40 py-10 overflow-hidden flex flex-col gap-4">

        {/* Row 1: Moving Left */}
        <div className="w-full flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] -my-2">
          <div className="flex gap-6 py-2 animate-marquee-left shrink-0">
            {/* Set 1 */}
            {TESTIMONIALS_DATA.map((item, idx) => (
              <Card key={`r1-1-${idx}`} item={item} />
            ))}
            {/* Set 2 (duplication) */}
            {TESTIMONIALS_DATA.map((item, idx) => (
              <Card key={`r1-2-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Row 2: Moving Right */}
        <div className="w-full flex overflow-hidden select-none [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)] -my-2">
          <div className="flex gap-6 py-2 animate-marquee-right shrink-0">
            {/* Set 1 */}
            {REORDERED_DATA.map((item, idx) => (
              <Card key={`r2-1-${idx}`} item={item} />
            ))}
            {/* Set 2 (duplication) */}
            {REORDERED_DATA.map((item, idx) => (
              <Card key={`r2-2-${idx}`} item={item} />
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
