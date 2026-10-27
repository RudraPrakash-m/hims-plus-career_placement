import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus } from "lucide-react";

export type WorkModeType = "On-site" | "Hybrid" | "Remote" | "Open to Any";

export interface CarrierPreferenceData {
  id: string;
  studentName?: string;
  preferredJobRoles: string[];
  preferredIndustry: string;
  preferredLocation: string;
  employmentType: string;
  careerGoals?: string;
  expectedSalaryRange?: string;
  workMode: WorkModeType;
  availability: string;
  lastUpdated: string;
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

const INITIAL_PREFERENCES: CarrierPreferenceData[] = [
  {
    id: "1",
    studentName: "Aarav Sharma",
    preferredJobRoles: ["Software Engineer", "Full Stack Developer", "Backend Developer"],
    preferredIndustry: "Information Technology (IT) & Services",
    preferredLocation: "Bangalore, Hyderabad, Pune",
    employmentType: "Full-Time",
    careerGoals: "Aiming to become a Tech Lead in distributed systems and cloud architecture.",
    expectedSalaryRange: "8 - 12 LPA",
    workMode: "Hybrid",
    availability: "Immediate",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    studentName: "Priya Patel",
    preferredJobRoles: ["Frontend Developer", "UI / UX Designer"],
    preferredIndustry: "E-Commerce & Retail",
    preferredLocation: "Bhubaneswar, Bangalore, Remote",
    employmentType: "Full-Time",
    careerGoals: "Aspiring to specialize in accessible design systems and Next.js frontend performance.",
    expectedSalaryRange: "5 - 8 LPA",
    workMode: "Remote",
    availability: "After Exams",
    lastUpdated: "2024-02-20",
  },
  {
    id: "3",
    studentName: "Rahul Verma",
    preferredJobRoles: ["Data Analyst", "Machine Learning Engineer"],
    preferredIndustry: "Banking, Financial Services & Insurance (BFSI)",
    preferredLocation: "Mumbai, Pune, Bangalore",
    employmentType: "Internship",
    careerGoals: "Planning to pursue an MS in Data Science after 2 years of industry experience.",
    expectedSalaryRange: "5 - 8 LPA",
    workMode: "Hybrid",
    availability: "Summer Internship",
    lastUpdated: "2024-03-10",
  },
  {
    id: "4",
    studentName: "Sneha Rao",
    preferredJobRoles: ["DevOps Engineer", "Cloud Engineer"],
    preferredIndustry: "Telecommunications & Media",
    preferredLocation: "Hyderabad, Chennai",
    employmentType: "Full-Time",
    careerGoals: "Targeting Kubernetes CKA certification and enterprise cloud migrations.",
    expectedSalaryRange: "8 - 12 LPA",
    workMode: "On-site",
    availability: "1 Month",
    lastUpdated: "2024-04-05",
  },
  {
    id: "5",
    studentName: "Vikram Das",
    preferredJobRoles: ["QA Automation Tester", "Cybersecurity Analyst"],
    preferredIndustry: "Healthcare & Pharmaceuticals",
    preferredLocation: "Bhubaneswar, Kolkata, Remote",
    employmentType: "Apprenticeship",
    careerGoals: "Specializing in compliance testing and automated penetration testing.",
    expectedSalaryRange: "3 - 5 LPA",
    workMode: "Remote",
    availability: "6 Months Internship",
    lastUpdated: "2024-05-18",
  },
];

const getWorkModeClass = (mode: WorkModeType) => {
  const styles: Record<WorkModeType, string> = {
    Remote: "bg-purple-100 text-purple-800 border border-purple-200",
    Hybrid: "bg-blue-100 text-blue-800 border border-blue-200",
    "On-site": "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "Open to Any": "bg-gray-100 text-gray-800 border border-gray-200",
  };
  return styles[mode] || "bg-gray-100 text-gray-800";
};

const WorkModeBadge = ({ mode }: { mode: WorkModeType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getWorkModeClass(
      mode
    )}`}
  >
    {mode}
  </span>
);

const PREFERENCE_COLUMNS: TableColumnDef<CarrierPreferenceData>[] = [
  {
    id: "preferredJobRoles",
    header: "Preferred Role",
    accessorFn: (row) =>
      Array.isArray(row.preferredJobRoles)
        ? row.preferredJobRoles.join(", ")
        : row.preferredJobRoles,
    Cell: ({ row: { original: row } }) => {
      const roles = Array.isArray(row.preferredJobRoles)
        ? row.preferredJobRoles
        : [row.preferredJobRoles];
      return (
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground truncate max-w-[200px]" title={roles.join(", ")}>
          <span className="truncate">{roles[0]}</span>
          {roles.length > 1 && (
            <span className="inline-flex shrink-0 items-center rounded bg-surface-active px-1.5 py-0.2 text-[10px] text-muted">
              +{roles.length - 1}
            </span>
          )}
        </span>
      );
    },
    enableSorting: true,
  },
  {
    id: "preferredIndustry",
    header: "Industry",
    accessorFn: (row) => row.preferredIndustry,
    Cell: ({ row: { original: row } }) => (
      <span className="truncate max-w-[220px] inline-block text-text-secondary" title={row.preferredIndustry}>
        {row.preferredIndustry}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "preferredLocation",
    header: "Location",
    accessorFn: (row) => row.preferredLocation,
    Cell: ({ row: { original: row } }) => (
      <span className="truncate max-w-[160px] inline-block text-text-secondary" title={row.preferredLocation}>
        {row.preferredLocation}
      </span>
    ),
  },
  {
    id: "employmentType",
    header: "Employment Type",
    accessorFn: (row) => row.employmentType,
    enableSorting: true,
  },
  {
    id: "workMode",
    header: "Work Mode",
    accessorFn: (row) => row.workMode,
    Cell: ({ row: { original: row } }) => <WorkModeBadge mode={row.workMode} />,
    enableSorting: true,
  },
  {
    id: "availability",
    header: "Availability",
    accessorFn: (row) => row.availability,
    defaultHidden: true,
  },
  {
    id: "expectedSalaryRange",
    header: "Expected Salary",
    accessorFn: (row) => row.expectedSalaryRange || "N/A",
    defaultHidden: true,
  },
  {
    id: "lastUpdated",
    header: "Last Updated",
    accessorFn: (row) => row.lastUpdated || "N/A",
    Cell: ({ row: { original: row } }) => formatDate(row.lastUpdated),
    defaultHidden: true,
  },
];

const PreferencePreview = ({
  preference,
}: {
  preference: CarrierPreferenceData;
}) => {
  const roles = Array.isArray(preference.preferredJobRoles)
    ? preference.preferredJobRoles
    : [preference.preferredJobRoles];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Preferred Job Roles
        </h4>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {roles.map((role) => (
            <span
              key={role}
              className="inline-block rounded-md bg-primary-light px-2.5 py-1 text-xs font-medium text-primary-dark"
            >
              {role}
            </span>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm border-t pt-3 md:grid-cols-2">
        <div>
          <dt className="text-xs text-muted">Preferred Industry</dt>
          <dd className="mt-1 font-medium text-foreground">{preference.preferredIndustry}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Preferred Location</dt>
          <dd className="mt-1 font-medium text-foreground">{preference.preferredLocation}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Employment Type</dt>
          <dd className="mt-1 font-medium text-foreground">{preference.employmentType}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Work Mode</dt>
          <dd className="mt-1">
            <WorkModeBadge mode={preference.workMode} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Expected Salary Range</dt>
          <dd className="mt-1 font-medium text-foreground">{preference.expectedSalaryRange || "Competitive"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Availability</dt>
          <dd className="mt-1 font-medium text-foreground">{preference.availability}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Last Updated</dt>
          <dd className="mt-1 font-medium text-foreground">{formatDate(preference.lastUpdated)}</dd>
        </div>
      </dl>

      {preference.careerGoals && (
        <div className="border-t pt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Higher Study & Career Goals
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {preference.careerGoals}
          </p>
        </div>
      )}
    </div>
  );
};

export interface ViewcarrierPreferenceProps {
  hideHeader?: boolean;
}

const ViewcarrierPreference = ({ hideHeader }: ViewcarrierPreferenceProps = {}) => {
  const navigate = useAppNavigate();
  const [preferences] =
    useState<CarrierPreferenceData[]>(INITIAL_PREFERENCES);
  const [selectedPreference, setSelectedPreference] =
    useState<CarrierPreferenceData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workModeFilter] = useState("");

  const rows = useMemo(
    () =>
      preferences.filter(
        (p) => !workModeFilter || p.workMode === workModeFilter
      ),
    [preferences, workModeFilter]
  );

  const openDetails = useCallback((pref: CarrierPreferenceData) => {
    setSelectedPreference(pref);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Career Preferences"
          description="Jobs, preferred roles and employment aspirations open to you."
          breadcrumb={[
            { label: "Home", path: "/" },
            { label: "Career Preferences and Employment Aspirations" },
            { label: "View Aspirations" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/carrier-preference")}
            >
              Add Preferences
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Career Preferences" : undefined} flush>
          <DataTable
            caption="Student Career Preferences"
            data={rows}
            columns={PREFERENCE_COLUMNS}
            getRowId={(p) => p.id}
            rowLabel={(p) =>
              Array.isArray(p.preferredJobRoles)
                ? p.preferredJobRoles.join(", ")
                : p.preferredJobRoles
            }
            searchPlaceholder="Search by job role, industry, location..."
            exportFileName="student_career_preferences"
            selectable={false}
            actions={{
              onView: openDetails,
              onEdit: (pref) =>
                navigate("/carrier-preference", {
                  state: { editRecord: pref },
                }),
            }}
            previewTitle={(p) =>
              Array.isArray(p.preferredJobRoles)
                ? p.preferredJobRoles.join(", ")
                : p.preferredJobRoles
            }
            renderPreview={(p) => <PreferencePreview preference={p} />}
            emptyTitle="No career preferences found"
            emptyAction={
              <Button
                icon={<Plus size={16} />}
                onClick={() => navigate("/carrier-preference")}
              >
                Add Preferences
              </Button>
            }
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedPreference
            ? `Career Preferences - ${Array.isArray(selectedPreference.preferredJobRoles)
              ? selectedPreference.preferredJobRoles.join(", ")
              : selectedPreference.preferredJobRoles
            }`
            : "Career Preference Details"
        }
        size="2xl"
      >
        {selectedPreference && (
          <div className="space-y-4 p-4">
            <PreferencePreview preference={selectedPreference} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedPreference;
                  setIsModalOpen(false);
                  navigate("/carrier-preference", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Preferences
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewcarrierPreference;