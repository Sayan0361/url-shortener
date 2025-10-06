import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HomeIcon, SettingsIcon, UserIcon, ListChecks } from "lucide-react";

// Navigation items
const NAVIGATION_ITEMS = [
    {
        href: "/",
        icon: HomeIcon,
        label: "Home",
    },
    {
        href: "/features", 
        icon: ListChecks,
        label: "Features",
    },
    {
        href: "/profile", 
        icon: UserIcon,
        label: "Profile",
    },
    {
        href: "/settings",
        icon: SettingsIcon,
        label: "Settings",
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" side="left">
            <SidebarHeader>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAVIGATION_ITEMS.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* maybe user profile, logout */}
            </SidebarFooter>
        </Sidebar>
    );
}