import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
export type ApplicationStatus =
  | "Submitted"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Selected"
  | "Rejected";

export interface StudentApplicationData {
  id: string;
  applicationNumber: string;
  studentName: string;
  opportunity: string;
  submissionDate: string;
  applicationStatus: ApplicationStatus;
  resume?: string;
  eligibilitySummary: string;
  applicationQuestions: string;
  declarationConsent: boolean;
}

const formatDate = (value?: string) => {
  if (!value) return "N/A";
  const [datePart] = value.split("T");
  const parts = datePart.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const INITIAL_APPLICATIONS: StudentApplicationData[] = [
  {
    id: "1",
    applicationNumber: "APP-2024-001",
    studentName: "Aarav Sharma",
    opportunity: "Software Development Engineer (Frontend) - ABC Technologies Pvt. Ltd.",
    submissionDate: "2024-01-18",
    applicationStatus: "Selected",
    resume: "aarav_sharma_resume_v2.pdf",
    eligibilitySummary: "Eligible: B.Tech CSE (8.8 CGPA), meets 65% aggregate criteria, no active backlogs.",
    applicationQuestions: "Over 2 years of project experience in React/TypeScript, Redux, and TailwindCSS. Built 3 full-stack web applications.",
    declarationConsent: true,
  },
  {
    id: "2",
    applicationNumber: "APP-2024-002",
    studentName: "Priya Patel",
    opportunity: "Data Analyst & Business Intelligence Intern - XYZ Industries",
    submissionDate: "2024-02-05",
    applicationStatus: "Interview Scheduled",
    resume: "priya_patel_cv_data.pdf",
    eligibilitySummary: "Eligible: B.Tech IT (8.2 CGPA), coursework in database management and statistics completed.",
    applicationQuestions: "Proficient in Python pandas, SQL data warehousing, and building interactive Power BI dashboards.",
    declarationConsent: true,
  },
  {
    id: "3",
    applicationNumber: "APP-2024-003",
    studentName: "Rahul Verma",
    opportunity: "Systems Engineer (Ninja & Digital) - Tata Consultancy Services (TCS)",
    submissionDate: "2024-02-22",
    applicationStatus: "Shortlisted",
    resume: "rahul_verma_mca_resume.pdf",
    eligibilitySummary: "Eligible: MCA final year (7.9 CGPA), verified consistent 60%+ throughout 10th and 12th.",
    applicationQuestions: "Hands-on experience in Java Spring Boot backend services, microservices design, and REST APIs.",
    declarationConsent: true,
  },
  {
    id: "4",
    applicationNumber: "APP-2024-004",
    studentName: "Sneha Rao",
    opportunity: "Specialist Programmer - Infosys Limited",
    submissionDate: "2024-03-01",
    applicationStatus: "Under Review",
    resume: "sneha_rao_competitive_profile.pdf",
    eligibilitySummary: "Eligible: B.Tech ECE (8.5 CGPA), qualified internal coding benchmark with distinction.",
    applicationQuestions: "Solved 450+ LeetCode problems in dynamic programming and graph algorithms; 5-star HackerRank in Python.",
    declarationConsent: true,
  },
  {
    id: "5",
    applicationNumber: "APP-2024-005",
    studentName: "Vikram Das",
    opportunity: "Industrial Automation Apprentice - Eastern Enterprises",
    submissionDate: "2024-03-12",
    applicationStatus: "Submitted",
    resume: "vikram_das_mechanical_apprentice.pdf",
    eligibilitySummary: "Eligible: B.Tech ME (7.4 CGPA), certified in PLC programming and industrial instrumentation.",
    applicationQuestions: "Completed 6-week industrial internship at Rourkela Steel Plant on automated hydraulic machinery.",
    declarationConsent: true,
  },
  {
    id: "6",
    applicationNumber: "APP-2024-006",
    studentName: "Ananya Mishra",
    opportunity: "DevOps & Cloud Specialist - Digital Solutions",
    submissionDate: "2024-01-28",
    applicationStatus: "Rejected",
    resume: "ananya_mishra_cloud.pdf",
    eligibilitySummary: "Not fully matched: Role requires minimum 1 year commercial experience; applicant is pre-final year.",
    applicationQuestions: "Targeting AWS Certified Solutions Architect and Docker/Kubernetes container orchestration.",
    declarationConsent: true,
  },
];

const getStatusClass = (status: ApplicationStatus) => {
  const styles: Record<ApplicationStatus, string> = {
    Submitted: "bg-blue-100 text-blue-800 border border-blue-200",
    "Under Review": "bg-purple-100 text-purple-800 border border-purple-200",
    Shortlisted: "bg-amber-100 text-amber-800 border border-amber-200",
    "Interview Scheduled": "bg-cyan-100 text-cyan-800 border border-cyan-200",
    Selected: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const StatusBadge = ({ status }: { status: ApplicationStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
      status
    )}`}
  >
    {status}
  </span>
);

const APPLICATION_COLUMNS: TableColumnDef<StudentApplicationData>[] = [
  {
    id: "applicationNumber",
    header: "Application No.",
    accessorFn: (row) => row.applicationNumber,
    Cell: ({ row: { original: row } }) => (
      <span className="font-semibold text-foreground text-xs">
        {row.applicationNumber}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "studentName",
    header: "Student Name",
    accessorFn: (row) => row.studentName,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.studentName}>
        {row.studentName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "opportunity",
    header: "Opportunity / Role",
    accessorFn: (row) => row.opportunity,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[280px] truncate" title={row.opportunity}>
        {row.opportunity}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "submissionDate",
    header: "Submitted On",
    accessorFn: (row) => row.submissionDate,
    Cell: ({ row: { original: row } }) => formatDate(row.submissionDate),
    enableSorting: true,
  },
  {
    id: "applicationStatus",
    header: "Status",
    accessorFn: (row) => row.applicationStatus,
    Cell: ({ row: { original: row } }) => <StatusBadge status={row.applicationStatus} />,
    enableSorting: true,
  },
  {
    id: "resume",
    header: "Resume",
    accessorFn: (row) => row.resume || "resume.pdf",
    defaultHidden: true,
  },
  {
    id: "eligibilitySummary",
    header: "Eligibility Summary",
    accessorFn: (row) => row.eligibilitySummary,
    defaultHidden: true,
  },
  {
    id: "applicationQuestions",
    header: "Application Questions",
    accessorFn: (row) => row.applicationQuestions,
    defaultHidden: true,
  },
  {
    id: "declarationConsent",
    header: "Declaration / Consent",
    accessorFn: (row) => (row.declarationConsent ? "Confirmed" : "Pending"),
    defaultHidden: true,
  },
];

const ApplicationPreview = ({ app }: { app: StudentApplicationData }) => {
  const details = [
    ["Application Number", app.applicationNumber],
    ["Student Name", app.studentName],
    ["Opportunity", app.opportunity],
    ["Submission Date", formatDate(app.submissionDate)],
    ["Resume File", app.resume || "N/A"],
    ["Declaration / Consent", app.declarationConsent ? "Confirmed & Agreed" : "Pending"],
  ];

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm md:grid-cols-2">
        {details.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="mt-1 break-words font-medium text-foreground">
              {value}
            </dd>
          </div>
        ))}
        <div>
          <dt className="text-xs text-muted">Application Status</dt>
          <dd className="mt-1">
            <StatusBadge status={app.applicationStatus} />
          </dd>
        </div>
      </dl>

      <div className="space-y-3 border-t pt-3">
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Eligibility Summary
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {app.eligibilitySummary}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Application Questions & Responses
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {app.applicationQuestions}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface StudentapplicationViewProps {
  hideHeader?: boolean;
}

const StudentapplicationView = ({ hideHeader }: StudentapplicationViewProps = {}) => {
  const navigate = useAppNavigate();
  const [applications, setApplications] =
    useState<StudentApplicationData[]>(INITIAL_APPLICATIONS);
  const [selectedApp, setSelectedApp] =
    useState<StudentApplicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () =>
      statusFilter
        ? applications.filter((a) => a.applicationStatus === statusFilter)
        : applications,
    [applications, statusFilter]
  );

  const openDetails = useCallback((app: StudentApplicationData) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: ApplicationStatus) => {
      setApplications((prev) =>
        prev.map((a) => (ids.includes(a.id) ? { ...a, applicationStatus: status } : a))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} applications updated to ${status}`
          : `Application status updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Student Applications"
          description="Monitor and manage student job, internship and placement applications."
          breadcrumb={[
            { label: "Placement" },
            { label: "Student Applications" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/student-application")}
            >
              Submit Application
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Student Applications" : undefined} flush>
        <DataTable
          caption="Placement & Internship Student Applications"
          data={rows}
          columns={APPLICATION_COLUMNS}
          getRowId={(a) => a.id}
          rowLabel={(a) => `${a.applicationNumber} - ${a.studentName}`}
          searchPlaceholder="Search by application number, student, opportunity..."
          exportFileName="student_placement_applications"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "review",
              label: "Mark Under Review",
              icon: Clock,
              onClick: (ids) => {
                updateStatus(ids, "Under Review");
                setSelection([]);
              },
            },
            {
              id: "shortlist",
              label: "Mark Shortlisted",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Shortlisted");
                setSelection([]);
              },
            },
            {
              id: "select",
              label: "Mark Selected",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Selected");
                setSelection([]);
              },
            },
            {
              id: "reject",
              label: "Mark Rejected",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateStatus(ids, "Rejected");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/student-application", {
                state: { editRecord: item },
              }),
            more: (item) => [
              {
                id: "view",
                label: "View Details",
                icon: Eye,
                onSelect: () => openDetails(item),
              },
            ],
          }}
          previewTitle={(a) => `${a.applicationNumber} - ${a.studentName}`}
          renderPreview={(a) => <ApplicationPreview app={a} />}
          emptyTitle="No student applications found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/student-application")}
            >
              Submit Application
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedApp
            ? `Application Details - ${selectedApp.applicationNumber}`
            : "Application Details"
        }
        size="2xl"
      >
        {selectedApp && (
          <div className="space-y-4 p-4">
            <ApplicationPreview app={selectedApp} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedApp;
                  setIsModalOpen(false);
                  navigate("/student-application", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default StudentapplicationView;