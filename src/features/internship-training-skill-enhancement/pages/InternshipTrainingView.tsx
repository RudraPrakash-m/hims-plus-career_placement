import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, Eye, Clock } from "lucide-react";

export type ProgrammeType =
  | "Internship"
  | "Training Programme"
  | "Technical Workshop"
  | "Certification"
  | "Skill Enhancement"
  | "Bootcamp";

export type RegistrationStatus = "Open" | "Closed" | "Upcoming" | "Invite Only";

export type AssessmentCompletionStatus =
  | "Completed & Passed"
  | "Cleared with Merit"
  | "In Progress"
  | "Assessment Pending"
  | "Not Completed";

export interface InternshipTrainingData {
  id: string;
  programmeName: string;
  programmeType: ProgrammeType;
  providerEmployer: string;
  startDate: string;
  endDate: string;
  scheduleDuration: string;
  registration: RegistrationStatus;
  skillsCovered: string[] | string;
  attendanceParticipation: string;
  assessmentCompletion: AssessmentCompletionStatus;
  certificate?: string;
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

const INITIAL_PROGRAMMES: InternshipTrainingData[] = [
  {
    id: "1",
    programmeName: "AWS Cloud Architecture & DevOps Practitioner Internship",
    programmeType: "Internship",
    providerEmployer: "AWS Academy",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    scheduleDuration: "12 Weeks (Mon-Fri, 2 hrs/day)",
    registration: "Closed",
    skillsCovered: ["Cloud & DevOps", "Full Stack Web Dev"],
    attendanceParticipation: "Regular (> 85%)",
    assessmentCompletion: "Completed & Passed",
    certificate: "AWS_Cloud_Certificate_2024.pdf",
    eligibility: "B.Tech CSE/IT/ECE (3rd and Final Year) with 60%+ aggregate.",
  },
  {
    id: "2",
    programmeName: "Google Cloud & Android Native App Development",
    programmeType: "Training Programme",
    providerEmployer: "Google Developers",
    startDate: "2024-03-01",
    endDate: "2024-04-15",
    scheduleDuration: "6 Weeks (Weekend Cohort)",
    registration: "Open",
    skillsCovered: ["Full Stack Web Dev", "Cloud & DevOps"],
    attendanceParticipation: "Active Participant",
    assessmentCompletion: "In Progress",
    certificate: "Pending Evaluation",
    eligibility: "Open to 2nd, 3rd, and 4th year B.Tech, MCA, and BCA students.",
  },
  {
    id: "3",
    programmeName: "IBM Enterprise AI & Machine Learning Foundations",
    programmeType: "Certification",
    providerEmployer: "IBM SkillsBuild",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    scheduleDuration: "8 Weeks Self-Paced + Weekly Lab",
    registration: "Closed",
    skillsCovered: ["Data Science & Python", "Machine Learning & AI"],
    attendanceParticipation: "Regular (> 85%)",
    assessmentCompletion: "Cleared with Merit",
    certificate: "IBM_AI_Foundations_Badge.pdf",
    eligibility: "Students with background in Linear Algebra and Python programming.",
  },
  {
    id: "4",
    programmeName: "Cisco Certified Network Associate (CCNA) Intensive Workshop",
    programmeType: "Technical Workshop",
    providerEmployer: "Cisco Academy",
    startDate: "2024-04-05",
    endDate: "2024-05-20",
    scheduleDuration: "6 Weeks (Evening Sessions)",
    registration: "Open",
    skillsCovered: ["Cybersecurity", "DSA & Algorithms"],
    attendanceParticipation: "Satisfactory (75-85%)",
    assessmentCompletion: "In Progress",
    certificate: "Awaiting Final Exam",
    eligibility: "B.Tech ECE, EE, and CSE students interested in enterprise infrastructure.",
  },
  {
    id: "5",
    programmeName: "Corporate Readiness & Workplace Soft Skills Bootcamp",
    programmeType: "Skill Enhancement",
    providerEmployer: "TCS iON",
    startDate: "2024-02-10",
    endDate: "2024-03-10",
    scheduleDuration: "4 Weeks (Daily 1 hour)",
    registration: "Closed",
    skillsCovered: ["Soft Skills & Communication"],
    attendanceParticipation: "Regular (> 85%)",
    assessmentCompletion: "Completed & Passed",
    certificate: "TCS_iON_CareerEdge_Cert.pdf",
    eligibility: "All pre-final and final year students enrolled for placement drives.",
  },
  {
    id: "6",
    programmeName: "Full Stack Microservices & React Native Bootcamp",
    programmeType: "Bootcamp",
    providerEmployer: "Infosys Springboard",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    scheduleDuration: "8 Weeks Intensive (10:00 AM - 4:00 PM)",
    registration: "Upcoming",
    skillsCovered: ["Full Stack Web Dev", "Cloud & DevOps", "DSA & Algorithms"],
    attendanceParticipation: "Active Participant",
    assessmentCompletion: "Assessment Pending",
    certificate: "Springboard_Cohort_Enrollment.pdf",
    eligibility: "B.Tech CSE/IT with basic understanding of OOP and JavaScript.",
  },
];

const getProgrammeTypeClass = (type: ProgrammeType) => {
  const styles: Record<ProgrammeType, string> = {
    Internship: "bg-teal-100 text-teal-800 border border-teal-200",
    "Training Programme": "bg-blue-100 text-blue-800 border border-blue-200",
    "Technical Workshop": "bg-purple-100 text-purple-800 border border-purple-200",
    Certification: "bg-amber-100 text-amber-800 border border-amber-200",
    "Skill Enhancement": "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Bootcamp: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  };
  return styles[type] || "bg-gray-100 text-gray-800";
};

const ProgrammeTypeBadge = ({ type }: { type: ProgrammeType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getProgrammeTypeClass(
      type
    )}`}
  >
    {type}
  </span>
);

const getRegistrationClass = (status: RegistrationStatus) => {
  const styles: Record<RegistrationStatus, string> = {
    Open: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Closed: "bg-rose-100 text-rose-800 border border-rose-200",
    Upcoming: "bg-blue-100 text-blue-800 border border-blue-200",
    "Invite Only": "bg-purple-100 text-purple-800 border border-purple-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const RegistrationBadge = ({ status }: { status: RegistrationStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRegistrationClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getCompletionClass = (status: AssessmentCompletionStatus) => {
  const styles: Record<AssessmentCompletionStatus, string> = {
    "Completed & Passed": "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "Cleared with Merit": "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "In Progress": "bg-blue-100 text-blue-800 border border-blue-200",
    "Assessment Pending": "bg-amber-100 text-amber-800 border border-amber-200",
    "Not Completed": "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const CompletionBadge = ({ status }: { status: AssessmentCompletionStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getCompletionClass(
      status
    )}`}
  >
    {status}
  </span>
);

const PROGRAMME_COLUMNS: TableColumnDef<InternshipTrainingData>[] = [
  {
    id: "programmeName",
    header: "Programme Name",
    accessorFn: (row) => row.programmeName,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[220px] truncate" title={row.programmeName}>
        {row.programmeName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "programmeType",
    header: "Type",
    accessorFn: (row) => row.programmeType,
    Cell: ({ row: { original: row } }) => <ProgrammeTypeBadge type={row.programmeType} />,
    enableSorting: true,
  },
  {
    id: "providerEmployer",
    header: "Provider / Employer",
    accessorFn: (row) => row.providerEmployer,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[170px] truncate" title={row.providerEmployer}>
        {row.providerEmployer}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "schedule",
    header: "Period",
    accessorFn: (row) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}`,
    Cell: ({ row: { original: row } }) => (
      <span className="text-xs text-muted whitespace-nowrap">
        {formatDate(row.startDate)} - {formatDate(row.endDate)}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "assessmentCompletion",
    header: "Status",
    accessorFn: (row) => row.assessmentCompletion,
    Cell: ({ row: { original: row } }) => <CompletionBadge status={row.assessmentCompletion} />,
    enableSorting: true,
  },
  {
    id: "registration",
    header: "Registration",
    accessorFn: (row) => row.registration,
    Cell: ({ row: { original: row } }) => <RegistrationBadge status={row.registration} />,
    defaultHidden: true,
  },
  {
    id: "attendanceParticipation",
    header: "Attendance",
    accessorFn: (row) => row.attendanceParticipation,
    defaultHidden: true,
  },
  {
    id: "certificate",
    header: "Certificate",
    accessorFn: (row) => row.certificate || "Verified",
    defaultHidden: true,
  },
  {
    id: "skillsCovered",
    header: "Skills Covered",
    accessorFn: (row) =>
      Array.isArray(row.skillsCovered)
        ? row.skillsCovered.join(", ")
        : (row.skillsCovered || "N/A"),
    defaultHidden: true,
  },
  {
    id: "eligibility",
    header: "Eligibility",
    accessorFn: (row) => row.eligibility,
    defaultHidden: true,
  },
];

const ProgrammePreview = ({ item }: { item: InternshipTrainingData }) => {
  const skillsDisplay = Array.isArray(item.skillsCovered)
    ? item.skillsCovered.join(", ")
    : (item.skillsCovered || "None");

  const details = [
    ["Programme Name", item.programmeName],
    ["Provider / Employer", item.providerEmployer],
    ["Schedule / Duration", item.scheduleDuration],
    ["Active Period", `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`],
    ["Attendance / Participation", item.attendanceParticipation],
    ["Certificate Document", item.certificate || "N/A"],
    ["Skills Covered", skillsDisplay],
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
          <dt className="text-xs text-muted">Programme Type</dt>
          <dd className="mt-1">
            <ProgrammeTypeBadge type={item.programmeType} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Registration Status</dt>
          <dd className="mt-1">
            <RegistrationBadge status={item.registration} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Assessment & Completion</dt>
          <dd className="mt-1">
            <CompletionBadge status={item.assessmentCompletion} />
          </dd>
        </div>
      </dl>

      <div className="border-t pt-3">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
          Eligibility Requirements
        </h4>
        <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {item.eligibility}
        </p>
      </div>
    </div>
  );
};

const InternshipTrainingView = () => {
  const navigate = useAppNavigate();
  const [programmes, setProgrammes] =
    useState<InternshipTrainingData[]>(INITIAL_PROGRAMMES);
  const [selectedItem, setSelectedItem] =
    useState<InternshipTrainingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [typeFilter] = useState("");

  const rows = useMemo(
    () =>
      typeFilter
        ? programmes.filter((p) => p.programmeType === typeFilter)
        : programmes,
    [programmes, typeFilter]
  );

  const openDetails = useCallback((item: InternshipTrainingData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateCompletion = useCallback(
    (ids: string[], status: AssessmentCompletionStatus) => {
      setProgrammes((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, assessmentCompletion: status } : p))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} programmes updated to ${status}`
          : `Programme status updated to ${status}`
      );
    },
    []
  );

  const updateRegistration = useCallback(
    (ids: string[], reg: RegistrationStatus) => {
      setProgrammes((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, registration: reg } : p))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} programmes registration updated to ${reg}`
          : `Programme registration updated to ${reg}`
      );
    },
    []
  );

  return (
    <>
      <PageHeader
        title="Internships & Training"
        description="Internship programmes, technical certifications and skill enhancement tracks."
        breadcrumb={[
          { label: "Placement" },
          { label: "Internships & Training" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/training-internship")}
          >
            Add Programme
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Internships, Technical Trainings, Certifications & Skill Programmes"
          data={rows}
          columns={PROGRAMME_COLUMNS}
          getRowId={(p) => p.id}
          rowLabel={(p) => `${p.programmeName} - ${p.providerEmployer}`}
          searchPlaceholder="Search by programme, provider, skills..."
          exportFileName="internship_training_programmes"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "mark-passed",
              label: "Mark Completed",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateCompletion(ids, "Completed & Passed");
                setSelection([]);
              },
            },
            {
              id: "mark-open",
              label: "Open Registration",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateRegistration(ids, "Open");
                setSelection([]);
              },
            },
            {
              id: "mark-closed",
              label: "Close Registration",
              icon: Clock,
              onClick: (ids) => {
                updateRegistration(ids, "Closed");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/training-internship", {
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
          previewTitle={(p) => `${p.programmeName} - ${p.providerEmployer}`}
          renderPreview={(p) => <ProgrammePreview item={p} />}
          emptyTitle="No training or internship programmes found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/training-internship")}
            >
              Add Programme
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
            ? `Programme Details - ${selectedItem.programmeName}`
            : "Programme Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <ProgrammePreview item={selectedItem} />
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
                  navigate("/training-internship", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Programme
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default InternshipTrainingView;
