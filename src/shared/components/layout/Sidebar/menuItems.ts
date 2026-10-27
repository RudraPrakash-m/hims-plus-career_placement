import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Compass,
    UserCheck,
    BookOpen,
    Briefcase,
    CalendarCheck,
    FileSpreadsheet,
    Building,
    ExternalLink,
    Award,
    Bell,
    BarChart3,
    Network,
    Building2,
    Settings,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

export interface MenuItem {
    icon?: LucideIcon;
    label: string;
    path?: string;
    submenu?: MenuItem[];
}

export const ALL_MENU_ITEMS: MenuItem[] = [
    {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        icon: Building2,
        label: "Employer Registration and Management",
        path: "/employer-registration-profile",
    },
    {
        icon: GraduationCap,
        label: "Student Employability Profile",
        path: "/student-employability-profile",
    },
    {
        icon: Compass,
        label: "Career Preferences and Employment Aspirations",
        path: "/carrier-preference",
    },
    {
        icon: UserCheck,
        label: "Career Counselling and Mentoring",
        path: "/carrier-counselling",
    },
    {
        icon: BookOpen,
        label: "Aptitude, Skill Assessment and Career Recommendations",
        path: "/aptitude",
    },
    {
        icon: Briefcase,
        label: "Job / Internship / Apprenticeship Opportunity Management",
        path: "/add-job",
    },
    {
        icon: CalendarCheck,
        label: "Placement Drive Management",
        path: "/placement-drive",
    },
    {
        icon: FileSpreadsheet,
        label: "Student Application and Opportunity Tracking",
        path: "/student-application",
    },
    {
        icon: UserCheck,
        label: "Shortlisting and Interview Scheduling",
        path: "/short-listing",
    },
    {
        icon: Building,
        label: "Campus Placement Workflow",
        path: "/campus-placement",
    },
    {
        icon: ExternalLink,
        label: "Off-campus Placement Workflow",
        path: "/off-campus-placement",
    },
    {
        icon: Award,
        label: "Internship, Training and Skill Enhancement",
        path: "/training-internship",
    },
    {
        icon: Users,
        label: "Alumni Engagement and Referrals",
        path: "/alumni-engagement",
    },
    {
        icon: Bell,
        label: "Notifications and Communication",
        path: "/notifications-communication",
    },
    {
        icon: Award,
        label: "Placement Outcomes and Employer Feedback",
        path: "/placement-outcomes-feedback",
    },
    {
        icon: BarChart3,
        label: "Dashboard, Analytics and Reports",
        path: "/dashboard-analytics",
    },
    {
        icon: Network,
        label: "Integration with HIMS Modules",
        path: "/integration-hims-modules",
    },
    {
        icon: UserCheck,
        label: "Counsellor, Mentor and Training Provider",
        submenu: [
            { label: "Counsellors & Mentors", path: "/carrier-counselling" },
            { label: "Training Providers", path: "/training-internship" },
        ],
    },
    {
        icon: Building2,
        label: "Industry, Job Role and Employment Type",
        path: "/carrier-preference",
    },
    {
        icon: BookOpen,
        label: "Skills and Certification Catalogue",
        path: "/aptitude",
    },
    {
        icon: Settings,
        label: "Assessment and Selection Stage Configuration",
        path: "/short-listing",
    },
    {
        icon: ShieldCheck,
        label: "User, Role and Audit Management",
        submenu: [
            { label: "Role Management", path: "/settings/profile" },
            { label: "Audit Logs", path: "/settings/logs" },
        ],
    },
];

/** Strict Role-to-Menu Mapping Table specified by user */
export const ROLE_MENU_MAP: Record<string, string[]> = {
    "Student": [
        "Student Employability Profile",
        "Career Preferences and Employment Aspirations",
        "Career Counselling and Mentoring",
        "Aptitude, Skill Assessment and Career Recommendations",
        "Student Application and Opportunity Tracking",
        "Shortlisting and Interview Scheduling",
        "Campus Placement Workflow",
        "Off-campus Placement Workflow",
        "Internship, Training and Skill Enhancement",
        "Alumni Engagement and Referrals",
        "Notifications and Communication",
        "Placement Outcomes and Employer Feedback",
    ],
    "Employer": [
        "Employer Registration and Management",
        "Job / Internship / Apprenticeship Opportunity Management",
        "Placement Drive Management",
        "Student Application and Opportunity Tracking",
        "Shortlisting and Interview Scheduling",
        "Campus Placement Workflow",
        "Off-campus Placement Workflow",
        "Notifications and Communication",
        "Placement Outcomes and Employer Feedback",
    ],
    "Institution / Placement Cell": [
        "Employer Registration and Management",
        "Student Employability Profile",
        "Counsellor, Mentor and Training Provider",
        "Career Counselling and Mentoring",
        "Aptitude, Skill Assessment and Career Recommendations",
        "Job / Internship / Apprenticeship Opportunity Management",
        "Placement Drive Management",
        "Student Application and Opportunity Tracking",
        "Shortlisting and Interview Scheduling",
        "Campus Placement Workflow",
        "Off-campus Placement Workflow",
        "Internship, Training and Skill Enhancement",
        "Alumni Engagement and Referrals",
        "Notifications and Communication",
        "Placement Outcomes and Employer Feedback",
        "Dashboard, Analytics and Reports",
        "Integration with HIMS Modules",
    ],
    "Career Counsellor / Mentor": [
        "Career Counselling and Mentoring",
        "Aptitude, Skill Assessment and Career Recommendations",
        "Notifications and Communication",
    ],
    "Alumni": [
        "Alumni Engagement and Referrals",
        "Notifications and Communication",
    ],
    "Administrator / HED Official": [
        "Industry, Job Role and Employment Type",
        "Skills and Certification Catalogue",
        "Counsellor, Mentor and Training Provider",
        "Assessment and Selection Stage Configuration",
        "Dashboard, Analytics and Reports",
        "User, Role and Audit Management",
        "Integration with HIMS Modules",
    ],
};

/** Returns the strict list of menu items arranged for the given role */
export const getMenuItemsForRole = (role?: string): MenuItem[] => {
    let activeRole = role;
    if (!activeRole && typeof window !== "undefined") {
        try {
            activeRole = localStorage.getItem("arf.activeRole") || "Student";
        } catch {
            activeRole = "Student";
        }
    }
    if (!activeRole) activeRole = "Student";

    const allowedLabels = ROLE_MENU_MAP[activeRole];
    if (!allowedLabels) {
        return ALL_MENU_ITEMS;
    }

    const dashboardItem = ALL_MENU_ITEMS.find((item) => item.label === "Dashboard");
    const roleItems: MenuItem[] = [];
    if (dashboardItem) {
        roleItems.push(dashboardItem);
    }

    for (const label of allowedLabels) {
        const found = ALL_MENU_ITEMS.find(
            (item) => item.label.trim().toLowerCase() === label.trim().toLowerCase()
        );
        if (found) {
            roleItems.push(found);
        }
    }

    return roleItems;
};

/** Default menu items for initial render or fallback */
export const MENU_ITEMS: MenuItem[] = getMenuItemsForRole();

export interface MenuLeaf {
    label: string;
    path: string;
    icon?: LucideIcon;
    /** Labels of the groups above this page, e.g. ["Employee Details"]. */
    trail: string[];
}

/** Every clickable page in the menu for the current role (used by header search). */
export const flattenMenu = (items?: MenuItem[], trail: string[] = [], icon?: LucideIcon): MenuLeaf[] => {
    const list = items ?? getMenuItemsForRole();
    return list.flatMap((item) => {
        const itemIcon = item.icon ?? icon;
        if (item.submenu?.length) return flattenMenu(item.submenu, [...trail, item.label], itemIcon);
        return item.path ? [{ label: item.label, path: item.path, icon: itemIcon, trail }] : [];
    });
};
