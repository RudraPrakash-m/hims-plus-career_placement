import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import placementDriveConfig from "../form-config/placementDrive.json";
import "../styles/placementDrive.css";

const PlacementDrive = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Placement drive updated successfully!"
        : "Placement drive created successfully!"
    );
    navigate("/placement-drive-view");
  };

  const fields = useMemo(() => {
    const rawFields = (placementDriveConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleDrive =
    editRecord?.driveName ||
    editRecord?.employer ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Drive");

  return (
    <div className="space-y-4">
      <PageHeader
        title={editRecord?.id ? "Edit Placement Drive" : "Create Placement Drive"}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Drive - ${titleDrive}`
            : "Recruitment & Placement Drive Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="placement-drive-form"
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

export default PlacementDrive;