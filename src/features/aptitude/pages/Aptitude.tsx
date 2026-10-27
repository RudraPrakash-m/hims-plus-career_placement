import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import aptitudeConfig from "../form-config/aptitude.json";
import "../styles/aptitude.css";
import AptitudeView from "./AptitudeView";

const Aptitude = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Assessment record updated successfully!"
        : "Assessment record saved successfully!"
    );
    navigate("/aptitude-view");
  };

  const fields = useMemo(() => {
    const rawFields = (aptitudeConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleAssessment =
    editRecord?.assessmentName ||
    editRecord?.studentBatch ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Assessment");

  return (
    <div className="space-y-6">
      <PageHeader
        title={editRecord?.id ? "Edit Assessment" : "Add Assessment"}
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Aptitude, Skill Assessment and Career Recommendations", path: "/aptitude" },
        ]}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Assessment - ${titleAssessment}`
            : "Assessment & Skill Evaluation Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="aptitude-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <AptitudeView hideHeader />
    </div>
  );
};

export default Aptitude;