import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import carrierConfig from "../form-config/carrierPreference.json";
import "../styles/carrierPreference.css";

import ViewcarrierPreference from "./viewcarrierPreference";

const CarrierPreference = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Career Preferences updated successfully!"
        : "Career Preferences saved successfully!"
    );
    if (editRecord?.id) {
      navigate("/carrier-preference", { replace: true });
    }
  };

  const fields = useMemo(() => {
    const rawFields = (carrierConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          editRecord?.id ? "Edit Career Preferences" : "Add Career Preferences"
        }
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Career Preferences and Employment Aspirations", path: "/carrier-preference" },
        ]}
      />
      <Card
        title={
          editRecord?.id ? "Edit Career Preferences" : "Career Preferences"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="carrier-preference-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <ViewcarrierPreference hideHeader />
    </div>
  );
};

export default CarrierPreference;