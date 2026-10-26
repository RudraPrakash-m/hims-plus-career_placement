import { useMemo, useState, useCallback } from 'react';
import { Badge, Button, Card, DataTable, Modal, PageHeader, Select, showToast, useAppNavigate, type BadgeVariant, type TableColumnDef } from '@mfe/components';
import { Plus, Lock, Unlock, CheckCircle2, XCircle } from 'lucide-react';

/** Status pill (was StatusBadge): colour and label per status. */
const STATUS_PILL: Record<string, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  success: { variant: 'success', label: 'Success' },
  inactive: { variant: 'secondary', label: 'Inactive' },
  pending: { variant: 'warning', label: 'Pending' },
  warning: { variant: 'warning', label: 'Warning' },
  suspended: { variant: 'danger', label: 'Suspended' },
  error: { variant: 'danger', label: 'Error' },
  info: { variant: 'info', label: 'Info' },
};
const StatusPill = ({ status, label }: { status: string; label?: string }) => {
  const pill = STATUS_PILL[status] ?? { variant: 'outline' as BadgeVariant, label: status };
  return (
    <Badge variant={pill.variant} size="sm">
      {label ?? pill.label}
    </Badge>
  );
};

interface EmployeeData {
    id: string;
    employeeId: string;
    employeeName: string;
    gender: string;
    dateOfBirth?: string;
    mobileNumber: string;
    emailId?: string;
    status: 'Active' | 'Inactive';
    profilePhoto?: string;
    maritalStatus?: string;
    bloodGroup?: string;
    nationality?: string;
    languages?: string[];
}

const INITIAL_EMPLOYEES: EmployeeData[] = [
    {
        id: '1',
        employeeId: 'EMP-001',
        employeeName: 'Aarav Sharma',
        gender: 'Male',
        dateOfBirth: '1990-05-12',
        mobileNumber: '9876543210',
        emailId: 'aarav.sharma@example.com',
        status: 'Active',
        maritalStatus: 'Married',
        bloodGroup: 'O+',
        nationality: 'Indian',
    },
    {
        id: '2',
        employeeId: 'EMP-002',
        employeeName: 'Priya Patel',
        gender: 'Female',
        dateOfBirth: '1993-08-24',
        mobileNumber: '9876543211',
        emailId: 'priya.patel@example.com',
        status: 'Active',
        maritalStatus: 'Single',
        bloodGroup: 'B+',
        nationality: 'Indian',
    },
    {
        id: '3',
        employeeId: 'EMP-003',
        employeeName: 'Rahul Verma',
        gender: 'Male',
        dateOfBirth: '1988-11-03',
        mobileNumber: '9876543212',
        emailId: 'rahul.verma@example.com',
        status: 'Inactive',
        maritalStatus: 'Married',
        bloodGroup: 'A+',
        nationality: 'Indian',
    },
    {
        id: '4',
        employeeId: 'EMP-004',
        employeeName: 'Sneha Rao',
        gender: 'Female',
        dateOfBirth: '1995-02-18',
        mobileNumber: '9876543213',
        emailId: 'sneha.rao@example.com',
        status: 'Active',
        maritalStatus: 'Single',
        bloodGroup: 'AB+',
        nationality: 'Indian',
    },
    {
        id: '5',
        employeeId: 'EMP-005',
        employeeName: 'Vikram Das',
        gender: 'Male',
        dateOfBirth: '1991-09-30',
        mobileNumber: '9876543214',
        emailId: 'vikram.das@example.com',
        status: 'Active',
        maritalStatus: 'Married',
        bloodGroup: 'O-',
        nationality: 'Indian',
    },
];

const formatDate = (value?: string) => (value ? new Date(value).toLocaleDateString() : 'N/A');

const EMPLOYEE_COLUMNS: TableColumnDef<EmployeeData>[] = [
    { 
        id: 'employeeId', 
        header: 'Employee ID', 
        accessorFn: (e) => e.employeeId, 
        Cell: ({ row: { original: e } }) => <span className="font-semibold text-xs text-foreground">{e.employeeId}</span>,
        enableSorting: true, 
        size: 144, 
    },
    { 
        id: 'employeeName', 
        header: 'Employee Name', 
        accessorFn: (e) => e.employeeName, 
        Cell: ({ row: { original: e } }) => (
            <div className="font-medium text-foreground max-w-[170px] truncate" title={e.employeeName}>
                {e.employeeName}
            </div>
        ),
        enableSorting: true 
    },
    { id: 'mobileNumber', header: 'Mobile', accessorFn: (e) => e.mobileNumber },
    {
        id: 'status',
        header: 'Status',
        accessorFn: (e) => e.status,
        Cell: ({ row: { original: e } }) => <StatusPill status={e.status === 'Active' ? 'active' : 'inactive'} />,
        enableSorting: true,
    },
    { id: 'gender', header: 'Gender', accessorFn: (e) => e.gender, defaultHidden: true },
    { id: 'dateOfBirth', header: 'Date of Birth', accessorFn: (e) => e.dateOfBirth, Cell: ({ row: { original: e } }) => formatDate(e.dateOfBirth), defaultHidden: true },
    { id: 'emailId', header: 'Email', accessorFn: (e) => e.emailId, defaultHidden: true },
    { id: 'bloodGroup', header: 'Blood Group', accessorFn: (e) => e.bloodGroup, defaultHidden: true },
];

const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

const STATUS_OPTIONS = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
];

interface EmployeeFilters {
    gender: string;
    status: string;
}

const EMPTY_FILTERS: EmployeeFilters = { gender: '', status: '' };

const EmployeePreview = ({ employee }: { employee: EmployeeData }) => (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        {[
            ['Employee ID', employee.employeeId],
            ['Gender', employee.gender],
            ['Date of Birth', formatDate(employee.dateOfBirth)],
            ['Mobile', employee.mobileNumber],
            ['Email', employee.emailId ?? 'N/A'],
            ['Blood Group', employee.bloodGroup ?? 'N/A'],
            ['Marital Status', employee.maritalStatus ?? 'N/A'],
            ['Nationality', employee.nationality ?? 'N/A'],
        ].map(([k, v]) => (
            <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
            </div>
        ))}
        <div className="col-span-2">
            <dt className="text-xs text-muted">Status</dt>
            <dd className="mt-1"><StatusPill status={employee.status === 'Active' ? 'active' : 'inactive'} /></dd>
        </div>
    </dl>
);

const EmployeeDetailsView = () => {
    const navigate = useAppNavigate();
    const [employees, setEmployees] = useState<EmployeeData[]>(INITIAL_EMPLOYEES);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter form (draft) vs. filters applied to the table.
    const [draft, setDraft] = useState<EmployeeFilters>(EMPTY_FILTERS);
    const [applied, setApplied] = useState<EmployeeFilters>(EMPTY_FILTERS);
    const [filtersHidden, setFiltersHidden] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);
    const appliedCount = Object.values(applied).filter(Boolean).length;

    const rows = useMemo(
        () => employees.filter((e) => (!applied.gender || e.gender === applied.gender) && (!applied.status || e.status === applied.status)),
        [employees, applied],
    );

    const openDetails = useCallback((employee: EmployeeData) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    }, []);

    const setStatus = useCallback((ids: string[], status: 'Active' | 'Inactive') => {
        setEmployees((prev) => prev.map((e) => (ids.includes(e.id) ? { ...e, status } : e)));
        showToast.success(ids.length > 1 ? `${ids.length} employees set to ${status}` : `Employee status changed to ${status}`);
    }, []);

    const resetFilters = () => {
        setDraft(EMPTY_FILTERS);
        setApplied(EMPTY_FILTERS);
    };

    return (
        <>
            <PageHeader
                title="Employee Directory"
                description="Staff profiles, department records and employment status."
                breadcrumb={[
                    { label: "Administration" },
                    { label: "Employees" },
                ]}
                actions={<Button icon={<Plus size={16} />} onClick={() => navigate("/employee-details")}>Add Employee</Button>}
            />

            <div className="space-y-4">
                {!filtersHidden && (
                  <Card title="Filters" description={appliedCount ? `${appliedCount} applied` : undefined}>
                    <form
                      className="flex flex-wrap items-end gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setApplied(draft);
                      }}
                    >
                    <Select
                        label="Gender"
                        placeholder="All genders"
                        options={GENDER_OPTIONS}
                        value={draft.gender}
                        onChange={(value: string | number) => setDraft((d) => ({ ...d, gender: String(value) }))}
                        wrapperClassName="min-w-48 flex-1 max-w-xs"
                    />
                    <Select
                        label="Status"
                        placeholder="All statuses"
                        options={STATUS_OPTIONS}
                        value={draft.status}
                        onChange={(value: string | number) => setDraft((d) => ({ ...d, status: String(value) }))}
                        wrapperClassName="min-w-48 flex-1 max-w-xs"
                    />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm">Apply</Button>
                        <Button type="button" size="sm" action="reset" onClick={resetFilters} />
                      </div>
                    </form>
                  </Card>
                )}

                <Card flush>
                    <DataTable
                        caption="Employees"
                        data={rows}
                        columns={EMPLOYEE_COLUMNS}
                        getRowId={(e) => e.id}
                        rowLabel={(e) => e.employeeName}
                        searchPlaceholder="Search by name, ID or mobile…"
                        exportFileName="employee_details"
                        selectable={false}
                        selectedKeys={selection}
                        onSelectionChange={setSelection}
                        bulkActions={[
                            { id: 'activate', label: 'Activate', icon: CheckCircle2, onClick: (ids) => { setStatus(ids, 'Active'); setSelection([]); } },
                            { id: 'deactivate', label: 'Deactivate', icon: XCircle, danger: true, onClick: (ids) => { setStatus(ids, 'Inactive'); setSelection([]); } },
                        ]}
                        filterToggle={{ hidden: filtersHidden, onToggle: () => setFiltersHidden((h) => !h), appliedCount }}
                        extraViewState={{
                            get: () => applied,
                            apply: (v) => {
                                setApplied(v as EmployeeFilters);
                                setDraft(v as EmployeeFilters);
                            },
                        }}
                        actions={{
                            onView: openDetails,
                            onEdit: (e) => navigate('/employee-details', { state: { editRecord: e } }),
                            more: (e) => [
                                e.status === 'Active'
                                    ? { id: 'lock', label: 'Deactivate', icon: Lock, danger: true, onSelect: () => setStatus([e.id], 'Inactive') }
                                    : { id: 'unlock', label: 'Activate', icon: Unlock, onSelect: () => setStatus([e.id], 'Active') },
                            ],
                        }}
                        previewTitle={(e) => e.employeeName}
                        renderPreview={(e) => <EmployeePreview employee={e} />}
                        emptyTitle="No employees yet"
                        emptyAction={<Button icon={<Plus size={16} />} onClick={() => navigate("/employee-details")}>Add Employee</Button>}
                    />
                </Card>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedEmployee ? `Employee Details - ${selectedEmployee.employeeName}` : 'Employee Details'}
                size="2xl"
            >
                {selectedEmployee && (
                    <div className="p-4 space-y-4">
                        {selectedEmployee.profilePhoto && (
                            <div className="flex items-center gap-4 p-3 bg-muted/10 rounded-lg">
                                <img
                                    src={selectedEmployee.profilePhoto}
                                    alt={selectedEmployee.employeeName}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                                />
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">{selectedEmployee.employeeName}</h4>
                                    <p className="text-xs text-muted-foreground">{selectedEmployee.employeeId}</p>
                                </div>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Employee ID</span>
                                <p className="text-sm font-medium text-foreground mt-1">{selectedEmployee.employeeId}</p>
                            </div>
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Employee Name</span>
                                <p className="text-sm font-medium text-foreground mt-1">{selectedEmployee.employeeName}</p>
                            </div>
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Gender</span>
                                <p className="text-sm font-medium text-foreground mt-1">{selectedEmployee.gender}</p>
                            </div>
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</span>
                                <p className="text-sm font-medium text-foreground mt-1">
                                    {selectedEmployee.dateOfBirth ? new Date(selectedEmployee.dateOfBirth).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</span>
                                <p className="text-sm font-medium text-foreground mt-1">{selectedEmployee.mobileNumber}</p>
                            </div>
                            <div className="border-b pb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Email ID</span>
                                <p className="text-sm font-medium text-foreground mt-1">{selectedEmployee.emailId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default EmployeeDetailsView;
