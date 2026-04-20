import { WARNING_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function WarningTemplate() {
  const base = "bg-brand-base"
  const panel = "bg-brand-panel"
  const saffron = "text-brand-saffron"
  const white = "text-brand-main"
  const muted = "text-brand-muted"

  return (
    <ExportableCarousel title="SCM Warning Template (Red Flags)">
      
      {/* Slide 1 - Aggressive Hook */}
      <SlideContainer bgClass={base}>
        <div className="absolute inset-0 bg-brand-base z-0" />
        
        {/* Warning Texture Overlay */}
        <div 
          className="absolute inset-[30px] border-[2px] border-[#E7A63B]/80 z-10 p-[50px] flex flex-col justify-between overflow-hidden"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(231, 166, 59, 0.03) 10px, rgba(231, 166, 59, 0.03) 20px)`
          }}
        >
           {/* Top Header */}
           <div className="flex justify-between items-start border-b-[2px] border-brand-saffron/40 pb-6 w-full">
              <div className="bg-[#E7A63B] text-brand-base px-5 py-2 font-mono font-bold uppercase tracking-[0.3em] flex items-center gap-4">
                 <span className="w-3 h-3 bg-brand-base rounded-full animate-pulse" />
                 {WARNING_CONTENT.eyebrow}
              </div>
              <img src="/SCM_Logo_SVG.svg" className="h-[60px] w-auto brightness-0 invert opacity-40" alt="SCM" />
           </div>

           <div className="my-auto relative z-20">
             <h1 className="font-serif text-[160px] leading-[0.8] tracking-tighter text-[#E7A63B] drop-shadow-2xl uppercase">
                 {WARNING_CONTENT.title.split(" ")[0]}<br/>
                 <span className="italic text-brand-main">{WARNING_CONTENT.title.split(" ")[1]}</span>
             </h1>
             <p className="font-sans text-[38px] font-medium leading-[1.2] text-brand-main mt-10 max-w-[80%] border-l-[4px] border-[#E7A63B] pl-8">
                 {WARNING_CONTENT.subtitle}
             </p>
           </div>

           <div className="flex justify-between items-end border-t-[2px] border-brand-saffron/40 pt-6">
              <span className="font-mono text-[24px] uppercase tracking-[0.4em] text-brand-saffron">
                SWIPE &rarr;
              </span>
           </div>
        </div>
      </SlideContainer>

      {/* Slide 2 & 3 - The Flags */}
      {WARNING_CONTENT.flags.slice(0,2).map((flag, i) => (
        <SlideContainer key={i} bgClass={panel}>
          <div className="flex flex-col h-full border-x-[20px] border-brand-base">
            
            <div className="p-[60px] bg-brand-base border-b-[1px] border-brand-divider relative flex items-center justify-between">
               <div className="font-mono text-[100px] font-bold text-brand-saffron leading-none">
                 {flag.num}
               </div>
               <div className="font-mono text-[20px] uppercase text-brand-muted tracking-[0.4em] text-right">
                 Warning<br/>Indicator
               </div>
            </div>

            <div className="flex-1 bg-brand-panel p-[70px] flex flex-col justify-center relative">
               <div className="absolute right-[50px] top-[50px]">
                  <img src="/SCM_Logo_SVG.svg" className="h-[80px] w-auto brightness-0 invert opacity-[0.05]" alt="SCM" />
               </div>

               <h2 className="font-serif italic text-[70px] leading-[1.0] text-brand-main mb-12 drop-shadow-md">
                 {flag.title}.
               </h2>
               
               <div className="bg-brand-base/50 p-[40px] border-l-[4px] border-brand-saffron shadow-lg">
                 <p className="font-sans text-[32px] leading-[1.4] text-brand-muted">
                   {flag.desc}
                 </p>
               </div>
            </div>

            <div className="h-[20px] bg-[#E7A63B] w-full relative overflow-hidden">
               <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(-45deg, #0B1320, #0B1320 20px, #E7A63B 20px, #E7A63B 40px)`
               }} />
            </div>

          </div>
        </SlideContainer>
      ))}

      {/* Slide 4 - Action */}
      <SlideContainer bgClass={base}>
        <div className="flex flex-col h-full p-[80px] justify-between relative border-[10px] border-[#E7A63B] m-[20px]">
          
          <div className="flex justify-between items-start">
             <img src="/SCM_Logo_SVG.svg" className="h-[90px] w-auto brightness-0 invert opacity-100 drop-shadow-md" alt="SCM" />
          </div>

          <div className="relative z-10 w-full">
            <h1 className="font-serif italic text-[110px] leading-[0.9] text-brand-main mb-10 w-full break-words">
              Don't be a<br/>
              <span className="text-[#E7A63B]">statistic.</span>
            </h1>
            
            <div className="flex flex-col gap-6 w-full">
               <div className="border border-brand-divider bg-brand-panel p-6 w-full text-left font-sans text-[28px] text-brand-main">
                 <span className="text-brand-teal font-mono font-bold mr-4">✓</span> Learn the exact laws.
               </div>
               <div className="border border-brand-divider bg-brand-panel p-6 w-full text-left font-sans text-[28px] text-brand-main">
                 <span className="text-brand-teal font-mono font-bold mr-4">✓</span> Know the verification process.
               </div>
               <div className="border border-brand-divider bg-brand-panel p-6 w-full text-left font-sans text-[28px] text-brand-main">
                 <span className="text-brand-teal font-mono font-bold mr-4">✓</span> Find verified associations.
               </div>
            </div>
          </div>

          <div className="w-full flex items-center justify-between border-t border-brand-divider/50 pt-8 mt-12">
            <div className="bg-[#E7A63B] text-brand-base px-8 py-4 font-mono font-bold text-[24px] uppercase tracking-[0.2em]">
               LINK IN BIO &rarr;
            </div>
            <div className="font-mono text-[18px] uppercase tracking-[0.3em] text-brand-muted">
               STAY SAFE
            </div>
          </div>
        </div>
      </SlideContainer>

    </ExportableCarousel>
  )
}
