import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import FeatureCard from "@/components/common/feature-card";
import {
  Brain,
  Award,
  LineChart,
  ClipboardCheck,
  Zap,
  Lightbulb,
} from "lucide-react";
import React from "react";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="text-2xl font-bold tracking-tight">
          <Link href="/">BizLenz</Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Add other navigation links here if needed */}
          <Button asChild>
            <Link href="/login">로그인</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center py-20 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="from-primary bg-gradient-to-r to-blue-400 bg-clip-text text-transparent">
              AI 기반 사업 제안서
            </span>{" "}
            자동 분석 서비스
          </h1>
          <p className="text-muted-foreground mt-6 max-w-3xl text-lg sm:text-xl">
            사업계획서 제출 전, 지원사업에 맞춤화된 평가로 성공적인 비즈니스
            기회를 만드세요.
          </p>
          <div className="mt-8 flex gap-4">
            <Button size="lg" asChild>
              <Link href="/login">지금 시작하기</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="#features">더 알아보기</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto py-16 text-center md:py-24"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            핵심 기능 및 이점
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            당신의 제안서를 다음 단계로 끌어올릴 강력한 기능들을 만나보세요.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ClipboardCheck className="text-primary h-8 w-8" />}
              title="보고서 자동 생성"
              description="복잡한 분석 결과 데이터를 명확하고 직관적인 보고서로 자동 생성하여 의사결정을 돕습니다."
            />
            <FeatureCard
              icon={<Lightbulb className="text-primary h-8 w-8" />}
              title="맞춤형 개선 제안"
              description="제안서의 강점은 살리고 약점은 보완할 구체적인 개선 방안을 제시합니다."
            />
            <FeatureCard
              icon={<Brain className="text-primary h-8 w-8" />}
              title="심층 시장 분석"
              description="AI가 시장 규모, 타겟 고객, 트렌드, 경쟁사를 심층 분석하여 성공 가능성을 진단합니다."
            />
            <FeatureCard
              icon={<LineChart className="text-primary h-8 w-8" />}
              title="정확한 재무 예측"
              description="수익 예측, 비용 분석, 손익분기점 등 재무 건전성을 평가하고 자금 조달 가이드를 제공합니다."
            />
            <FeatureCard
              icon={<Zap className="text-primary h-8 w-8" />}
              title="기술 스택 평가"
              description="제안된 기술 스택의 적합성, 확장성, 구현 가능성을 분석하여 기술적 리스크를 최소화합니다."
            />
            <FeatureCard
              icon={<Award className="text-primary h-8 w-8" />}
              title="종합 리스크 진단"
              description="사업, 기술, 시장 관련 잠재적 리스크를 식별하고, 효과적인 완화 전략을 제시합니다."
            />
          </div>
        </section>
        {/* How-it-works Section */}
        <section className="container mx-auto py-16 text-center md:py-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            어떻게 작동하나요?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            간단한 세 단계로 당신의 제안서를 분석하세요.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="p-4">
              <span className="text-primary text-5xl font-bold">1</span>
              <h3 className="text-xl font-semibold">제안서 업로드</h3>
              <p className="text-muted-foreground mb-4">
                사업 제안서를 간편하게 업로드하세요.
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-primary text-5xl font-bold">2</span>
              <h3 className="text-xl font-semibold">AI 분석 실행</h3>
              <p className="text-muted-foreground mb-4">
                유저의 요청에 따라 AI가 자동으로 평가를 진행합니다.
              </p>
            </Card>
            <Card className="p-4">
              <span className="text-primary text-5xl font-bold">3</span>
              <h3 className="text-xl font-semibold">보고서 확인</h3>
              <p className="text-muted-foreground mb-4">
                분석 결과를 담은 상세 보고서를 확인하고 개선하세요.
              </p>
            </Card>
          </div>
        </section>

        {/* Final CTA */}
        <section className="from-primary text-primary-foreground bg-gradient-to-r to-blue-600 py-20 text-center md:py-28">
          <h2 className="text-4xl font-bold tracking-tight">
            당신의 제안서를 혁신할 준비가 되셨나요?
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg opacity-90">
            지금 바로 BizLenz와 함께 더 강력하고 설득력 있는 사업 제안서를
            만들어보세요.
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 mt-10"
            asChild
          >
            <Link href="/login">무료로 시작하기</Link>
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground container mx-auto p-8 text-center">
        <p>&copy; {new Date().getFullYear()} BizLenz. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy" className="hover:text-primary">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="hover:text-primary">
            이용약관
          </Link>
        </div>
      </footer>
    </div>
  );
}