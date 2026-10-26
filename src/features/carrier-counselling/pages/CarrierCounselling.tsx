import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import carrierCounsellingConfig from "../form-config/carrierCounselling.json";
import "../styles/carrierCounselling.css";

const CarrierCounselling = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Counselling session updated successfully!"
        : "Counselling session scheduled successfully!"
    );
    navigate("/carrier-counselling-view");
  };

  const fields = useMemo(() => {
    const rawFields = (carrierCounsellingConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea").map((f) => ({
      ...f,
      gridColumn: 3,
    }));
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: 2,
    }));
    return [...regular, ...multiline];
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          editRecord?.id
            ? "Edit Counselling Session"
            : "Schedule Counselling Session"
        }
      />
      <Card
        title={
          editRecord?.id
            ? "Edit Counselling Session"
            : "Schedule Counselling Session"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="carrier-counselling-form"
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

export default CarrierCounselling;