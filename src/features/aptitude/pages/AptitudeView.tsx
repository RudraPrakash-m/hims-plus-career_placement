import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, Eye } from "lucide-react";

export type AssessmentResultType =
  | "Distinction"
  | "Merit"
  | "Pass"
  | "Needs Improvement"
  | "Result Awaited";

export interface AptitudeData {
  id: string;
  assessmentType: string;
  assessmentName: string;
  schedule: string;
  studentBatch: string;
  assessmentResult: AssessmentResultType;
  skillCategory: string;
  recommendation?: string;
  followUp?: string;
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

const INITIAL_ASSESSMENTS: AptitudeData[] = [
  {
    id: "1",
    assessmentType: "Aptitude & Quantitative Ability",
    assessmentName: "National Aptitude Assessment 2024",
    schedule: "2024-01-15T10:00:00",
    studentBatch: "Batch 2024 - B.Tech CSE",
    assessmentResult: "Distinction",
    skillCategory: "Quantitative Ability",
    recommendation: "Recommended for high-tier technical hiring and quantitative analytics roles.",
    followUp: "Placement Prep",
  },
  {
    id: "2",
    assessmentType: "Technical Skill Assessment",
    assessmentName: "Core Data Structures & Algorithms Benchmark",
    schedule: "2024-02-20T14:30:00",
    studentBatch: "Batch 2024 - B.Tech IT & ECE",
    assessmentResult: "Merit",
    skillCategory: "Data Structures & Algorithms",
    recommendation: "Strong foundational knowledge; encourage practice with dynamic programming.",
    followUp: "Technical Bootcamp",
  },
  {
    id: "3",
    assessmentType: "Soft Skills & Communication",
    assessmentName: "Corporate Communication & Workplace Readiness",
    schedule: "2024-03-10T11:00:00",
    studentBatch: "Aarav Sharma",
    assessmentResult: "Pass",
    skillCategory: "Communication",
    recommendation: "Focus on structured presentation delivery and mock behavioral interviews.",
    followUp: "Soft Skills Workshop",
  },
  {
    id: "4",
    assessmentType: "Logical Reasoning",
    assessmentName: "Analytical & Critical Thinking Test",
    schedule: "2024-04-05T09:30:00",
    studentBatch: "Batch 2025 - MCA",
    assessmentResult: "Needs Improvement",
    skillCategory: "Logical Reasoning",
    recommendation: "Needs focused remedial practice sessions in deductive logic and pattern puzzles.",
    followUp: "Re-assessment",
  },
  {
    id: "5",
    assessmentType: "Core Engineering",
    assessmentName: "Core Engineering Domain Diagnostic",
    schedule: "2024-05-18T15:00:00",
    studentBatch: "Priya Patel",
    assessmentResult: "Distinction",
    skillCategory: "Programming",
    recommendation: "Exceptional architecture skills; mapped to specialized Cloud Developer track.",
    followUp: "Career Counselling",
  },
  {
    id: "6",
    assessmentType: "Psychometric Assessment",
    assessmentName: "Workplace Behavioral & Personality Profiling",
    schedule: "2024-06-02T10:00:00",
    studentBatch: "All Eligible Students",
    assessmentResult: "Result Awaited",
    skillCategory: "Communication",
    recommendation: "Evaluation under review by psychological assessment panel.",
    followUp: "None",
  },
];

const getResultClass = (result: AssessmentResultType) => {
  const styles: Record<AssessmentResultType, string> = {
    Distinction: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Merit: "bg-blue-100 text-blue-800 border border-blue-200",
    Pass: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    "Needs Improvement": "bg-rose-100 text-rose-800 border border-rose-200",
    "Result Awaited": "bg-amber-100 text-amber-800 border border-amber-200",
  };
  return styles[result] || "bg-gray-100 text-gray-800";
};

const ResultBadge = ({ result }: { result: AssessmentResultType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getResultClass(
      result
    )}`}
  >
    {result}
  </span>
);

const APTITUDE_COLUMNS: TableColumnDef<AptitudeData>[] = [
  {
    id: "assessmentName",
    header: "Assessment Name",
    accessorFn: (row) => row.assessmentName,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[220px] truncate" title={row.assessmentName}>
        {row.assessmentName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "assessmentType",
    header: "Assessment Type",
    accessorFn: (row) => row.assessmentType,
    Cell: ({ row: { original: row } }) => (
      <div className="text-muted max-w-[170px] truncate" title={row.assessmentType}>
        {row.assessmentType}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "studentBatch",
    header: "Target / Student",
    accessorFn: (row) => row.studentBatch,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={row.studentBatch}>
        {row.studentBatch}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "skillCategory",
    header: "Category",
    accessorFn: (row) => row.skillCategory,
    enableSorting: true,
  },
  {
    id: "assessmentResult",
    header: "Result",
    accessorFn: (row) => row.assessmentResult,
    Cell: ({ row: { original: row } }) => <ResultBadge result={row.assessmentResult} />,
    enableSorting: true,
  },
  {
    id: "schedule",
    header: "Date Scheduled",
    accessorFn: (row) => row.schedule,
    Cell: ({ row: { original: row } }) => formatDate(row.schedule),
    defaultHidden: true,
  },
  {
    id: "followUp",
    header: "Follow-up",
    accessorFn: (row) => row.followUp || "None",
    defaultHidden: true,
  },
  {
    id: "recommendation",
    header: "Recommendation",
    accessorFn: (row) => row.recommendation || "N/A",
    defaultHidden: true,
  },
];

const AssessmentPreview = ({ assessment }: { assessment: AptitudeData }) => {
  const details = [
    ["Assessment Name", assessment.assessmentName],
    ["Assessment Type", assessment.assessmentType],
    ["Student / Batch", assessment.studentBatch],
    ["Schedule", formatDate(assessment.schedule)],
    ["Skill Category", assessment.skillCategory],
    ["Follow-up", assessment.followUp || "None"],
    ["Recommendation", assessment.recommendation || "N/A"],
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
        <dt className="text-xs text-muted">Assessment Result</dt>
        <dd className="mt-1">
          <ResultBadge result={assessment.assessmentResult} />
        </dd>
      </div>
    </dl>
  );
};

export interface AptitudeViewProps {
  hideHeader?: boolean;
}

const AptitudeView = ({ hideHeader }: AptitudeViewProps = {}) => {
  const navigate = useAppNavigate();
  const [assessments, setAssessments] =
    useState<AptitudeData[]>(INITIAL_ASSESSMENTS);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AptitudeData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [resultFilter] = useState("");

  const rows = useMemo(
    () =>
      assessments.filter(
        (a) => !resultFilter || a.assessmentResult === resultFilter
      ),
    [assessments, resultFilter]
  );

  const openDetails = useCallback((assessment: AptitudeData) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  }, []);

  const updateResult = useCallback(
    (ids: string[], result: AssessmentResultType) => {
      setAssessments((prev) =>
        prev.map((a) => (ids.includes(a.id) ? { ...a, assessmentResult: result } : a))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} assessments updated to ${result}`
          : `Assessment result updated to ${result}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Aptitude & Technical Assessments"
          description="Comprehensive evaluation test scores, cut-offs and student performance."
          breadcrumb={[
            { label: "Placement" },
            { label: "Aptitude Assessments" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/aptitude")}
            >
              Add Assessment
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Aptitude, Skill Assessment and Career Recommendations" : undefined} flush>
        <DataTable
          caption="Aptitude & Skill Evaluation Assessments"
          data={rows}
          columns={APTITUDE_COLUMNS}
          getRowId={(a) => a.id}
          rowLabel={(a) => `${a.assessmentName} - ${a.studentBatch}`}
          searchPlaceholder="Search by assessment name, student/batch, category..."
          exportFileName="aptitude_evaluations"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "mark-distinction",
              label: "Mark Distinction",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateResult(ids, "Distinction");
                setSelection([]);
              },
            },
            {
              id: "mark-pass",
              label: "Mark Pass",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateResult(ids, "Pass");
                setSelection([]);
              },
            },
            {
              id: "mark-needs-improvement",
              label: "Needs Improvement",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateResult(ids, "Needs Improvement");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/aptitude", {
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
          previewTitle={(a) => `${a.assessmentName} - ${a.studentBatch}`}
          renderPreview={(a) => <AssessmentPreview assessment={a} />}
          emptyTitle="No assessment records found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/aptitude")}
            >
              Add Assessment
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedAssessment
            ? `Assessment Details - ${selectedAssessment.assessmentName}`
            : "Assessment Details"
        }
        size="2xl"
      >
        {selectedAssessment && (
          <div className="space-y-4 p-4">
            <AssessmentPreview assessment={selectedAssessment} />
            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const item = selectedAssessment;
                  setIsModalOpen(false);
                  navigate("/aptitude", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Assessment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default AptitudeView;