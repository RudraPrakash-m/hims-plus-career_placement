import { useState, useRef, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Badge, Button, Card, Modal, PageHeader, showToast } from '@mfe/components';
import { Award, BookmarkCheck, Briefcase, Check, ChevronDown, FileText, Lock, PenTool, Plus, Search, ShieldCheck, Trash2, UploadCloud, type LucideIcon } from "lucide-react";

// Types
interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  file: string;
}

interface ProjectItem {
  id: string;
  title: string;
  type: string;
  description: string;
}

interface PlacementDriveItem {
  id: string;
  title: string;
  type: string;
  date: string;
  file: string;
}

interface CompanyPerkItem {
  id: string;
  title: string;
  type: string;
  description: string;
}

// Predefined skill lists
const PREDEFINED_STUDENT_SKILLS = [
  "Java",
  "Python",
  "SQL",
  "React",
  "JavaScript",
  "TypeScript",
  "Node.js",
  "C++",
  "C#",
  "HTML & CSS",
  "AWS Cloud",
  "Docker & Kubernetes",
  "Git & GitHub",
  "Machine Learning / AI",
  "Data Structures & Algorithms",
  "Teamwork",
  "Communication",
  "Problem Solving",
  "Leadership",
  "Agile / Scrum",
  "UI/UX Design",
  "Other",
];

const PREDEFINED_EMPLOYER_SKILLS = [
  "Full-Stack Developer",
  "Cloud Architect & DevOps",
  "Data Scientist / AI Engineer",
  "Cyber Security Analyst",
  "Mobile App Developer (Flutter/React Native)",
  "QA & Test Automation",
  "Java Backend Engineer",
  "UI/UX & Product Design",
  "Business & Systems Analysis",
  "Embedded Systems & IoT",
  "Problem Solving & Aptitude",
  "Agile / Scrum Delivery",
  "Cloud Infrastructure (AWS/Azure/GCP)",
  "Relational & NoSQL Databases",
  "Communication & Leadership",
  "Other",
];

interface SectionItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  icon?: LucideIcon;
  iconColor?: string;
}

/** A titled list of records with an Add button and a delete tile per row (was ItemSectionCard). */
const SectionList = ({
  title,
  description,
  items,
  onAdd,
  onDelete,
  defaultIcon: DefaultIcon,
  defaultIconColor = "text-amber-600",
  addLabel = "Add",
  emptyMessage = "No records added yet.",
}: {
  title: string;
  description?: string;
  items: SectionItem[];
  onAdd: () => void;
  onDelete?: (id: string) => void;
  defaultIcon?: LucideIcon;
  defaultIconColor?: string;
  addLabel?: string;
  emptyMessage?: string;
}) => (
  <Card
    title={title}
    description={description}
    actions={<Button variant="outline" size="sm" icon={<Plus size={16} />} label={addLabel} onClick={onAdd} />}
  >
    <div className="space-y-3 pt-1">
      {items.map((item) => {
        const ItemIcon = item.icon || DefaultIcon;
        return (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-(--border) p-3.5"
          >
            <div className="flex min-w-0 items-start gap-3">
              {ItemIcon && <ItemIcon className={`mt-0.5 h-5 w-5 shrink-0 ${item.iconColor || defaultIconColor}`} />}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold leading-tight text-foreground">{item.title}</h4>
                  {item.badge && (
                    <Badge variant="warning" size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.subtitle}</p>
              </div>
            </div>
            {onDelete && (
              <button
                type="button"
                className="action-tile action-tile--xs"
                data-tone="danger"
                title="Delete"
                aria-label={`Delete ${item.title}`}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        );
      })}
      {items.length === 0 && <p className="py-1 text-xs italic text-muted">{emptyMessage}</p>}
    </div>
  </Card>
);

const StudentEmployability = () => {
  const location = useLocation();

  // Determine role purely based on active route or storage (no manual on-page switcher)
  const isEmployerRoute = 
    location.pathname.includes("employer-registration-profile") ||
    location.pathname.includes("my-employability-profile") || 
    location.pathname.includes("employer-registration");

  const isStudentRoute = 
    location.pathname.includes("student-employability-profile") ||
    location.pathname.includes("student-employability");

  const [activeRole, setActiveRole] = useState<"Student" | "Employer">(() => {
    if (isEmployerRoute) return "Employer";
    if (isStudentRoute) return "Student";
    try {
      const stored = localStorage.getItem("arf.activeRole");
      if (stored === "Employer") return "Employer";
    } catch {
      /* ignore */
    }
    return "Student";
  });

  // Keep activeRole synchronized with browser route changes
  useEffect(() => {
    if (isEmployerRoute) {
      setActiveRole("Employer");
    } else if (isStudentRoute) {
      setActiveRole("Student");
    }
  }, [location.pathname, isEmployerRoute, isStudentRoute]);

  // Listen to header role switch event "arf:role-changed"
  useEffect(() => {
    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const newRole = customEvent.detail;
      if (newRole === "Employer") {
        setActiveRole("Employer");
      } else if (newRole === "Student") {
        setActiveRole("Student");
      }
    };

    window.addEventListener("arf:role-changed", handleRoleChanged);
    return () => window.removeEventListener("arf:role-changed", handleRoleChanged);
  }, []);

  const isEmployer = activeRole === "Employer";

  /* ------------------- STUDENT DATA & STATE ------------------- */
  const studentInfo = {
    name: "Aarav Sharma",
    studentId: "STU-5001",
    programme: "B.Tech CSE",
    batch: "2022–26",
    institution: "Ravenshaw University",
    cgpa: "8.4",
    yearOfPassing: "2026",
    achievements: "Dean's list 2024, 2025",
  };

  const [studentSkills, setStudentSkills] = useState<string[]>([
    "Java",
    "SQL",
    "React",
    "Teamwork",
  ]);

  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: "1",
      title: "AWS Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2026-03-14",
      file: "aws-cert.pdf",
    },
  ]);

  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "1",
      title: "Campus Event Portal",
      type: "Project",
      description: "Built a React + Node app used by 1,200 students.",
    },
  ]);

  const [studentResume, setStudentResume] = useState<{ name: string; size: string } | null>(null);
  const [studentLinks, setStudentLinks] = useState({
    portfolio: "",
    linkedIn: "https://linkedin.com/in/aarav-sh",
    gitHub: "https://github.com/aarav-sh",
  });

  /* ------------------- EMPLOYER DATA & STATE ------------------- */
  const employerInfo = {
    name: "Apex Cloud Innovations Ltd",
    corporateId: "EMP-2024-089",
    industry: "IT & Enterprise Cloud Solutions",
    cin: "CIN-U72200MH2018PTC1045",
    headquarters: "CyberCity, Bengaluru & BBSR",
    scale: "500–1,000 Employees",
    rating: "4.6 ★ (Glassdoor Certified)",
    accreditation: "NASSCOM & ISO 27001",
  };

  const [employerRequirements, setEmployerRequirements] = useState<string[]>([
    "Full-Stack Developer",
    "Cloud Architect & DevOps",
    "Data Scientist / AI Engineer",
    "Problem Solving & Aptitude",
  ]);

  const [placementDrives, setPlacementDrives] = useState<PlacementDriveItem[]>([
    {
      id: "1",
      title: "Graduate Engineer Trainee 2026",
      type: "Campus Drive · 45 Openings",
      date: "2026-04-10",
      file: "jd-get-2026.pdf",
    },
    {
      id: "2",
      title: "Cloud & DevOps Summer Internship",
      type: "Internship Drive · 20 Openings",
      date: "2026-05-15",
      file: "internship-brochure.pdf",
    },
  ]);

  const [companyPerks, setCompanyPerks] = useState<CompanyPerkItem[]>([
    {
      id: "1",
      title: "Flexible Hybrid Work & Health Coverage",
      type: "Work Culture",
      description: "Comprehensive medical coverage for family with modern hybrid workplace flexibility.",
    },
    {
      id: "2",
      title: "Learning Budget & Certifications",
      type: "Perks & Growth",
      description: "100% sponsorship for cloud certification tracks (AWS, Azure, GCP) and hackathons.",
    },
  ]);

  const [employerBrochure, setEmployerBrochure] = useState<{ name: string; size: string } | null>({
    name: "apex-cloud-placement-brochure-2026.pdf",
    size: "3.2 MB",
  });

  const [employerLinks, setEmployerLinks] = useState({
    website: "https://apexcloudinnovations.example.com",
    careersPortal: "https://apexcloudinnovations.example.com/careers",
    linkedIn: "https://linkedin.com/company/apex-cloud-innovations",
  });

  /* ------------------- SKILLS SELECTION & CUSTOM ADD / DELETE ------------------- */
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [customSkillText, setCustomSkillText] = useState("");
  const skillDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (skillDropdownRef.current && !skillDropdownRef.current.contains(e.target as Node)) {
        setIsSkillDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const activePredefinedSkills = isEmployer ? PREDEFINED_EMPLOYER_SKILLS : PREDEFINED_STUDENT_SKILLS;
  const activeSelectedSkills = isEmployer ? employerRequirements : studentSkills;

  const filteredSkillOptions = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    if (!query) return activePredefinedSkills;
    return activePredefinedSkills.filter((s) => s.toLowerCase().includes(query));
  }, [skillSearch, activePredefinedSkills]);

  const toggleSkill = (skillOption: string) => {
    if (skillOption === "Other") {
      setIsSkillDropdownOpen(false);
      showToast.info(`Please enter your custom ${isEmployer ? "requirement" : "skill"} in the input box.`);
      return;
    }

    if (isEmployer) {
      if (employerRequirements.includes(skillOption)) {
        setEmployerRequirements((prev) => prev.filter((s) => s !== skillOption));
        showToast.info(`Removed "${skillOption}"`);
      } else {
        setEmployerRequirements((prev) => [...prev, skillOption]);
        showToast.success(`Added "${skillOption}"`);
      }
    } else {
      if (studentSkills.includes(skillOption)) {
        setStudentSkills((prev) => prev.filter((s) => s !== skillOption));
        showToast.info(`Removed "${skillOption}"`);
      } else {
        setStudentSkills((prev) => [...prev, skillOption]);
        showToast.success(`Added "${skillOption}"`);
      }
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (isEmployer) {
      setEmployerRequirements((prev) => prev.filter((s) => s !== skillToRemove));
    } else {
      setStudentSkills((prev) => prev.filter((s) => s !== skillToRemove));
    }
    showToast.info(`Deleted "${skillToRemove}"`);
  };

  const addCustomSkill = () => {
    const trimmed = customSkillText.trim();
    if (!trimmed) {
      showToast.error("Please enter a skill or requirement name.");
      return;
    }
    
    if (activeSelectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showToast.warning(`"${trimmed}" is already added.`);
      return;
    }

    if (isEmployer) {
      setEmployerRequirements((prev) => [...prev, trimmed]);
      showToast.success(`Hiring requirement "${trimmed}" added successfully.`);
    } else {
      setStudentSkills((prev) => [...prev, trimmed]);
      showToast.success(`Skill "${trimmed}" added successfully.`);
    }
    setCustomSkillText("");
  };

  /* ------------------- MODALS STATE & HANDLERS ------------------- */
  // Student Modals
  const [isAddCertOpen, setIsAddCertOpen] = useState(false);
  const [certForm, setCertForm] = useState({ title: "", issuer: "", date: "", file: "" });

  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: "", type: "Project", description: "" });

  // Employer Modals
  const [isAddDriveOpen, setIsAddDriveOpen] = useState(false);
  const [driveForm, setDriveForm] = useState({ title: "", type: "Campus Drive · 30 Openings", date: "", file: "" });

  const [isAddPerkOpen, setIsAddPerkOpen] = useState(false);
  const [perkForm, setPerkForm] = useState({ title: "", type: "Work Culture", description: "" });

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      showToast.error("Please enter certification title and issuer.");
      return;
    }
    setCertifications((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: certForm.title,
        issuer: certForm.issuer,
        date: certForm.date || new Date().toISOString().substring(0, 10),
        file: certForm.file || `${certForm.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      },
    ]);
    setCertForm({ title: "", issuer: "", date: "", file: "" });
    setIsAddCertOpen(false);
    showToast.success("Certification added successfully.");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showToast.error("Please enter project title and description.");
      return;
    }
    setProjects((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: projectForm.title,
        type: projectForm.type || "Project",
        description: projectForm.description,
      },
    ]);
    setProjectForm({ title: "", type: "Project", description: "" });
    setIsAddProjectOpen(false);
    showToast.success("Project added successfully.");
  };

  const handleAddPlacementDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveForm.title) {
      showToast.error("Please enter recruitment drive title.");
      return;
    }
    setPlacementDrives((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: driveForm.title,
        type: driveForm.type || "Campus Drive",
        date: driveForm.date || new Date().toISOString().substring(0, 10),
        file: driveForm.file || `${driveForm.title.toLowerCase().replace(/\s+/g, "-")}.pdf`,
      },
    ]);
    setDriveForm({ title: "", type: "Campus Drive · 30 Openings", date: "", file: "" });
    setIsAddDriveOpen(false);
    showToast.success("Placement Drive added successfully.");
  };

  const handleAddPerk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perkForm.title || !perkForm.description) {
      showToast.error("Please enter benefit title and description.");
      return;
    }
    setCompanyPerks((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        title: perkForm.title,
        type: perkForm.type || "Work Culture",
        description: perkForm.description,
      },
    ]);
    setPerkForm({ title: "", type: "Work Culture", description: "" });
    setIsAddPerkOpen(false);
    showToast.success("Company benefit added successfully.");
  };

  /* ------------------- FILE UPLOAD HANDLERS ------------------- */
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (isEmployer) {
      setEmployerBrochure({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      showToast.success(`Attached company brochure / MoU: ${file.name}`);
    } else {
      setStudentResume({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      });
      showToast.success(`Attached student resume: ${file.name}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  /* ------------------- COMPLETION CALCULATION ------------------- */
  const completionPercentage = useMemo(() => {
    if (isEmployer) {
      return employerBrochure ? 100 : 92;
    }
    return studentResume ? 100 : 86;
  }, [isEmployer, employerBrochure, studentResume]);

  const handleSave = () => {
    if (isEmployer) {
      showToast.success("Employer Registration Profile saved successfully!");
    } else {
      showToast.success("Student Employability Profile saved successfully!");
    }
  };

  // Donut chart math
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Page Header (Role switcher removed as requested) */}
      <PageHeader
        title={isEmployer ? "Employer Registration Profile" : "Student Employability Profile"}
        description={
          isEmployer
            ? "Manage corporate organization details, talent requirements, placement drives, and verified credentials."
            : "Keep your profile current: employers and the placement cell see it when you apply."
        }
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: isEmployer ? "Employer Management" : "Career & Placement" },
          { label: isEmployer ? "Employer Registration Profile" : "Student Employability Profile" },
        ]}
      />

      {/* Card 1: Top Unified Details & Completion Card */}
      <Card
        title={isEmployer ? "Organization details" : "Student details"}
        description={
          isEmployer
            ? "Official corporate registry data verified under Higher Education Placement Network."
            : "Verified academic data can be changed only in Student Lifecycle."
        }
        actions={
          isEmployer ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eef7f0] text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              Corporate Registry · Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fcf4e8] text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800">
              <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              From HIMS · read-only
            </span>
          )
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
          {/* Left part: 8 details in clean 4-column grid */}
          <div className="lg:col-span-8 xl:col-span-9">
            {isEmployer ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Organization Name</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Corporate ID</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.corporateId}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Industry / Sector</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.industry}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">CIN / Registration</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.cin}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Headquarters / Hub</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.headquarters}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Organization Scale</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.scale}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Workplace Rating</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.rating}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Accreditations</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{employerInfo.accreditation}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Name</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.name}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Student ID</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.studentId}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Programme</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.programme}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Batch</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.batch}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Institution</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.institution}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">CGPA</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.cgpa}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Year of passing</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.yearOfPassing}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Achievements</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 block">{studentInfo.achievements}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right part: Profile Completion integrated widget */}
          <div className="lg:col-span-4 xl:col-span-3 lg:border-l lg:border-slate-200 dark:lg:border-slate-800 lg:pl-6 flex flex-col items-center justify-center text-center py-1">
            <span className="text-xs font-bold text-foreground mb-2">
              {isEmployer ? "Corporate readiness" : "Profile completion"}
            </span>
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={isEmployer ? "#bbf7d0" : "#fed7aa"}
                  strokeWidth="11"
                  fill="transparent"
                  className="dark:stroke-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={isEmployer ? "#16a34a" : "#ea580c"}
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${isEmployer ? "text-emerald-900 dark:text-emerald-100" : "text-amber-900 dark:text-amber-100"}`}>
                  {completionPercentage}%
                </span>
              </div>
            </div>

            <div className="mt-2 text-xs">
              {completionPercentage < 100 ? (
                <div className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-card px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isEmployer ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span>Missing: <strong>{isEmployer ? "Hiring MoU / Brochure" : "Upload a resume"}</strong></span>
                </div>
              ) : (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% {isEmployer ? "Campus Hiring Ready" : "Complete!"}
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Card 2: Skills / Target Hiring Requirements */}
      <Card
        title={isEmployer ? "Hiring Requirements & Core Competencies" : "Skills"}
        description={
          isEmployer
            ? "Target job roles, technical proficiencies, and talent criteria sought from candidates."
            : "Technical, professional and soft skills."
        }
      >
        <div className="space-y-4 pt-1">
          {/* Selected Skill / Requirement Pills with Delete Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {activeSelectedSkills.map((skill) => (
              <span
                key={skill}
                className={`inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-medium shadow-2xs ${
                  isEmployer
                    ? "bg-[#eef7f0] text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800"
                    : "bg-[#fff8eb] text-amber-900 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-800"
                }`}
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-rose-100 dark:hover:bg-rose-950/50 p-1 rounded-full transition-colors group cursor-pointer"
                  title={`Delete ${skill}`}
                  aria-label={`Delete ${skill}`}
                >
                  <Trash2 className="w-3 h-3 text-slate-400 group-hover:text-rose-600 transition-colors" />
                </button>
              </span>
            ))}
            {activeSelectedSkills.length === 0 && (
              <span className="text-xs text-muted-foreground italic">No items added yet. Choose from options or add custom below.</span>
            )}
          </div>

          {/* Add Skills Area: Multi-select dropdown + Direct Add Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* 1. Multi-Select Dropdown */}
            <div className="space-y-1.5" ref={skillDropdownRef}>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isEmployer ? "Select from Common Requirements:" : "Select from Predefined Skills:"}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsSkillDropdownOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-left transition-colors shadow-2xs"
                >
                  <span className={activeSelectedSkills.length > 0 ? "text-foreground font-medium truncate" : "text-muted-foreground truncate"}>
                    {activeSelectedSkills.length > 0
                      ? `${activeSelectedSkills.length} selected (${isEmployer ? "Roles" : "Skills"})`
                      : `Choose from list...`}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${isSkillDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isSkillDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-card border border-slate-200 dark:border-border rounded-xl shadow-xl p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="relative px-1 pt-1 pb-1 border-b border-slate-100 dark:border-slate-800">
                      <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder={`Search or filter...`}
                        className="w-full pl-7 pr-3 py-1.5 text-xs rounded-md bg-slate-50 dark:bg-card/70 border border-slate-200 dark:border-slate-700 text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-52 overflow-y-auto space-y-0.5 px-1 py-1">
                      {filteredSkillOptions.map((opt) => {
                        const isOther = opt === "Other";
                        const isSelected = activeSelectedSkills.includes(opt);

                        if (isOther) {
                          return (
                            <button
                              key="Other"
                              type="button"
                              onClick={() => toggleSkill("Other")}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-amber-700 dark:text-amber-400 font-semibold hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors border-t border-dashed border-amber-200 dark:border-amber-900/50 mt-1 pt-1.5"
                            >
                              <span className="flex items-center gap-1.5">
                                <PenTool className="w-3 h-3" /> Other (Use custom input)
                              </span>
                              <ChevronDown className="w-3 h-3 -rotate-90 text-amber-600" />
                            </button>
                          );
                        }

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleSkill(opt)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                              isSelected
                                ? isEmployer
                                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-medium"
                                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-medium"
                                : "text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                          >
                            <span className="truncate">{opt}</span>
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                                isSelected
                                  ? isEmployer
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : "bg-amber-600 border-amber-600 text-white"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Direct Add Input + Add Button */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isEmployer ? "Or Add Custom Role / Requirement:" : "Or Add Custom Skill:"}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customSkillText}
                  onChange={(e) => setCustomSkillText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder={isEmployer ? "e.g. Kubernetes Administrator" : "e.g. Next.js, Rust..."}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={addCustomSkill}
                  icon={<Plus size={16} />}
                  className="bg-[#0f4c81] hover:bg-[#0c3d68] text-white text-xs px-4 py-2 shrink-0 cursor-pointer"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Row of 2 Side-by-Side Cards (Add & Delete fully connected) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {isEmployer ? (
          /* Employer Card 1: Placement Drives & Openings */
          <SectionList
            title="Campus Placement Drives & Openings"
            description="Active recruitment batches, test dates, and job role circulars."
            addLabel="Add drive"
            onAdd={() => setIsAddDriveOpen(true)}
            onDelete={(id) => {
              setPlacementDrives((prev) => prev.filter((d) => d.id !== id));
              showToast.info("Placement drive deleted.");
            }}
            emptyMessage="No placement drives added yet. Click 'Add drive' to create one."
            defaultIcon={Briefcase}
            defaultIconColor="text-emerald-600"
            items={placementDrives.map((d) => ({
              id: d.id,
              title: d.title,
              subtitle: `${d.type} · Target: ${d.date}`,
              badge: d.file,
            }))}
          />
        ) : (
          /* Student Card 1: Certifications */
          <SectionList
            title="Certifications"
            description="Credentials from recognized authorities."
            addLabel="Add certification"
            onAdd={() => setIsAddCertOpen(true)}
            onDelete={(id) => {
              setCertifications((prev) => prev.filter((c) => c.id !== id));
              showToast.info("Certification deleted.");
            }}
            emptyMessage="No certifications added yet. Click 'Add certification' to add."
            defaultIcon={Award}
            defaultIconColor="text-amber-600"
            items={certifications.map((c) => ({
              id: c.id,
              title: c.title,
              subtitle: `${c.issuer} · Issued: ${c.date}`,
              badge: c.file,
            }))}
          />
        )}

        {isEmployer ? (
          /* Employer Card 2: Corporate Culture & Benefits */
          <SectionList
            title="Corporate Culture & Benefits"
            description="Workplace environment, perks, and employee development."
            addLabel="Add benefit"
            onAdd={() => setIsAddPerkOpen(true)}
            onDelete={(id) => {
              setCompanyPerks((prev) => prev.filter((p) => p.id !== id));
              showToast.info("Company benefit deleted.");
            }}
            emptyMessage="No company benefits added yet. Click 'Add benefit' to add."
            defaultIcon={Award}
            defaultIconColor="text-emerald-600"
            items={companyPerks.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.description,
              badge: p.type,
            }))}
          />
        ) : (
          /* Student Card 2: Projects and experience */
          <SectionList
            title="Projects and experience"
            description="Showcase coursework, internships and projects."
            addLabel="Add project"
            onAdd={() => setIsAddProjectOpen(true)}
            onDelete={(id) => {
              setProjects((prev) => prev.filter((p) => p.id !== id));
              showToast.info("Project deleted.");
            }}
            emptyMessage="No projects added yet. Click 'Add project' to add."
            defaultIcon={Briefcase}
            defaultIconColor="text-amber-600"
            items={projects.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.description,
              badge: p.type,
            }))}
          />
        )}
      </div>

      {/* Card 5: Resume & Links / Corporate Brochure & Links */}
      <Card
        title={isEmployer ? "Company Profile, MoU & Official Links" : "Resume and web links"}
        description={
          isEmployer
            ? "Upload company corporate brochure, campus hiring MoU, and official corporate channels."
            : "Upload your standard resume and professional web profiles."
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Left Column: Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              {isEmployer ? "Company Placement Brochure / Hiring MoU" : "Resume (PDF or DOC)"}
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/10 cursor-pointer transition-colors min-h-[140px]"
            >
              <UploadCloud className="w-8 h-8 text-amber-700 dark:text-amber-500 mb-2 stroke-[1.5]" />
              <p className="text-xs text-foreground font-medium">
                Drag and drop your file here, or <span className="text-amber-800 dark:text-amber-400 font-semibold underline">browse</span>
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">PDF, DOC, DOCX up to {isEmployer ? "10 MB" : "5 MB"}</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Attached file chip with Delete Option */}
            {(isEmployer ? employerBrochure : studentResume) && (
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="font-medium text-foreground truncate">
                    {isEmployer ? employerBrochure?.name : studentResume?.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ({isEmployer ? employerBrochure?.size : studentResume?.size})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEmployer) setEmployerBrochure(null);
                    else setStudentResume(null);
                    showToast.info("Document removed.");
                  }}
                  className="hover:bg-rose-100 dark:hover:bg-rose-950/50 p-1.5 rounded-md transition-colors text-slate-400 hover:text-rose-600 ml-2 cursor-pointer"
                  title="Delete Document"
                  aria-label="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Web Profiles & URLs */}
          <div className="space-y-3">
            {isEmployer ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Corporate Website URL
                  </label>
                  <input
                    type="url"
                    value={employerLinks.website}
                    onChange={(e) => setEmployerLinks({ ...employerLinks, website: e.target.value })}
                    placeholder="https://company.example.com"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Campus Careers / Hiring Portal URL
                  </label>
                  <input
                    type="url"
                    value={employerLinks.careersPortal}
                    onChange={(e) => setEmployerLinks({ ...employerLinks, careersPortal: e.target.value })}
                    placeholder="https://company.example.com/campus-careers"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Corporate LinkedIn Page URL
                  </label>
                  <input
                    type="url"
                    value={employerLinks.linkedIn}
                    onChange={(e) => setEmployerLinks({ ...employerLinks, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/company/..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Portfolio / Website URL
                  </label>
                  <input
                    type="url"
                    value={studentLinks.portfolio}
                    onChange={(e) => setStudentLinks({ ...studentLinks, portfolio: e.target.value })}
                    placeholder="https://aarav-portfolio.example.com"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={studentLinks.linkedIn}
                    onChange={(e) => setStudentLinks({ ...studentLinks, linkedIn: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    GitHub Profile URL
                  </label>
                  <input
                    type="url"
                    value={studentLinks.gitHub}
                    onChange={(e) => setStudentLinks({ ...studentLinks, gitHub: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Row 5: Save Profile Button at the bottom middle */}
      <div className="flex justify-center pt-4 pb-8">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          icon={<BookmarkCheck size={16} />}
          className="bg-[#0f4c81] hover:bg-[#0c3d68] text-white font-semibold shadow-md px-10 py-2.5 text-sm rounded-lg cursor-pointer"
        >
          {isEmployer ? "Save organization profile" : "Save profile"}
        </Button>
      </div>

      {/* MODALS */}
      {/* 1. Add Certification Modal (Student) */}
      {isAddCertOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddCertOpen(false)}
          title="Add Certification"
          size="md"
        >
          <form onSubmit={handleAddCertification} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Certification Name *
              </label>
              <input
                type="text"
                required
                value={certForm.title}
                onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Issuing Organization *
              </label>
              <input
                type="text"
                required
                value={certForm.issuer}
                onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Issue Date</label>
                <input
                  type="date"
                  value={certForm.date}
                  onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Document / Certificate File</label>
                <input
                  type="text"
                  value={certForm.file}
                  onChange={(e) => setCertForm({ ...certForm, file: e.target.value })}
                  placeholder="e.g. aws-cert.pdf"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddCertOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0f4c81] text-white">
                Add Certification
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 2. Add Project Modal (Student) */}
      {isAddProjectOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddProjectOpen(false)}
          title="Add Project or Experience"
          size="md"
        >
          <form onSubmit={handleAddProject} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                placeholder="e.g. Campus Event Portal"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Type</label>
              <select
                value={projectForm.type}
                onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="Project">Project</option>
                <option value="Internship">Internship</option>
                <option value="Research">Research</option>
                <option value="Work Experience">Work Experience</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Describe your role, stack, and impact..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddProjectOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0f4c81] text-white">
                Add Project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3. Add Placement Drive Modal (Employer) */}
      {isAddDriveOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddDriveOpen(false)}
          title="Add Campus Recruitment Drive"
          size="md"
        >
          <form onSubmit={handleAddPlacementDrive} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Recruitment Drive Title *
              </label>
              <input
                type="text"
                required
                value={driveForm.title}
                onChange={(e) => setDriveForm({ ...driveForm, title: e.target.value })}
                placeholder="e.g. Graduate Engineer Trainee 2026"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Drive Category / Openings</label>
              <input
                type="text"
                value={driveForm.type}
                onChange={(e) => setDriveForm({ ...driveForm, type: e.target.value })}
                placeholder="e.g. Campus Placement Drive · 50 Openings"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Drive Target Date</label>
                <input
                  type="date"
                  value={driveForm.date}
                  onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Job Description Doc</label>
                <input
                  type="text"
                  value={driveForm.file}
                  onChange={(e) => setDriveForm({ ...driveForm, file: e.target.value })}
                  placeholder="e.g. jd-engineer-2026.pdf"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddDriveOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0f4c81] text-white">
                Add Drive
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* 4. Add Company Benefit Modal (Employer) */}
      {isAddPerkOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddPerkOpen(false)}
          title="Add Company Culture & Benefit"
          size="md"
        >
          <form onSubmit={handleAddPerk} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Benefit Title *
              </label>
              <input
                type="text"
                required
                value={perkForm.title}
                onChange={(e) => setPerkForm({ ...perkForm, title: e.target.value })}
                placeholder="e.g. Wellness Stipend & Health Coverage"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Category</label>
              <select
                value={perkForm.type}
                onChange={(e) => setPerkForm({ ...perkForm, type: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Work Culture">Work Culture</option>
                <option value="Perks & Growth">Perks & Growth</option>
                <option value="Wellness & Healthcare">Wellness & Healthcare</option>
                <option value="Compensation & Stock Options">Compensation & Stock Options</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={perkForm.description}
                onChange={(e) => setPerkForm({ ...perkForm, description: e.target.value })}
                placeholder="Describe this perk and how it benefits student recruits..."
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAddPerkOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-[#0f4c81] text-white">
                Add Benefit
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentEmployability;