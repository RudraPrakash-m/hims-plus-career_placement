import { useState, useCallback } from "react";
import { Badge, Button, Card, DataTable, Modal, PageHeader, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus } from "lucide-react";

export type JobStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Published"
  | "Closed"
  | "Cancelled";

export interface JobInternshipData {
  id: string;
  opportunityType: string;
  employer: string;
  jobTitle: string;
  jobDescription: string;
  eligibilityCriteria: string;
  locationWorkMode: string;
  salaryStipend: string;
  vacancies: number | string;
  applicationStartDate: string;
  applicationEndDate: string;
  requiredDocuments: string[] | string;
  status: JobStatus;
  eligible?: boolean;
  closesText?: string;
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

const INITIAL_JOBS: JobInternshipData[] = [
  {
    id: "OPP-2001",
    opportunityType: "Job",
    employer: "TCS",
    jobTitle: "Associate Software Engineer",
    jobDescription:
      "Develop modular React/Next.js web applications, build reusable design systems, and optimize page load performance.",
    eligibilityCriteria:
      "B.Tech CSE/IT, MCA with minimum 60% or 6.0 CGPA. Strong fundamentals in algorithms and web technology.",
    locationWorkMode: "Bhubaneswar · On-site",
    salaryStipend: "₹4.0 LPA",
    vacancies: 5,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-11-01",
    closesText: "01 Nov 2026",
    requiredDocuments: ["Resume / CV", "Transcripts"],
    status: "Published",
    eligible: true,
  },
  {
    id: "OPP-2002",
    opportunityType: "Job",
    employer: "L&T Construction",
    jobTitle: "Graduate Engineer Trainee",
    jobDescription:
      "Work with multidisciplinary engineering teams on structural modeling, estimation, and site execution.",
    eligibilityCriteria:
      "B.Tech Civil / Mechanical / Electrical with minimum 6.5 CGPA.",
    locationWorkMode: "Chennai · On-site",
    salaryStipend: "₹5.3 LPA",
    vacancies: 12,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-10-28",
    closesText: "28 Oct 2026",
    requiredDocuments: ["Resume / CV", "Transcripts"],
    status: "Published",
    eligible: true,
  },
  {
    id: "OPP-2003",
    opportunityType: "Job",
    employer: "State Bank of India",
    jobTitle: "Probationary Officer",
    jobDescription:
      "General banking operations, loan appraisal, digital services enablement, and branch operations.",
    eligibilityCriteria:
      "Any graduate from a recognized university with minimum 60% marks.",
    locationWorkMode: "Pan-India · On-site",
    salaryStipend: "₹6.6 LPA",
    vacancies: 19,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-11-15",
    closesText: "15 Nov 2026",
    requiredDocuments: ["Resume / CV", "Govt ID"],
    status: "Published",
    eligible: true,
  },
  {
    id: "OPP-2006",
    opportunityType: "Job",
    employer: "Amazon Web Services",
    jobTitle: "Cloud Support Engineer",
    jobDescription:
      "Provide technical troubleshooting and infrastructure guidance for AWS cloud compute, networking, and storage.",
    eligibilityCriteria:
      "B.Tech CSE/IT with AWS Certified Cloud Practitioner / Solutions Architect and 7.5+ CGPA.",
    locationWorkMode: "Hyderabad · Hybrid",
    salaryStipend: "₹14.0 LPA",
    vacancies: 26,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-11-05",
    closesText: "05 Nov 2026",
    requiredDocuments: ["Resume / CV", "Certifications"],
    status: "Published",
    eligible: false,
  },
  {
    id: "OPP-2008",
    opportunityType: "Job",
    employer: "Mu Sigma",
    jobTitle: "Business Analyst",
    jobDescription:
      "Analyze enterprise data patterns, build statistical insights models, and collaborate with decision sciences teams.",
    eligibilityCriteria:
      "B.Tech, B.Sc Mathematics / Statistics, or Economics with strong quantitative aptitude.",
    locationWorkMode: "Bengaluru · On-site",
    salaryStipend: "₹7.0 LPA",
    vacancies: 33,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-11-20",
    closesText: "20 Nov 2026",
    requiredDocuments: ["Resume / CV", "Transcripts"],
    status: "Published",
    eligible: true,
  },
  {
    id: "OPP-2010",
    opportunityType: "Job",
    employer: "Reliance Retail",
    jobTitle: "Retail Management Trainee",
    jobDescription:
      "Oversee omnichannel store operations, supply chain logistics, customer engagement, and inventory planning.",
    eligibilityCriteria:
      "BBA / MBA / Any Graduate with good communication and retail operations interest.",
    locationWorkMode: "Bhubaneswar · On-site",
    salaryStipend: "₹3.5 LPA",
    vacancies: 40,
    applicationStartDate: "2026-10-01",
    applicationEndDate: "2026-10-30",
    closesText: "30 Oct 2026",
    requiredDocuments: ["Resume / CV"],
    status: "Published",
    eligible: true,
  },
];

const JOB_COLUMNS: TableColumnDef<JobInternshipData>[] = [
  {
    id: "jobTitle",
    header: "Title / role",
    accessorFn: (row) => row.jobTitle,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "employer",
    header: "Employer",
    accessorFn: (row) => row.employer,
    enableSorting: true,
    hideBelow: "md",
  },
  {
    id: "opportunityType",
    header: "Type",
    accessorFn: (row) => row.opportunityType,
    enableSorting: true,
    hideBelow: "lg",
  },
  {
    id: "locationWorkMode",
    header: "Location",
    accessorFn: (row) => row.locationWorkMode,
    hideBelow: "xl",
  },
  {
    id: "salaryStipend",
    header: "Salary / stipend",
    accessorFn: (row) => row.salaryStipend,
    hideBelow: "xl",
  },
  {
    id: "vacancies",
    header: "Vacancies",
    accessorFn: (row) => String(row.vacancies),
    align: "right",
    enableSorting: true,
    hideBelow: "lg",
  },
  {
    id: "closes",
    header: "Closes",
    accessorFn: (row) => row.closesText || formatDate(row.applicationEndDate),
    enableSorting: true,
    hideBelow: "lg",
  },
  {
    id: "eligibility",
    header: "Your eligibility",
    accessorFn: (row) => (row.eligible !== false ? "Eligible" : "Not eligible"),
    Cell: ({ row: { original: row } }) => (
      <Badge variant={row.eligible !== false ? "success" : "secondary"} size="sm">
        {row.eligible !== false ? "Eligible" : "Not eligible"}
      </Badge>
    ),
  },
];

const JobPreview = ({ job }: { job: JobInternshipData }) => {
  const documentsDisplay = Array.isArray(job.requiredDocuments)
    ? job.requiredDocuments.join(", ")
    : job.requiredDocuments || "None";

  const details = [
    ["Title / role", job.jobTitle],
    ["Employer", job.employer],
    ["Type", job.opportunityType],
    ["Location", job.locationWorkMode],
    ["Salary / stipend", job.salaryStipend],
    ["Vacancies", String(job.vacancies)],
    ["Closes", job.closesText || formatDate(job.applicationEndDate)],
    ["Required Documents", documentsDisplay],
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
          <dt className="text-xs text-muted">Your eligibility</dt>
          <dd className="mt-1">
            <Badge variant={job.eligible !== false ? "success" : "secondary"} size="sm">
              {job.eligible !== false ? "Eligible" : "Not eligible"}
            </Badge>
          </dd>
        </div>
      </dl>

      <div className="space-y-3 border-t pt-3">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Job Description
          </h4>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {job.jobDescription}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Eligibility Criteria
          </h4>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {job.eligibilityCriteria}
          </p>
        </div>
      </div>
    </div>
  );
};

const ViewJob = () => {
  const navigate = useAppNavigate();
  const [jobs] = useState<JobInternshipData[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobInternshipData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDetails = useCallback((job: JobInternshipData) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      <PageHeader
        title="Opportunities"
        description="Jobs, internships and apprenticeships open to you."
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/add-job")}
          >
            Add Opportunity
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
          <DataTable
            caption="Opportunities"
            data={jobs}
            columns={JOB_COLUMNS}
            getRowId={(j) => j.id}
            rowLabel={(j) => `${j.jobTitle} - ${j.employer}`}
            searchPlaceholder="Search title / employer"
            exportFileName="opportunities"
            selectable={false}
            actions={{
              onView: openDetails,
            }}
            previewTitle={(j) => `${j.jobTitle} - ${j.employer}`}
            renderPreview={(j) => <JobPreview job={j} />}
            emptyTitle="Nothing here yet"
            emptyDescription="Records you add will appear in this table."
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedJob
            ? `Opportunity Details - ${selectedJob.jobTitle}`
            : "Opportunity Details"
        }
        size="2xl"
      >
        {selectedJob && (
          <div className="space-y-4 p-4">
            <JobPreview job={selectedJob} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedJob;
                  setIsModalOpen(false);
                  navigate("/add-job", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Opportunity
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewJob;