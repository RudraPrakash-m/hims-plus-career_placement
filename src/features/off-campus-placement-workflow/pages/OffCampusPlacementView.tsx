import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";

export type StudentAppStatusType =
  | "Applied"
  | "Submitted"
  | "Not Applied"
  | "Draft Saved";

export type InterviewSelectionStatusType =
  | "OA Cleared"
  | "Technical Round 1 Cleared"
  | "Technical Round 2 Cleared"
  | "HR Round Cleared"
  | "Interview Scheduled"
  | "Selected"
  | "Not Selected";

export type JoiningOutcomeType =
  | "Joined"
  | "Joining Awaited"
  | "Offer Accepted"
  | "Offer Declined"
  | "Deferred";

export interface OffCampusPlacementData {
  id: string;
  opportunity: string;
  employer: string;
  studentName: string;
  applicationLinkMethod: string;
  studentApplicationStatus: StudentAppStatusType;
  interviewSelectionStatus: InterviewSelectionStatusType;
  offerDetails?: string;
  joiningOutcome: JoiningOutcomeType;
  applicationDate: string;
  supportingEvidence?: string;
  eligibility: string;
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

const INITIAL_OFF_CAMPUS_RECORDS: OffCampusPlacementData[] = [
  {
    id: "1",
    opportunity: "Google India - Software Engineer",
    employer: "Google India",
    studentName: "Aarav Sharma",
    applicationLinkMethod: "https://careers.google.com/jobs/results/12345 (Direct Application)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "Selected",
    offerDetails: "₹28,50,000 CTC + ₹5,00,000 Joining Bonus + RSUs, Software Engineer L3",
    joiningOutcome: "Offer Accepted",
    applicationDate: "2024-03-15",
    supportingEvidence: "google_india_offer_letter.pdf",
    eligibility: "B.Tech CSE/IT, min 65% aggregate, 2024 passout. Strong competitive coding rating.",
  },
  {
    id: "2",
    opportunity: "Amazon India - SDE 1",
    employer: "Amazon India",
    studentName: "Sneha Rao",
    applicationLinkMethod: "https://amazon.jobs/en/jobs/23456 (Employee Referral by Alumni)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "Selected",
    offerDetails: "₹32,00,000 CTC (Base + Sign-on Bonus + Stocks), SDE 1 (Hyderabad)",
    joiningOutcome: "Joined",
    applicationDate: "2024-04-10",
    supportingEvidence: "amazon_sde1_official_offer.pdf",
    eligibility: "B.Tech ECE/CSE, exceptional data structures and algorithm optimization capabilities.",
  },
  {
    id: "3",
    opportunity: "Microsoft India - Software Engineer",
    employer: "Microsoft India",
    studentName: "Priya Patel",
    applicationLinkMethod: "https://careers.microsoft.com/us/en/job/7890 (Direct Portal Application)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "Technical Round 2 Cleared",
    offerDetails: "Under active evaluation after AA (As-Appropriate) Final Round",
    joiningOutcome: "Joining Awaited",
    applicationDate: "2024-05-02",
    supportingEvidence: "microsoft_interview_email.pdf",
    eligibility: "B.Tech IT with min 7.0 CGPA, coursework in operating systems and distributed systems.",
  },
  {
    id: "4",
    opportunity: "Oracle India - Associate Software Engineer",
    employer: "Oracle India",
    studentName: "Rahul Verma",
    applicationLinkMethod: "https://oracle.taleo.net/careersection/jobdetail (Oracle Careers Portal)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "Selected",
    offerDetails: "₹16,80,000 CTC, Associate Software Engineer (Cloud Platform)",
    joiningOutcome: "Offer Accepted",
    applicationDate: "2024-04-20",
    supportingEvidence: "oracle_offer_confirmation.pdf",
    eligibility: "MCA / B.Tech CSE, min 65% aggregate, hands-on SQL and microservices background.",
  },
  {
    id: "5",
    opportunity: "Cisco Systems - Technical Consulting Engineer",
    employer: "Cisco Systems",
    studentName: "Vikram Das",
    applicationLinkMethod: "https://jobs.cisco.com/jobs/SearchJobs (University Placement Referral)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "HR Round Cleared",
    offerDetails: "₹14,00,000 CTC + Health Benefits, Technical Consulting Engineer",
    joiningOutcome: "Joining Awaited",
    applicationDate: "2024-05-18",
    supportingEvidence: "cisco_selection_mail.pdf",
    eligibility: "B.Tech ME/EE/ECE with networking fundamentals (CCNA certified preferred).",
  },
  {
    id: "6",
    opportunity: "Accenture - Advanced ASE",
    employer: "Accenture",
    studentName: "Ananya Mishra",
    applicationLinkMethod: "https://indiacampus.accenture.com/off-campus (National Talent Hunt 2024)",
    studentApplicationStatus: "Applied",
    interviewSelectionStatus: "OA Cleared",
    offerDetails: "Awaiting Technical & Cognitive Interview Round 1",
    joiningOutcome: "Joining Awaited",
    applicationDate: "2024-06-01",
    supportingEvidence: "accenture_hall_ticket.pdf",
    eligibility: "B.Sc CS / BCA with min 60% marks and strong logical reasoning.",
  },
];

const getStudentAppClass = (status: StudentAppStatusType) => {
  const styles: Record<StudentAppStatusType, string> = {
    Applied: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Submitted: "bg-blue-100 text-blue-800 border border-blue-200",
    "Not Applied": "bg-gray-100 text-gray-800 border border-gray-200",
    "Draft Saved": "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const StudentAppBadge = ({ status }: { status: StudentAppStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStudentAppClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getInterviewClass = (status: InterviewSelectionStatusType) => {
  if (status === "Selected") {
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  }
  if (status.includes("Cleared")) {
    return "bg-cyan-100 text-cyan-800 border border-cyan-200";
  }
  if (status.includes("Scheduled")) {
    return "bg-purple-100 text-purple-800 border border-purple-200";
  }
  if (status === "Not Selected") {
    return "bg-rose-100 text-rose-800 border border-rose-200";
  }
  return "bg-blue-100 text-blue-800 border border-blue-200";
};

const InterviewBadge = ({ status }: { status: InterviewSelectionStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getInterviewClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getJoiningOutcomeClass = (outcome: JoiningOutcomeType) => {
  const styles: Record<JoiningOutcomeType, string> = {
    Joined: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "Joining Awaited": "bg-blue-100 text-blue-800 border border-blue-200",
    "Offer Accepted": "bg-teal-100 text-teal-800 border border-teal-200",
    "Offer Declined": "bg-rose-100 text-rose-800 border border-rose-200",
    Deferred: "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[outcome] || "bg-gray-100 text-gray-800";
};

const JoiningOutcomeBadge = ({ outcome }: { outcome: JoiningOutcomeType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getJoiningOutcomeClass(
      outcome
    )}`}
  >
    {outcome}
  </span>
);

const OFF_CAMPUS_COLUMNS: TableColumnDef<OffCampusPlacementData>[] = [
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
    id: "employer",
    header: "Employer",
    accessorFn: (row) => row.employer,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[160px] truncate" title={row.employer}>
        {row.employer}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "opportunity",
    header: "Role / Opportunity",
    accessorFn: (row) => row.opportunity,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[220px] truncate" title={row.opportunity}>
        {row.opportunity}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "interviewSelectionStatus",
    header: "Selection Status",
    accessorFn: (row) => row.interviewSelectionStatus,
    Cell: ({ row: { original: row } }) => <InterviewBadge status={row.interviewSelectionStatus} />,
    enableSorting: true,
  },
  {
    id: "joiningOutcome",
    header: "Joining Outcome",
    accessorFn: (row) => row.joiningOutcome,
    Cell: ({ row: { original: row } }) => <JoiningOutcomeBadge outcome={row.joiningOutcome} />,
    enableSorting: true,
  },
  {
    id: "studentApplicationStatus",
    header: "Application Status",
    accessorFn: (row) => row.studentApplicationStatus,
    Cell: ({ row: { original: row } }) => <StudentAppBadge status={row.studentApplicationStatus} />,
    defaultHidden: true,
  },
  {
    id: "offerDetails",
    header: "Offer Details",
    accessorFn: (row) => row.offerDetails || "N/A",
    defaultHidden: true,
  },
  {
    id: "applicationDate",
    header: "Date",
    accessorFn: (row) => row.applicationDate,
    Cell: ({ row: { original: row } }) => formatDate(row.applicationDate),
    defaultHidden: true,
  },
  {
    id: "applicationLinkMethod",
    header: "Application Link / Method",
    accessorFn: (row) => row.applicationLinkMethod,
    defaultHidden: true,
  },
  {
    id: "supportingEvidence",
    header: "Supporting Evidence",
    accessorFn: (row) => row.supportingEvidence || "evidence.pdf",
    defaultHidden: true,
  },
  {
    id: "eligibility",
    header: "Eligibility",
    accessorFn: (row) => row.eligibility,
    defaultHidden: true,
  },
];

const OffCampusPreview = ({ item }: { item: OffCampusPlacementData }) => {
  const details = [
    ["Opportunity", item.opportunity],
    ["Employer", item.employer],
    ["Student / Applicant", item.studentName],
    ["Application Link / Method", item.applicationLinkMethod],
    ["Application / Offer Date", formatDate(item.applicationDate)],
    ["Offer Details", item.offerDetails || "N/A"],
    ["Supporting Evidence File", item.supportingEvidence || "N/A"],
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
            <StudentAppBadge status={item.studentApplicationStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Selection Status</dt>
          <dd className="mt-1">
            <InterviewBadge status={item.interviewSelectionStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Joining Outcome</dt>
          <dd className="mt-1">
            <JoiningOutcomeBadge outcome={item.joiningOutcome} />
          </dd>
        </div>
      </dl>

      <div className="border-t pt-3">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Eligibility Criteria
        </h4>
        <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {item.eligibility}
        </p>
      </div>
    </div>
  );
};

export interface OffCampusPlacementViewProps {
  hideHeader?: boolean;
}

const OffCampusPlacementView = ({ hideHeader }: OffCampusPlacementViewProps = {}) => {
  const navigate = useAppNavigate();
  const [records, setRecords] =
    useState<OffCampusPlacementData[]>(INITIAL_OFF_CAMPUS_RECORDS);
  const [selectedItem, setSelectedItem] =
    useState<OffCampusPlacementData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [outcomeFilter] = useState("");

  const rows = useMemo(
    () =>
      outcomeFilter
        ? records.filter((r) => r.joiningOutcome === outcomeFilter)
        : records,
    [records, outcomeFilter]
  );

  const openDetails = useCallback((item: OffCampusPlacementData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateSelectionStatus = useCallback(
    (ids: string[], status: InterviewSelectionStatusType) => {
      setRecords((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, interviewSelectionStatus: status } : r))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} records updated to ${status}`
          : `Selection status updated to ${status}`
      );
    },
    []
  );

  const updateJoiningOutcome = useCallback(
    (ids: string[], outcome: JoiningOutcomeType) => {
      setRecords((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, joiningOutcome: outcome } : r))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} records updated to ${outcome}`
          : `Joining outcome updated to ${outcome}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Off-Campus Placements"
          description="Track external job applications, off-campus offers and verification status."
          breadcrumb={[
            { label: "Placement" },
            { label: "Off-Campus Placements" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/off-campus-placement")}
            >
              Add Off-Campus Record
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Off-campus Placement Workflow" : undefined} flush>
        <DataTable
          caption="Off-Campus Placements, Direct Applications & Offer Verification"
          data={rows}
          columns={OFF_CAMPUS_COLUMNS}
          getRowId={(r) => r.id}
          rowLabel={(r) => `${r.studentName} - ${r.opportunity}`}
          searchPlaceholder="Search by student, employer, opportunity..."
          exportFileName="off_campus_placement_records"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "mark-selected",
              label: "Mark Selected",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateSelectionStatus(ids, "Selected");
                setSelection([]);
              },
            },
            {
              id: "mark-joined",
              label: "Mark Joined",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateJoiningOutcome(ids, "Joined");
                setSelection([]);
              },
            },
            {
              id: "mark-applied",
              label: "Mark Applied",
              icon: Clock,
              onClick: (ids) => {
                setRecords((prev) =>
                  prev.map((r) =>
                    ids.includes(r.id) ? { ...r, studentApplicationStatus: "Applied" } : r
                  )
                );
                showToast.success(`${ids.length} records marked as Applied`);
                setSelection([]);
              },
            },
            {
              id: "mark-declined",
              label: "Mark Offer Declined",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateJoiningOutcome(ids, "Offer Declined");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/off-campus-placement", {
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
          previewTitle={(r) => `${r.studentName} - ${r.opportunity}`}
          renderPreview={(r) => <OffCampusPreview item={r} />}
          emptyTitle="No off-campus placement records found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/off-campus-placement")}
            >
              Add Off-Campus Record
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedItem
            ? `Off-Campus Details - ${selectedItem.studentName}`
            : "Off-Campus Placement Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <OffCampusPreview item={selectedItem} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedItem;
                  setIsModalOpen(false);
                  navigate("/off-campus-placement", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OffCampusPlacementView;
