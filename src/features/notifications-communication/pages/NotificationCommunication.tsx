import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import notificationConfig from "../form-config/notificationCommunication.json";
import "../styles/notificationCommunication.css";
import NotificationCommunicationView from "./NotificationCommunicationView";

const NotificationCommunication = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Notification updated successfully!"
        : "Notification dispatched successfully!"
    );
    navigate("/notifications-communication-view");
  };

  const fields = useMemo(() => {
    const rawFields = (notificationConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleNotif =
    editRecord?.notificationType ||
    editRecord?.recipient ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Notification");

  const defaultValues = editRecord || {
    sentDate: new Date().toISOString().split("T")[0],
    deliveryStatus: "Delivered",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={editRecord?.id ? "Edit Notification" : "Send Notification & Announcement"}
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Notifications and Communication", path: "/notifications-communication" },
        ]}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Notification - ${titleNotif}`
            : "Placement Drive, Opportunity & Event Communication"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          gridColumns={12}
          buttonPosition="bottom"
          className="notifications-communication-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <NotificationCommunicationView hideHeader />
    </div>
  );
};

export default NotificationCommunication;
