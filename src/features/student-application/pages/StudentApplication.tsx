import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import studentApplicationConfig from "../form-config/studentApplication.json";
import "../styles/studentApplication.css";

const StudentApplication = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Application updated successfully!"
        : "Application submitted successfully!"
    );
    navigate("/student-application-view");
  };

  const fields = useMemo(() => {
    const rawFields = (studentApplicationConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleApp =
    editRecord?.applicationNumber ||
    editRecord?.studentName ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Application");

  const defaultValues = editRecord || {
    applicationNumber: `APP-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
    submissionDate: new Date().toISOString().split("T")[0],
    applicationStatus: "Submitted",
    declarationConsent: true,
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Student Application" : "Submit Student Application"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Application - ${titleApp}`
            : "Placement & Job Opportunity Application Form"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          gridColumns={12}
          buttonPosition="bottom"
          className="student-application-form"
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

export default StudentApplication;