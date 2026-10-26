import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";

export type ShortlistDecisionType = "Shortlisted" | "On Hold" | "Rejected";

export type OutcomeType =
  | "Passed"
  | "Failed"
  | "Attended - Result Awaited"
  | "Absent"
  | "Rescheduled";

export interface ShortlistingData {
  id: string;
  opportunityDrive: string;
  applicant: string;
  filters: string[] | string;
  shortlistDecision: ShortlistDecisionType;
  interviewRound: string;
  dateTime: string;
  modeVenue: string;
  panelContact: string;
  outcome: OutcomeType;
  remarks?: string;
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

const INITIAL_SHORTLISTS: ShortlistingData[] = [
  {
    id: "1",
    opportunityDrive: "TCS Campus Drive 2024",
    applicant: "Aarav Sharma",
    filters: ["Min 65% CGPA", "Zero Backlogs", "Eligible Branches", "Passed Benchmark"],
    shortlistDecision: "Shortlisted",
    interviewRound: "Technical Round 2",
    dateTime: "2024-02-25T10:00:00",
    modeVenue: "Campus Placement Block - Interview Room 102",
    panelContact: "Mr. Ramesh Pattnaik (Technical Architect, TCS)",
    outcome: "Passed",
    remarks: "Exceptional command over algorithms and microservices. Recommended for Digital profile offer.",
  },
  {
    id: "2",
    opportunityDrive: "SDE Frontend - ABC Technologies",
    applicant: "Priya Patel",
    filters: ["Min 65% CGPA", "Eligible Branches", "Docs Verified"],
    shortlistDecision: "Shortlisted",
    interviewRound: "Technical Round 1",
    dateTime: "2024-03-05T14:30:00",
    modeVenue: "Online - Google Meet",
    panelContact: "Ms. Neha Swaminathan (Lead Frontend Engineer)",
    outcome: "Attended - Result Awaited",
    remarks: "Strong knowledge of React hooks and performance profiling; evaluated on design systems live task.",
  },
  {
    id: "3",
    opportunityDrive: "Specialist Programmer - Infosys",
    applicant: "Sneha Rao",
    filters: ["Min 65% CGPA", "Zero Backlogs", "Passed Benchmark"],
    shortlistDecision: "Shortlisted",
    interviewRound: "Managerial Round",
    dateTime: "2024-03-12T11:00:00",
    modeVenue: "Auditorium Annex & Online Platform",
    panelContact: "Dr. K. V. S. Murthy (Director of Engineering, Infosys)",
    outcome: "Passed",
    remarks: "High problem-solving aptitude; successfully solved dynamic programming tree optimization challenge.",
  },
  {
    id: "4",
    opportunityDrive: "Data Analyst Intern - XYZ Industries",
    applicant: "Rahul Verma",
    filters: ["Min 65% CGPA", "Docs Verified"],
    shortlistDecision: "On Hold",
    interviewRound: "Technical Round 1",
    dateTime: "2024-03-18T15:00:00",
    modeVenue: "In-person - Placement Cell Room 204",
    panelContact: "Mr. Debashish Jena (Senior Data Analyst)",
    outcome: "Attended - Result Awaited",
    remarks: "Good SQL capability, needs follow-up review on machine learning deployment workflows.",
  },
  {
    id: "5",
    opportunityDrive: "Automation Apprentice - Eastern Enterprises",
    applicant: "Vikram Das",
    filters: ["Eligible Branches", "Docs Verified"],
    shortlistDecision: "Shortlisted",
    interviewRound: "HR Interview",
    dateTime: "2024-03-22T09:30:00",
    modeVenue: "Mechanical Conference Room",
    panelContact: "Mr. S. K. Mahapatra (Head HR, Eastern Enterprises)",
    outcome: "Passed",
    remarks: "All original credentials verified; cleared medical fitness check; offer package rolled out.",
  },
  {
    id: "6",
    opportunityDrive: "GenC Elevate - Cognizant",
    applicant: "Ananya Mishra",
    filters: ["Eligible Branches"],
    shortlistDecision: "Rejected",
    interviewRound: "Technical Round 1",
    dateTime: "2024-02-18T16:00:00",
    modeVenue: "Online - MS Teams",
    panelContact: "Mr. Alok Verma (Tech Specialist)",
    outcome: "Failed",
    remarks: "Candidate struggled with core database normalization and object-oriented fundamentals.",
  },
];

const getShortlistClass = (decision: ShortlistDecisionType) => {
  const styles: Record<ShortlistDecisionType, string> = {
    Shortlisted: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "On Hold": "bg-amber-100 text-amber-800 border border-amber-200",
    Rejected: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return styles[decision] || "bg-gray-100 text-gray-800";
};

const ShortlistDecisionBadge = ({ decision }: { decision: ShortlistDecisionType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getShortlistClass(
      decision
    )}`}
  >
    {decision}
  </span>
);

const getOutcomeClass = (outcome: OutcomeType) => {
  const styles: Record<OutcomeType, string> = {
    Passed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Failed: "bg-rose-100 text-rose-800 border border-rose-200",
    "Attended - Result Awaited": "bg-blue-100 text-blue-800 border border-blue-200",
    Absent: "bg-gray-100 text-gray-800 border border-gray-200",
    Rescheduled: "bg-purple-100 text-purple-800 border border-purple-200",
  };
  return styles[outcome] || "bg-gray-100 text-gray-800";
};

const OutcomeBadge = ({ outcome }: { outcome: OutcomeType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getOutcomeClass(
      outcome
    )}`}
  >
    {outcome}
  </span>
);

const SHORTLIST_COLUMNS: TableColumnDef<ShortlistingData>[] = [
  {
    id: "applicant",
    header: "Applicant Name",
    accessorFn: (row) => row.applicant,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.applicant}>
        {row.applicant}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "opportunityDrive",
    header: "Opportunity / Drive",
    accessorFn: (row) => row.opportunityDrive,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[240px] truncate" title={row.opportunityDrive}>
        {row.opportunityDrive}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "interviewRound",
    header: "Interview Round",
    accessorFn: (row) => row.interviewRound,
    Cell: ({ row: { original: row } }) => (
      <span className="text-xs font-medium text-foreground">
        {row.interviewRound}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "shortlistDecision",
    header: "Decision",
    accessorFn: (row) => row.shortlistDecision,
    Cell: ({ row: { original: row } }) => <ShortlistDecisionBadge decision={row.shortlistDecision} />,
    enableSorting: true,
  },
  {
    id: "outcome",
    header: "Outcome",
    accessorFn: (row) => row.outcome,
    Cell: ({ row: { original: row } }) => <OutcomeBadge outcome={row.outcome} />,
    enableSorting: true,
  },
  {
    id: "dateTime",
    header: "Date & Time",
    accessorFn: (row) => row.dateTime,
    Cell: ({ row: { original: row } }) => formatDate(row.dateTime),
    enableSorting: true,
  },
  {
    id: "modeVenue",
    header: "Mode / Venue",
    accessorFn: (row) => row.modeVenue,
    defaultHidden: true,
  },
  {
    id: "panelContact",
    header: "Panel / Contact",
    accessorFn: (row) => row.panelContact,
    defaultHidden: true,
  },
  {
    id: "filters",
    header: "Filters Applied",
    accessorFn: (row) =>
      Array.isArray(row.filters) ? row.filters.join(", ") : (row.filters || "N/A"),
    defaultHidden: true,
  },
  {
    id: "remarks",
    header: "Remarks",
    accessorFn: (row) => row.remarks || "N/A",
    defaultHidden: true,
  },
];

const ShortlistPreview = ({ item }: { item: ShortlistingData }) => {
  const filtersDisplay = Array.isArray(item.filters)
    ? item.filters.join(", ")
    : (item.filters || "None");

  const details = [
    ["Applicant Name", item.applicant],
    ["Opportunity / Drive", item.opportunityDrive],
    ["Interview Round", item.interviewRound],
    ["Date and Time", formatDate(item.dateTime)],
    ["Mode / Venue", item.modeVenue],
    ["Panel / Contact Details", item.panelContact],
    ["Filters Applied", filtersDisplay],
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
          <dt className="text-xs text-muted">Shortlist Decision</dt>
          <dd className="mt-1">
            <ShortlistDecisionBadge decision={item.shortlistDecision} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Interview Outcome</dt>
          <dd className="mt-1">
            <OutcomeBadge outcome={item.outcome} />
          </dd>
        </div>
      </dl>

      {item.remarks && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Selection Remarks & Feedback
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {item.remarks}
          </p>
        </div>
      )}
    </div>
  );
};

const ShortlistingView = () => {
  const navigate = useAppNavigate();
  const [shortlists, setShortlists] =
    useState<ShortlistingData[]>(INITIAL_SHORTLISTS);
  const [selectedItem, setSelectedItem] =
    useState<ShortlistingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [decisionFilter] = useState("");

  const rows = useMemo(
    () =>
      decisionFilter
        ? shortlists.filter((s) => s.shortlistDecision === decisionFilter)
        : shortlists,
    [shortlists, decisionFilter]
  );

  const openDetails = useCallback((item: ShortlistingData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateDecision = useCallback(
    (ids: string[], decision: ShortlistDecisionType) => {
      setShortlists((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, shortlistDecision: decision } : s))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} candidates updated to ${decision}`
          : `Candidate updated to ${decision}`
      );
    },
    []
  );

  const updateOutcome = useCallback(
    (ids: string[], outcome: OutcomeType) => {
      setShortlists((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, outcome } : s))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} outcomes updated to ${outcome}`
          : `Outcome updated to ${outcome}`
      );
    },
    []
  );

  return (
    <>
      <PageHeader
        title="Candidate Shortlisting"
        description="Candidate evaluation, interview round tracking and selection outcomes."
        breadcrumb={[
          { label: "Placement" },
          { label: "Shortlisting & Rounds" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/short-listing")}
          >
            Evaluate Candidate
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Candidate Shortlisting, Interview Rounds & Outcomes"
          data={rows}
          columns={SHORTLIST_COLUMNS}
          getRowId={(s) => s.id}
          rowLabel={(s) => `${s.applicant} - ${s.opportunityDrive}`}
          searchPlaceholder="Search by applicant, opportunity, round, panel..."
          exportFileName="candidate_shortlisting_evaluations"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "shortlist",
              label: "Mark Shortlisted",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateDecision(ids, "Shortlisted");
                setSelection([]);
              },
            },
            {
              id: "pass",
              label: "Mark Passed",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateOutcome(ids, "Passed");
                setSelection([]);
              },
            },
            {
              id: "hold",
              label: "Mark On Hold",
              icon: Clock,
              onClick: (ids) => {
                updateDecision(ids, "On Hold");
                setSelection([]);
              },
            },
            {
              id: "reject",
              label: "Mark Rejected",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateDecision(ids, "Rejected");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/short-listing", {
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
          previewTitle={(s) => `${s.applicant} - ${s.opportunityDrive}`}
          renderPreview={(s) => <ShortlistPreview item={s} />}
          emptyTitle="No shortlisting records found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/short-listing")}
            >
              Evaluate Candidate
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
            ? `Candidate Evaluation - ${selectedItem.applicant}`
            : "Candidate Evaluation Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <ShortlistPreview item={selectedItem} />
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
                  navigate("/short-listing", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Evaluation
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ShortlistingView;