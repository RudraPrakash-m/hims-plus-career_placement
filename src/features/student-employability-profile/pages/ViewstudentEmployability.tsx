import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, Clock, AlertCircle, Eye } from "lucide-react";

export type CompletionStatus =
  | "Completed"
  | "In Progress"
  | "Partially Complete"
  | "Needs Attention";

export interface StudentEmployabilityData {
  id: string;
  studentDetails: string;
  academicAchievements: string;
  skills: string[];
  certifications?: string;
  projectsExperience?: string;
  resume?: string;
  portfolioLinks?: string;
  profileCompletion: CompletionStatus;
}

const INITIAL_PROFILES: StudentEmployabilityData[] = [
  {
    id: "1",
    studentDetails: "Aarav Sharma (STU-2022-001) - B.Tech CSE",
    academicAchievements: "B.Tech CSE, KIIT University, 8.9 CGPA, 2024, Dean's List",
    skills: ["Python & Data Science", "Machine Learning & AI", "SQL & Database Management", "Problem Solving"],
    certifications: "AWS Certified Cloud Practitioner (Amazon, 2023)",
    projectsExperience: "AI Health Diagnostics Tool (Internship at HealthTech Labs, 6 months)",
    resume: "aarav_sharma_resume.pdf",
    portfolioLinks: "https://github.com/aarav-sharma",
    profileCompletion: "Completed",
  },
  {
    id: "2",
    studentDetails: "Priya Patel (STU-2022-045) - B.Tech IT",
    academicAchievements: "B.Tech IT, Silicon Institute, 8.4 CGPA, 2024, Smart India Hackathon Winner",
    skills: ["React & Frontend Development", "Node.js & Backend APIs", "UI/UX Design", "Communication"],
    certifications: "Meta Frontend Developer Professional Certificate (Meta, 2023)",
    projectsExperience: "Campus Placement Portal fullstack web application",
    resume: "priya_patel_cv.pdf",
    portfolioLinks: "https://linkedin.com/in/priyapatel-dev",
    profileCompletion: "In Progress",
  },
  {
    id: "3",
    studentDetails: "Rahul Verma (STU-2023-018) - MCA",
    academicAchievements: "MCA, Utkal University, 7.8 CGPA, 2024",
    skills: ["Java & Spring Boot", "SQL & Database Management", "Team Leadership"],
    certifications: "Oracle Certified Associate Java SE 8 (Oracle, 2023)",
    projectsExperience: "Inventory & Billing ERP System for local enterprises",
    resume: "rahul_verma_resume.pdf",
    portfolioLinks: "https://github.com/rahulverma-java",
    profileCompletion: "Partially Complete",
  },
  {
    id: "4",
    studentDetails: "Sneha Rao (STU-2023-089) - B.Tech ECE",
    academicAchievements: "B.Tech ECE, NIT Rourkela, 8.1 CGPA, 2024",
    skills: ["Python & Data Science", "Problem Solving", "Communication"],
    certifications: "Google Data Analytics Certificate (Coursera, 2024)",
    projectsExperience: "IoT Weather Monitoring System",
    resume: "sneha_rao_resume.pdf",
    portfolioLinks: "https://github.com/sneha-rao",
    profileCompletion: "Needs Attention",
  },
];

const getStatusBadgeClass = (status: CompletionStatus) => {
  const styles: Record<CompletionStatus, string> = {
    Completed: "bg-green-100 text-green-800 border border-green-200",
    "In Progress": "bg-blue-100 text-blue-800 border border-blue-200",
    "Partially Complete": "bg-amber-100 text-amber-800 border border-amber-200",
    "Needs Attention": "bg-red-100 text-red-800 border border-red-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const ProfileCompletionBadge = ({ status }: { status: CompletionStatus }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
      status
    )}`}
  >
    {status}
  </span>
);

const EMPLOYABILITY_COLUMNS: TableColumnDef<StudentEmployabilityData>[] = [
  {
    id: "studentDetails",
    header: "Student Details",
    accessorFn: (row) => row.studentDetails,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[240px] truncate" title={row.studentDetails}>
        {row.studentDetails}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "academicAchievements",
    header: "Academic Details",
    accessorFn: (row) => row.academicAchievements,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[260px] truncate" title={row.academicAchievements}>
        {row.academicAchievements}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "skills",
    header: "Key Skills",
    accessorFn: (row) => (Array.isArray(row.skills) ? row.skills.join(", ") : row.skills),
    Cell: ({ row: { original: row } }) => {
      const skillList = Array.isArray(row.skills) ? row.skills : [row.skills];
      return (
        <div className="flex items-center gap-1.5 flex-nowrap">
          {skillList.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="inline-block bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5 rounded whitespace-nowrap"
            >
              {skill}
            </span>
          ))}
          {skillList.length > 2 && (
            <span className="inline-block bg-muted/20 text-muted-foreground text-[11px] font-medium px-1.5 py-0.5 rounded">
              +{skillList.length - 2}
            </span>
          )}
        </div>
      );
    },
  },
  {
    id: "profileCompletion",
    header: "Status",
    accessorFn: (row) => row.profileCompletion,
    Cell: ({ row: { original: row } }) => <ProfileCompletionBadge status={row.profileCompletion} />,
    enableSorting: true,
  },
  {
    id: "certifications",
    header: "Certifications",
    accessorFn: (row) => row.certifications || "N/A",
    defaultHidden: true,
  },
  {
    id: "projectsExperience",
    header: "Projects / Experience",
    accessorFn: (row) => row.projectsExperience || "N/A",
    defaultHidden: true,
  },
  {
    id: "resume",
    header: "Resume",
    accessorFn: (row) => row.resume || "N/A",
    defaultHidden: true,
  },
  {
    id: "portfolioLinks",
    header: "Portfolio / Links",
    accessorFn: (row) => row.portfolioLinks || "N/A",
    defaultHidden: true,
  },
];

const ProfilePreview = ({ profile }: { profile: StudentEmployabilityData }) => {
  const details = [
    ["Student Details", profile.studentDetails],
    ["Academic Achievements", profile.academicAchievements],
    ["Skills", Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills],
    ["Certifications", profile.certifications || "N/A"],
    ["Projects / Experience", profile.projectsExperience || "N/A"],
    ["Resume", profile.resume || "N/A"],
    ["Portfolio / Links", profile.portfolioLinks || "N/A"],
  ];

  return (
    <dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm md:grid-cols-2">
      {details.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="mt-1 break-words font-medium text-foreground">{value}</dd>
        </div>
      ))}
      <div className="md:col-span-2">
        <dt className="text-xs text-muted">Profile Completion</dt>
        <dd className="mt-1">
          <ProfileCompletionBadge status={profile.profileCompletion} />
        </dd>
      </div>
    </dl>
  );
};

export interface ViewstudentEmployabilityProps {
  hideHeader?: boolean;
}

const ViewstudentEmployability = ({ hideHeader }: ViewstudentEmployabilityProps = {}) => {
  const navigate = useAppNavigate();
  const [profiles, setProfiles] = useState<StudentEmployabilityData[]>(INITIAL_PROFILES);
  const [selectedProfile, setSelectedProfile] = useState<StudentEmployabilityData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setSelection] = useState<string[]>([]);
  const [completionFilter] = useState("");

  const rows = useMemo(
    () =>
      profiles.filter(
        (p) => !completionFilter || p.profileCompletion === completionFilter
      ),
    [profiles, completionFilter]
  );

  const openDetails = useCallback((profile: StudentEmployabilityData) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  }, []);

  const updateCompletion = useCallback(
    (ids: string[], status: CompletionStatus) => {
      setProfiles((prev) =>
        prev.map((p) => (ids.includes(p.id) ? { ...p, profileCompletion: status } : p))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} profiles updated to ${status}`
          : `Profile completion updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Student Employability Profiles"
          description="Student profiles, academic records and employability readiness."
          breadcrumb={[
            { label: "Placement" },
            { label: "Employability Profiles" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/student-employability-profile")}
            >
              Add Profile
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Student Employability Profile" : undefined} flush>
          <DataTable
            caption="Student Employability Profiles"
            data={rows}
            columns={EMPLOYABILITY_COLUMNS}
            getRowId={(p) => p.id}
            rowLabel={(p) => p.studentDetails}
            searchPlaceholder="Search by student, skills, or programme..."
            exportFileName="student_employability_profiles"
            selectable={false}
            bulkActions={[
              {
                id: "complete",
                label: "Mark Completed",
                icon: CheckCircle2,
                onClick: (ids) => {
                  updateCompletion(ids, "Completed");
                  setSelection([]);
                },
              },
              {
                id: "progress",
                label: "Mark In Progress",
                icon: Clock,
                onClick: (ids) => {
                  updateCompletion(ids, "In Progress");
                  setSelection([]);
                },
              },
              {
                id: "attention",
                label: "Needs Attention",
                icon: AlertCircle,
                danger: true,
                onClick: (ids) => {
                  updateCompletion(ids, "Needs Attention");
                  setSelection([]);
                },
              },
            ]}
            actions={{
              onView: openDetails,
              onEdit: (profile) =>
                navigate("/student-employability-profile", {
                  state: { editRecord: profile },
                }),
              more: (profile) => [
                {
                  id: "view",
                  label: "View Profile",
                  icon: Eye,
                  onSelect: () => openDetails(profile),
                },
              ],
            }}
            previewTitle={(p) => p.studentDetails}
            renderPreview={(p) => <ProfilePreview profile={p} />}
            emptyTitle="No student employability profiles found"
            emptyAction={
              <Button
                icon={<Plus size={16} />}
                onClick={() => navigate("/student-employability-profile")}
              >
                Add Profile
              </Button>
            }
          />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedProfile
            ? `Student Profile - ${selectedProfile.studentDetails}`
            : "Student Employability Profile"
        }
        size="2xl"
      >
        {selectedProfile && (
          <div className="space-y-4 p-4">
            <ProfilePreview profile={selectedProfile} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const prof = selectedProfile;
                  setIsModalOpen(false);
                  navigate("/student-employability-profile", {
                    state: { editRecord: prof },
                  });
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ViewstudentEmployability;