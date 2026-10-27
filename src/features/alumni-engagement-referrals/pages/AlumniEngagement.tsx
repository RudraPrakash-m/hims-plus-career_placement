import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import alumniConfig from "../form-config/alumniEngagement.json";
import "../styles/alumniEngagement.css";

const AlumniEngagement = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Alumni engagement record updated successfully!"
        : "Alumni engagement record saved successfully!"
    );
    navigate("/alumni-engagement-view");
  };

  const fields = useMemo(() => {
    const rawFields = (alumniConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleSession =
    editRecord?.alumniProfile ||
    editRecord?.studentMentee ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Session");

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Alumni Engagement" : "Add Alumni Engagement"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Session - ${titleSession}`
            : "Alumni Mentorship, Referral & Engagement Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="alumni-engagement-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>
    </div>
  );
};

export default AlumniEngagement;
