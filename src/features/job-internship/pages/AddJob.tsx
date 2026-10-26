import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import addJobConfig from "../form-config/addJob.json";
import "../styles/addJob.css";

const AddJob = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Job / Internship opportunity updated successfully!"
        : "Job / Internship opportunity posted successfully!"
    );
    navigate("/view-job");
  };

  const fields = useMemo(() => {
    const rawFields = (addJobConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleJob =
    editRecord?.jobTitle ||
    editRecord?.employer ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Opportunity");

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Opportunity" : "Post Job / Internship"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Opportunity - ${titleJob}`
            : "Job, Internship & Placement Opportunity Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="add-job-form"
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

export default AddJob;