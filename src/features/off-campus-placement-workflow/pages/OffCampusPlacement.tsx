import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import offCampusPlacementConfig from "../form-config/offCampusPlacement.json";
import "../styles/offCampusPlacement.css";

const OffCampusPlacement = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Off-campus placement record updated successfully!"
        : "Off-campus placement record saved successfully!"
    );
    navigate("/off-campus-placement-view");
  };

  const fields = useMemo(() => {
    const rawFields = (offCampusPlacementConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleRecord =
    editRecord?.studentName ||
    editRecord?.opportunity ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Off-Campus Record");

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Off-Campus Record" : "Add Off-Campus Placement"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Record - ${titleRecord}`
            : "Off-Campus Placement Application, Offer & Outcome Tracking"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="off-campus-placement-form"
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

export default OffCampusPlacement;
