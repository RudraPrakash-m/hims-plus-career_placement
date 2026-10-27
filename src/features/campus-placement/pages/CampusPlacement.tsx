import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import campusPlacementConfig from "../form-config/campusPlacement.json";
import "../styles/campusPlacement.css";

const CampusPlacement = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Placement record updated successfully!"
        : "Placement record saved successfully!"
    );
    navigate("/campus-placement-view");
  };

  const fields = useMemo(() => {
    const rawFields = (campusPlacementConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titlePlacement =
    editRecord?.eligibleStudent ||
    editRecord?.employerDrive ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Placement");

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Campus Placement Record" : "Add Campus Placement Record"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Record - ${titlePlacement}`
            : "Campus Recruitment, Offer Tracking & Joining Status"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="campus-placement-form"
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

export default CampusPlacement;