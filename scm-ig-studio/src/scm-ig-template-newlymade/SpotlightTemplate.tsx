import { SPOTLIGHT_CONTENT } from "./content"
import { SlideContainer } from "./SlideContainer"
import { ExportableCarousel } from "./ExportableCarousel"

export function SpotlightTemplate() {
  const base = "bg-brand-base"
  const panel = "bg-brand-panel"
  const white = "text-brand-main"
  const teal = "text-brand-teal"
  const saffron = "text-brand-saffron"
  const muted = "text-brand-muted"

  return (
    <ExportableCarousel title="SCM Spotlight Template (Listicle)">
      
      {/* Slide 1 - Title */}
      <SlideContainer bgClass={base}>
        <div className="relative h-full flex flex-col overflow-hidden">
          {/* Arch Image Frame */}
          <div className="absolute right-0 top-0 w-2/3 h-[70%] bg-brand-panel border-l-[1px] border-b-[1px] border-brand-divider rounded-bl-[150px] overflow-hidden -mr-[1px] -mt-[1px]">
             <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-40 grayscale"
              style={{ backgroundImage: `url('/BarcelonaGaudiHouse.jpg')` }}
            />
          </div>

          <div className="relative z-10 p-[70px] flex-1 flex flex-col justify-end pointer-events-none">
            <div className="bg-brand-base/90 p-[40px] pl-[50px] border-[1px] border-brand-divider w-[85%] backdrop-blur-md rounded-tr-[60px] shadow-2xl inline-block -mb-[20px] pointer-events-auto">
              <span className="font-mono font-bold text-[20px] uppercase tracking-[0.3em] text-brand-saffron mb-6 block">
                {SPOTLIGHT_CONTENT.eyebrow}
              </span>
              <h1 className="font-serif text-[90px] leading-[0.95] tracking-tight text-brand-main mb-6">
                A closer<br/>
                <span className="italic text-brand-teal">look at Gràcia</span>
              </h1>
              <p className="font-sans text-[28px] font-medium leading-[1.3] text-brand-muted max-w-[90%]">
                {SPOTLIGHT_CONTENT.subtitle}
              </p>
            </div>
          </div>
          
          <img src="/SCM_Logo_SVG.svg" className="absolute top-[50px] left-[50px] h-[75px] w-auto brightness-0 invert opacity-90 z-20" alt="SCM" />
        </div>
      </SlideContainer>

      {/* Repeating Club Slides */}
      {SPOTLIGHT_CONTENT.clubs.map((club, idx) => (
        <SlideContainer key={club.id} bgClass={base}>
          <div className="flex flex-col h-full border-[30px] border-brand-panel">
            <div className="flex justify-between items-start p-[50px] border-b-[1px] border-brand-divider">
               <h2 className="font-serif italic text-[64px] leading-none text-brand-main max-w-[80%]">
                 {club.name}
               </h2>
               <div className="font-mono text-[60px] font-bold text-brand-teal leading-none -mt-3">
                 {club.id}
               </div>
            </div>
            
            <div className="flex-1 relative bg-brand-base p-[50px] flex flex-col justify-center">
              <div className="absolute right-[50px] top-[40px]">
                 <img src="/SCM_Logo_SVG.svg" className="h-[50px] w-auto brightness-0 invert opacity-10" alt="SCM" />
              </div>
               <p className="font-sans text-[36px] font-medium leading-[1.4] text-brand-main border-l-[3px] border-brand-saffron pl-10 mb-12">
                 "{club.desc}"
               </p>
               
               <div className="mt-auto">
                 <span className="font-mono text-[16px] text-brand-muted uppercase tracking-widest block mb-3">
                   VIBE CHECK
                 </span>
                 <div className="inline-block px-6 py-3 border-[1px] border-brand-divider bg-brand-panel font-sans text-[24px] text-brand-main shadow-lg">
                   {club.vibe}
                 </div>
               </div>
            </div>
          </div>
        </SlideContainer>
      ))}

      {/* Final Call to Action */}
      <SlideContainer bgClass={panel}>
         <div className="flex flex-col h-full p-[80px] justify-center items-center text-center relative border-[20px] border-brand-base">
           <img src="/SCM_Logo_SVG.svg" className="h-[120px] w-auto brightness-0 invert opacity-20 mb-16" alt="SCM" />
           
           <h2 className="font-serif text-[85px] leading-none text-brand-main mb-8">
             Explore Safely.
           </h2>
           
           <div className="bg-brand-teal px-8 py-4 font-mono font-bold text-[30px] uppercase tracking-[0.2em] text-brand-base mb-12 shadow-xl shadow-brand-teal/20">
             {SPOTLIGHT_CONTENT.action}
           </div>

           <div className="font-mono text-[22px] tracking-widest text-[#E7A63B] uppercase">
              LINK IN BIO
           </div>
         </div>
      </SlideContainer>

    </ExportableCarousel>
  )
}
