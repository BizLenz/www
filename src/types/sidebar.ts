import type { LucideIcon } from "lucide-react";

export interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export interface TeamData {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url?: string;
    icon?: LucideIcon;
  }[];
}

export interface ReportItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface StaticAppData {
  navMain: NavMainItem[];
  reports: ReportItem[];
}
