import { ANATOMY_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function AnatomyTemplate() {
  const base = "bg-brand-base"
  const panel = "bg-brand-panel"
  const white = "text-brand-main"
  const muted = "text-brand-muted"
  const olive = "text-[#A8A555]"

  return (
    <ExportableCarousel title="SCM Anatomy Template (Blueprint)">
      
      {/* Slide 1 - Brutalist Stats */}
      <SlideContainer bgClass={base}>
        {/* Graph Paper Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
             backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 flex flex-col h-full justify-between p-[80px]">
          <div className="flex justify-between items-start border-b-[1px] border-brand-divider pb-6">
            <span className="font-mono font-bold text-[20px] uppercase tracking-[0.3em] text-brand-main bg-brand-panel px-6 py-2 border border-brand-divider">
              {'// '}{ANATOMY_CONTENT.eyebrow}
            </span>
            <img src="/SCM_Logo_SVG.svg" className="h-[70px] w-auto brightness-0 invert opacity-50 block" alt="SCM" />
          </div>

          <div className="flex flex-col gap-10">
             <div className="font-serif italic text-[85px] leading-[1.0] text-brand-main max-w-[80%]">
               {ANATOMY_CONTENT.title}
             </div>
             
             <div className="border-[1px] border-brand-divider bg-brand-panel p-[50px] shadow-2xl relative overflow-hidden group">
               <div className="absolute right-0 top-0 w-[4px] h-full bg-[#A8A555]" />
               <div className="font-mono text-[160px] font-bold text-brand-main leading-[0.8] mb-8 group-hover:text-[#A8A555] transition-colors">
                 {ANATOMY_CONTENT.stat}
               </div>
               <p className="font-sans text-[30px] font-medium text-brand-muted leading-[1.4] max-w-[90%]">
                 {ANATOMY_CONTENT.statContext}
               </p>
             </div>
          </div>

          <div className="flex justify-end pt-8">
             <span className="font-mono text-[22px] uppercase tracking-[0.4em] text-[#A8A555]">
               SWIPE TO EXAMINE &rarr;
             </span>
          </div>
        </div>
      </SlideContainer>

      {/* Slide 2 & 3 - Technical Breakdown */}
      {ANATOMY_CONTENT.pillars.map((pillar, i) => (
        <SlideContainer key={i} bgClass={panel}>
           {/* Blueprint Graph */}
           <div className="absolute inset-0 z-0 opacity-5"
            style={{
               backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
               backgroundSize: '40px 40px'
            }}
           />

           <div className="relative z-10 flex flex-col h-full p-[60px]">
              
              <div className="flex items-center gap-6 mb-16 border-b border-brand-divider pb-8">
                 <div className="bg-[#A8A555]/10 border border-[#A8A555]/30 text-[#A8A555] font-mono text-[32px] px-6 py-3 font-bold uppercase">
                   {pillar.id}
                 </div>
                 <div className="font-mono text-[20px] uppercase text-brand-muted tracking-[0.3em]">
                   STRUCTURAL PILLAR // 0{i+1}
                 </div>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-12 max-w-[800px] ml-10">
                 <div className="font-mono text-[20px] text-[#A8A555] tracking-[0.2em] uppercase border-l-2 border-[#A8A555] pl-4">
                   [{pillar.tag} SECTOR]
                 </div>
                 
                 <h2 className="font-serif italic text-[95px] leading-[0.9] text-brand-main">
                   {pillar.name}.
                 </h2>

                 <div className="border border-brand-divider bg-brand-base p-[40px] relative">
                    {/* Technical corner markers */}
                    <div className="absolute -top-[5px] -left-[5px] w-3 h-3 border-t-2 border-l-2 border-brand-muted" />
                    <div className="absolute -top-[5px] -right-[5px] w-3 h-3 border-t-2 border-r-2 border-brand-muted" />
                    <div className="absolute -bottom-[5px] -left-[5px] w-3 h-3 border-b-2 border-l-2 border-brand-muted" />
                    <div className="absolute -bottom-[5px] -right-[5px] w-3 h-3 border-b-2 border-r-2 border-brand-muted" />
                    
                    <p className="font-sans text-[36px] text-brand-muted leading-[1.4] font-medium">
                      {pillar.desc}
                    </p>
                 </div>
              </div>

              <div className="flex justify-between items-end mt-auto pt-8 border-t border-brand-divider">
                 <img src="/SCM_Logo_SVG.svg" className="h-[60px] w-auto brightness-0 invert opacity-20" alt="SCM" />
                 <span className="font-mono text-[18px] uppercase tracking-[0.4em] text-brand-muted">
                   SCM // 2026 DATA
                 </span>
              </div>
           </div>
        </SlideContainer>
      ))}

      {/* Slide 4 - CTA */}
      <SlideContainer bgClass={base}>
         <div className="flex flex-col h-full justify-center items-center p-[80px] text-center border-[20px] border-brand-panel">
            <img src="/SCM_Logo_SVG.svg" className="h-[140px] w-auto brightness-0 invert opacity-10 mb-16" alt="SCM" />
            
            <h2 className="font-serif italic text-[100px] leading-[0.9] text-brand-main mb-10 w-full">
              Don't guess.<br/>Know.
            </h2>
            
            <div className="bg-brand-main text-brand-base px-10 py-5 font-mono font-bold text-[32px] uppercase tracking-[0.2em] border-b-4 border-[#A8A555] mb-12 shadow-2xl">
              {ANATOMY_CONTENT.action}
            </div>

            <p className="font-mono text-[24px] uppercase tracking-[0.4em] text-[#A8A555]">
               LINK IN BIO.
            </p>
         </div>
      </SlideContainer>

    </ExportableCarousel>
  )
}
