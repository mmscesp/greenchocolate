import { STATEMENT_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function StatementPost() {
  const base = "bg-brand-base"
  
  return (
    // Single post container using the portrait 4:5 ratio setting
    <ExportableCarousel title="SCM Single Statement (4:5 Ratio)">
      <SlideContainer bgClass={base} format="portrait">
        
        {/* Deep immersive background */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-[0.15] grayscale"
            style={{ backgroundImage: `url('/BarcelonaGaudiHouse.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-base via-brand-panel to-brand-panel-light mix-blend-multiply opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-teal/20 via-transparent to-transparent opacity-40" />
        </div>

        {/* Massive Watermark */}
        <div className="absolute -left-[300px] -bottom-[200px] z-10 opacity-[0.03] pointer-events-none">
           <img src="/SCM_Logo_SVG.svg" className="h-[1200px] w-auto brightness-0 invert" alt="" />
        </div>

        <div className="relative z-20 flex flex-col h-full p-[90px] justify-between">
          
          <div className="flex justify-between items-start border-b-[1px] border-brand-divider/50 pb-8">
            <span className="font-mono font-bold text-[24px] uppercase tracking-[0.3em] text-brand-saffron">
              {'// DATA POINT'}
            </span>
            <img src="/SCM_Logo_SVG.svg" className="h-[90px] w-auto brightness-0 invert opacity-100 drop-shadow-md" alt="SCM" />
          </div>

          <div className="my-auto relative">
             <div className="absolute -left-[60px] -top-[60px] font-serif text-[300px] leading-none text-brand-teal opacity-20 select-none">
               "
             </div>
             <p className="font-serif italic text-[110px] leading-[1.0] text-brand-main drop-shadow-2xl relative z-10">
               {STATEMENT_CONTENT.quote}
             </p>
          </div>

          <div className="flex flex-col items-end border-t-[1px] border-brand-divider/50 pt-10">
             <span className="font-mono font-bold text-[32px] tracking-[0.2em] text-brand-main/90 mb-4 bg-brand-panel px-6 py-3 border border-brand-divider">
               {STATEMENT_CONTENT.cta}
             </span>
             <p className="font-mono text-[24px] text-[#E7A63B] uppercase tracking-[0.4em] pr-2">
               SOCIALCLUBMAPS.COM
             </p>
          </div>

        </div>

      </SlideContainer>
    </ExportableCarousel>
  )
}
