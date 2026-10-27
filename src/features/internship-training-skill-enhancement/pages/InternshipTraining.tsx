import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import internshipTrainingConfig from "../form-config/internshipTraining.json";
import "../styles/internshipTraining.css";
import InternshipTrainingView from "./InternshipTrainingView";

const InternshipTraining = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Programme updated successfully!"
        : "Programme saved successfully!"
    );
    navigate("/training-internship-view");
  };

  const fields = useMemo(() => {
    const rawFields = (internshipTrainingConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleProg =
    editRecord?.programmeName ||
    editRecord?.providerEmployer ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Programme");

  return (
    <div className="space-y-6">
      <PageHeader
        title={editRecord?.id ? "Edit Training / Internship Programme" : "Add Training / Internship Programme"}
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Internship, Training and Skill Enhancement", path: "/training-internship" },
        ]}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Programme - ${titleProg}`
            : "Internship, Training & Skill Enhancement Programme Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="internship-training-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <InternshipTrainingView hideHeader />
    </div>
  );
};

export default InternshipTraining;
