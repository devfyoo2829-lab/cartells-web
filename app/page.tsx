"use client"

import React, { useState, useRef } from "react"
import { MultiStepForm, type FormData as FormDataType } from "@/components/cartells/multi-step-form"
import { LoadingModal } from "@/components/cartells/loading-modal"
import { ResultModal } from "@/components/cartells/result-modal"
import { motion } from "framer-motion"
import { ArrowDown, FileText, Shield, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const formRef = useRef<HTMLElement>(null)
  const blobUrlRef = useRef<string | null>(null)

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (data: FormDataType) => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // FormData(multipart)로 PDF 파일 + 텍스트 데이터를 함께 전송
      const formPayload = new FormData()

      // 차량 관련 정보
      formPayload.append("current_mileage", data.current_mileage)
      formPayload.append("accident_desc", data.accident_desc)
      formPayload.append("is_flooded", String(data.is_flooded ?? false))
      formPayload.append("issue_details", data.issue_details)

      // 등록원부 PDF 파일
      if (data.registrationGap) {
        formPayload.append("registrationGap", data.registrationGap)
      }
      if (data.registrationEul) {
        formPayload.append("registrationEul", data.registrationEul)
      }

      const response = await fetch(
        "https://addie-unwatching-nonresonantly.ngrok-free.dev/webhook-test/cartells-check",
        {
          method: "POST",
          headers: {
            // 💡 이 한 줄이 ngrok의 경고 페이지를 강제로 건너뛰게 해줍니다.
            "ngrok-skip-browser-warning": "69420",
          },
          body: formPayload,
        }
      )

      if (!response.ok) {
        throw new Error("API request failed")
      }

      const contentType = response.headers.get("content-type") || ""

      if (contentType.includes("image")) {
        // 이미지 응답: Blob URL로 변환
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL(blob)
        blobUrlRef.current = blobUrl
        setResultImage(blobUrl)
        setShowResult(true)
      } else {
        // JSON 응답
        const result = await response.json()
        if (result.imageUrl) {
          setResultImage(result.imageUrl)
        } else if (result.image) {
          setResultImage(`data:image/png;base64,${result.image}`)
        }
        setShowResult(true)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrorMessage("분석 중 오류가 발생했습니다. 다시 시도해 주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloseResult = () => {
    setShowResult(false)
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = null
    }
    setResultImage(null)
  }

  return (
    <main className="min-h-screen aurora-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="font-serif text-xl tracking-tight text-primary">Cartells</span>
          <Button
            variant="outline"
            onClick={scrollToForm}
            className="text-xs uppercase tracking-[0.15em] rounded-sm border-primary/30 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
          >
            시작하기
          </Button>
        </div>
      </header>

      {/* Hero Section - Magazine Editorial Style */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 mb-10"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">AI 기반 정밀 감정</span>
          </motion.div>

          {/* Main Title - Large Serif */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-primary mb-8 leading-[1.15] tracking-tight text-balance"
          >
            60초 만에 끝나는
            <br />
            <span className="text-primary/80">중고차 AI 정밀 감정</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            서류 업로드부터 리포트 생성까지 딱 1분이면 충분합니다.
            <br className="hidden md:block" />
            복잡한 유통 마진을 걷어낸 진짜 차량 가치를 지금 바로 확인하세요.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Button
              onClick={scrollToForm}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-10 py-6 text-sm uppercase tracking-[0.15em]"
            >
              무료 감정 시작하기
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={scrollToForm}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
              How It Works
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-primary tracking-tight">
              간단한 3단계 프로세스
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                step: "01",
                title: "데이터 입력",
                subtitle: "Input",
                desc: "자동차 등록원부와 사고 이력을 업로드하면 분석이 시작됩니다.",
              },
              {
                icon: Shield,
                step: "02",
                title: "AI 정밀 분석",
                subtitle: "Processing",
                desc: "AI가 사고 이력과 실주행거리를 대조하여 침수 및 전손 여부를 꼼꼼히 검증합니다.",
              },
              {
                icon: Sparkles,
                step: "03",
                title: "리포트 즉시 발행",
                subtitle: "Output",
                desc: "전문가가 쓴 듯 정교한 감정 리포트가 1분 안에 당신의 화면에 나타납니다.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="glass-card rounded-2xl p-8 text-center relative overflow-hidden group"
              >
                <div className="absolute top-4 right-4 font-serif text-5xl text-primary/10 group-hover:text-primary/20 transition-colors">
                  {feature.step}
                </div>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70 mb-2 block">
                  {feature.subtitle}
                </span>
                <h3 className="font-serif text-xl text-primary mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section ref={formRef} className="py-24 md:py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4 block">
              Start Your Appraisal
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-primary tracking-tight">
              지금 시작하세요
            </h2>
          </motion.div>

          <MultiStepForm onSubmit={handleSubmit} isLoading={isLoading} />

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-red-500">{errorMessage}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 md:py-32 px-6 border-t border-muted relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: "AI-Driven", label: "지능형 정밀 분석" },
              { value: "Document-Verified", label: "공인 서류 기반 검증" },
              { value: "1분", label: "평균 소요" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="font-serif text-4xl md:text-5xl text-primary mb-3 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-muted relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-6">
            <img
              src="/images/cartells-logo-white2.png"
              alt="Cartells 로고"
              className="h-6 w-auto opacity-70"
            />
            <p className="text-xs text-muted-foreground text-center">
              2026 Cartells. AI 기반 자동차 정밀 감정 서비스.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.1em]">
                이용약관
              </a>
              <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors uppercase tracking-[0.1em]">
                개인정보
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoadingModal isOpen={isLoading} />
      <ResultModal isOpen={showResult} onClose={handleCloseResult} imageUrl={resultImage} />
    </main>
  )
}
