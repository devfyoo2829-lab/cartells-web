"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Download, Share2, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResultModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string | null
}

export function ResultModal({ isOpen, onClose, imageUrl }: ResultModalProps) {
  const handleDownloadImage = () => {
    if (!imageUrl) return
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `Cartells_Appraisal_Report_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const handleSaveAsPdf = () => {
    if (!imageUrl) return
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Cartells 감정 리포트</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
            @media print {
              body { margin: 0; }
              img { width: 100%; height: auto; }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="setTimeout(()=>{window.print();window.close();},300)" />
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleShare = async () => {
    if (imageUrl && navigator.share) {
      try {
        await navigator.share({
          title: "Cartells 차량 감정 리포트",
          text: "AI 기반 차량 정밀 감정 결과입니다.",
          url: imageUrl,
        })
      } catch (err) {
        console.log("Share failed:", err)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-center mb-8"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-primary mb-2 tracking-tight">
                AI 정밀 감정 리포트
              </h2>
              <p className="text-muted-foreground text-sm">
                분석이 완료되었습니다
              </p>
            </motion.div>

            {/* Image Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-auto"
            >
              {imageUrl ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="차량 감정 리포트"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl border"
                />
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  리포트를 불러오는 중...
                </div>
              )}
            </motion.div>

            {/* Footer Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 mt-8"
            >
              {imageUrl && (
                <>
                  <Button
                    onClick={handleSaveAsPdf}
                    className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm"
                  >
                    <FileDown className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-[0.1em]">PDF로 저장하기</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 rounded-sm border-muted hover:border-primary bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-[0.1em]">이미지 저장</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex items-center gap-2 rounded-sm border-muted hover:border-primary bg-transparent"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm uppercase tracking-[0.1em]">공유</span>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={onClose}
                className="flex items-center gap-2 rounded-sm border-muted hover:border-primary bg-transparent"
              >
                <span className="text-sm uppercase tracking-[0.1em]">닫기</span>
              </Button>
            </motion.div>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-xs text-muted-foreground/60 mt-6 text-center"
            >
              본 리포트는 AI 분석 결과이며, 실제 차량 상태와 다를 수 있습니다.
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
