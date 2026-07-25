export default function SectionDivider() {
  return (
    <div className="relative w-full h-[32px]" aria-hidden="true">
      {/* Top horizontal line running full viewport width */}
      <div className="absolute top-0 left-0 right-0 border-t border-neutral-200/80"></div>
      {/* Bottom horizontal line running full viewport width */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-neutral-200/80"></div>
      
      {/* Central content boundaries mapping vertical lines */}
      <div className="relative mx-auto max-w-7xl h-full border-l border-r border-border">
        {/* Yellow accent block extending from the right vertical line to the right edge of the viewport */}
        <div className="absolute left-full top-0 bottom-0 w-[100vw] bg-[#FAFB86] border-t border-b border-neutral-200/80"></div>
      </div>
    </div>
  );
}
