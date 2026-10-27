import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { exportToExcel } from '@mfe/utils';
import {
  Eye,
  Trash2,
  FileSpreadsheet,
  Building2,
  GraduationCap,
  CheckCircle2,
  Award,
  Users
} from "lucide-react";

export type SelectionStageType =
  | "Applied"
  | "Shortlisted"
  | "Offer Issued"
  | "Offer Accepted"
  | "Joined"
  | "Joining Awaited"
  | "Declined";

export type OpportunityCategoryType =
  | "Full-Time Job"
  | "Internship"
  | "Industrial Apprenticeship"
  | "Skill Enhancement Training";

export interface PlacementRecord {
  id: string;
  studentName: string;
  rollNo: string;
  academicSession: string;
  institutionProgramme: string;
  employer: string;
  industry: string;
  opportunityType: OpportunityCategoryType;
  selectionStage: SelectionStageType;
  salaryPackage: string;
  salaryNumeric: number; // LPA
  joiningDate?: string;
  profileCompletion: number;
  counsellingAttended: boolean;
  assessmentScore: string;
  trainingCertified: boolean;
  engagementScore: number;
  remarks?: string;
}

export interface EmployerParticipationRecord {
  id: string;
  employerName: string;
  industry: string;
  academicSession: string;
  registrationStatus: "Registered" | "MOU Active" | "Pending Renewal";
  activeRecruiter: boolean;
  drivesConducted: number;
  opportunityType: string;
  totalApplications: number;
  offersReleased: number;
  joinedCount: number;
  highestPackage: string;
  averagePackage: string;
}

const INITIAL_PLACEMENTS: PlacementRecord[] = [
  {
    id: "1",
    studentName: "Aarav Sharma",
    rollNo: "STU-2022-001",
    academicSession: "2024 - 2025",
    institutionProgramme: "Faculty of Engineering & Technology - B.Tech (All Branches)",
    employer: "Google India",
    industry: "Cloud & Product Engineering",
    opportunityType: "Full-Time Job",
    selectionStage: "Offer Accepted",
    salaryPackage: "₹ 28.50 LPA",
    salaryNumeric: 28.5,
    joiningDate: "2024-07-15",
    profileCompletion: 98,
    counsellingAttended: true,
    assessmentScore: "95% (Cleared)",
    trainingCertified: true,
    engagementScore: 97,
    remarks: "Offered Software Engineer L3 role. Outstanding coding & problem solving proficiency.",
  },
  {
    id: "2",
    studentName: "Priya Patel",
    rollNo: "STU-2022-045",
    academicSession: "2024 - 2025",
    institutionProgramme: "Faculty of Engineering & Technology - B.Tech (All Branches)",
    employer: "Microsoft India",
    industry: "Cloud & Product Engineering",
    opportunityType: "Full-Time Job",
    selectionStage: "Joined",
    salaryPackage: "₹ 24.00 LPA",
    salaryNumeric: 24.0,
    joiningDate: "2024-06-01",
    profileCompletion: 96,
    counsellingAttended: true,
    assessmentScore: "92% (Cleared)",
    trainingCertified: true,
    engagementScore: 95,
    remarks: "Joined Azure Core team. High technical score in Cloud and Distributed systems.",
  },
  {
    id: "3",
    studentName: "Sneha Rao",
    rollNo: "STU-2023-089",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Electronics & Communication - B.Tech ECE",
    employer: "Amazon Web Services (AWS)",
    industry: "Cloud & Product Engineering",
    opportunityType: "Internship",
    selectionStage: "Joined",
    salaryPackage: "₹ 15.00 LPA",
    salaryNumeric: 15.0,
    joiningDate: "2024-05-15",
    profileCompletion: 94,
    counsellingAttended: true,
    assessmentScore: "89% (Cleared)",
    trainingCertified: true,
    engagementScore: 92,
    remarks: "Summer Cloud Solutions Architecture internship with pre-placement offer option.",
  },
  {
    id: "4",
    studentName: "Rahul Verma",
    rollNo: "STU-2023-018",
    academicSession: "2024 - 2025",
    institutionProgramme: "School of Computer Applications - MCA & B.Sc CS",
    employer: "Tata Consultancy Services",
    industry: "IT & Software Services",
    opportunityType: "Full-Time Job",
    selectionStage: "Offer Accepted",
    salaryPackage: "₹ 9.00 LPA",
    salaryNumeric: 9.0,
    joiningDate: "2024-08-01",
    profileCompletion: 91,
    counsellingAttended: true,
    assessmentScore: "86% (Cleared)",
    trainingCertified: true,
    engagementScore: 89,
    remarks: "Selected under TCS Digital cadre through National Qualifier Test & Technical interview.",
  },
  {
    id: "5",
    studentName: "Vikram Das",
    rollNo: "STU-2022-092",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Mechanical & Civil - B.Tech Core",
    employer: "Tata Consultancy Services",
    industry: "Core Engineering & Manufacturing",
    opportunityType: "Industrial Apprenticeship",
    selectionStage: "Joined",
    salaryPackage: "₹ 6.50 LPA",
    salaryNumeric: 6.5,
    joiningDate: "2024-06-15",
    profileCompletion: 88,
    counsellingAttended: true,
    assessmentScore: "81% (Cleared)",
    trainingCertified: true,
    engagementScore: 86,
    remarks: "1-year industry automation apprenticeship under national engineering talent initiative.",
  },
  {
    id: "6",
    studentName: "Kavita Reddy",
    rollNo: "STU-2022-112",
    academicSession: "2024 - 2025",
    institutionProgramme: "School of Management & Business Studies - MBA",
    employer: "Deloitte Consulting",
    industry: "Consulting & Financial Services",
    opportunityType: "Full-Time Job",
    selectionStage: "Offer Issued",
    salaryPackage: "₹ 11.50 LPA",
    salaryNumeric: 11.5,
    joiningDate: "2024-08-15",
    profileCompletion: 92,
    counsellingAttended: true,
    assessmentScore: "88% (Cleared)",
    trainingCertified: true,
    engagementScore: 90,
    remarks: "Risk Advisory & Strategic consulting associate offer issued; awaiting onboarding rollout.",
  },
  {
    id: "7",
    studentName: "Aditya Nair",
    rollNo: "STU-2022-077",
    academicSession: "2023 - 2024",
    institutionProgramme: "School of Computer Applications - MCA & B.Sc CS",
    employer: "Infosys Technologies",
    industry: "IT & Software Services",
    opportunityType: "Full-Time Job",
    selectionStage: "Joined",
    salaryPackage: "₹ 9.50 LPA",
    salaryNumeric: 9.5,
    joiningDate: "2023-08-10",
    profileCompletion: 89,
    counsellingAttended: true,
    assessmentScore: "87% (Cleared)",
    trainingCertified: true,
    engagementScore: 88,
    remarks: "Specialist Programmer profile recruited via HackWithInfy national coding hackathon.",
  },
  {
    id: "8",
    studentName: "Ananya Sen",
    rollNo: "STU-2022-134",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Electronics & Communication - B.Tech ECE",
    employer: "Cognizant Technology Solutions",
    industry: "IT & Software Services",
    opportunityType: "Full-Time Job",
    selectionStage: "Joining Awaited",
    salaryPackage: "₹ 7.20 LPA",
    salaryNumeric: 7.2,
    joiningDate: "2024-09-01",
    profileCompletion: 90,
    counsellingAttended: true,
    assessmentScore: "84% (Cleared)",
    trainingCertified: true,
    engagementScore: 87,
    remarks: "GenC Elevate profile offer released; medical verification and bg check in progress.",
  },
  {
    id: "9",
    studentName: "Manish Kumar",
    rollNo: "STU-2023-044",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Mechanical & Civil - B.Tech Core",
    employer: "Wipro Technologies",
    industry: "Core Engineering & Manufacturing",
    opportunityType: "Skill Enhancement Training",
    selectionStage: "Shortlisted",
    salaryPackage: "₹ 5.50 LPA",
    salaryNumeric: 5.5,
    joiningDate: "2024-07-20",
    profileCompletion: 87,
    counsellingAttended: true,
    assessmentScore: "78% (Cleared)",
    trainingCertified: true,
    engagementScore: 82,
    remarks: "Advanced Mechatronics & Industry 4.0 corporate training with guaranteed interview track.",
  },
  {
    id: "10",
    studentName: "Ritu Goswami",
    rollNo: "STU-2022-160",
    academicSession: "2023 - 2024",
    institutionProgramme: "School of Management & Business Studies - MBA",
    employer: "Deloitte Consulting",
    industry: "Consulting & Financial Services",
    opportunityType: "Full-Time Job",
    selectionStage: "Joined",
    salaryPackage: "₹ 10.80 LPA",
    salaryNumeric: 10.8,
    joiningDate: "2023-07-15",
    profileCompletion: 93,
    counsellingAttended: true,
    assessmentScore: "90% (Cleared)",
    trainingCertified: true,
    engagementScore: 91,
    remarks: "Human Capital Consultant associate role; successfully completed 1-year mark.",
  },
];

const INITIAL_EMPLOYER_PARTICIPATION: EmployerParticipationRecord[] = [
  {
    id: "EMP-01",
    employerName: "Tata Consultancy Services",
    industry: "IT & Software Services",
    academicSession: "2024 - 2025",
    registrationStatus: "MOU Active",
    activeRecruiter: true,
    drivesConducted: 4,
    opportunityType: "Full-Time Job & Apprenticeship",
    totalApplications: 340,
    offersReleased: 84,
    joinedCount: 78,
    highestPackage: "₹ 9.00 LPA",
    averagePackage: "₹ 7.20 LPA",
  },
  {
    id: "EMP-02",
    employerName: "Google India",
    industry: "Cloud & Product Engineering",
    academicSession: "2024 - 2025",
    registrationStatus: "Registered",
    activeRecruiter: true,
    drivesConducted: 2,
    opportunityType: "Full-Time Job & Internship",
    totalApplications: 210,
    offersReleased: 12,
    joinedCount: 11,
    highestPackage: "₹ 28.50 LPA",
    averagePackage: "₹ 26.00 LPA",
  },
  {
    id: "EMP-03",
    employerName: "Microsoft India",
    industry: "Cloud & Product Engineering",
    academicSession: "2024 - 2025",
    registrationStatus: "MOU Active",
    activeRecruiter: true,
    drivesConducted: 2,
    opportunityType: "Full-Time Job",
    totalApplications: 195,
    offersReleased: 15,
    joinedCount: 14,
    highestPackage: "₹ 24.00 LPA",
    averagePackage: "₹ 22.50 LPA",
  },
  {
    id: "EMP-04",
    employerName: "Amazon Web Services (AWS)",
    industry: "Cloud & Product Engineering",
    academicSession: "2024 - 2025",
    registrationStatus: "MOU Active",
    activeRecruiter: true,
    drivesConducted: 3,
    opportunityType: "Internship & Full-Time Job",
    totalApplications: 260,
    offersReleased: 22,
    joinedCount: 20,
    highestPackage: "₹ 18.00 LPA",
    averagePackage: "₹ 14.50 LPA",
  },
  {
    id: "EMP-05",
    employerName: "Deloitte Consulting",
    industry: "Consulting & Financial Services",
    academicSession: "2024 - 2025",
    registrationStatus: "Registered",
    activeRecruiter: true,
    drivesConducted: 3,
    opportunityType: "Full-Time Job",
    totalApplications: 180,
    offersReleased: 28,
    joinedCount: 25,
    highestPackage: "₹ 11.50 LPA",
    averagePackage: "₹ 9.80 LPA",
  },
  {
    id: "EMP-06",
    employerName: "Infosys Technologies",
    industry: "IT & Software Services",
    academicSession: "2024 - 2025",
    registrationStatus: "MOU Active",
    activeRecruiter: true,
    drivesConducted: 3,
    opportunityType: "Full-Time Job",
    totalApplications: 290,
    offersReleased: 56,
    joinedCount: 51,
    highestPackage: "₹ 9.50 LPA",
    averagePackage: "₹ 6.80 LPA",
  },
  {
    id: "EMP-07",
    employerName: "Cognizant Technology Solutions",
    industry: "IT & Software Services",
    academicSession: "2024 - 2025",
    registrationStatus: "Registered",
    activeRecruiter: true,
    drivesConducted: 2,
    opportunityType: "Full-Time Job",
    totalApplications: 230,
    offersReleased: 42,
    joinedCount: 38,
    highestPackage: "₹ 7.20 LPA",
    averagePackage: "₹ 5.80 LPA",
  },
  {
    id: "EMP-08",
    employerName: "Wipro Technologies",
    industry: "Core Engineering & Manufacturing",
    academicSession: "2024 - 2025",
    registrationStatus: "Registered",
    activeRecruiter: true,
    drivesConducted: 2,
    opportunityType: "Training & Job",
    totalApplications: 175,
    offersReleased: 31,
    joinedCount: 29,
    highestPackage: "₹ 6.50 LPA",
    averagePackage: "₹ 5.40 LPA",
  },
];

const getStageBadgeClass = (stage: SelectionStageType) => {
  switch (stage) {
    case "Joined":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Offer Accepted":
      return "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300";
    case "Offer Issued":
      return "bg-purple-100 text-purple-800 border border-purple-300 dark:bg-purple-950/40 dark:text-purple-300";
    case "Joining Awaited":
      return "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300";
    case "Shortlisted":
      return "bg-sky-100 text-sky-800 border border-sky-300 dark:bg-sky-950/40 dark:text-sky-300";
    case "Applied":
      return "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300";
    case "Declined":
      return "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};


export interface ViewDashBoardProps {
  hideHeader?: boolean;
}

const ViewDashBoard = ({ hideHeader }: ViewDashBoardProps = {}) => {
  const navigate = useAppNavigate();

  // Selected filters from user
  const [selectedSession] = useState<string>("All");
  const [selectedProgramme] = useState<string>("All");
  const [selectedEmployer] = useState<string>("All");
  const [selectedOpportunity] = useState<string>("All");

  // Active view tab: 'placementStats' | 'employerParticipation' | 'studentEngagement'
  const [activeTab, setActiveTab] = useState<"placementStats" | "employerParticipation" | "studentEngagement">("placementStats");

  const [data, setData] = useState<PlacementRecord[]>(INITIAL_PLACEMENTS);
  const employersData = INITIAL_EMPLOYER_PARTICIPATION;
  const [selectedItem, setSelectedItem] = useState<PlacementRecord | null>(null);
  const [selectedEmployerItem, setSelectedEmployerItem] = useState<EmployerParticipationRecord | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Filtered Placements Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSession = selectedSession === "All" || item.academicSession === selectedSession;
      const matchProg = selectedProgramme === "All" || item.institutionProgramme.includes(selectedProgramme) || selectedProgramme.includes(item.institutionProgramme);
      const matchEmp = selectedEmployer === "All" || item.employer.toLowerCase().includes(selectedEmployer.toLowerCase()) || item.industry.toLowerCase().includes(selectedEmployer.toLowerCase());
      const matchOpp = selectedOpportunity === "All" || item.opportunityType === selectedOpportunity;
      return matchSession && matchProg && matchEmp && matchOpp;
    });
  }, [data, selectedSession, selectedProgramme, selectedEmployer, selectedOpportunity]);

  // Filtered Employers Data
  const filteredEmployers = useMemo(() => {
    return employersData.filter((item) => {
      const matchSession = selectedSession === "All" || item.academicSession === selectedSession;
      const matchEmp = selectedEmployer === "All" || item.employerName.toLowerCase().includes(selectedEmployer.toLowerCase()) || item.industry.toLowerCase().includes(selectedEmployer.toLowerCase());
      return matchSession && matchEmp;
    });
  }, [employersData, selectedSession, selectedEmployer]);

  const handleEdit = useCallback((item: PlacementRecord) => {
    navigate("/dashboard-analytics", {
      state: {
        editRecord: {
          id: item.id,
          reportTitle: `Outcome Analysis - ${item.studentName}`,
          academicSession: item.academicSession,
          institutionProgramme: item.institutionProgramme,
          employer: item.employer,
          opportunityType: item.opportunityType,
          remarks: item.remarks,
        },
      },
    });
  }, [navigate]);

  const handleDelete = useCallback((item: PlacementRecord) => {
    setData((prev) => prev.filter((d) => d.id !== item.id));
    showToast.success(`Record for "${item.studentName}" deleted.`);
  }, []);

  const handleBulkExportExcel = async (keys: string[]) => {
    const selectedRows = filteredData.filter((d) => keys.includes(d.id));
    await exportToExcel(COLUMNS, selectedRows.length ? selectedRows : filteredData, "placement_analytics_report");
    showToast.success(`Exported ${selectedRows.length || filteredData.length} record(s) to Excel.`);
  };

  // 1. Columns for Placement Statistics Table
  const COLUMNS: TableColumnDef<PlacementRecord>[] = [
    {
      id: "studentName",
      header: "Student & Roll No",
      accessorFn: (row) => `${row.studentName} ${row.rollNo}`,
      Cell: ({ row: { original: row } }) => (
        <div>
          <span className="font-semibold text-foreground text-xs">{row.studentName}</span>
          <p className="text-[11px] text-muted">{row.rollNo}</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "employer",
      header: "Employer & Sector",
      accessorFn: (row) => `${row.employer} ${row.industry}`,
      Cell: ({ row: { original: row } }) => (
        <div>
          <p className="font-medium text-foreground text-xs">{row.employer}</p>
          <p className="text-[11px] text-muted">{row.industry}</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "salaryPackage",
      header: "Salary Package",
      accessorFn: (row) => row.salaryPackage,
      Cell: ({ row: { original: row } }) => (
        <span className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">
          {row.salaryPackage}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "selectionStage",
      header: "Outcome Stage",
      accessorFn: (row) => row.selectionStage,
      Cell: ({ row: { original: row } }) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStageBadgeClass(row.selectionStage)}`}>
          {row.selectionStage}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "institutionProgramme",
      header: "Programme",
      accessorFn: (row) => row.institutionProgramme,
      defaultHidden: true,
    },
    {
      id: "opportunityType",
      header: "Opportunity Type",
      accessorFn: (row) => row.opportunityType,
      defaultHidden: true,
    },
    {
      id: "engagementScore",
      header: "Engagement Score",
      accessorFn: (row) => row.engagementScore,
      defaultHidden: true,
    },
  ];

  // 2. Columns for Employer Participation Table
  const EMPLOYER_COLUMNS: TableColumnDef<EmployerParticipationRecord>[] = [
    {
      id: "employerName",
      header: "Employer Name",
      accessorFn: (row) => row.employerName,
      Cell: ({ row: { original: row } }) => (
        <div>
          <p className="font-semibold text-foreground">{row.employerName}</p>
          <span className="text-xs text-muted">{row.industry}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "registrationStatus",
      header: "Registration Status",
      accessorFn: (row) => row.registrationStatus,
      Cell: ({ row: { original: row } }) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          {row.registrationStatus}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "drivesConducted",
      header: "Drives Conducted",
      accessorFn: (row) => row.drivesConducted,
      Cell: ({ row: { original: row } }) => (
        <span className="font-semibold text-foreground">{row.drivesConducted} Drives</span>
      ),
      enableSorting: true,
    },
    {
      id: "opportunityType",
      header: "Opportunity Types",
      accessorFn: (row) => row.opportunityType,
      Cell: ({ row: { original: row } }) => <span className="text-xs text-foreground">{row.opportunityType}</span>,
    },
    {
      id: "offersReleased",
      header: "Offers Released",
      accessorFn: (row) => row.offersReleased,
      Cell: ({ row: { original: row } }) => (
        <span className="font-semibold text-purple-600">{row.offersReleased}</span>
      ),
      enableSorting: true,
    },
    {
      id: "joinedCount",
      header: "Joined Candidates",
      accessorFn: (row) => row.joinedCount,
      Cell: ({ row: { original: row } }) => (
        <span className="font-semibold text-emerald-600">{row.joinedCount}</span>
      ),
      enableSorting: true,
    },
    {
      id: "highestPackage",
      header: "Highest Package",
      accessorFn: (row) => row.highestPackage,
      Cell: ({ row: { original: row } }) => <span className="font-medium text-foreground">{row.highestPackage}</span>,
      enableSorting: true,
    },
    {
      id: "averagePackage",
      header: "Average CTC",
      accessorFn: (row) => row.averagePackage,
      Cell: ({ row: { original: row } }) => <span className="font-medium text-foreground">{row.averagePackage}</span>,
      enableSorting: true,
    },
  ];

  // 3. Columns for Student Engagement Table
  const ENGAGEMENT_COLUMNS: TableColumnDef<PlacementRecord>[] = [
    {
      id: "studentName",
      header: "Student Name",
      accessorFn: (row) => row.studentName,
      Cell: ({ row: { original: row } }) => (
        <div>
          <p className="font-semibold text-foreground">{row.studentName}</p>
          <p className="text-xs text-muted">{row.rollNo}</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "institutionProgramme",
      header: "Programme",
      accessorFn: (row) => row.institutionProgramme,
      Cell: ({ row: { original: row } }) => <span className="text-xs font-medium text-foreground">{row.institutionProgramme}</span>,
      enableSorting: true,
    },
    {
      id: "profileCompletion",
      header: "Profile Completion",
      accessorFn: (row) => row.profileCompletion,
      Cell: ({ row: { original: row } }) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${row.profileCompletion >= 90 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
              style={{ width: `${row.profileCompletion}%` }}
            />
          </div>
          <span className="text-xs font-bold text-foreground">{row.profileCompletion}%</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "counsellingAttended",
      header: "Counselling Attended",
      accessorFn: (row) => (row.counsellingAttended ? "Yes" : "No"),
      Cell: ({ row: { original: row } }) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.counsellingAttended ? 'text-emerald-600' : 'text-slate-400'}`}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          {row.counsellingAttended ? "Completed" : "Pending"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "assessmentScore",
      header: "Assessment Result",
      accessorFn: (row) => row.assessmentScore,
      Cell: ({ row: { original: row } }) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
          {row.assessmentScore}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "trainingCertified",
      header: "Training & Certification",
      accessorFn: (row) => (row.trainingCertified ? "Certified" : "In Progress"),
      Cell: ({ row: { original: row } }) => (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${row.trainingCertified ? 'text-purple-600' : 'text-slate-500'}`}>
          <Award className="h-3.5 w-3.5" />
          {row.trainingCertified ? "Certified" : "In Progress"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "opportunityType",
      header: "Engaged Opportunity",
      accessorFn: (row) => row.opportunityType,
      Cell: ({ row: { original: row } }) => <span className="text-xs text-foreground">{row.opportunityType}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & PageHeader */}
      {!hideHeader && (
        <div className="flex flex-col gap-1">
          <PageHeader
            title="Placement Analytics & Reports"
            description="Institutional placement metrics, employer participation insights and cohort engagement."
            breadcrumb={[
              { label: "Analytics" },
              { label: "Overview" },
            ]}
          />
        </div>
      )}
      {/* SECTION 5: TABBED REPORTS & DETAILED DATA TABLES */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("placementStats")}
            className={`pb-2.5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "placementStats"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            Placement Statistics & Outcomes ({filteredData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("employerParticipation")}
            className={`pb-2.5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "employerParticipation"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Building2 className="h-4 w-4" />
            Employer Participation & Drives ({filteredEmployers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("studentEngagement")}
            className={`pb-2.5 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
              activeTab === "studentEngagement"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            Student Engagement Index ({filteredData.length})
          </button>
        </div>

        {/* TAB 1: Placement Statistics Table */}
        {activeTab === "placementStats" && (
          <Card title={hideHeader ? "Placement Statistics & Outcomes" : undefined} flush>
          <DataTable
            caption="Placement Statistics & Outcomes"
            data={filteredData}
            columns={COLUMNS}
            getRowId={(row) => row.id}
            rowLabel={(row) => `${row.studentName} - ${row.employer}`}
            searchPlaceholder="Search by student, roll no, employer, programme, stage..."
            exportFileName="placement_statistics_outcomes"
            selectable={false}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            actions={{
              onView: (item) => setSelectedItem(item),
              onEdit: handleEdit,
              onDelete: handleDelete,
              more: (item) => [
                {
                  id: "view-details",
                  label: "View Full Profile & Analytics",
                  icon: Eye,
                  onSelect: () => setSelectedItem(item),
                },
              ],
            }}
            previewTitle={(item) => `Placement Outcome - ${item.studentName}`}
            renderPreview={(item) => (
              <div className="space-y-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Student Name</dt>
                    <dd className="font-semibold text-foreground">{item.studentName} ({item.rollNo})</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Academic Session</dt>
                    <dd className="font-medium text-foreground">{item.academicSession}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-xs text-muted">Institution / Programme</dt>
                    <dd className="font-medium text-foreground">{item.institutionProgramme}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Employer</dt>
                    <dd className="font-semibold text-primary">{item.employer}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Industry Sector</dt>
                    <dd className="font-medium text-foreground">{item.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Opportunity Type</dt>
                    <dd className="font-medium text-foreground">{item.opportunityType}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Salary Package</dt>
                    <dd className="font-bold text-emerald-600">{item.salaryPackage}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Outcome Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${getStageBadgeClass(item.selectionStage)}`}>
                        {item.selectionStage}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Joining Date</dt>
                    <dd className="font-medium text-foreground">{item.joiningDate || "Awaited"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Profile Completion</dt>
                    <dd className="font-semibold text-foreground">{item.profileCompletion}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Assessment Result</dt>
                    <dd className="font-medium text-foreground">{item.assessmentScore}</dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="text-xs text-muted">Evaluation & Outcome Remarks</dt>
                    <dd className="text-xs text-muted mt-0.5 leading-relaxed bg-muted/40 p-2.5 rounded-lg border">
                      {item.remarks || "No additional remarks recorded."}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            bulkActions={[
              {
                id: "bulk-export",
                label: "Export Selected to Excel",
                icon: FileSpreadsheet,
                onClick: handleBulkExportExcel,
              },
              {
                id: "delete",
                label: "Delete Selected",
                icon: Trash2,
                danger: true,
                onClick: (keys) => {
                  setData((prev) => prev.filter((d) => !keys.includes(d.id)));
                  setSelectedKeys([]);
                  showToast.success(`Deleted ${keys.length} record(s).`);
                },
              },
            ]}
          />
          </Card>
        )}

        {/* TAB 2: Employer Participation Table */}
        {activeTab === "employerParticipation" && (
          <Card title={hideHeader ? "Employer Participation & Campus Drives" : undefined} flush>
          <DataTable
            caption="Employer Participation & Campus Drives"
            data={filteredEmployers}
            columns={EMPLOYER_COLUMNS}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.employerName}
            searchPlaceholder="Search by employer name, industry, opportunity..."
            exportFileName="employer_participation_report"
            actions={{
              onView: (item) => setSelectedEmployerItem(item),
            }}
            previewTitle={(item) => `Employer Profile - ${item.employerName}`}
            renderPreview={(item) => (
              <div className="space-y-4">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Employer Name</dt>
                    <dd className="font-semibold text-foreground">{item.employerName}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Industry Sector</dt>
                    <dd className="font-medium text-foreground">{item.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Registration Status</dt>
                    <dd className="font-medium text-emerald-600">{item.registrationStatus}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Drives Conducted</dt>
                    <dd className="font-semibold text-foreground">{item.drivesConducted} Drives</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Applications Received</dt>
                    <dd className="font-medium text-foreground">{item.totalApplications}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Offers Released</dt>
                    <dd className="font-semibold text-purple-600">{item.offersReleased}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Joined Candidates</dt>
                    <dd className="font-bold text-emerald-600">{item.joinedCount}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Package Range</dt>
                    <dd className="font-semibold text-foreground">{item.averagePackage} - {item.highestPackage}</dd>
                  </div>
                </dl>
              </div>
            )}
          />
          </Card>
        )}

        {/* TAB 3: Student Engagement Index Table */}
        {activeTab === "studentEngagement" && (
          <Card title={hideHeader ? "Student Engagement & Readiness Index" : undefined} flush>
          <DataTable
            caption="Student Engagement & Readiness Index"
            data={filteredData}
            columns={ENGAGEMENT_COLUMNS}
            getRowId={(row) => row.id}
            rowLabel={(row) => row.studentName}
            searchPlaceholder="Search student engagement records..."
            exportFileName="student_engagement_index"
            actions={{
              onView: (item) => setSelectedItem(item),
            }}
          />
          </Card>
        )}
      </div>

      {/* Modal for Placement Detail Preview */}
      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={`Placement & Analytics Breakdown - ${selectedItem.studentName}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-base text-foreground">{selectedItem.studentName}</h4>
                <p className="text-xs text-muted">Roll No: {selectedItem.rollNo} | Session: {selectedItem.academicSession}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStageBadgeClass(selectedItem.selectionStage)}`}>
                {selectedItem.selectionStage}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Employer / Organization</span>
                <span className="font-semibold text-foreground text-sm">{selectedItem.employer}</span>
                <span className="text-xs text-muted block mt-0.5">{selectedItem.industry}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Package / Salary</span>
                <span className="font-bold text-emerald-600 text-base">{selectedItem.salaryPackage}</span>
                <span className="text-xs text-muted block mt-0.5">Opportunity: {selectedItem.opportunityType}</span>
              </div>
            </div>

            <div className="p-3 bg-card border rounded-lg space-y-2">
              <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Employability Indicators</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted block">Profile Completion:</span>
                  <span className="font-bold text-foreground">{selectedItem.profileCompletion}%</span>
                </div>
                <div>
                  <span className="text-muted block">Counselling Status:</span>
                  <span className="font-bold text-emerald-600">{selectedItem.counsellingAttended ? "Attended" : "Not Attended"}</span>
                </div>
                <div>
                  <span className="text-muted block">Assessment Score:</span>
                  <span className="font-bold text-blue-600">{selectedItem.assessmentScore}</span>
                </div>
                <div>
                  <span className="text-muted block">Certification:</span>
                  <span className="font-bold text-purple-600">{selectedItem.trainingCertified ? "Certified" : "Pending"}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border text-xs">
              <span className="font-semibold text-foreground block mb-1">Remarks & Joining Verification</span>
              <p className="text-muted leading-relaxed">{selectedItem.remarks}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const item = selectedItem;
                  setSelectedItem(null);
                  handleEdit(item);
                }}
              >
                Edit Analytics Record
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal for Employer Participation Detail Preview */}
      {selectedEmployerItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEmployerItem(null)}
          title={`Corporate Partner Profile - ${selectedEmployerItem.employerName}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-base text-foreground">{selectedEmployerItem.employerName}</h4>
                <p className="text-xs text-muted">{selectedEmployerItem.industry}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {selectedEmployerItem.registrationStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Drives Conducted</span>
                <span className="font-bold text-foreground text-base">{selectedEmployerItem.drivesConducted}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Total Applications</span>
                <span className="font-bold text-foreground text-base">{selectedEmployerItem.totalApplications}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Offers Released</span>
                <span className="font-bold text-purple-600 text-base">{selectedEmployerItem.offersReleased}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Joined Candidates</span>
                <span className="font-bold text-emerald-600 text-base">{selectedEmployerItem.joinedCount}</span>
              </div>
            </div>

            <div className="p-3 bg-card border rounded-lg">
              <p className="text-xs font-semibold text-foreground mb-1">Compensation Package Range</p>
              <p className="text-sm font-medium text-emerald-600">
                Average CTC: {selectedEmployerItem.averagePackage} | Highest CTC: {selectedEmployerItem.highestPackage}
              </p>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEmployerItem(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewDashBoard;