import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import placementConfig from "../form-config/placementOutcomesFeedback.json";
import "../styles/placementOutcomesFeedback.css";

const PlacementOutcomesFeedback = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Placement outcome and feedback updated successfully!"
        : "Placement outcome and feedback recorded successfully!"
    );
    navigate("/placement-outcomes-feedback-view");
  };

  const fields = useMemo(() => {
    const rawFields = (placementConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleStudent =
    editRecord?.student ||
    editRecord?.employer ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Outcome Record");

  const defaultValues = editRecord || {
    offerJoiningDate: new Date().toISOString().split("T")[0],
    outcomeStatus: "Offer Issued",
    employmentType: "Full-Time Job",
    verificationStatus: "Verified",
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Placement Outcome" : "Record Placement Outcome & Feedback"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Outcome - ${titleStudent}`
            : "Student Placement Result, Offer Details & Employer Assessment"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          gridColumns={12}
          buttonPosition="bottom"
          className="placement-outcomes-feedback-form"
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

export default PlacementOutcomesFeedback;
