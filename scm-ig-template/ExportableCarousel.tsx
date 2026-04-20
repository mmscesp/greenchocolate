import React, { useRef, useState } from "react"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export function ExportableCarousel({ 
  title, 
  children 
}: { 
  title: string
  children: React.ReactNode 
}) {
  const [exporting, setExporting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (!containerRef.current) return
    setExporting(true)
    
    try {
      const slides = Array.from(containerRef.current.querySelectorAll('.export-slide')) as HTMLElement[]
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [1080, 1080]
      })

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i]
        
        // Temporarily remove transform so html2canvas renders the true 1080x1080 resolution
        slide.classList.remove('scale-[0.357]')
        slide.classList.add('scale-100')

        // Wait a tick for DOM to apply style
        await new Promise(r => setTimeout(r, 50))

        const canvas = await html2canvas(slide, {
          scale: 2, 
          useCORS: true,
          logging: false,
          width: 1080,
          height: 1080,
          windowWidth: 1080,
          windowHeight: 1080
        })
        
        // Restore
        slide.classList.remove('scale-100')
        slide.classList.add('scale-[0.357]')

        const imgData = canvas.toDataURL('image/jpeg', 0.95)
        
        if (i > 0) {
          pdf.addPage([1080, 1080], 'portrait')
        }
        
        pdf.addImage(imgData, 'JPEG', 0, 0, 1080, 1080)
      }

      pdf.save(`${title.replace(/\s+/g, '-').toLowerCase()}.pdf`)
    } catch (e) {
      console.error(e)
      alert("Failed to export. Please try again.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center px-4">
        <h2 className="text-2xl font-serif text-white tracking-wide">{title}</h2>
        <button 
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 bg-[#FAF8F5] text-[#08121f] px-6 py-2 rounded-full font-sans font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Download size={16} />
          {exporting ? "Generating PDF..." : "Export to PDF"}
        </button>
      </div>

      <div className="p-4 overflow-x-auto custom-scrollbar pt-8">
        <div 
          ref={containerRef}
          className="flex gap-8 w-max pl-4"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
