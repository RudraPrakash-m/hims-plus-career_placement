/**
 * Header data — sample values ported from hims-ui-new (data/mock.ts, data/applications.ts).
 * Replace each block with the real API response when it exists.
 */

/** Module this app is: shown in the header and marked as "Current application" in the launcher. */
export const MODULE = { appId: "arf", name: "Career Counselling" };

/* ---- Languages -------------------------------------------------------- */
export interface Language {
    code: string;
    label: string;
}

export const LANGUAGES: Language[] = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "or", label: "ଓଡ଼ିଆ" },
];

/* ---- Roles ------------------------------------------------------------ */
export const USER_ROLES = [
    "Student",
    "Employer",
    "Institution / Placement Cell",
    "Career Counsellor / Mentor",
    "Alumni",
    "Administrator / HED Official",
];

export const ROLE_DESCRIPTIONS: Record<string, string> = {
    "Student": "Access student profile, applications and opportunities",
    "Employer": "Post jobs, internships and manage campus recruitment",
    "Institution / Placement Cell": "Manage placement drives, students and company invites",
    "Career Counsellor / Mentor": "Career guidance, student mentoring and counselling",
    "Alumni": "Alumni engagement, mentorship and referrals",
    "Administrator / HED Official": "Full departmental administration and policy oversight",
    "HED Admin": "Full access across the department",
    "College Verifier": "Verify college applications",
    "Governing Body Officer": "Manage governing body requests",
};

/* ---- Notifications ---------------------------------------------------- */
export type NotificationTone = "neutral" | "success" | "warning" | "danger" | "info";

export interface AppNotification {
    id: string;
    title: string;
    body?: string;
    /** ISO timestamp */
    createdAt: string;
    read: boolean;
    category: string;
    tone?: NotificationTone;
}

export const createSampleNotifications = (): AppNotification[] => {
    const now = Date.now();
    const ago = (minutes: number) => new Date(now - minutes * 60000).toISOString();
    return [
        { id: "n1", title: "Approval needed: access request", body: "Rohan Iyer requested Manager access to Finance.", createdAt: ago(8), read: false, category: "Approvals", tone: "warning" },
        { id: "n2", title: "Nightly backup completed", body: "2.4 GB archived in 6 min 12 s.", createdAt: ago(95), read: false, category: "System", tone: "success" },
        { id: "n3", title: "New sign-in from Pune, IN", body: "Chrome on Windows · 10:42 AM.", createdAt: ago(240), read: false, category: "Security", tone: "danger" },
        { id: "n4", title: "Monthly report is ready", body: "September operations summary can be downloaded.", createdAt: ago(60 * 26), read: true, category: "Reports", tone: "info" },
        { id: "n5", title: "Maintenance window scheduled", body: "Sunday 02:00–03:00 IST. Brief read-only mode expected.", createdAt: ago(60 * 52), read: true, category: "System", tone: "neutral" },
    ];
};

/* ---- Applications ----------------------------------------------------- */
export interface HimsApp {
    id: string;
    name: string;
    /** In-app route, or an absolute URL (opens in a new tab). */
    url: string;
}

// Placeholder: every app opens the dashboard until real URLs exist.
const U = (id: string) => `/dashboard?app=${id}`;

export const APPS: HimsApp[] = [
    { id: "arf", name: "Aashdit Reusable Framework", url: "/dashboard" },
    { id: "construction", name: "Construction Management", url: U("construction") },
    { id: "guest-faculty-mgmt", name: "Guest Faculty Management", url: U("guest-faculty-mgmt") },
    { id: "assembly", name: "Assembly Questions", url: U("assembly") },
    { id: "library", name: "Library Management", url: U("library") },
    { id: "asset", name: "Asset Management", url: U("asset") },
    { id: "audit", name: "Academic Audit", url: U("audit") },
    { id: "survey", name: "Survey Management", url: U("survey") },
    { id: "univ-recruitment", name: "University Recruitments", url: U("univ-recruitment") },
    { id: "loan", name: "Loan Recovery", url: U("loan") },
    { id: "grievance", name: "Grievance", url: U("grievance") },
    { id: "placement", name: "Placement Management", url: U("placement") },
    { id: "fdms", name: "FDMS", url: U("fdms") },
    { id: "infra", name: "Infrastructure Grants", url: U("infra") },
    { id: "coaching", name: "Private Coaching Center", url: U("coaching") },
    { id: "quality", name: "Quality Education", url: U("quality") },
    { id: "event", name: "Event Management", url: U("event") },
    { id: "feedback", name: "Feedback Management", url: U("feedback") },
    { id: "accreditation", name: "Accreditation Management", url: U("accreditation") },
    { id: "legal", name: "Legal case", url: U("legal") },
    { id: "fee", name: "Fee Management", url: U("fee") },
    { id: "question-bank", name: "Question Bank", url: U("question-bank") },
    { id: "stud-fac", name: "Stud Fac Exchange", url: U("stud-fac") },
    { id: "hostel", name: "Hostel Management", url: U("hostel") },
    { id: "lms", name: "Learning Management", url: U("lms") },
    { id: "exam", name: "Exam Management", url: U("exam") },
    { id: "naac", name: "NAAC", url: U("naac") },
];

/** Which applications each role may open ("all" = everything). */
export const ROLE_APPS: Record<string, string[] | "all"> = {
    "Student": "all",
    "Employer": "all",
    "Institution / Placement Cell": "all",
    "Career Counsellor / Mentor": "all",
    "Alumni": "all",
    "Administrator / HED Official": "all",
    "HED Admin": "all",
    "College Verifier": ["arf", "accreditation", "naac", "audit", "survey", "quality", "infra", "legal", "question-bank"],
    "Governing Body Officer": ["arf", "grievance", "legal", "feedback", "event", "fee", "placement", "hostel", "library"],
};

export const appsForRole = (role: string): HimsApp[] => {
    const allowed = ROLE_APPS[role] ?? ["arf"];
    return allowed === "all" ? APPS : APPS.filter((a) => allowed.includes(a.id));
};

export const DEFAULT_PINNED = ["arf", "library", "fee", "grievance", "placement", "exam", "naac"];
