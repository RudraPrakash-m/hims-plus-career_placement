import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, Eye, RotateCcw, Trash2 } from "lucide-react";

export type OutcomeStatusType =
  | "Selected"
  | "Offer Issued"
  | "Offer Accepted"
  | "Offer Declined"
  | "Joined";

export type VerificationStatusType =
  | "Verified"
  | "Pending Verification"
  | "Under Review"
  | "Rejected";

export interface PlacementOutcomeFeedbackData {
  id: string;
  student: string;
  employer: string;
  opportunityDrive: string;
  outcomeStatus: OutcomeStatusType;
  offerJoiningDate: string;
  salaryPackage: string;
  employmentType: string;
  verificationStatus: VerificationStatusType;
  employerFeedback: string;
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

const INITIAL_OUTCOMES: PlacementOutcomeFeedbackData[] = [
  {
    id: "1",
    student: "Aarav Sharma (STU-2022-001)",
    employer: "Google India",
    opportunityDrive: "Google Off-Campus Full-time Recruitment 2024",
    outcomeStatus: "Offer Accepted",
    offerJoiningDate: "2024-07-15",
    salaryPackage: "₹ 28.5 LPA",
    employmentType: "Full-Time Job",
    verificationStatus: "Verified",
    employerFeedback: "Outstanding algorithmic and data structures proficiency. Demonstrated strong analytical reasoning during design rounds. Candidate showed exceptional cultural fit and curiosity.",
  },
  {
    id: "2",
    student: "Priya Patel (STU-2022-045)",
    employer: "Microsoft India",
    opportunityDrive: "TCS National Campus Drive 2024",
    outcomeStatus: "Joined",
    offerJoiningDate: "2024-06-01",
    salaryPackage: "₹ 24.0 LPA",
    employmentType: "Full-Time Job",
    verificationStatus: "Verified",
    employerFeedback: "Excellent problem-solving aptitude and clean coding standards. Great grasp of cloud architecture principles. Recommended to continue mentoring junior students.",
  },
  {
    id: "3",
    student: "Rahul Verma (STU-2023-018)",
    employer: "Amazon Web Services",
    opportunityDrive: "AWS Cloud & DevOps Summer Internship 2024",
    outcomeStatus: "Offer Issued",
    offerJoiningDate: "2024-05-20",
    salaryPackage: "₹ 60,000 / month",
    employmentType: "Internship",
    verificationStatus: "Verified",
    employerFeedback: "Strong hands-on Linux administration and Docker containerization fundamentals. High enthusiasm and rapid learner during technical interview.",
  },
  {
    id: "4",
    student: "Sneha Rao (STU-2023-089)",
    employer: "Tata Consultancy Services",
    opportunityDrive: "TCS National Campus Drive 2024",
    outcomeStatus: "Offer Accepted",
    offerJoiningDate: "2024-08-01",
    salaryPackage: "₹ 7.2 LPA (Digital)",
    employmentType: "Full-Time Job",
    verificationStatus: "Verified",
    employerFeedback: "Good grasp of Java Spring Boot, SQL querying, and SDLC models. Clear verbal communication and proactive team engagement.",
  },
  {
    id: "5",
    student: "Kavita Reddy (STU-2022-112)",
    employer: "Infosys Technologies",
    opportunityDrive: "Infosys Power Programmer Drive 2024",
    outcomeStatus: "Selected",
    offerJoiningDate: "2024-08-15",
    salaryPackage: "₹ 9.5 LPA",
    employmentType: "Full-Time Job",
    verificationStatus: "Pending Verification",
    employerFeedback: "High coding competition score in HackWithInfy. Strong competitive programming foundation. Awaiting official graduation degree verification.",
  },
  {
    id: "6",
    student: "Aditya Nair (STU-2022-077)",
    employer: "Deloitte Consulting",
    opportunityDrive: "Deloitte US-India Analyst Drive",
    outcomeStatus: "Offer Declined",
    offerJoiningDate: "2024-07-01",
    salaryPackage: "₹ 8.5 LPA",
    employmentType: "Full-Time Job",
    verificationStatus: "Verified",
    employerFeedback: "Impressive case study analysis and consulting presentation skills. Candidate chose to decline in pursuit of higher postgraduate research.",
  },
];

const getOutcomeBadgeClass = (status: OutcomeStatusType) => {
  switch (status) {
    case "Joined":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Offer Accepted":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Offer Issued":
      return "bg-purple-100 text-purple-800 border border-purple-200";
    case "Selected":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Offer Declined":
      return "bg-rose-100 text-rose-800 border border-rose-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const OutcomeStatusBadge = ({ status }: { status: OutcomeStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getOutcomeBadgeClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getVerificationBadgeClass = (status: VerificationStatusType) => {
  switch (status) {
    case "Verified":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "Under Review":
      return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Pending Verification":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "Rejected":
      return "bg-rose-100 text-rose-800 border border-rose-200";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const VerificationStatusBadge = ({ status }: { status: VerificationStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getVerificationBadgeClass(
      status
    )}`}
  >
    {status}
  </span>
);

const OUTCOME_COLUMNS: TableColumnDef<PlacementOutcomeFeedbackData>[] = [
  {
    id: "student",
    header: "Student",
    accessorFn: (row) => row.student,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.student}>
        {row.student}
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
    id: "opportunityDrive",
    header: "Opportunity / Drive",
    accessorFn: (row) => row.opportunityDrive,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[200px] truncate" title={row.opportunityDrive}>
        {row.opportunityDrive}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "salaryPackage",
    header: "Package",
    accessorFn: (row) => row.salaryPackage,
    Cell: ({ row: { original: row } }) => (
      <span className="font-semibold text-xs text-foreground">
        {row.salaryPackage}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "outcomeStatus",
    header: "Status",
    accessorFn: (row) => row.outcomeStatus,
    Cell: ({ row: { original: row } }) => <OutcomeStatusBadge status={row.outcomeStatus} />,
    enableSorting: true,
  },
  {
    id: "employmentType",
    header: "Employment Type",
    accessorFn: (row) => row.employmentType,
    defaultHidden: true,
  },
  {
    id: "offerJoiningDate",
    header: "Offer / Joining Date",
    accessorFn: (row) => row.offerJoiningDate,
    Cell: ({ row: { original: row } }) => formatDate(row.offerJoiningDate),
    defaultHidden: true,
  },
  {
    id: "verificationStatus",
    header: "Verification",
    accessorFn: (row) => row.verificationStatus,
    Cell: ({ row: { original: row } }) => <VerificationStatusBadge status={row.verificationStatus} />,
    defaultHidden: true,
  },
  {
    id: "employerFeedback",
    header: "Feedback",
    accessorFn: (row) => row.employerFeedback,
    defaultHidden: true,
  },
];

const OutcomePreview = ({ item }: { item: PlacementOutcomeFeedbackData }) => {
  const details = [
    ["Student", item.student],
    ["Employer", item.employer],
    ["Opportunity / Drive", item.opportunityDrive],
    ["Employment Type", item.employmentType],
    ["Salary / Package", item.salaryPackage],
    ["Offer / Joining Date", formatDate(item.offerJoiningDate)],
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
          <dt className="text-xs text-muted">Outcome Status</dt>
          <dd className="mt-1">
            <OutcomeStatusBadge status={item.outcomeStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Verification Status</dt>
          <dd className="mt-1">
            <VerificationStatusBadge status={item.verificationStatus} />
          </dd>
        </div>
      </dl>

      <div className="space-y-3 border-t pt-3">
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Employer Feedback & Assessment
          </h4>
          <p className="mt-2 text-sm text-foreground bg-muted/10 p-3 rounded-md border leading-relaxed">
            {item.employerFeedback}
          </p>
        </div>
      </div>
    </div>
  );
};

const PlacementOutcomesFeedbackView = () => {
  const navigate = useAppNavigate();
  const [data, setData] = useState<PlacementOutcomeFeedbackData[]>(INITIAL_OUTCOMES);
  const [selectedItem, setSelectedItem] = useState<PlacementOutcomeFeedbackData | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const handleEdit = useCallback(
    (item: PlacementOutcomeFeedbackData) => {
      navigate("/placement-outcomes-feedback", { state: { editRecord: item } });
    },
    [navigate]
  );

  const handleDelete = useCallback((item: PlacementOutcomeFeedbackData) => {
    setData((prev) => prev.filter((d) => d.id !== item.id));
    showToast.success(`Outcome for "${item.student}" deleted.`);
  }, []);

  const handleBulkVerify = (keys: string[]) => {
    const ids = new Set(keys);
    setData((prev) =>
      prev.map((item) =>
        ids.has(item.id) ? { ...item, verificationStatus: "Verified" } : item
      )
    );
    setSelectedKeys([]);
    showToast.success(`Marked ${keys.length} record(s) as Verified.`);
  };

  const handleBulkMarkJoined = (keys: string[]) => {
    const ids = new Set(keys);
    setData((prev) =>
      prev.map((item) =>
        ids.has(item.id) ? { ...item, outcomeStatus: "Joined" } : item
      )
    );
    setSelectedKeys([]);
    showToast.success(`Marked ${keys.length} student(s) as Joined.`);
  };

  const handleBulkDelete = (keys: string[]) => {
    const ids = new Set(keys);
    setData((prev) => prev.filter((d) => !ids.has(d.id)));
    setSelectedKeys([]);
    showToast.success(`Deleted ${keys.length} placement outcome record(s).`);
  };

  const stats = useMemo(() => {
    const total = data.length;
    const verified = data.filter((d) => d.verificationStatus === "Verified").length;
    const joined = data.filter((d) => d.outcomeStatus === "Joined").length;
    const accepted = data.filter((d) => d.outcomeStatus === "Offer Accepted").length;
    return { total, verified, joined, accepted };
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Outcomes & Feedback"
        description="Recorded placement selections, offer packages and employer feedback."
        breadcrumb={[
          { label: "Placement" },
          { label: "Placement Outcomes" },
        ]}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate("/placement-outcomes-feedback")}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Record Outcome & Feedback
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Total Outcomes</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Verified Offers</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{stats.verified}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Joined Candidates</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">{stats.joined}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Offer Accepted</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{stats.accepted}</p>
        </div>
      </div>

      <Card flush>
      <DataTable
        caption="Placement Outcomes & Employer Feedback"
        data={data}
        columns={OUTCOME_COLUMNS}
        getRowId={(row) => row.id}
        rowLabel={(row) => `${row.student} - ${row.employer}`}
        searchPlaceholder="Search by student, employer, drive, outcome status..."
        exportFileName="placement_outcomes_feedback"
        selectable={false}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        actions={{
          onView: (item) => setSelectedItem(item),
          onEdit: handleEdit,
          onDelete: handleDelete,
          more: (item) => [
            {
              id: "view",
              label: "View Feedback & Details",
              icon: Eye,
              onSelect: () => setSelectedItem(item),
            },
          ],
        }}
        previewTitle={(item) => `Outcome Details - ${item.student}`}
        renderPreview={(item) => <OutcomePreview item={item} />}
        bulkActions={[
          {
            id: "verify",
            label: "Verify Selected",
            icon: CheckCircle2,
            onClick: handleBulkVerify,
          },
          {
            id: "mark-joined",
            label: "Mark Joined",
            icon: RotateCcw,
            onClick: handleBulkMarkJoined,
          },
          {
            id: "delete",
            label: "Delete",
            icon: Trash2,
            danger: true,
            onClick: handleBulkDelete,
          },
        ]}
      />
      </Card>

      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={`Outcome Details - ${selectedItem.student}`}
          size="lg"
        >
          <OutcomePreview item={selectedItem} />
        </Modal>
      )}
    </div>
  );
};

export default PlacementOutcomesFeedbackView;
