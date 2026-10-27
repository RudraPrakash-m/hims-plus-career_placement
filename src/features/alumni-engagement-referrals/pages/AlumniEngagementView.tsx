import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye } from "lucide-react";

export type ParticipationStatusType =
  | "Accepted"
  | "Completed"
  | "Cancelled"
  | "Scheduled / Pending";

export interface AlumniEngagementData {
  id: string;
  alumniProfile: string;
  industryRole: string;
  studentMentee: string;
  mentoringAvailability: string;
  referralOpportunity?: string;
  sessionSchedule: string;
  participationStatus: ParticipationStatusType;
  feedback?: string;
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

const INITIAL_ALUMNI_SESSIONS: AlumniEngagementData[] = [
  {
    id: "1",
    alumniProfile: "Mr. Alok Patnaik",
    industryRole: "Google India / Staff Software Engineer",
    studentMentee: "Aarav Sharma",
    mentoringAvailability: "Weekends - System Design",
    referralOpportunity: "Google Early Career L3 Referral (Ref ID: GOOG-2024-REF-01)",
    sessionSchedule: "2024-02-15T15:30:00",
    participationStatus: "Completed",
    feedback: "Exceptional session! Covered distributed caching, CAP theorem tradeoffs, and conducted a mock tech interview. Highly beneficial.",
  },
  {
    id: "2",
    alumniProfile: "Ms. Neha Swaminathan",
    industryRole: "Amazon AWS / Senior SDE",
    studentMentee: "Sneha Rao",
    mentoringAvailability: "Weekday Evenings - Mock Interviews",
    referralOpportunity: "Amazon SDE 1 Off-Campus Referral (Ref ID: AMZN-SDE1-2024)",
    sessionSchedule: "2024-02-28T18:00:00",
    participationStatus: "Completed",
    feedback: "Reviewed candidate resume for AWS Leadership Principles fitment. Candidate demonstrated strong problem solving in graph problems.",
  },
  {
    id: "3",
    alumniProfile: "Mr. Debashish Jena",
    industryRole: "Microsoft / Lead Data Scientist",
    studentMentee: "Rahul Verma",
    mentoringAvailability: "Bi-weekly - Career Roadmap",
    referralOpportunity: "Microsoft Data & AI Analyst Openings (Referral Submitted)",
    sessionSchedule: "2024-03-10T11:00:00",
    participationStatus: "Accepted",
    feedback: "Scheduled deep dive into production ML pipelines, feature stores, and cloud model serving architecture.",
  },
  {
    id: "4",
    alumniProfile: "Ms. Priyanka Mahapatra",
    industryRole: "Oracle / Cloud Consultant",
    studentMentee: "Priya Patel",
    mentoringAvailability: "Weekends - System Design",
    referralOpportunity: "Oracle Associate Software Engineer (OCI Cloud Platform)",
    sessionSchedule: "2024-03-20T14:00:00",
    participationStatus: "Accepted",
    feedback: "Mock frontend performance optimization and state management architecture discussion planned.",
  },
  {
    id: "5",
    alumniProfile: "Mr. Tanmay Mohanty",
    industryRole: "Cisco / Engineering Manager",
    studentMentee: "Vikram Das",
    mentoringAvailability: "Monthly - Industry Readiness",
    referralOpportunity: "Cisco Consulting Engineer Track",
    sessionSchedule: "2024-04-05T16:00:00",
    participationStatus: "Scheduled / Pending",
    feedback: "Focusing on enterprise networking protocols and industrial IoT integration architectures.",
  },
  {
    id: "6",
    alumniProfile: "Ms. Ananya Das",
    industryRole: "JPMorgan Chase / Quantitative Analyst",
    studentMentee: "Ananya Mishra",
    mentoringAvailability: "On-demand Project Guidance",
    referralOpportunity: "JPMC Tech Analyst Apprenticeship 2024",
    sessionSchedule: "2024-01-20T10:00:00",
    participationStatus: "Cancelled",
    feedback: "Session cancelled due to semester end-term lab examination conflict. Rescheduling requested.",
  },
];

const getParticipationClass = (status: ParticipationStatusType) => {
  const styles: Record<ParticipationStatusType, string> = {
    Accepted: "bg-blue-100 text-blue-800 border border-blue-200",
    Completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-800 border border-rose-200",
    "Scheduled / Pending": "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const ParticipationBadge = ({ status }: { status: ParticipationStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getParticipationClass(
      status
    )}`}
  >
    {status}
  </span>
);

const ALUMNI_COLUMNS: TableColumnDef<AlumniEngagementData>[] = [
  {
    id: "alumniProfile",
    header: "Alumni Mentor",
    accessorFn: (row) => row.alumniProfile,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.alumniProfile}>
        {row.alumniProfile}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "industryRole",
    header: "Company / Role",
    accessorFn: (row) => row.industryRole,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[180px] truncate" title={row.industryRole}>
        {row.industryRole}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "studentMentee",
    header: "Student / Mentee",
    accessorFn: (row) => row.studentMentee,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[160px] truncate" title={row.studentMentee}>
        {row.studentMentee}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "sessionSchedule",
    header: "Session Date",
    accessorFn: (row) => row.sessionSchedule,
    Cell: ({ row: { original: row } }) => formatDate(row.sessionSchedule),
    enableSorting: true,
  },
  {
    id: "participationStatus",
    header: "Status",
    accessorFn: (row) => row.participationStatus,
    Cell: ({ row: { original: row } }) => <ParticipationBadge status={row.participationStatus} />,
    enableSorting: true,
  },
  {
    id: "mentoringAvailability",
    header: "Mentoring Topics",
    accessorFn: (row) => row.mentoringAvailability,
    defaultHidden: true,
  },
  {
    id: "referralOpportunity",
    header: "Referral Opportunity",
    accessorFn: (row) => row.referralOpportunity || "None",
    defaultHidden: true,
  },
  {
    id: "feedback",
    header: "Feedback",
    accessorFn: (row) => row.feedback || "N/A",
    defaultHidden: true,
  },
];

const AlumniPreview = ({ item }: { item: AlumniEngagementData }) => {
  const details = [
    ["Alumni Mentor", item.alumniProfile],
    ["Industry & Role", item.industryRole],
    ["Mapped Student / Mentee", item.studentMentee],
    ["Mentoring Topics & Availability", item.mentoringAvailability],
    ["Session Scheduled At", formatDate(item.sessionSchedule)],
    ["Referral Opportunity", item.referralOpportunity || "None recorded"],
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
          <dt className="text-xs text-muted">Participation Status</dt>
          <dd className="mt-1">
            <ParticipationBadge status={item.participationStatus} />
          </dd>
        </div>
      </dl>

      {item.feedback && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Mentoring Feedback & Notes
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {item.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export interface AlumniEngagementViewProps {
  hideHeader?: boolean;
}

const AlumniEngagementView = ({ hideHeader }: AlumniEngagementViewProps = {}) => {
  const navigate = useAppNavigate();
  const [sessions, setSessions] =
    useState<AlumniEngagementData[]>(INITIAL_ALUMNI_SESSIONS);
  const [selectedItem, setSelectedItem] =
    useState<AlumniEngagementData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () =>
      statusFilter
        ? sessions.filter((s) => s.participationStatus === statusFilter)
        : sessions,
    [sessions, statusFilter]
  );

  const openDetails = useCallback((item: AlumniEngagementData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: ParticipationStatusType) => {
      setSessions((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, participationStatus: status } : s))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} sessions updated to ${status}`
          : `Session status updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Alumni Engagement & Referrals"
          description="Alumni mentorship network, job referrals and career guidance sessions."
          breadcrumb={[
            { label: "Placement" },
            { label: "Alumni Engagement" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/alumni-engagement")}
            >
              Add Engagement
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Alumni Engagement and Referrals" : undefined} flush>
        <DataTable
          caption="Alumni Mentorship Sessions, Referrals & Engagement Tracking"
          data={rows}
          columns={ALUMNI_COLUMNS}
          getRowId={(s) => s.id}
          rowLabel={(s) => `${s.alumniProfile} - ${s.studentMentee}`}
          searchPlaceholder="Search by alumni, student, industry, role..."
          exportFileName="alumni_engagement_records"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "complete",
              label: "Mark Completed",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Completed");
                setSelection([]);
              },
            },
            {
              id: "accept",
              label: "Mark Accepted",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Accepted");
                setSelection([]);
              },
            },
            {
              id: "cancel",
              label: "Mark Cancelled",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateStatus(ids, "Cancelled");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/alumni-engagement", {
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
          previewTitle={(s) => `${s.alumniProfile} - ${s.studentMentee}`}
          renderPreview={(s) => <AlumniPreview item={s} />}
          emptyTitle="No alumni engagement records found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/alumni-engagement")}
            >
              Add Engagement
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
            ? `Engagement Details - ${selectedItem.alumniProfile}`
            : "Engagement Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <AlumniPreview item={selectedItem} />
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
                  navigate("/alumni-engagement", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Engagement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AlumniEngagementView;
