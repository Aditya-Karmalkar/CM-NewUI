import * as React from "react"
import {
  Activity,
  BarChartIcon,
  Calendar,
  ClipboardListIcon,
  Heart,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MessageSquare,
  Pill,
  SearchIcon,
  SettingsIcon,
  Shield,
  Target,
  User,
  QrCode,
  Scan,
  HeartHandshake,
} from "lucide-react"

import { NavDocuments } from "./nav-documents"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar"

const data = {
  user: {
    name: "Health User",
    email: "user@curamind.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Health Chat",
      url: "chat",
      icon: MessageSquare,
    },
    {
      title: "Health Metrics",
      url: "metrics",
      icon: Activity,
    },
    {
      title: "Medications",
      url: "medications",
      icon: Pill,
    },
    {
      title: "Appointments",
      url: "appointments",
      icon: Calendar,
    },
    {
      title: "First Aid Coach",
      url: "first-aid-coach",
      icon: HeartHandshake,
    },
    {
      title: "Health Goals",
      url: "goals",
      icon: Target,
    },
  ],
  navClouds: [
    {
      title: "Emergency",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Emergency Profile",
          url: "emergency-profile",
        },
        {
          title: "First Aid Coach",
          url: "first-aid-coach",
        },
        {
          title: "Generate QR Code",
          url: "qr-generator",
          icon: QrCode,
        },
        {
          title: "Scan QR Code",
          url: "qr-scanner",
          icon: Scan,
        },
      ],
    },
    {
      title: "Reports",
      icon: ClipboardListIcon,
      url: "reports",
      items: [
        {
          title: "Health Reports",
          url: "reports",
        },
        {
          title: "Analytics",
          url: "analytics",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "settings",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "User Profile",
      url: "profile",
      icon: User,
    },
    {
      name: "Health Records",
      url: "records",
      icon: Heart,
    },
    {
      name: "Settings",
      url: "settings",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="offcanvas" className="bg-white border-r border-gray-200" {...props}>
      <SidebarHeader className="bg-white border-b border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 text-black hover:bg-gray-100">
              <a href="/health-dashboard">
                <Heart className="h-5 w-5 text-blue-500" />
                <span className="text-base font-semibold text-black">CuraMind</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={data.navMain} onItemClick={props.onNavigate} />
        <NavMain items={data.navClouds} onItemClick={props.onNavigate} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-white border-t border-gray-200">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
