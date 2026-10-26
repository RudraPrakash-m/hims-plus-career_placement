import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye } from "lucide-react";
export type SessionStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Rescheduled";

export type AttendanceStatus = "Present" | "Absent" | "Excused" | "Pending";

export interface CarrierCounsellingData {
  id: string;
  sessionType: string;
  student: string;
  counsellor: string;
  dateTime: string;
  modeVenue: string;
  purposeTopic: string;
  attendance: AttendanceStatus;
  sessionNotes?: string;
  followUpAction?: string;
  status: SessionStatus;
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

const INITIAL_SESSIONS: CarrierCounsellingData[] = [
  {
    id: "1",
    sessionType: "Career Guidance",
    student: "Aarav Sharma",
    counsellor: "Dr. S. K. Mohapatra",
    dateTime: "2024-01-15T10:30:00",
    modeVenue: "Online - Google Meet",
    purposeTopic: "Full Stack Career Roadmap & Placement Strategy",
    attendance: "Present",
    sessionNotes: "Recommended focusing on cloud microservices and open source contributions.",
    followUpAction: "Review updated GitHub portfolio on 2024-02-15",
    status: "Completed",
  },
  {
    id: "2",
    sessionType: "Mentoring",
    student: "Priya Patel",
    counsellor: "Prof. Anjali Mehta",
    dateTime: "2024-02-20T14:00:00",
    modeVenue: "In-person - Room 101",
    purposeTopic: "Mock Technical Interview & Frontend System Design",
    attendance: "Present",
    sessionNotes: "Good performance in React hooks, needs practice with state management scale.",
    followUpAction: "Second mock interview scheduled for 2024-03-05",
    status: "Completed",
  },
  {
    id: "3",
    sessionType: "Counselling",
    student: "Rahul Verma",
    counsellor: "Dr. Rajesh Jena",
    dateTime: "2024-03-10T11:00:00",
    modeVenue: "In-person - Placement Cell",
    purposeTopic: "Higher Studies vs Immediate Industry Placement Counselling",
    attendance: "Present",
    sessionNotes: "Discussed GRE/GATE preparation alongside campus drive preparation.",
    followUpAction: "Evaluate corporate offers and share shortlist by end of March",
    status: "Completed",
  },
  {
    id: "4",
    sessionType: "Follow-up",
    student: "Sneha Rao",
    counsellor: "Ms. Neha Gupta",
    dateTime: "2024-04-05T15:30:00",
    modeVenue: "Online - Zoom",
    purposeTopic: "Soft Skills, Communication & HR Interview Prep",
    attendance: "Pending",
    sessionNotes: "Scheduled mock HR round focusing on situational questions.",
    followUpAction: "Conduct mock behavioral interview",
    status: "Scheduled",
  },
  {
    id: "5",
    sessionType: "Mentoring",
    student: "Vikram Das",
    counsellor: "Mr. Alok Patnaik",
    dateTime: "2024-05-18T16:00:00",
    modeVenue: "In-person - Mentor Cabin",
    purposeTopic: "Cybersecurity & DevOps Industry Certifications Roadmap",
    attendance: "Excused",
    sessionNotes: "Session rescheduled due to semester lab exam conflict.",
    followUpAction: "Reschedule session for next week",
    status: "Rescheduled",
  },
];

const getStatusClass = (status: SessionStatus) => {
  const styles: Record<SessionStatus, string> = {
    Scheduled: "bg-blue-100 text-blue-800 border border-blue-200",
    Completed: "bg-green-100 text-green-800 border border-green-200",
    Cancelled: "bg-red-100 text-red-800 border border-red-200",
    Rescheduled: "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const StatusBadge = ({ status }: { status: SessionStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getAttendanceClass = (attendance: AttendanceStatus) => {
  const styles: Record<AttendanceStatus, string> = {
    Present: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Absent: "bg-rose-100 text-rose-800 border border-rose-200",
    Excused: "bg-purple-100 text-purple-800 border border-purple-200",
    Pending: "bg-gray-100 text-gray-800 border border-gray-200",
  };
  return styles[attendance] || "bg-gray-100 text-gray-800";
};

const AttendanceBadge = ({ attendance }: { attendance: AttendanceStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getAttendanceClass(
      attendance
    )}`}
  >
    {attendance}
  </span>
);

const COUNSELLING_COLUMNS: TableColumnDef<CarrierCounsellingData>[] = [
  {
    id: "student",
    header: "Student Name",
    accessorFn: (row) => row.student,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.student}>
        {row.student}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "counsellor",
    header: "Counsellor / Mentor",
    accessorFn: (row) => row.counsellor,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.counsellor}>
        {row.counsellor}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "sessionType",
    header: "Session Type",
    accessorFn: (row) => row.sessionType,
    enableSorting: true,
  },
  {
    id: "purposeTopic",
    header: "Topic / Purpose",
    accessorFn: (row) => row.purposeTopic,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[240px] truncate" title={row.purposeTopic}>
        {row.purposeTopic}
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorFn: (row) => row.status,
    Cell: ({ row: { original: row } }) => <StatusBadge status={row.status} />,
    enableSorting: true,
  },
  {
    id: "dateTime",
    header: "Date and Time",
    accessorFn: (row) => row.dateTime,
    Cell: ({ row: { original: row } }) => formatDate(row.dateTime),
    defaultHidden: true,
  },
  {
    id: "modeVenue",
    header: "Mode / Venue",
    accessorFn: (row) => row.modeVenue,
    defaultHidden: true,
  },
  {
    id: "attendance",
    header: "Attendance",
    accessorFn: (row) => row.attendance,
    Cell: ({ row: { original: row } }) => <AttendanceBadge attendance={row.attendance} />,
    defaultHidden: true,
  },
  {
    id: "sessionNotes",
    header: "Session Notes",
    accessorFn: (row) => row.sessionNotes || "N/A",
    defaultHidden: true,
  },
  {
    id: "followUpAction",
    header: "Follow-up Action",
    accessorFn: (row) => row.followUpAction || "N/A",
    defaultHidden: true,
  },
];

const SessionPreview = ({ session }: { session: CarrierCounsellingData }) => {
  const details = [
    ["Session Type", session.sessionType],
    ["Student", session.student],
    ["Counsellor / Mentor", session.counsellor],
    ["Date and Time", formatDate(session.dateTime)],
    ["Mode / Venue", session.modeVenue],
    ["Purpose / Topic", session.purposeTopic],
    ["Session Notes", session.sessionNotes || "N/A"],
    ["Follow-up Action", session.followUpAction || "N/A"],
  ];

  return (
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
        <dt className="text-xs text-muted">Attendance</dt>
        <dd className="mt-1">
          <AttendanceBadge attendance={session.attendance} />
        </dd>
      </div>
      <div>
        <dt className="text-xs text-muted">Session Status</dt>
        <dd className="mt-1">
          <StatusBadge status={session.status} />
        </dd>
      </div>
    </dl>
  );
};

const CarriercounsellingView = () => {
  const navigate = useAppNavigate();
  const [sessions, setSessions] =
    useState<CarrierCounsellingData[]>(INITIAL_SESSIONS);
  const [selectedSession, setSelectedSession] =
    useState<CarrierCounsellingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () =>
      sessions.filter((s) => !statusFilter || s.status === statusFilter),
    [sessions, statusFilter]
  );

  const openDetails = useCallback((session: CarrierCounsellingData) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: SessionStatus) => {
      setSessions((prev) =>
        prev.map((s) => (ids.includes(s.id) ? { ...s, status } : s))
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
      <PageHeader
        title="Career Counselling"
        description="One-on-one mentorship sessions, career guidance and skill advisory."
        breadcrumb={[
          { label: "Placement" },
          { label: "Career Counselling" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/carrier-counselling")}
          >
            Schedule Session
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Career Counselling Sessions"
          data={rows}
          columns={COUNSELLING_COLUMNS}
          getRowId={(s) => s.id}
          rowLabel={(s) => `${s.student} - ${s.purposeTopic}`}
          searchPlaceholder="Search by student, counsellor, purpose..."
          exportFileName="carrier_counselling_sessions"
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
              navigate("/carrier-counselling", {
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
          previewTitle={(s) => `${s.student} - ${s.sessionType}`}
          renderPreview={(s) => <SessionPreview session={s} />}
          emptyTitle="No counselling sessions found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/carrier-counselling")}
            >
              Schedule Session
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedSession
            ? `Counselling Details - ${selectedSession.student}`
            : "Counselling Session Details"
        }
        size="2xl"
      >
        {selectedSession && (
          <div className="space-y-4 p-4">
            <SessionPreview session={selectedSession} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedSession;
                  setIsModalOpen(false);
                  navigate("/carrier-counselling", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Session
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CarriercounsellingView;