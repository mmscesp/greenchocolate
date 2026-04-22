import { COMPARISON_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function ComparisonTemplate() {
  const base = "bg-brand-base"
  const panel = "bg-brand-panel"
  const white = "text-brand-main"
  const teal = "text-brand-teal"
  const saffron = "text-brand-saffron"
  const muted = "text-brand-muted"

  return (
    <ExportableCarousel title="SCM Comparison Template (Myth vs Fact)">
      
      {/* Slide 1 - Split Title */}
      <SlideContainer bgClass={base}>
        <div className="absolute inset-0 flex flex-col">
          <div className="h-1/2 bg-brand-panel relative flex items-center justify-center p-[80px]">
            <h1 className="font-serif text-[120px] leading-none text-brand-main z-10 drop-shadow-2xl">
              Reality
            </h1>
            <div className="absolute bottom-[20px] left-[50px] font-mono text-[20px] tracking-widest text-[#E7A63B]">
              {'// EXPECTATION'}
            </div>
          </div>
          <div className="h-1/2 bg-brand-base relative flex items-center justify-center p-[80px]">
            <h1 className="font-serif italic text-[120px] leading-none text-brand-teal z-10 drop-shadow-2xl">
              Rumor
            </h1>
            <div className="absolute top-[20px] right-[50px] font-mono text-[20px] tracking-widest text-brand-teal">
              REALITY //
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] rounded-full border-[1px] border-brand-divider bg-brand-base z-20 flex items-center justify-center shadow-xl">
            <span className="font-serif italic text-[50px] text-brand-main">VS</span>
          </div>

          {/* Logo */}
          <div className="absolute top-[50px] right-[50px] z-30">
            <img src="/SCM_Logo_SVG.svg" className="h-[70px] w-auto brightness-0 invert opacity-20" alt="SCM" />
          </div>
        </div>
      </SlideContainer>

      {/* Slide 2 - The Contrast Layout */}
      <SlideContainer bgClass={panel}>
        <div className="flex flex-col h-full border-[20px] border-brand-base">
          
          <div className="flex-1 flex flex-col justify-center px-[80px] border-b-[1px] border-brand-divider relative bg-brand-base">
            <div className="absolute top-[40px] left-[40px] px-6 py-2 border border-brand-saffron/40 font-mono text-[18px] text-brand-saffron uppercase font-bold tracking-[0.2em] bg-brand-saffron/5">
              {COMPARISON_CONTENT.myth.head}
            </div>
            
            <p className="font-sans text-[36px] font-medium leading-[1.3] text-brand-muted mt-12">
              "{COMPARISON_CONTENT.myth.body}"
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center px-[80px] relative bg-brand-panel">
             <div className="absolute top-[40px] left-[40px] px-6 py-2 border border-brand-teal/40 font-mono text-[18px] text-brand-teal uppercase font-bold tracking-[0.2em] bg-brand-teal/5">
              {COMPARISON_CONTENT.fact.head}
            </div>

            <p className="font-sans text-[38px] font-medium leading-[1.3] text-brand-main mt-12 bg-left-bottom bg-gradient-to-r from-brand-teal to-brand-teal bg-[length:100%_2px] bg-no-repeat pb-1">
              "{COMPARISON_CONTENT.fact.body}"
            </p>
          </div>
        </div>
      </SlideContainer>

      {/* Slide 3 - Takeaway */}
      <SlideContainer bgClass={base}>
        <div className="flex flex-col h-full justify-between p-[80px] relative">
          <div className="w-full flex justify-between items-start border-b-[1px] border-brand-divider/80 pb-6">
             <span className="font-mono font-bold text-[18px] uppercase tracking-[0.3em] text-brand-saffron">
               THE TAKEAWAY
             </span>
             <img src="/SCM_Logo_SVG.svg" className="h-[60px] w-auto brightness-0 invert opacity-50 block" alt="SCM" />
          </div>

          <div>
             <h2 className="font-serif italic text-[80px] leading-[1.0] text-brand-main drop-shadow-lg relative z-10 mb-8 border-l-[4px] border-brand-teal pl-10 -ml-1">
               {COMPARISON_CONTENT.takeaway}
             </h2>
          </div>

          <div className="flex flex-col items-end pt-12 border-t-[1px] border-brand-divider/80">
             <div className="flex items-center gap-6 group mb-3">
                <span className="font-mono font-bold text-[38px] tracking-[0.2em] text-brand-main/90">
                  [ LINK IN BIO ]
                </span>
                <span className="font-serif italic text-[60px] leading-none text-brand-saffron">
                  &rarr;
                </span>
             </div>
          </div>
        </div>
      </SlideContainer>

    </ExportableCarousel>
  )
}
