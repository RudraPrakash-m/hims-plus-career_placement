import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye, Clock } from "lucide-react";

export type RegistrationStatusType =
  | "Registered"
  | "Pending Verification"
  | "Withdrawn"
  | "Not Registered";

export type OfferStatusType =
  | "Offer Issued"
  | "Accepted"
  | "Declined"
  | "Pending";

export type JoiningStatusType =
  | "Joined"
  | "Joining Awaited"
  | "Deferred"
  | "Not Joined"
  | "Under Verification";

export interface CampusPlacementData {
  id: string;
  academicSession: string;
  institutionProgramme: string;
  employerDrive: string;
  eligibleStudent: string;
  registrationStatus: RegistrationStatusType;
  selectionStages: string;
  offerStatus: OfferStatusType;
  joiningStatus: JoiningStatusType;
  joiningDate?: string;
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

const INITIAL_PLACEMENTS: CampusPlacementData[] = [
  {
    id: "1",
    academicSession: "2024 - 2025",
    institutionProgramme: "Faculty of Engineering & Technology - B.Tech (All Branches)",
    employerDrive: "Tata Consultancy Services (TCS) - TCS National Campus Drive 2024",
    eligibleStudent: "Aarav Sharma",
    registrationStatus: "Registered",
    selectionStages: "Final Selection & Offer",
    offerStatus: "Accepted",
    joiningStatus: "Joining Awaited",
    joiningDate: "2024-07-15",
    remarks: "Offered TCS Digital Profile package of 7.2 LPA. Acceptance confirmation received.",
  },
  {
    id: "2",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Electronics & Communication - B.Tech ECE",
    employerDrive: "Infosys Limited - Specialist Programmer Campus Drive",
    eligibleStudent: "Sneha Rao",
    registrationStatus: "Registered",
    selectionStages: "Final Selection & Offer",
    offerStatus: "Offer Issued",
    joiningStatus: "Joining Awaited",
    joiningDate: "2024-08-01",
    remarks: "Specialist Programmer offer of 9.5 LPA issued; candidate reviewing offer letter terms.",
  },
  {
    id: "3",
    academicSession: "2024 - 2025",
    institutionProgramme: "School of Computer Applications - MCA & B.Sc CS",
    employerDrive: "Cognizant Technology Solutions - GenC Elevate Recruitment",
    eligibleStudent: "Rahul Verma",
    registrationStatus: "Registered",
    selectionStages: "HR Interview Completed",
    offerStatus: "Pending",
    joiningStatus: "Joining Awaited",
    joiningDate: "2024-08-15",
    remarks: "HR round completed with positive rating; final offer rollout scheduled for next week.",
  },
  {
    id: "4",
    academicSession: "2024 - 2025",
    institutionProgramme: "Faculty of Engineering & Technology - B.Tech (All Branches)",
    employerDrive: "ABC Technologies Pvt. Ltd. - SDE Frontend Drive",
    eligibleStudent: "Priya Patel",
    registrationStatus: "Registered",
    selectionStages: "Final Selection & Offer",
    offerStatus: "Accepted",
    joiningStatus: "Joined",
    joiningDate: "2024-06-01",
    remarks: "Joined Bhubaneswar innovation lab as Associate Frontend Engineer. Induction complete.",
  },
  {
    id: "5",
    academicSession: "2024 - 2025",
    institutionProgramme: "Department of Mechanical & Civil - B.Tech Core",
    employerDrive: "Eastern Enterprises - Industrial Automation Apprentice Drive",
    eligibleStudent: "Vikram Das",
    registrationStatus: "Registered",
    selectionStages: "Final Selection & Offer",
    offerStatus: "Accepted",
    joiningStatus: "Joined",
    joiningDate: "2024-05-20",
    remarks: "Graduate Apprenticeship onboarding complete at Rourkela plant. Medical clearance verified.",
  },
  {
    id: "6",
    academicSession: "2024 - 2025",
    institutionProgramme: "School of Computer Applications - MCA & B.Sc CS",
    employerDrive: "XYZ Industries - Data Analyst & BI Drive",
    eligibleStudent: "Ananya Mishra",
    registrationStatus: "Pending Verification",
    selectionStages: "Stage Pending",
    offerStatus: "Pending",
    joiningStatus: "Under Verification",
    joiningDate: "2024-09-01",
    remarks: "Academic marksheet verification pending from university controller of examinations.",
  },
];

const getRegistrationClass = (status: RegistrationStatusType) => {
  const styles: Record<RegistrationStatusType, string> = {
    Registered: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "Pending Verification": "bg-amber-100 text-amber-800 border border-amber-200",
    Withdrawn: "bg-rose-100 text-rose-800 border border-rose-200",
    "Not Registered": "bg-gray-100 text-gray-800 border border-gray-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const RegistrationBadge = ({ status }: { status: RegistrationStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRegistrationClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getOfferClass = (status: OfferStatusType) => {
  const styles: Record<OfferStatusType, string> = {
    "Offer Issued": "bg-blue-100 text-blue-800 border border-blue-200",
    Accepted: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Declined: "bg-rose-100 text-rose-800 border border-rose-200",
    Pending: "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const OfferBadge = ({ status }: { status: OfferStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getOfferClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getJoiningClass = (status: JoiningStatusType) => {
  const styles: Record<JoiningStatusType, string> = {
    Joined: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "Joining Awaited": "bg-blue-100 text-blue-800 border border-blue-200",
    Deferred: "bg-purple-100 text-purple-800 border border-purple-200",
    "Not Joined": "bg-rose-100 text-rose-800 border border-rose-200",
    "Under Verification": "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const JoiningBadge = ({ status }: { status: JoiningStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getJoiningClass(
      status
    )}`}
  >
    {status}
  </span>
);

const PLACEMENT_COLUMNS: TableColumnDef<CampusPlacementData>[] = [
  {
    id: "eligibleStudent",
    header: "Student Name",
    accessorFn: (row) => row.eligibleStudent,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.eligibleStudent}>
        {row.eligibleStudent}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "employerDrive",
    header: "Employer / Drive",
    accessorFn: (row) => row.employerDrive,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[240px] truncate" title={row.employerDrive}>
        {row.employerDrive}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "selectionStages",
    header: "Stage",
    accessorFn: (row) => row.selectionStages,
    Cell: ({ row: { original: row } }) => (
      <span className="text-xs font-medium text-foreground max-w-[160px] truncate inline-block" title={row.selectionStages}>
        {row.selectionStages}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "offerStatus",
    header: "Offer",
    accessorFn: (row) => row.offerStatus,
    Cell: ({ row: { original: row } }) => <OfferBadge status={row.offerStatus} />,
    enableSorting: true,
  },
  {
    id: "joiningStatus",
    header: "Joining Status",
    accessorFn: (row) => row.joiningStatus,
    Cell: ({ row: { original: row } }) => <JoiningBadge status={row.joiningStatus} />,
    enableSorting: true,
  },
  {
    id: "academicSession",
    header: "Academic Session",
    accessorFn: (row) => row.academicSession,
    defaultHidden: true,
  },
  {
    id: "institutionProgramme",
    header: "Institution / Programme",
    accessorFn: (row) => row.institutionProgramme,
    defaultHidden: true,
  },
  {
    id: "registrationStatus",
    header: "Registration Status",
    accessorFn: (row) => row.registrationStatus,
    Cell: ({ row: { original: row } }) => <RegistrationBadge status={row.registrationStatus} />,
    defaultHidden: true,
  },
  {
    id: "joiningDate",
    header: "Joining Date",
    accessorFn: (row) => row.joiningDate || "",
    Cell: ({ row: { original: row } }) => formatDate(row.joiningDate),
    defaultHidden: true,
  },
  {
    id: "remarks",
    header: "Remarks",
    accessorFn: (row) => row.remarks || "N/A",
    defaultHidden: true,
  },
];

const PlacementPreview = ({ item }: { item: CampusPlacementData }) => {
  const details = [
    ["Academic Session", item.academicSession],
    ["Institution / Programme", item.institutionProgramme],
    ["Employer / Drive", item.employerDrive],
    ["Student Name", item.eligibleStudent],
    ["Selection Stage Tracked", item.selectionStages],
    ["Expected / Confirmed Joining Date", formatDate(item.joiningDate)],
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
          <dt className="text-xs text-muted">Registration Status</dt>
          <dd className="mt-1">
            <RegistrationBadge status={item.registrationStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Offer Status</dt>
          <dd className="mt-1">
            <OfferBadge status={item.offerStatus} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Joining Status</dt>
          <dd className="mt-1">
            <JoiningBadge status={item.joiningStatus} />
          </dd>
        </div>
      </dl>

      {item.remarks && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Placement Remarks & Compensation Details
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {item.remarks}
          </p>
        </div>
      )}
    </div>
  );
};

const CampusplacementView = () => {
  const navigate = useAppNavigate();
  const [placements, setPlacements] =
    useState<CampusPlacementData[]>(INITIAL_PLACEMENTS);
  const [selectedItem, setSelectedItem] =
    useState<CampusPlacementData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [offerFilter] = useState("");

  const rows = useMemo(
    () =>
      offerFilter
        ? placements.filter((p) => p.offerStatus === offerFilter)
        : placements,
    [placements, offerFilter]
  );

  const openDetails = useCallback((item: CampusPlacementData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateOfferStatus = useCallback(
    (ids: string[], status: OfferStatusType) => {
      setPlacements((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, offerStatus: status } : p))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} placement records updated to ${status}`
          : `Placement record updated to ${status}`
      );
    },
    []
  );

  const updateJoiningStatus = useCallback(
    (ids: string[], status: JoiningStatusType) => {
      setPlacements((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, joiningStatus: status } : p))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} joining statuses updated to ${status}`
          : `Joining status updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      <PageHeader
        title="Campus Placements"
        description="Monitor campus recruitment workflows, selections, offers and student onboarding."
        breadcrumb={[
          { label: "Placement" },
          { label: "Campus Placements" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/campus-placement")}
          >
            Add Placement Record
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Campus Recruitment, Drive Registration & Offer Tracking"
          data={rows}
          columns={PLACEMENT_COLUMNS}
          getRowId={(p) => p.id}
          rowLabel={(p) => `${p.eligibleStudent} - ${p.employerDrive}`}
          searchPlaceholder="Search by student, employer, drive, programme..."
          exportFileName="campus_placement_records"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "accept-offer",
              label: "Mark Offer Accepted",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateOfferStatus(ids, "Accepted");
                setSelection([]);
              },
            },
            {
              id: "joined",
              label: "Mark Joined",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateJoiningStatus(ids, "Joined");
                setSelection([]);
              },
            },
            {
              id: "pending-offer",
              label: "Mark Offer Pending",
              icon: Clock,
              onClick: (ids) => {
                updateOfferStatus(ids, "Pending");
                setSelection([]);
              },
            },
            {
              id: "decline-offer",
              label: "Mark Offer Declined",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateOfferStatus(ids, "Declined");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/campus-placement", {
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
          previewTitle={(p) => `${p.eligibleStudent} - ${p.employerDrive}`}
          renderPreview={(p) => <PlacementPreview item={p} />}
          emptyTitle="No campus placement records found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/campus-placement")}
            >
              Add Placement Record
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
            ? `Placement Details - ${selectedItem.eligibleStudent}`
            : "Placement Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <PlacementPreview item={selectedItem} />
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
                  navigate("/campus-placement", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Placement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default CampusplacementView;