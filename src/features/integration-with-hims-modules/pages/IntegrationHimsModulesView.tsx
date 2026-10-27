import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, Select, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { exportToExcel, exportToPDF } from '@mfe/utils';
import { Plus, Eye, Pencil, Trash2, CheckCircle2, AlertTriangle, XCircle, Clock, CheckCheck, ShieldAlert, RotateCw } from "lucide-react";

export type SourceModuleType =
  | "Student Lifecycle"
  | "Internship Management"
  | "Alumni";

export type SyncStatusType =
  | "Successful"
  | "Pending"
  | "Failed";

export type ReconciliationStatusType =
  | "Reconciled"
  | "Requires Manual Review"
  | "Auto-Reconciled"
  | "Pending";

export interface HimsIntegrationRecord {
  id: string;
  sourceModule: SourceModuleType;
  studentIdentifier: string;
  studentName: string;
  academicRollNo: string;
  internshipRecord: string;
  internshipInterfaceApproved: boolean;
  alumniRecord: string;
  isEligibleAlumni: boolean;
  synchronizationStatus: SyncStatusType;
  errorDetails?: string;
  errorCode?: string;
  reconciliation: ReconciliationStatusType;
  lastSyncTimestamp: string;
  reconciliationNotes?: string;
}

const INITIAL_HIMS_RECORDS: HimsIntegrationRecord[] = [
  {
    id: "1",
    sourceModule: "Student Lifecycle",
    studentIdentifier: "HIMS-STU-2024-001",
    studentName: "Aarav Sharma",
    academicRollNo: "STU-2022-001",
    internshipRecord: "AWS Cloud Solutions Summer Internship",
    internshipInterfaceApproved: true,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Successful",
    reconciliation: "Reconciled",
    lastSyncTimestamp: "2024-10-22 09:30:15",
    reconciliationNotes: "Matched with HIMS Student Master record. Demographic and academic credentials verified.",
  },
  {
    id: "2",
    sourceModule: "Internship Management",
    studentIdentifier: "HIMS-STU-2024-045",
    studentName: "Priya Patel",
    academicRollNo: "STU-2022-045",
    internshipRecord: "Full Stack AI Development Internship (MS-INT-2024-15)",
    internshipInterfaceApproved: true,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Successful",
    reconciliation: "Auto-Reconciled",
    lastSyncTimestamp: "2024-10-22 10:14:02",
    reconciliationNotes: "Approved interface handshake successful with corporate provider portal.",
  },
  {
    id: "3",
    sourceModule: "Alumni",
    studentIdentifier: "HIMS-STU-2023-018",
    studentName: "Rahul Verma",
    academicRollNo: "STU-2023-018",
    internshipRecord: "TCS Industrial Automation Apprenticeship",
    internshipInterfaceApproved: true,
    alumniRecord: "Eligible Alumni - Class of 2023 (ALUM-2023-018)",
    isEligibleAlumni: true,
    synchronizationStatus: "Successful",
    reconciliation: "Reconciled",
    lastSyncTimestamp: "2024-10-21 16:45:30",
    reconciliationNotes: "Degree conferral verified. Former student career profile linked to Tata Consultancy Services.",
  },
  {
    id: "4",
    sourceModule: "Student Lifecycle",
    studentIdentifier: "HIMS-STU-2024-092",
    studentName: "Vikram Das",
    academicRollNo: "STU-2022-092",
    internshipRecord: "Deloitte Risk & Advisory Consulting Internship",
    internshipInterfaceApproved: true,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Failed",
    errorCode: "ERR-SYNC-409-CONFLICT",
    errorDetails: "Academic session mismatch: HIMS reports enrolled session 2023-24 while placement portal sent 2024-25. Verification required.",
    reconciliation: "Requires Manual Review",
    lastSyncTimestamp: "2024-10-23 08:12:44",
    reconciliationNotes: "Pending registrar clarification on lateral admission semester mapping.",
  },
  {
    id: "5",
    sourceModule: "Internship Management",
    studentIdentifier: "HIMS-STU-2023-089",
    studentName: "Sneha Rao",
    academicRollNo: "STU-2023-089",
    internshipRecord: "Google SWE Summer Practicum (GOOG-INT-2024-02)",
    internshipInterfaceApproved: true,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Successful",
    reconciliation: "Reconciled",
    lastSyncTimestamp: "2024-10-22 14:20:10",
    reconciliationNotes: "Verified training credits linked to departmental curriculum ledger.",
  },
  {
    id: "6",
    sourceModule: "Alumni",
    studentIdentifier: "HIMS-STU-2022-077",
    studentName: "Aditya Nair",
    academicRollNo: "STU-2022-077",
    internshipRecord: "Not Applicable",
    internshipInterfaceApproved: false,
    alumniRecord: "Eligible Alumni - Class of 2022 (ALUM-2022-077)",
    isEligibleAlumni: true,
    synchronizationStatus: "Pending",
    errorCode: "ERR-HIMS-TIMEOUT-504",
    errorDetails: "Alumni association service endpoint timed out after 30,000ms. Queued for scheduled retry.",
    reconciliation: "Pending",
    lastSyncTimestamp: "2024-10-23 10:05:22",
    reconciliationNotes: "Background sync task will re-trigger interface poll.",
  },
  {
    id: "7",
    sourceModule: "Student Lifecycle",
    studentIdentifier: "HIMS-STU-2022-112",
    studentName: "Kavita Reddy",
    academicRollNo: "STU-2022-112",
    internshipRecord: "AWS Cloud Solutions Summer Internship",
    internshipInterfaceApproved: true,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Successful",
    reconciliation: "Reconciled",
    lastSyncTimestamp: "2024-10-20 11:30:00",
    reconciliationNotes: "Record verified and locked.",
  },
  {
    id: "8",
    sourceModule: "Internship Management",
    studentIdentifier: "HIMS-STU-2023-044",
    studentName: "Manish Kumar",
    academicRollNo: "STU-2023-044",
    internshipRecord: "Interface Pending / Approved Interface Not Available",
    internshipInterfaceApproved: false,
    alumniRecord: "Not Applicable (Current Student)",
    isEligibleAlumni: false,
    synchronizationStatus: "Failed",
    errorCode: "ERR-INT-INTERFACE-UNAPPROVED",
    errorDetails: "Employer internship interface certificate has not been counter-signed by institutional coordinator.",
    reconciliation: "Requires Manual Review",
    lastSyncTimestamp: "2024-10-23 09:15:18",
    reconciliationNotes: "Authorized placement officer requested to verify certificate validity.",
  },
];

const getSyncBadgeClass = (status: SyncStatusType) => {
  switch (status) {
    case "Successful":
      return "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "Pending":
      return "bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300";
    case "Failed":
      return "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getReconciliationBadgeClass = (status: ReconciliationStatusType) => {
  switch (status) {
    case "Reconciled":
      return "bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-950/40 dark:text-blue-300";
    case "Auto-Reconciled":
      return "bg-teal-100 text-teal-800 border border-teal-300 dark:bg-teal-950/40 dark:text-teal-300";
    case "Requires Manual Review":
      return "bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-300";
    case "Pending":
      return "bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getSourceModuleBadgeClass = (module: SourceModuleType) => {
  switch (module) {
    case "Student Lifecycle":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300";
    case "Internship Management":
      return "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-300";
    case "Alumni":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300";
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const SOURCE_MODULE_OPTIONS = [
  { value: "All", label: "All Modules" },
  { value: "Student Lifecycle", label: "Student Lifecycle" },
  { value: "Internship Management", label: "Internship Management" },
  { value: "Alumni", label: "Alumni" },
];

const SYNC_STATUS_OPTIONS = [
  { value: "All", label: "All Sync Statuses" },
  { value: "Successful", label: "Successful" },
  { value: "Pending", label: "Pending" },
  { value: "Failed", label: "Failed" },
];

const RECONCILIATION_OPTIONS = [
  { value: "All", label: "All Reconciliation Statuses" },
  { value: "Reconciled", label: "Reconciled" },
  { value: "Auto-Reconciled", label: "Auto-Reconciled" },
  { value: "Requires Manual Review", label: "Requires Manual Review" },
  { value: "Pending", label: "Pending" },
];

export interface IntegrationHimsModulesViewProps {
  hideHeader?: boolean;
}

const IntegrationHimsModulesView = ({ hideHeader }: IntegrationHimsModulesViewProps = {}) => {
  const navigate = useAppNavigate();

  // Filters
  const [sourceModuleFilter, setSourceModuleFilter] = useState<string>("All");
  const [syncStatusFilter, setSyncStatusFilter] = useState<string>("All");
  const [reconciliationFilter, setReconciliationFilter] = useState<string>("All");

  const [data, setData] = useState<HimsIntegrationRecord[]>(INITIAL_HIMS_RECORDS);
  const [selectedItem, setSelectedItem] = useState<HimsIntegrationRecord | null>(null);
  const [reconcileModalItem, setReconcileModalItem] = useState<HimsIntegrationRecord | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSource = sourceModuleFilter === "All" || item.sourceModule === sourceModuleFilter;
      const matchSync = syncStatusFilter === "All" || item.synchronizationStatus === syncStatusFilter;
      const matchReconcile = reconciliationFilter === "All" || item.reconciliation === reconciliationFilter;
      return matchSource && matchSync && matchReconcile;
    });
  }, [data, sourceModuleFilter, syncStatusFilter, reconciliationFilter]);

  // Sync & Integration KPI statistics
  const stats = useMemo(() => {
    const total = data.length;
    const successful = data.filter((d) => d.synchronizationStatus === "Successful").length;
    const pending = data.filter((d) => d.synchronizationStatus === "Pending").length;
    const failed = data.filter((d) => d.synchronizationStatus === "Failed").length;
    const reconciled = data.filter((d) => d.reconciliation === "Reconciled" || d.reconciliation === "Auto-Reconciled").length;
    const needsReview = data.filter((d) => d.reconciliation === "Requires Manual Review").length;
    return { total, successful, pending, failed, reconciled, needsReview };
  }, [data]);

  const resetFilters = () => {
    setSourceModuleFilter("All");
    setSyncStatusFilter("All");
    setReconciliationFilter("All");
    showToast.info("Integration filters reset.");
  };

  const handleEdit = useCallback((item: HimsIntegrationRecord) => {
    navigate("/integration-hims-modules", {
      state: {
        editRecord: {
          id: item.id,
          sourceModule: item.sourceModule,
          studentIdentifier: item.studentIdentifier,
          studentName: item.studentName,
          academicRollNo: item.academicRollNo,
          internshipRecord: item.internshipRecord,
          alumniRecord: item.alumniRecord,
          synchronizationStatus: item.synchronizationStatus,
          reconciliation: item.reconciliation,
          errorDetails: item.errorDetails,
          reconciliationNotes: item.reconciliationNotes,
        },
      },
    });
  }, [navigate]);

  const handleDelete = useCallback((item: HimsIntegrationRecord) => {
    setData((prev) => prev.filter((d) => d.id !== item.id));
    showToast.success(`HIMS integration mapping for "${item.studentIdentifier}" deleted.`);
  }, []);

  const handleTriggerReconciliation = (item: HimsIntegrationRecord) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              synchronizationStatus: "Successful",
              reconciliation: "Reconciled",
              errorDetails: "Resolved via manual reconciliation override by authorized officer.",
              lastSyncTimestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : d
      )
    );
    setReconcileModalItem(null);
    showToast.success(`Record ${item.studentIdentifier} reconciled and synchronized successfully.`);
  };

  const handleBulkReconcile = (keys: string[]) => {
    setData((prev) =>
      prev.map((d) =>
        keys.includes(d.id)
          ? {
              ...d,
              synchronizationStatus: "Successful",
              reconciliation: "Reconciled",
              lastSyncTimestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
            }
          : d
      )
    );
    setSelectedKeys([]);
    showToast.success(`Reconciled ${keys.length} selected record(s).`);
  };

  const handleTriggerBatchSync = () => {
    showToast.info("Triggered HIMS bi-directional batch synchronization...");
    setTimeout(() => {
      setData((prev) =>
        prev.map((d) =>
          d.synchronizationStatus === "Pending"
            ? { ...d, synchronizationStatus: "Successful", reconciliation: "Auto-Reconciled" }
            : d
        )
      );
      showToast.success("HIMS Batch synchronization completed successfully.");
    }, 1200);
  };

  const EXPORT_COLUMNS: TableColumnDef<HimsIntegrationRecord>[] = [
    { id: "sourceModule", header: "Source Module", accessorFn: (row) => row.sourceModule },
    { id: "studentName", header: "Student Name", accessorFn: (row) => row.studentName },
    { id: "studentIdentifier", header: "HIMS ID", accessorFn: (row) => row.studentIdentifier },
    { id: "academicRollNo", header: "Roll No", accessorFn: (row) => row.academicRollNo },
    { id: "synchronizationStatus", header: "Sync Status", accessorFn: (row) => row.synchronizationStatus },
    { id: "reconciliation", header: "Reconciliation Status", accessorFn: (row) => row.reconciliation },
    { id: "internshipRecord", header: "Internship Record", accessorFn: (row) => row.internshipRecord },
    { id: "alumniRecord", header: "Alumni Record", accessorFn: (row) => row.alumniRecord },
    { id: "errorDetails", header: "Error Details & Logs", accessorFn: (row) => row.errorDetails || "None" },
    { id: "lastSyncTimestamp", header: "Last Synced", accessorFn: (row) => row.lastSyncTimestamp },
  ];

  const handleExportExcel = async (rows?: HimsIntegrationRecord[]) => {
    const recordsToExport = rows && rows.length > 0 ? rows : filteredData;
    await exportToExcel(EXPORT_COLUMNS, recordsToExport, "hims_integration_audit_log");
    showToast.success("HIMS integration log exported to Excel (.xlsx).");
  };

  const handleExportPDF = async (rows?: HimsIntegrationRecord[]) => {
    const recordsToExport = rows && rows.length > 0 ? rows : filteredData;
    await exportToPDF(EXPORT_COLUMNS, recordsToExport, "hims_integration_audit_log", "Integration with HIMS Modules - Audit Report");
    showToast.success("HIMS integration log exported as PDF.");
  };

  const COLUMNS: TableColumnDef<HimsIntegrationRecord>[] = [
    {
      id: "sourceModule",
      header: "Source Module",
      accessorFn: (row) => row.sourceModule,
      Cell: ({ row: { original: row } }) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${getSourceModuleBadgeClass(row.sourceModule)}`}>
          {row.sourceModule}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "studentIdentifier",
      header: "Student & Mapping",
      accessorFn: (row) => `${row.studentIdentifier} ${row.studentName} ${row.academicRollNo}`,
      Cell: ({ row: { original: row } }) => (
        <div className="min-w-[170px]">
          <span className="font-semibold text-foreground text-xs block leading-tight">{row.studentName}</span>
          <p className="text-[11px] text-muted whitespace-nowrap mt-0.5">{row.studentIdentifier} • {row.academicRollNo}</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "synchronizationStatus",
      header: "Sync Status",
      accessorFn: (row) => row.synchronizationStatus,
      Cell: ({ row: { original: row } }) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${getSyncBadgeClass(row.synchronizationStatus)}`}>
          {row.synchronizationStatus === "Successful" && <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />}
          {row.synchronizationStatus === "Pending" && <Clock className="h-3 w-3 mr-1 shrink-0" />}
          {row.synchronizationStatus === "Failed" && <XCircle className="h-3 w-3 mr-1 shrink-0" />}
          {row.synchronizationStatus}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "reconciliation",
      header: "Reconciliation",
      accessorFn: (row) => row.reconciliation,
      Cell: ({ row: { original: row } }) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0 ${getReconciliationBadgeClass(row.reconciliation)}`}>
            {row.reconciliation}
          </span>
          {row.reconciliation === "Requires Manual Review" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReconcileModalItem(row)}
              className="text-[10px] py-0.5 px-2 h-6 text-rose-600 border-rose-300 hover:bg-rose-50 whitespace-nowrap shrink-0"
            >
              Reconcile
            </Button>
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "lastSyncTimestamp",
      header: "Last Synced",
      accessorFn: (row) => row.lastSyncTimestamp,
      Cell: ({ row: { original: row } }) => (
        <span className="text-xs text-muted whitespace-nowrap">
          {row.lastSyncTimestamp}
        </span>
      ),
      enableSorting: true,
    },
  ];

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <PageHeader
          title="HIMS Module Integration"
          description="Enterprise system sync, student records mapping and data reconciliation logs."
          breadcrumb={[
            { label: "Administration" },
            { label: "HIMS Integration" },
          ]}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                icon={<RotateCw size={16} />}
                onClick={handleTriggerBatchSync}
              >
                Batch Sync
              </Button>
              <Button
                icon={<Plus size={16} />}
                onClick={() => navigate("/integration-hims-modules")}
              >
                Add Mapping
              </Button>
            </div>
          }
        />
      )}

      {/* Sync & Integration KPI statistics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Total Mappings</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Successful Sync</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{stats.successful}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Pending Sync</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Sync Failures</p>
          <p className="mt-1 text-2xl font-bold text-rose-600">{stats.failed}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-xs font-medium text-muted">Requires Review</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">{stats.needsReview}</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card title="Filter & Query Mappings">
        <div className="flex flex-wrap items-end gap-3">
          <Select
            label="Source Module"
            options={SOURCE_MODULE_OPTIONS}
            value={sourceModuleFilter}
            onChange={(val: string | number) => setSourceModuleFilter(String(val))}
            wrapperClassName="min-w-44 flex-1 max-w-xs"
          />
          <Select
            label="Sync Status"
            options={SYNC_STATUS_OPTIONS}
            value={syncStatusFilter}
            onChange={(val: string | number) => setSyncStatusFilter(String(val))}
            wrapperClassName="min-w-44 flex-1 max-w-xs"
          />
          <Select
            label="Reconciliation Status"
            options={RECONCILIATION_OPTIONS}
            value={reconciliationFilter}
            onChange={(val: string | number) => setReconciliationFilter(String(val))}
            wrapperClassName="min-w-44 flex-1 max-w-xs"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* DATA TABLE */}
      <Card title={hideHeader ? "Integration with HIMS Modules" : undefined} flush>
      <DataTable
        caption="Integration with HIMS Modules - Registry & Synchronization Logs"
        data={filteredData}
        columns={COLUMNS}
        getRowId={(row) => row.id}
        rowLabel={(row) => `${row.studentIdentifier} - ${row.studentName}`}
        searchPlaceholder="Search by HIMS ID, student name, roll no, internship, alumni record..."
        exportFileName="hims_integration_registry"
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        selectable={false}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        actions={{
          onView: (item) => setSelectedItem(item),
          more: (item) => [
            {
              id: "edit",
              label: "Edit Mapping",
              icon: Pencil,
              onSelect: () => handleEdit(item),
            },
            {
              id: "view-payload",
              label: "View Sync Payload & Error Log",
              icon: Eye,
              onSelect: () => setSelectedItem(item),
            },
            {
              id: "reconcile-action",
              label: "Initiate Reconciliation",
              icon: CheckCheck,
              onSelect: () => setReconcileModalItem(item),
            },
            {
              id: "delete",
              label: "Delete Record",
              icon: Trash2,
              danger: true,
              onSelect: () => handleDelete(item),
            },
          ],
        }}
        previewTitle={(item) => `HIMS Integration Record - ${item.studentIdentifier}`}
        renderPreview={(item) => (
          <div className="space-y-4">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Source Module</dt>
                <dd className="font-semibold text-foreground">{item.sourceModule}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">HIMS Student Identifier</dt>
                <dd className="font-bold text-primary">{item.studentIdentifier}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Student Name</dt>
                <dd className="font-medium text-foreground">{item.studentName}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Academic Roll No</dt>
                <dd className="font-medium text-foreground">{item.academicRollNo}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs text-muted">Internship Record</dt>
                <dd className="font-medium text-foreground">
                  {item.internshipRecord}
                  <span className={`ml-2 text-xs font-semibold ${item.internshipInterfaceApproved ? 'text-emerald-600' : 'text-slate-400'}`}>
                    ({item.internshipInterfaceApproved ? "Interface Approved" : "Pending Interface"})
                  </span>
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs text-muted">Alumni Record</dt>
                <dd className="font-medium text-foreground">{item.alumniRecord}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Synchronization Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${getSyncBadgeClass(item.synchronizationStatus)}`}>
                    {item.synchronizationStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Reconciliation Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${getReconciliationBadgeClass(item.reconciliation)}`}>
                    {item.reconciliation}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Last Synchronization Timestamp</dt>
                <dd className="font-medium text-foreground">{item.lastSyncTimestamp}</dd>
              </div>
              {item.errorDetails && (
                <div className="md:col-span-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg p-3">
                  <dt className="text-xs font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Error Details ({item.errorCode})
                  </dt>
                  <dd className="text-xs text-rose-700 dark:text-rose-300 mt-1 leading-relaxed">
                    {item.errorDetails}
                  </dd>
                </div>
              )}
              {item.reconciliationNotes && (
                <div className="md:col-span-2 bg-muted/40 border rounded-lg p-3">
                  <dt className="text-xs font-semibold text-muted">Reconciliation Notes & Resolution</dt>
                  <dd className="text-xs text-foreground mt-1 leading-relaxed">
                    {item.reconciliationNotes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
        bulkActions={[
          {
            id: "bulk-reconcile",
            label: "Reconcile Selected",
            icon: CheckCheck,
            onClick: handleBulkReconcile,
          },
          {
            id: "delete",
            label: "Delete Selected",
            icon: Trash2,
            danger: true,
            onClick: (keys) => {
              setData((prev) => prev.filter((d) => !keys.includes(d.id)));
              setSelectedKeys([]);
              showToast.success(`Deleted ${keys.length} record(s).`);
            },
          },
        ]}
      />
      </Card>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          title={`HIMS Integration Detail - ${selectedItem.studentIdentifier}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-base text-foreground">{selectedItem.studentName}</h4>
                <p className="text-xs text-muted">HIMS ID: {selectedItem.studentIdentifier} | Roll: {selectedItem.academicRollNo}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getSyncBadgeClass(selectedItem.synchronizationStatus)}`}>
                {selectedItem.synchronizationStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Source Module</span>
                <span className="font-semibold text-foreground text-sm">{selectedItem.sourceModule}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg">
                <span className="text-xs text-muted block">Reconciliation State</span>
                <span className="font-bold text-blue-600 text-sm">{selectedItem.reconciliation}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg col-span-2">
                <span className="text-xs text-muted block">Internship Record</span>
                <span className="font-semibold text-foreground text-sm">{selectedItem.internshipRecord}</span>
              </div>
              <div className="p-3 bg-muted/40 rounded-lg col-span-2">
                <span className="text-xs text-muted block">Alumni Record</span>
                <span className="font-semibold text-foreground text-sm">{selectedItem.alumniRecord}</span>
              </div>
            </div>

            {selectedItem.errorDetails && (
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Error Details: {selectedItem.errorCode}</span>
                </div>
                <p className="mt-1 text-rose-700 dark:text-rose-300 leading-relaxed">
                  {selectedItem.errorDetails}
                </p>
              </div>
            )}

            <div className="p-3 rounded-lg border bg-background text-xs">
              <span className="font-semibold text-foreground block mb-0.5">Reconciliation & Troubleshooting Log</span>
              <p className="text-muted leading-relaxed">{selectedItem.reconciliationNotes || "No manual reconciliation required."}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const item = selectedItem;
                  setSelectedItem(null);
                  handleEdit(item);
                }}
              >
                Edit Mapping
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* RECONCILIATION MODAL */}
      {reconcileModalItem && (
        <Modal
          isOpen={true}
          onClose={() => setReconcileModalItem(null)}
          title={`Initiate Supported Reconciliation - ${reconcileModalItem.studentIdentifier}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300">
              <p className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Review Detected Mismatch & Interface Status
              </p>
              <p className="mt-1 leading-relaxed">
                Review the discrepancies between the HIMS master database and Career & Placement records before approving reconciliation.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted">Student Identifier:</dt>
                <dd className="font-semibold text-foreground">{reconcileModalItem.studentIdentifier}</dd>
              </div>
              <div>
                <dt className="text-muted">Student Name:</dt>
                <dd className="font-semibold text-foreground">{reconcileModalItem.studentName}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Error / Mismatch Detail:</dt>
                <dd className="font-medium text-rose-600 mt-0.5">{reconcileModalItem.errorDetails || "Mismatch detected during batch handshake."}</dd>
              </div>
            </dl>

            <div className="pt-2 border-t flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReconcileModalItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleTriggerReconciliation(reconcileModalItem)}
              >
                Approve & Reconcile Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default IntegrationHimsModulesView;
