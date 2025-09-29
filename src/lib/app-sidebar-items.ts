import {
  Bot,
  Brain,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Zap,
} from "lucide-react";

import type { StaticAppData } from "@/types/sidebar";

export const staticAppData: StaticAppData = {
  navMain: [
    {
      title: "사업평가",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "파일 관리",
          url: "files",
        },
        {
          title: "심층 분석",
          url: "#",
        },
        {
          title: "참고 파일",
          url: "#",
        },
      ],
    },
    {
      title: "모델 선택",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "gemini-2.5-flash",
          icon: Zap,
        },
        {
          title: "gemini-2.5-pro",
          icon: Brain,
        },
      ],
    },
    {
      title: "분석 설정",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "일반",
          url: "#",
        },
        {
          title: "요금",
          url: "#",
        },
        {
          title: "한도",
        },
      ],
    },
  ],
  reports: [
    {
      name: "보고서",
      url: "results",
      icon: Frame,
    },
    {
      name: "시각화",
      url: "#",
      icon: PieChart,
    },
    {
      name: "로드맵",
      url: "#",
      icon: Map,
    },
  ],
};
