"use client"

import React from "react"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Upload, Check, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormData {
  // Step 1: 서류 업로드
  registrationGap: File | null
  registrationEul: File | null
  // Step 2: 차량 정보
  accident_desc: string
  current_mileage: string
  is_flooded: boolean | null
  issue_details: string
}

const initialFormData: FormData = {
  registrationGap: null,
  registrationEul: null,
  accident_desc: "",
  current_mileage: "",
  is_flooded: null,
  issue_details: "",
}

interface MultiStepFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
}

export function MultiStepForm({ onSubmit, isLoading }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [dragOver, setDragOver] = useState<"gap" | "eul" | null>(null)

  const totalSteps = 2

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleDrop = useCallback((e: React.DragEvent, type: "gap" | "eul") => {
    e.preventDefault()
    setDragOver(null)
    const file = e.dataTransfer.files[0]
    if (file) {
      updateFormData(type === "gap" ? "registrationGap" : "registrationEul", file)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "gap" | "eul") => {
    const file = e.target.files?.[0]
    if (file) {
      updateFormData(type === "gap" ? "registrationGap" : "registrationEul", file)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.registrationGap !== null
      case 2:
        return formData.current_mileage && formData.is_flooded !== null
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (canProceed()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto relative z-10">
      {/* Step Indicator - Editorial Style */}
      <div className="flex items-center justify-center gap-12 mb-16">
        {[1, 2].map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => step < currentStep && setCurrentStep(step)}
            className={cn(
              "relative flex flex-col items-center gap-3 transition-all duration-300",
              step <= currentStep ? "opacity-100" : "opacity-40"
            )}
          >
            <span className={cn(
              "font-serif text-5xl md:text-6xl tracking-tight transition-colors duration-300",
              step === currentStep ? "text-primary" : "text-muted-foreground"
            )}>
              {String(step).padStart(2, '0')}
            </span>
            <span className={cn(
              "text-xs uppercase tracking-[0.2em] font-medium",
              step === currentStep ? "text-primary" : "text-muted-foreground"
            )}>
              {step === 1 ? "서류 업로드" : "차량 정보"}
            </span>
            {step === currentStep && (
              <motion.div
                layoutId="stepIndicator"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Form Card - Glassmorphism */}
      <div className="glass-card rounded-2xl p-8 md:p-12">
        <AnimatePresence mode="wait">
          {/* Step 1: 서류 업로드 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-10"
            >
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4 tracking-tight">
                  등록원부 업로드
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                  자동차 등록원부를 업로드해 주세요. 갑부는 필수이며, 을부는 선택사항입니다.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 갑부 업로드 */}
                <div>
                  <Label className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-4 flex items-center justify-center gap-2">
                    등록원부 (갑) <span className="text-destructive">*</span>
                  </Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver("gap") }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(e, "gap")}
                    className={cn(
                      "border-2 border-dashed rounded-sm p-8 text-center transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col items-center justify-center",
                      dragOver === "gap" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
                      formData.registrationGap && "border-solid border-primary/40 bg-primary/5"
                    )}
                  >
                    <input
                      type="file"
                      id="gap-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "gap")}
                    />
                    <label htmlFor="gap-upload" className="cursor-pointer w-full">
                      {formData.registrationGap ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary break-all px-2">{formData.registrationGap.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateFormData("registrationGap", null) }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-muted-foreground/60" />
                          </div>
                          <div>
                            <span className="text-sm text-foreground font-medium block mb-1">드래그 또는 클릭</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG</span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* 을부 업로드 */}
                <div>
                  <Label className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-4 flex items-center justify-center gap-2">
                    등록원부 (을) <span className="text-muted-foreground/50 text-[10px]">선택</span>
                  </Label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver("eul") }}
                    onDragLeave={() => setDragOver(null)}
                    onDrop={(e) => handleDrop(e, "eul")}
                    className={cn(
                      "border-2 border-dashed rounded-sm p-8 text-center transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col items-center justify-center",
                      dragOver === "eul" ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
                      formData.registrationEul && "border-solid border-primary/40 bg-primary/5"
                    )}
                  >
                    <input
                      type="file"
                      id="eul-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "eul")}
                    />
                    <label htmlFor="eul-upload" className="cursor-pointer w-full">
                      {formData.registrationEul ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                            <Check className="w-6 h-6 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-primary break-all px-2">{formData.registrationEul.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateFormData("registrationEul", null) }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-muted-foreground/60" />
                          </div>
                          <div>
                            <span className="text-sm text-foreground font-medium block mb-1">드래그 또는 클릭</span>
                            <span className="text-xs text-muted-foreground">PDF, JPG, PNG</span>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: 차량 정보 */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-10"
            >
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4 tracking-tight">
                  차량 관련 정보
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                  사고 내용, 주행거리, 침수 여부, 관리 상태를 입력해 주세요.
                </p>
              </div>

              {/* 사고여부 (accident_desc) */}
              <div>
                <Label htmlFor="accident_desc" className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-4 block">
                  사고 내용 <span className="text-muted-foreground/50 text-[10px] normal-case">(선택)</span>
                </Label>
                <Textarea
                  id="accident_desc"
                  placeholder="예: 앞쪽 휀다 1회 교환, 본네뜨 교체, 부분 판금 수리"
                  value={formData.accident_desc}
                  onChange={(e) => updateFormData("accident_desc", e.target.value)}
                  className="bg-transparent border border-muted rounded-sm focus:border-primary focus:ring-0 min-h-[100px] resize-none text-base"
                />
              </div>

              {/* 주행거리 (current_mileage) */}
              <div>
                <Label htmlFor="current_mileage" className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-3 block">
                  주행거리 (km) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="current_mileage"
                  placeholder="예: 26837"
                  type="text"
                  value={formData.current_mileage}
                  onChange={(e) => updateFormData("current_mileage", e.target.value.replace(/[^0-9]/g, ''))}
                  className="h-14 text-xl text-center bg-transparent border-0 border-b-2 border-muted rounded-none focus:border-primary focus:ring-0 placeholder:text-muted-foreground/40"
                />
              </div>

              {/* 침수여부 (is_flooded) - Card Selector */}
              <div>
                <Label className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-4 block">
                  침수 여부 <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: false, label: "침수 없음", sub: "침수 이력이 없습니다" },
                    { value: true, label: "침수 있음", sub: "침수 이력이 있습니다" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => updateFormData("is_flooded", option.value)}
                      className={cn(
                        "p-5 rounded-sm border-2 transition-all duration-200 text-left group",
                        formData.is_flooded === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-transparent hover:border-primary/50"
                      )}
                    >
                      <span className={cn(
                        "text-base font-medium block mb-1",
                        formData.is_flooded === option.value ? "text-primary-foreground" : "text-foreground"
                      )}>{option.label}</span>
                      <span className={cn(
                        "text-xs",
                        formData.is_flooded === option.value ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>{option.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 관리상태 (issue_details) */}
              <div>
                <Label htmlFor="issue_details" className="text-xs uppercase tracking-[0.15em] font-medium text-muted-foreground mb-4 block">
                  관리 상태 <span className="text-muted-foreground/50 text-[10px] normal-case">(선택)</span>
                </Label>
                <Textarea
                  id="issue_details"
                  placeholder="예: 운전석 시트 미세 오염, 뒷좌석 가죽 찢어짐"
                  value={formData.issue_details}
                  onChange={(e) => updateFormData("issue_details", e.target.value)}
                  className="bg-transparent border border-muted rounded-sm focus:border-primary focus:ring-0 min-h-[100px] resize-none text-base"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Clean Editorial */}
        <div className="flex justify-between mt-12 pt-8 border-t border-muted">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-transparent disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm uppercase tracking-[0.1em]">이전</span>
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-8"
            >
              <span className="text-sm uppercase tracking-[0.1em]">다음</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed() || isLoading}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm uppercase tracking-[0.1em]">분석 중</span>
                </>
              ) : (
                <>
                  <span className="text-sm uppercase tracking-[0.1em]">감정 시작</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export type { FormData }
