import { useMemo, useState, useCallback } from "react";
import { Button, Card, DataTable, Modal, PageHeader, showToast, useAppNavigate, type TableColumnDef } from '@mfe/components';
import { Plus, CheckCircle2, Eye, RotateCcw } from "lucide-react";

export type DeliveryStatusType =
  | "Delivered"
  | "Sent"
  | "Read"
  | "Pending"
  | "Failed";

export interface NotificationCommunicationData {
  id: string;
  notificationType: string;
  recipient: string;
  deliveryChannel: string;
  deadline?: string;
  sentDate: string;
  deliveryStatus: DeliveryStatusType;
  message: string;
  communicationHistory?: string;
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

const INITIAL_NOTIFICATIONS: NotificationCommunicationData[] = [
  {
    id: "1",
    notificationType: "Drive Announcement",
    recipient: "All Final Year Eligible",
    deliveryChannel: "Omnichannel",
    deadline: "2024-01-25",
    sentDate: "2024-01-10",
    deliveryStatus: "Delivered",
    message: "TCS National Campus Drive 2024 announced. Register on portal before deadline 25/01/2024. Eligible branches: B.Tech CSE/IT/ECE & MCA.",
    communicationHistory: "Dispatched via SMTP & Twilio SMS Gateway to 342 students at 10:00 AM. 340 delivered, 2 bounced.",
  },
  {
    id: "2",
    notificationType: "Interview Schedule",
    recipient: "TCS Shortlisted Candidates",
    deliveryChannel: "Email & In-App",
    deadline: "2024-02-14",
    sentDate: "2024-02-10",
    deliveryStatus: "Read",
    message: "Technical Round 2 scheduled for 15/02/2024 at 10:00 AM. Venue: Placement Cell Room 102. Please carry original marksheet and resume copies.",
    communicationHistory: "Sent to 60 shortlisted candidates. In-app acknowledgment received from 58 students.",
  },
  {
    id: "3",
    notificationType: "Opportunity Alert",
    recipient: "Pre-Final Year Students",
    deliveryChannel: "In-App",
    deadline: "2024-03-15",
    sentDate: "2024-02-20",
    deliveryStatus: "Delivered",
    message: "AWS Cloud & DevOps 8-Week Summer Internship registrations are now open. Apply through Career Development portal.",
    communicationHistory: "Broadcasted via Campus Mobile App notification to 280 pre-final year students.",
  },
  {
    id: "4",
    notificationType: "Deadline Reminder",
    recipient: "Infosys Shortlisted Candidates",
    deliveryChannel: "SMS",
    deadline: "2024-03-05",
    sentDate: "2024-03-03",
    deliveryStatus: "Delivered",
    message: "Reminder: Submit offer acceptance confirmation and medical fitness certificates before 05/03/2024, 5:00 PM.",
    communicationHistory: "SMS delivered via institutional gateway to 25 verified phone numbers.",
  },
  {
    id: "5",
    notificationType: "Offer Notification",
    recipient: "Aarav Sharma",
    deliveryChannel: "Email",
    deadline: "2024-03-25",
    sentDate: "2024-03-15",
    deliveryStatus: "Delivered",
    message: "Congratulations! Google India has extended an off-campus full-time offer for Software Engineer L3 profile. Check portal for formal letter.",
    communicationHistory: "Sent via official placement officer mailbox to aarav.sharma@example.edu.",
  },
  {
    id: "6",
    notificationType: "Counselling Alert",
    recipient: "Priya Patel",
    deliveryChannel: "Email & In-App",
    deadline: "2024-03-30",
    sentDate: "2024-03-22",
    deliveryStatus: "Sent",
    message: "Your 1-on-1 Alumni Mentorship Session with Ms. Priyanka Mahapatra (Oracle) is scheduled for 25/03/2024, 2:00 PM via Google Meet.",
    communicationHistory: "Calendar invite and reminder email generated automatically.",
  },
];

const getDeliveryStatusClass = (status: DeliveryStatusType) => {
  const styles: Record<DeliveryStatusType, string> = {
    Delivered: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Read: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    Sent: "bg-blue-100 text-blue-800 border border-blue-200",
    Pending: "bg-amber-100 text-amber-800 border border-amber-200",
    Failed: "bg-rose-100 text-rose-800 border border-rose-200",
  };
  return styles[status] || "bg-gray-100 text-gray-800";
};

const DeliveryStatusBadge = ({ status }: { status: DeliveryStatusType }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDeliveryStatusClass(
      status
    )}`}
  >
    {status}
  </span>
);

const getNotificationTypeClass = (type: string) => {
  if (type.includes("Drive")) {
    return "bg-indigo-100 text-indigo-800 border border-indigo-200";
  }
  if (type.includes("Opportunity")) {
    return "bg-teal-100 text-teal-800 border border-teal-200";
  }
  if (type.includes("Interview")) {
    return "bg-purple-100 text-purple-800 border border-purple-200";
  }
  if (type.includes("Deadline")) {
    return "bg-amber-100 text-amber-800 border border-amber-200";
  }
  if (type.includes("Offer")) {
    return "bg-blue-100 text-blue-800 border border-blue-200";
  }
  return "bg-emerald-100 text-emerald-800 border border-emerald-200";
};

const NotificationTypeBadge = ({ type }: { type: string }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getNotificationTypeClass(
      type
    )}`}
  >
    {type}
  </span>
);

const NOTIFICATION_COLUMNS: TableColumnDef<NotificationCommunicationData>[] = [
  {
    id: "notificationType",
    header: "Type",
    accessorFn: (row) => row.notificationType,
    Cell: ({ row: { original: row } }) => <NotificationTypeBadge type={row.notificationType} />,
    enableSorting: true,
  },
  {
    id: "recipient",
    header: "Recipient Cohort",
    accessorFn: (row) => row.recipient,
    Cell: ({ row: { original: row } }) => (
      <div className="font-medium text-foreground max-w-[180px] truncate" title={row.recipient}>
        {row.recipient}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "deliveryChannel",
    header: "Channel",
    accessorFn: (row) => row.deliveryChannel,
    enableSorting: true,
  },
  {
    id: "sentDate",
    header: "Sent On",
    accessorFn: (row) => row.sentDate,
    Cell: ({ row: { original: row } }) => formatDate(row.sentDate),
    enableSorting: true,
  },
  {
    id: "deliveryStatus",
    header: "Status",
    accessorFn: (row) => row.deliveryStatus,
    Cell: ({ row: { original: row } }) => <DeliveryStatusBadge status={row.deliveryStatus} />,
    enableSorting: true,
  },
  {
    id: "deadline",
    header: "Deadline",
    accessorFn: (row) => row.deadline || "",
    Cell: ({ row: { original: row } }) => formatDate(row.deadline),
    defaultHidden: true,
  },
  {
    id: "message",
    header: "Message",
    accessorFn: (row) => row.message,
    defaultHidden: true,
  },
  {
    id: "communicationHistory",
    header: "Communication History",
    accessorFn: (row) => row.communicationHistory || "N/A",
    defaultHidden: true,
  },
];

const NotificationPreview = ({ item }: { item: NotificationCommunicationData }) => {
  const details = [
    ["Notification Type", item.notificationType],
    ["Recipient Cohort / Student", item.recipient],
    ["Delivery Channel", item.deliveryChannel],
    ["Relevant Deadline", formatDate(item.deadline)],
    ["Date Sent", formatDate(item.sentDate)],
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
          <dt className="text-xs text-muted">Delivery Status</dt>
          <dd className="mt-1">
            <DeliveryStatusBadge status={item.deliveryStatus} />
          </dd>
        </div>
      </dl>

      <div className="space-y-3 border-t pt-3">
        <div>
          <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
            Message Content
          </h4>
          <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {item.message}
          </p>
        </div>

        {item.communicationHistory && (
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Communication & Audit History
            </h4>
            <p className="mt-1 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {item.communicationHistory}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export interface NotificationCommunicationViewProps {
  hideHeader?: boolean;
}

const NotificationCommunicationView = ({ hideHeader }: NotificationCommunicationViewProps = {}) => {
  const navigate = useAppNavigate();
  const [notifications, setNotifications] =
    useState<NotificationCommunicationData[]>(INITIAL_NOTIFICATIONS);
  const [selectedItem, setSelectedItem] =
    useState<NotificationCommunicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [statusFilter] = useState("");

  const rows = useMemo(
    () =>
      statusFilter
        ? notifications.filter((n) => n.deliveryStatus === statusFilter)
        : notifications,
    [notifications, statusFilter]
  );

  const openDetails = useCallback((item: NotificationCommunicationData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const updateStatus = useCallback(
    (ids: string[], status: DeliveryStatusType) => {
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, deliveryStatus: status } : n))
      );
      showToast.success(
        ids.length > 1
          ? `${ids.length} notifications updated to ${status}`
          : `Notification updated to ${status}`
      );
    },
    []
  );

  return (
    <>
      {!hideHeader && (
        <PageHeader
          title="Notifications & Communication"
          description="Broadcast announcements, interview schedules and deadline alerts."
          breadcrumb={[
            { label: "Placement" },
            { label: "Notifications" },
          ]}
          actions={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/notifications-communication")}
            >
              Send Notification
            </Button>
          }
        />
      )}

      <div className="space-y-4">
        <Card title={hideHeader ? "Notifications and Communication" : undefined} flush>
        <DataTable
          caption="Event Notifications, Deadline Alerts & Broadcast Communication"
          data={rows}
          columns={NOTIFICATION_COLUMNS}
          getRowId={(n) => n.id}
          rowLabel={(n) => `${n.notificationType} - ${n.recipient}`}
          searchPlaceholder="Search by type, recipient, message..."
          exportFileName="notification_communications"
          selectable={false}
          selectedKeys={selection}
          onSelectionChange={setSelection}
          bulkActions={[
            {
              id: "mark-delivered",
              label: "Mark Delivered",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Delivered");
                setSelection([]);
              },
            },
            {
              id: "mark-read",
              label: "Mark Read",
              icon: CheckCircle2,
              onClick: (ids) => {
                updateStatus(ids, "Read");
                setSelection([]);
              },
            },
            {
              id: "resend",
              label: "Resend",
              icon: RotateCcw,
              onClick: (ids) => {
                updateStatus(ids, "Sent");
                setSelection([]);
              },
            },
          ]}
          actions={{
            onView: openDetails,
            onEdit: (item) =>
              navigate("/notifications-communication", {
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
          previewTitle={(n) => `${n.notificationType} - ${n.recipient}`}
          renderPreview={(n) => <NotificationPreview item={n} />}
          emptyTitle="No notifications found"
          emptyAction={
            <Button
              icon={<Plus size={16} />}
              onClick={() => navigate("/notifications-communication")}
            >
              Send Notification
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
            ? `Notification Details - ${selectedItem.notificationType}`
            : "Notification Details"
        }
        size="2xl"
      >
        {selectedItem && (
          <div className="space-y-4 p-4">
            <NotificationPreview item={selectedItem} />
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
                  navigate("/notifications-communication", {
                    state: { editRecord: item },
                  });
                }}
              >
                Edit Notification
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default NotificationCommunicationView;
