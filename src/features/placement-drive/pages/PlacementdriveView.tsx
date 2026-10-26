import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";
export type DriveStatus =
  | "Draft"
  | "Published"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export interface PlacementDriveData {
  id: string;
  driveName: string;
  employer: string;
  driveType: string;
  schedule: string;
  registrationDeadline: string;
  venueMode: string;
  vacanciesRoles: string;
  driveStatus: DriveStatus;
  eligibleProgrammes: string[] | string;
  selectionStages: string[] | string;
  eligibilityCriteria: string;
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

const INITIAL_DRIVES: PlacementDriveData[] = [
  {
    id: "1",
    driveName: "TCS National Campus Recruitment Drive 2024",
    employer: "Tata Consultancy Services",
    driveType: "On-Campus Drive",
    schedule: "2024-02-15",
    registrationDeadline: "2024-01-25",
    venueMode: "Campus Main Auditorium & Computer Center",
    vacanciesRoles: "Ninja Trainee: 45, Digital Innovator: 15",
    driveStatus: "Completed",
    eligibleProgrammes: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "MCA"],
    selectionStages: ["Aptitude Test", "Coding Test", "Technical Interview 1", "HR Interview"],
    eligibilityCriteria: "60%+ throughout 10th, 12th, and B.Tech/MCA. Zero active backlogs allowed at the time of drive.",
  },
  {
    id: "2",
    driveName: "Infosys Specialist Programmer Campus Drive",
    employer: "Infosys Limited",
    driveType: "Joint / Pool Campus Drive",
    schedule: "2024-03-10",
    registrationDeadline: "2024-02-20",
    venueMode: "Virtual Assessment Platform & Department Labs",
    vacanciesRoles: "Specialist Programmer: 10, Digital Specialist: 20",
    driveStatus: "Completed",
    eligibleProgrammes: ["B.Tech CSE", "B.Tech IT", "MCA"],
    selectionStages: ["Coding Test", "Technical Interview 1", "Technical Interview 2", "HR Interview"],
    eligibilityCriteria: "Minimum 65% or 7.0 CGPA. Strong expertise in algorithms, competitive programming, and databases.",
  },
  {
    id: "3",
    driveName: "Cognizant GenC Elevate Recruitment Drive",
    employer: "Cognizant",
    driveType: "On-Campus Drive",
    schedule: "2024-04-05",
    registrationDeadline: "2024-03-22",
    venueMode: "Placement Cell Block & Seminar Hall 1",
    vacanciesRoles: "GenC Developer: 30, GenC Elevate: 15",
    driveStatus: "In Progress",
    eligibleProgrammes: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE", "B.Tech EE", "MCA"],
    selectionStages: ["Aptitude Test", "Technical Interview 1", "HR Interview"],
    eligibilityCriteria: "Consistent 60% and above in academics. Maximum 1 pending backlog permitted.",
  },
  {
    id: "4",
    driveName: "ABC Technologies Full-Stack Graduate Hiring",
    employer: "ABC Technologies Pvt. Ltd.",
    driveType: "Virtual / Online Recruitment Drive",
    schedule: "2024-05-18",
    registrationDeadline: "2024-05-05",
    venueMode: "Online via MS Teams & Remote Proctoring",
    vacanciesRoles: "Associate Software Engineer: 12",
    driveStatus: "Published",
    eligibleProgrammes: ["B.Tech CSE", "B.Tech IT", "MCA"],
    selectionStages: ["Coding Test", "Technical Interview 1", "Managerial Round", "HR Interview"],
    eligibilityCriteria: "Proficiency in React, TypeScript, and Node.js. Minimum 60% in degree.",
  },
  {
    id: "5",
    driveName: "Eastern Enterprises Industrial Engineering Placement",
    employer: "Eastern Enterprises",
    driveType: "On-Campus Drive",
    schedule: "2024-06-12",
    registrationDeadline: "2024-05-28",
    venueMode: "Mechanical Department Seminar Hall",
    vacanciesRoles: "Graduate Engineer Trainee (GET): 18",
    driveStatus: "Draft",
    eligibleProgrammes: ["B.Tech ME", "B.Tech EE", "B.Tech CE"],
    selectionStages: ["Aptitude Test", "Group Discussion", "Technical Interview 1", "HR Interview"],
    eligibilityCriteria: "B.Tech in Mechanical, Electrical, or Civil Engineering with min 58% marks.",
  },
];

const getStatusClass = (status: DriveStatus) => {
  const styles: Record<DriveStatus, string> = {
    Draft: "bg-gray-100 text-gray-800 border border-gray-200",
    Published: "bg-blue-100 text-blue-800 border border-blue-200",
    "In Progress": "bg-amber-100 text-amber-800 border border-amber-200",
    Completed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const StatusBadge = ({ status }: { status: DriveStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getDriveTypeClass = (type: string) => {
  if (type.includes("On-Campus")) {
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  }
  if (type.includes("Pool")) {
    return "bg-purple-100 text-purple-800 border border-purple-200";
  }
  if (type.includes("Virtual")) {
    return "bg-cyan-100 text-cyan-800 border border-cyan-200";
  }
  if (type.includes("Off-Campus")) {
    return "bg-indigo-100 text-indigo-800 border border-indigo-200";
  }
  if (type.includes("Fair")) {
    return "bg-orange-100 text-orange-800 border border-orange-200";
  }
  return "bg-blue-100 text-blue-800 border border-blue-200";
};

const DriveTypeBadge = ({ type }: { type: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDriveTypeClass(
      type
    )}`}
  >
    {type}
  </span>
);

const DRIVE_COLUMNS: TableColumnDef<PlacementDriveData>[] = [
  {
    id: "driveName",
    header: "Drive Name",
    accessorFn: (row) => row.driveName,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[220px] truncate" title={row.driveName}>
        {row.driveName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "employer",
    header: "Employer",
    accessorFn: (row) => row.employer,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[170px] truncate" title={row.employer}>
        {row.employer}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "driveType",
    header: "Type",
    accessorFn: (row) => row.driveType,
    Cell: ({ row: { original: row } }) => <DriveTypeBadge type={row.driveType} />,
    enableSorting: true,
  },
  {
    id: "schedule",
    header: "Drive Date",
    accessorFn: (row) => row.schedule,
    Cell: ({ row: { original: row } }) => formatDate(row.schedule),
    enableSorting: true,
  },
  {
    id: "venueMode",
    header: "Venue / Mode",
    accessorFn: (row) => row.venueMode,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[180px] truncate" title={row.venueMode}>
        {row.venueMode}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "driveStatus",
    header: "Status",
    accessorFn: (row) => row.driveStatus,
    Cell: ({ row: { original: row } }) => <StatusBadge status={row.driveStatus} />,
    enableSorting: true,
  },
  {
    id: "registrationDeadline",
    header: "Deadline",
    accessorFn: (row) => row.registrationDeadline,
    Cell: ({ row: { original: row } }) => formatDate(row.registrationDeadline),
    defaultHidden: true,
  },
  {
    id: "vacanciesRoles",
    header: "Vacancies / Roles",
    accessorFn: (row) => row.vacanciesRoles,
    defaultHidden: true,
  },
  {
    id: "eligibleProgrammes",
    header: "Eligible Programmes",
    accessorFn: (row) =>
      Array.isArray(row.eligibleProgrammes)
        ? row.eligibleProgrammes.join(", ")
        : (row.eligibleProgrammes || "All"),
    defaultHidden: true,
  },
  {
    id: "selectionStages",
    header: "Selection Stages",
    accessorFn: (row) =>
      Array.isArray(row.selectionStages)
        ? row.selectionStages.join(" -> ")
        : (row.selectionStages || "N/A"),
    defaultHidden: true,
  },
  {
    id: "eligibilityCriteria",
    header: "Eligibility Criteria",
    accessorFn: (row) => row.eligibilityCriteria,
    defaultHidden: true,
  },
];

const DrivePreview = ({ drive }: { drive: PlacementDriveData }) => {
  const programmesDisplay = Array.isArray(drive.eligibleProgrammes)
    ? drive.eligibleProgrammes.join(", ")
    : (drive.eligibleProgrammes || "All Final Year");

  const stagesDisplay = Array.isArray(drive.selectionStages)
    ? drive.selectionStages.join(" -> ")
    : (drive.selectionStages || "N/A");

  const details = [
    ["Drive Name", drive.driveName],
    ["Employer", drive.employer],
    ["Drive Type", drive.driveType],
    ["Drive Schedule", formatDate(drive.schedule)],
    ["Registration Deadline", formatDate(drive.registrationDeadline)],
    ["Venue / Mode", drive.venueMode],
    ["Vacancies / Roles", drive.vacanciesRoles],
    ["Eligible Programmes", programmesDisplay],
    ["Selection Stages", stagesDisplay],
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
          <dt className="text-xs text-muted">Drive Status</dt>
          <dd className="mt-1">
            <StatusBadge status={drive.driveStatus} />
          </dd>
        </div>
      </dl>

      <div className="space-y-2 border-t pt-3">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Eligibility Criteria
        </h4>
        <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {drive.eligibilityCriteria}
        </p>
      </div>
    </div>
  );
};

const PlacementdriveView = () => {
  const navigate = useAppNavigate();
  const [drives, setDrives] = useState<PlacementDriveData[]>(INITIAL_DRIVES);
  const [selectedDrive, setSelectedDrive] = useState<PlacementDriveData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () => (statusFilter ? drives.filter((d) => d.driveStatus === statusFilter) : drives),
    [drives, statusFilter]
  );

  const openDetails = useCallback((drive: PlacementDriveData) => {
    setSelectedDrive(drive);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: DriveStatus) => {
      setDrives((prev) =>
        prev.map((d) => (ids.includes(d.id) ? { ...d, driveStatus: status } : d))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} placement drives updated to ${status}`
          : `Placement drive status updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      <PageHeader
        title="Placement Drives"
        description="Campus recruitment drives, scheduling and company registration."
        breadcrumb={[
          { label: "Placement" },
          { label: "Placement Drives" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/placement-drive")}
          >
            Create Drive
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Campus Recruitment & Placement Drives"
          data={rows}
          columns={DRIVE_COLUMNS}
          getRowId={(d) => d.id}
          rowLabel={(d) => `${d.driveName} - ${d.employer}`}
          searchPlaceholder="Search by drive name, employer, venue..."
          exportFileName="placement_recruitment_drives"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "in-progress",
              label: "Mark In Progress",
              icon: Clock,
              onClick: (ids) => {
                updateStatus(ids, "In Progress");
                setSelection([]);
              },
            },
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
              navigate("/placement-drive", {
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
          previewTitle={(d) => `${d.driveName} - ${d.employer}`}
          renderPreview={(d) => <DrivePreview drive={d} />}
          emptyTitle="No placement drives found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/placement-drive")}
            >
              Create Drive
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedDrive
            ? `Placement Drive Details - ${selectedDrive.driveName}`
            : "Placement Drive Details"
        }
        size="2xl"
      >
        {selectedDrive && (
          <div className="space-y-4 p-4">
            <DrivePreview drive={selectedDrive} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedDrive;
                  setIsModalOpen(false);
                  navigate("/placement-drive", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Drive
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PlacementdriveView;