
import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, XCircle, RotateCcw, Eye } from "lucide-react";

type VerificationStatus =
  | "Pending"
  | "Verified"
  | "Rejected"
  | "Returned";

interface OrganizationData {
  id: string;
  organizationName: string;
  organizationType: string;
  registrationDetails: string;
  address: string;
  contactPerson: string;
  website?: string;
  companyProfile?: string;
  supportingDocuments?: string;
  verificationStatus: VerificationStatus;
}

const INITIAL_ORGANIZATIONS: OrganizationData[] = [
  {
    id: "1",
    organizationName: "ABC Technologies Pvt. Ltd.",
    organizationType: "Information Technology",
    registrationDetails: "CIN-U72900OD2024PTC012345",
    address: "Bhubaneswar, Odisha",
    contactPerson: "Rahul Sharma - HR Manager",
    website: "https://www.example.com",
    companyProfile: "Software development and IT services.",
    supportingDocuments: "company-registration.pdf",
    verificationStatus: "Verified",
  },
  {
    id: "2",
    organizationName: "XYZ Industries",
    organizationType: "Manufacturing",
    registrationDetails: "REG-2024-002",
    address: "Cuttack, Odisha",
    contactPerson: "Priya Das - HR Executive",
    website: "https://www.example.org",
    companyProfile: "Industrial manufacturing organization.",
    verificationStatus: "Pending",
  },
  {
    id: "3",
    organizationName: "Digital Solutions",
    organizationType: "Information Technology",
    registrationDetails: "REG-2024-003",
    address: "Puri, Odisha",
    contactPerson: "Amit Kumar - Director",
    website: "https://www.example.net",
    companyProfile: "Digital and technology solutions.",
    verificationStatus: "Returned",
  },
  {
    id: "4",
    organizationName: "Eastern Enterprises",
    organizationType: "Consulting",
    registrationDetails: "REG-2024-004",
    address: "Rourkela, Odisha",
    contactPerson: "Sneha Rao - HR Manager",
    verificationStatus: "Rejected",
  },
];

const getStatusClass = (status: VerificationStatus) => {
  const styles: Record<VerificationStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    Verified: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Returned: "bg-blue-100 text-blue-800",
  };

  return styles[status];
};

const VerificationBadge = ({
  status,
}: {
  status: VerificationStatus;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(status)}`}
  >
    {status}
  </span>
);

const ORGANIZATION_COLUMNS: TableColumnDef<OrganizationData>[] = [
  {
    id: "organizationName",
    header: "Organization Name",
    accessorFn: (org) => org.organizationName,
    Cell: ({ row: { original: org } }) => (
      <div className="font-medium text-foreground max-w-[200px] truncate" title={org.organizationName}>
        {org.organizationName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "organizationType",
    header: "Industry / Type",
    accessorFn: (org) => org.organizationType,
    Cell: ({ row: { original: org } }) => (
      <div className="text-muted max-w-[170px] truncate" title={org.organizationType}>
        {org.organizationType}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "contactPerson",
    header: "Contact Person",
    accessorFn: (org) => org.contactPerson,
    Cell: ({ row: { original: org } }) => (
      <div className="font-medium text-foreground max-w-[170px] truncate" title={org.contactPerson}>
        {org.contactPerson}
      </div>
    ),
  },
  {
    id: "verificationStatus",
    header: "Status",
    accessorFn: (org) => org.verificationStatus,
    Cell: ({ row: { original: org } }) => (
      <VerificationBadge status={org.verificationStatus} />
    ),
    enableSorting: true,
  },
  {
    id: "registrationDetails",
    header: "Registration Details",
    accessorFn: (org) => org.registrationDetails,
    defaultHidden: true,
  },
  {
    id: "address",
    header: "Address",
    accessorFn: (org) => org.address,
    defaultHidden: true,
  },
  {
    id: "website",
    header: "Website",
    accessorFn: (org) => org.website || "N/A",
    defaultHidden: true,
  },
];

const OrganizationPreview = ({
  organization,
}: {
  organization: OrganizationData;
}) => {
  const details = [
    ["Organization Name", organization.organizationName],
    ["Organization Type / Industry", organization.organizationType],
    ["Registration / Identification Details", organization.registrationDetails],
    ["Address and Location", organization.address],
    ["Contact Person", organization.contactPerson],
    ["Website", organization.website || "N/A"],
    ["Company Profile", organization.companyProfile || "N/A"],
    ["Supporting Documents", organization.supportingDocuments || "N/A"],
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

      <div className="md:col-span-2">
        <dt className="text-xs text-muted">Verification Status</dt>
        <dd className="mt-1">
          <VerificationBadge
            status={organization.verificationStatus}
          />
        </dd>
      </div>
    </dl>
  );
};

const RegistrationView = () => {
  const navigate = useAppNavigate();

  const [organizations, setOrganizations] =
    useState<OrganizationData[]>(INITIAL_ORGANIZATIONS);

  const [selectedOrganization, setSelectedOrganization] =
    useState<OrganizationData | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () =>
      organizations.filter(
        (org) =>
          !statusFilter ||
          org.verificationStatus === statusFilter,
      ),
    [organizations, statusFilter],
  );

  const openDetails = useCallback((org: OrganizationData) => {
    setSelectedOrganization(org);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: VerificationStatus) => {
      setOrganizations((previous) =>
        previous.map((org) =>
          ids.includes(org.id)
            ? { ...org, verificationStatus: status }
            : org,
        ),
      );

      showToast.success(
        ids.length > 1
          ? `${ids.length} organizations updated to ${status}`
          : `Organization status changed to ${status}`,
      );
    },
    [],
  );

  return (
    <>
      <PageHeader
        title="Organization Registrations"
        description="Registered partner organizations, corporate profiles and verification status."
        breadcrumb={[
          { label: "Administration" },
          { label: "Organizations" },
        ]}
        actions={
          <Button
            icon={<Plus size={16} />}
            onClick={() => navigate("/employer-registration-profile")}
          >
            Add Organization
          </Button>
        }
      />

      <div className="space-y-4">
        <Card flush>
        <DataTable
          caption="Organizations"
          data={rows}
          columns={ORGANIZATION_COLUMNS}
          getRowId={(org) => org.id}
          rowLabel={(org) => org.organizationName}
          searchPlaceholder="Search by organization, type or contact..."
          exportFileName="organization_details"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "verify",
              label: "Verify",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Verified");
                setSelection([]);
              },
            },
            {
              id: "reject",
              label: "Reject",
              icon: XCircle,
              danger: true,
              onClick: (ids) => {
                updateStatus(ids, "Rejected");
                setSelection([]);
              },
            },
            {
              id: "return",
              label: "Return",
              icon: RotateCcw,
              onClick: (ids) => {
                updateStatus(ids, "Returned");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (org) =>
              navigate("/employer-registration-profile", {
                state: { editRecord: org },
              }),
            more: (org) => [
              {
                id: "view",
                label: "View Organization",
                icon: Eye,
                onSelect: () => openDetails(org),
              },
              ...(
                [
                  "Pending",
                  "Verified",
                  "Rejected",
                  "Returned",
                ] as VerificationStatus[]
              )
                .filter(
                  (status) =>
                    status !== org.verificationStatus,
                )
                .map((status) => ({
                  id: `status-${status.toLowerCase()}`,
                  label: `Mark ${status}`,
                  onSelect: () =>
                    updateStatus([org.id], status),
                })),
            ],
          }}
          previewTitle={(org) => org.organizationName}
          renderPreview={(org) => (
            <OrganizationPreview organization={org} />
          )}
          emptyTitle="No organizations found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/employee-registration")}
            >
              Add Organization
            </Button>
          }
        />
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedOrganization
            ? `Organization Details - ${selectedOrganization.organizationName}`
            : "Organization Details"
        }
        size="2xl"
      >
        {selectedOrganization && (
          <div className="space-y-4 p-4">
            <OrganizationPreview
              organization={selectedOrganization}
            />

            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  const org = selectedOrganization;
                  setIsModalOpen(false);

                  navigate("/employer-registration-profile", {
                    state: { editRecord: org },
                  });
                }}
              >
                Edit Organization
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RegistrationView;
