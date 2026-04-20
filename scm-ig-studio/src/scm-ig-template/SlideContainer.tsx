export function SlideContainer({ 
  children, 
  bgClass = "bg-white", 
  className = "",
  style = {},
  format = "square"
}: { 
  children: React.ReactNode, 
  bgClass?: string, 
  className?: string,
  style?: React.CSSProperties,
  format?: "square" | "portrait"
}) {
  const isPortrait = format === "portrait";
  const hPX = isPortrait ? 1350 : 1080;
  const outerH = isPortrait ? 482 : 386; // 1350 * 0.357 vs 1080 * 0.357

  return (
    // Outer container reserves just enough space for the scaled down div
    <div 
      className="relative w-[386px] shrink-0 overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 hover:shadow-teal-500/10"
      style={{ height: outerH }}
    >
      {/* 
        Inner container is exactly 1080x1080 or 1080x1350.
        It has scale applied so it fits visually. (0.357x = 386px wide)
      */}
      <div 
        className={`export-slide absolute top-0 left-0 w-[1080px] origin-top-left scale-[0.357] ${bgClass} ${className} flex flex-col`}
        style={{ height: hPX, ...style }}
      >
        {children}
      </div>
    </div>
  )
}
