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
        submenu: [
            { label: "Employer Registration", path: "/employer-registration-profile" },
            { label: "View Registration", path: "/registration-view" },
        ],
    },
    {
        icon: GraduationCap,
        label: "Student Employability Profile",
        submenu: [
            { label: "Student Employability", path: "/student-employability-profile" },
            { label: "View Employability", path: "/view-student-employability" },
        ],
    },
    {
        icon: Compass,
        label: "Career Preferences and Employment Aspirations",
        submenu: [
            { label: "Career Preferences", path: "/carrier-preference" },
            { label: "View Aspirations", path: "/view-carrier-preference" },
        ],
    },
    {
        icon: UserCheck,
        label: "Career Counselling and Mentoring",
        submenu: [
            { label: "Career Counselling", path: "/carrier-counselling" },
            { label: "View Counselling", path: "/carrier-counselling-view" },
        ],
    },
    {
        icon: BookOpen,
        label: "Aptitude, Skill Assessment and Career Recommendations",
        submenu: [
            { label: "Aptitude", path: "/aptitude" },
            { label: "View Aptitude", path: "/aptitude-view" },
        ],
    },
    {
        icon: Briefcase,
        label: "Job / Internship / Apprenticeship Opportunity Management",
        submenu: [
            { label: "Add Opportunity", path: "/add-job" },
            { label: "View Opportunities", path: "/view-job" },
        ],
    },
    {
        icon: CalendarCheck,
        label: "Placement Drive Management",
        submenu: [
            { label: "Add Placement Drive", path: "/placement-drive" },
            { label: "View Placement Drives", path: "/placement-drive-view" },
        ],
    },
    {
        icon: FileSpreadsheet,
        label: "Student Application and Opportunity Tracking",
        submenu: [
            { label: "Add Student Application", path: "/student-application" },
            { label: "View Student Applications", path: "/student-application-view" },
        ],
    },
    {
        icon: UserCheck,
        label: "Shortlisting and Interview Scheduling",
        submenu: [
            { label: "Shortlisting", path: "/short-listing" },
            { label: "View Shortlisted Students", path: "/shortlisting-view" },
        ],
    },
    {
        icon: Building,
        label: "Campus Placement Workflow",
        submenu: [
            { label: "Campus Placement", path: "/campus-placement" },
            { label: "View Campus Placement", path: "/campus-placement-view" },
        ],
    },
    {
        icon: ExternalLink,
        label: "Off-campus Placement Workflow",
        submenu: [
            { label: "Off-campus Placement", path: "/off-campus-placement" },
            { label: "View Off-campus Placement", path: "/off-campus-placement-view" },
        ],
    },
    {
        icon: Award,
        label: "Internship, Training and Skill Enhancement",
        submenu: [
            { label: "Training & Internship", path: "/training-internship" },
            { label: "View Programmes", path: "/training-internship-view" },
        ],
    },
    {
        icon: Users,
        label: "Alumni Engagement and Referrals",
        submenu: [
            { label: "Alumni Engagement", path: "/alumni-engagement" },
            { label: "View Alumni Engagements", path: "/alumni-engagement-view" },
        ],
    },
    {
        icon: Bell,
        label: "Notifications and Communication",
        submenu: [
            { label: "Send Notification", path: "/notifications-communication" },
            { label: "View Notifications", path: "/notifications-communication-view" },
        ],
    },
    {
        icon: Award,
        label: "Placement Outcomes and Employer Feedback",
        submenu: [
            { label: "Record Outcome & Feedback", path: "/placement-outcomes-feedback" },
            { label: "View Placement Outcomes", path: "/placement-outcomes-feedback-view" },
        ],
    },
    {
        icon: BarChart3,
        label: "Dashboard, Analytics and Reports",
        submenu: [
            { label: "Dashboard Analytics", path: "/dashboard-analytics" },
            { label: "View Dashboard", path: "/view-dashboard" },
        ],
    },
    {
        icon: Network,
        label: "Integration with HIMS Modules",
        submenu: [
            { label: "Sync & Map HIMS Record", path: "/integration-hims-modules" },
            { label: "View HIMS Integrations", path: "/integration-hims-modules-view" },
        ],
    },
    {
        icon: UserCheck,
        label: "Counsellor, Mentor and Training Provider",
        submenu: [
            { label: "Counsellors & Mentors", path: "/carrier-counselling-view" },
            { label: "Training Providers", path: "/training-internship-view" },
        ],
    },
    {
        icon: Building2,
        label: "Industry, Job Role and Employment Type",
        submenu: [
            { label: "Job Roles & Types", path: "/carrier-preference" },
            { label: "View Configurations", path: "/view-carrier-preference" },
        ],
    },
    {
        icon: BookOpen,
        label: "Skills and Certification Catalogue",
        submenu: [
            { label: "Skills Assessment", path: "/aptitude" },
            { label: "View Certifications", path: "/aptitude-view" },
        ],
    },
    {
        icon: Settings,
        label: "Assessment and Selection Stage Configuration",
        submenu: [
            { label: "Selection Stages", path: "/short-listing" },
            { label: "View Stages", path: "/shortlisting-view" },
        ],
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
