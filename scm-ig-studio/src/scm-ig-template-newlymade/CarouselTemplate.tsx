import { CAROUSEL_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function CarouselTemplate() {
  const base = "bg-brand-base"
  const panel = "bg-brand-panel"
  const white = "text-brand-main"
  const teal = "text-brand-teal"
  const saffron = "text-brand-saffron"
  const muted = "text-brand-muted"

  return (
    <ExportableCarousel title="SCM Agency Carousel Template">
      {/* Slide 1 - Cinematic Hook */}
      <SlideContainer bgClass={base}>
        {/* Treated Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-30 z-0 grayscale"
          style={{ backgroundImage: `url('/BarcelonaGaudiHouse.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-base via-brand-base/80 to-brand-panel-light/30 mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-base via-transparent to-brand-teal/10 z-10 opacity-50" />
        
        {/* Strict Editorial Frame */}
        <div className="absolute inset-[30px] border-[1px] border-brand-divider/80 z-20 flex flex-col p-[50px]">
          
          <div className="flex justify-between items-end border-b-[1px] border-brand-divider/80 pb-6">
            <img 
              src="/SCM_Logo_SVG.svg" 
              className="h-[110px] w-auto brightness-0 invert opacity-100 block drop-shadow-md" 
              alt="SocialClubsMaps" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            {/* Fallback mark in case SVG fails */}
            <span className="hidden font-mono font-bold tracking-[0.3em] uppercase text-brand-main text-[20px] pt-1">
              SocialClubsMaps.com
            </span>
            <span className="font-mono text-[16px] uppercase tracking-[0.3em] text-brand-teal pt-1">
              VOL. 1
            </span>
          </div>
          
          <div className="mt-auto mb-16 flex flex-col gap-10 max-w-[800px]">
            <h1 className="font-serif text-[130px] leading-[0.85] tracking-tight text-brand-main">
              {CAROUSEL_CONTENT[0].title.split(" ")[0]}<br/>
              <span className="italic text-brand-saffron">{CAROUSEL_CONTENT[0].title.split(" ")[1]}.</span>
            </h1>
            <div className="space-y-4 max-w-[650px] border-l-[3px] border-brand-teal pl-8">
              {CAROUSEL_CONTENT[0].body?.map((line, i) => (
                <p key={i} className={`font-sans font-medium text-[34px] leading-[1.3] tracking-tight ${i === 2 ? white : muted}`}>
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-end border-t-[1px] border-brand-divider/80 pt-6 mt-auto">
            <p className={`font-sans font-medium text-[24px] ${muted}`}>
              {CAROUSEL_CONTENT[0].footnote}
            </p>
            <div className="bg-brand-saffron text-brand-base px-6 py-3 font-mono font-bold text-[18px] uppercase tracking-[0.2em] relative overflow-hidden group">
              <span className="relative z-10">SWIPE &rarr;</span>
            </div>
          </div>
        </div>
      </SlideContainer>

      {/* Slide 2 - Reality Check (Split Design) */}
      <SlideContainer bgClass={base}>
        <div className="absolute inset-0 flex">
          <div className="w-[15%] h-full border-r-[1px] border-brand-divider relative">
             <div className="absolute bottom-[50px] -left-[140px] -rotate-90 font-mono text-[20px] uppercase tracking-[0.4em] text-brand-muted whitespace-nowrap">
               {"// REALITY CHECK"}
             </div>
          </div>
          <div className="w-[85%] h-full bg-brand-panel relative">
             <div className="absolute inset-x-0 top-[25%] h-[1px] bg-brand-divider" />
             <div className="absolute inset-x-0 bottom-[20%] h-[1px] bg-brand-divider" />
          </div>
        </div>

        <div className={`relative z-10 flex flex-col justify-center h-full p-[80px] ${white} ml-[5%]`}>
          <div className="absolute top-[75px] right-[70px] z-20">
            <img src="/SCM_Logo_SVG.svg" className="h-[85px] w-auto brightness-0 invert opacity-[0.15]" alt="SCM" />
          </div>

          <div className={`font-mono text-[22px] font-bold uppercase tracking-[0.2em] ${saffron} mb-12`}>
            {CAROUSEL_CONTENT[1].eyebrow}
          </div>
          
          <h1 className="font-serif text-[115px] leading-[0.9] tracking-tighter mb-16 relative -ml-[10%] drop-shadow-2xl">
            <span className="bg-brand-base px-4">Barcelona</span><br/>
            <span className={`italic ${teal} bg-brand-base px-4 leading-[1.1]`}>is not</span><br/>
            <span className="bg-brand-base px-4">Amsterdam.</span>
          </h1>

          <div className="space-y-6 max-w-[700px] border-l-[3px] border-brand-saffron pl-10 ml-8">
            {CAROUSEL_CONTENT[1].body?.slice(1).map((line, i) => (
              <p key={i} className={`font-sans text-[36px] font-medium leading-[1.3] ${
                i === CAROUSEL_CONTENT[1].body!.slice(1).length - 1 ? saffron : muted
              }`}>
                {line}
              </p>
            ))}
          </div>
        </div>
        
        {/* Footer Meta */}
        <div className="absolute bottom-[40px] right-[50px] font-mono text-[18px] uppercase tracking-[0.3em] text-brand-muted z-20">
          SCM // 02
        </div>
      </SlideContainer>

      {/* Slide 3 - Architecture Grid */}
      <SlideContainer bgClass={base}>
        <div className={`flex flex-col h-full ${white} overflow-hidden relative`}>
           <div className="p-[70px] pb-10 bg-brand-panel">
            <h1 className="font-serif text-[72px] leading-[1.0] tracking-tight mb-4 uppercase">
               {CAROUSEL_CONTENT[2].title.split(" ")[0]} {CAROUSEL_CONTENT[2].title.split(" ")[1]}<br/>
              <span className="italic text-brand-teal lowercase">actually</span> are.
            </h1>
            <p className={`font-sans font-medium text-[28px] leading-snug ${muted}`}>
              {CAROUSEL_CONTENT[2].subtitle}
            </p>
            {/* Subtle logo */}
            <img src="/SCM_Logo_SVG.svg" className="absolute top-[65px] right-[70px] h-[100px] w-auto opacity-30 brightness-0 invert" alt="SCM" />
          </div>
          
          <div className="flex-1 flex flex-col border-t-[1px] border-brand-divider">
             {CAROUSEL_CONTENT[2].list?.map((item, i) => (
              <div key={i} className="flex-1 flex border-b-[1px] border-brand-divider last:border-0 group">
                 <div className="w-[140px] flex items-center justify-center border-r-[1px] border-brand-divider bg-brand-base">
                    <span className="font-mono font-bold text-[48px] text-brand-teal group-hover:text-brand-saffron transition-colors">
                      0{i+1}
                    </span>
                 </div>
                 <div className="flex-1 flex flex-col justify-center px-[50px] py-[30px] bg-brand-panel/30">
                   <h3 className="font-serif italic text-[38px] tracking-tight mb-2 leading-none text-brand-main">{item.head}</h3>
                   <p className={`font-sans text-[24px] leading-[1.35] ${muted}`}>
                      {item.desc}
                   </p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </SlideContainer>

      {/* Slide 4 - The Conflict Matrix */}
      <SlideContainer bgClass={base}>
        <div className={`flex flex-col h-full ${white} relative`}>
          {/* Background Structural Lines */}
          <div className="absolute left-[35%] top-0 bottom-0 w-[1px] bg-brand-divider/50 z-0" />
          <div className="absolute right-[10%] top-0 bottom-0 w-[1px] bg-brand-divider/50 z-0" />

          <div className="p-[70px] pb-12 relative z-10 border-b-[1px] border-brand-divider bg-brand-base flex justify-between items-start">
            <h1 className="font-serif text-[84px] leading-[0.95] tracking-tight">
              Why people<br/>
              <span className="italic text-brand-saffron">get this wrong.</span>
            </h1>
            <img src="/SCM_Logo_SVG.svg" className="h-[90px] w-auto brightness-0 invert opacity-20 mt-2" alt="SCM" />
          </div>

          <div className="flex-1 relative z-10 flex flex-col justify-center py-[20px]">
            {CAROUSEL_CONTENT[3].list?.map((item, i) => (
               <div key={i} className={`flex items-center group relative h-[160px]`}>
                  {/* The Line connecting left to right */}
                  <div className="absolute left-0 w-full h-[1px] bg-brand-divider top-1/2 -z-10 group-hover:bg-brand-saffron/30" />
                  
                  <div className={`w-[35%] pl-[70px] pr-[30px] bg-brand-base py-4`}>
                    <div className={`font-mono font-bold text-[24px] uppercase tracking-[0.2em] px-4 py-2 inline-block border-[1px] 
                      ${i === 2 ? 'border-brand-saffron text-brand-saffron badge-pulse' : 'border-brand-teal text-brand-teal'}`}>
                      {item.head}
                    </div>
                  </div>
                  
                  <div className="w-[55%] bg-brand-panel p-[30px] rounded-sm border-[1px] border-brand-divider shadow-xl relative top-2">
                     <p className={`font-sans text-[24px] leading-[1.4] ${white}`}>
                      {item.desc}
                    </p>
                  </div>
               </div>
            ))}
          </div>

          <div className="p-[60px] pt-[40px] mt-auto border-t-[1px] border-brand-divider bg-brand-base relative z-10 flex items-center justify-between">
             <p className={`font-serif italic text-[36px] leading-[1.1] ${white}`}>
                Context matters.
             </p>
             <p className={`font-mono text-[20px] uppercase tracking-[0.2em] ${muted}`}>
                SCM // 04
             </p>
          </div>
        </div>
      </SlideContainer>

      {/* Slide 5 - The Audit Layout */}
      <SlideContainer bgClass={panel}>
         <div className={`flex flex-col h-full ${white} overflow-hidden border-[20px] border-brand-base`}>
          <div className="px-[60px] py-[50px] flex justify-between items-start border-b-[1px] border-brand-divider bg-brand-base">
             <h1 className="font-serif text-[72px] leading-[1.0] tracking-tight">
              So what does<br/>SCM <span className="italic text-brand-teal">check?</span>
             </h1>
             <div className="w-[100px] h-[100px] border-[1px] border-brand-teal rounded-full flex flex-col items-center justify-center shrink-0">
                <span className="font-mono text-[28px] font-bold text-brand-teal leading-none">04</span>
                <span className="font-mono text-[12px] uppercase text-brand-teal tracking-widest mt-1">Things</span>
             </div>
          </div>

          <div className="grid grid-cols-2 grid-rows-2 flex-1 relative bg-brand-divider gap-[1px]">
            {CAROUSEL_CONTENT[4].list?.map((item, i) => (
              <div key={i} className="bg-brand-panel p-[45px] flex flex-col justify-between">
                 <div className="flex justify-between items-start mb-6 w-full">
                   <h3 className="font-serif italic text-[32px] text-brand-main leading-[1.1] max-w-[80%]">{item.head}</h3>
                   <span className="font-mono font-bold text-brand-muted text-[20px] pt-1">0{i+1}</span>
                 </div>
                 <p className="font-sans text-[22px] text-brand-muted leading-[1.4]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="px-[60px] py-[30px] border-t-[1px] border-brand-divider bg-brand-base flex justify-between items-center relative z-10">
             <div className={`font-mono uppercase tracking-[0.2em] text-[20px] font-bold ${saffron}`}>
               {CAROUSEL_CONTENT[4].closing}
             </div>
             <img src="/SCM_Logo_SVG.svg" className="h-[70px] w-auto brightness-0 invert opacity-[0.15]" alt="SCM" />
          </div>
        </div>
      </SlideContainer>

      {/* Slide 6 - Pure Editorial Typography Layout */}
      <SlideContainer bgClass={base}>
        {/* Abstract watermark corner logo */}
        <div className="absolute -right-[150px] top-[20%] opacity-[0.04] pointer-events-none z-0">
          <img src="/SCM_Logo_SVG.svg" className="w-[900px] h-auto brightness-0 invert" alt="" />
        </div>

        <div className={`flex flex-col h-full ${white} relative z-10 p-[70px] justify-between`}>
          <div className="w-full flex justify-between items-start border-b-[1px] border-brand-divider/80 pb-6">
             <span className="font-mono font-bold text-[18px] uppercase tracking-[0.3em] text-brand-teal bg-brand-teal/10 px-6 py-3 border-[1px] border-brand-teal/30 mt-2">
               RESOURCE // KIT
             </span>
             <img src="/SCM_Logo_SVG.svg" className="h-[75px] w-auto brightness-0 invert opacity-90 block" alt="SCM" />
          </div>

          <div className="my-auto">
            <h1 className="font-serif italic text-[130px] leading-[0.9] tracking-tight text-brand-main mb-16 border-l-[4px] border-brand-saffron pl-12 -ml-[4px]">
               Get the<br/>Safety Kit.
            </h1>
            
            {/* Outline list mapped from content */}
            <div className="space-y-8 pl-[52px]">
               {CAROUSEL_CONTENT[5].inside?.slice(0,3).map((item, idx) => (
                 <div key={idx} className="font-sans text-[34px] font-medium leading-[1.3] text-brand-main flex items-center gap-6">
                    <span className="font-mono font-bold text-[26px] text-brand-teal">0{idx+1} /</span>
                    {item}
                 </div>
               ))}
            </div>
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
             <p className="font-mono text-[22px] text-brand-muted uppercase tracking-[0.4em] pr-2">
               Free Forever.
             </p>
          </div>
        </div>
      </SlideContainer>

    </ExportableCarousel>
  )
}
