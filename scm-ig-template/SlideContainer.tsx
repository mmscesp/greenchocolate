export function SlideContainer({ 
  children, 
  bgClass = "bg-white", 
  className = "",
  style = {}
}: { 
  children: React.ReactNode, 
  bgClass?: string, 
  className?: string,
  style?: React.CSSProperties 
}) {
  return (
    // Outer container reserves just enough space for the scaled down 1080x1080 div (0.45x = 486px)
    <div className="relative w-[386px] h-[386px] shrink-0 overflow-hidden shadow-2xl transition-transform hover:-translate-y-2 hover:shadow-yellow-500/10">
      {/* 
        Inner container is exactly 1080x1080.
        It has scale applied so it fits visually. (0.357x = 386px)
        html2canvas will capture the original dimensions because we pass the innermost div.
      */}
      <div 
        className={`export-slide absolute top-0 left-0 w-[1080px] h-[1080px] origin-top-left scale-[0.357] ${bgClass} ${className} flex flex-col`}
        style={style}
      >
        {children}
      </div>
    </div>
  )
}
