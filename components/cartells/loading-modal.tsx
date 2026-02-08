"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface LoadingModalProps {
  isOpen: boolean
}

const steps = [
  "등록원부를 분석하고 있습니다",
  "AI가 사고 이력을 대조 중입니다",
  "차량 가치를 정밀 산정 중입니다",
  "리포트를 생성하고 있습니다",
]

export function LoadingModal({ isOpen }: LoadingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0)
      return
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 2500)

    return () => clearInterval(interval)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-lg mx-4 text-center px-8"
          >
            {/* Elegant Minimal Loader */}
            <div className="relative w-20 h-20 mx-auto mb-12">
              {/* Outer circle */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
              />
              {/* Animated arc */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              {/* Center dot */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-2xl md:text-3xl text-primary mb-6 tracking-tight">
              전문 AI가 분석 중입니다
            </h3>

            {/* Current Step */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-muted-foreground text-base mb-10"
              >
                {steps[currentStep]}
              </motion.p>
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="w-full max-w-xs mx-auto">
              <div className="h-[2px] bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-xs text-muted-foreground">{String(currentStep + 1).padStart(2, '0')}</span>
                <span className="text-xs text-muted-foreground">{String(steps.length).padStart(2, '0')}</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground/60 mt-12">
              차량 이력과 서류를 정밀 대조하여 가치를 산정합니다
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
