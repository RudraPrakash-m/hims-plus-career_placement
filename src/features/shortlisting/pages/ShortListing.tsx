import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import shortListingConfig from "../form-config/shortListing.json";
import "../styles/shortListing.css";
import ShortlistingView from "./ShortlistingView";

const ShortListing = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "Shortlisting record updated successfully!"
        : "Shortlisting record saved successfully!"
    );
    navigate("/shortlisting-view");
  };

  const fields = useMemo(() => {
    const rawFields = (shortListingConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleShortlist =
    editRecord?.applicant ||
    editRecord?.opportunityDrive ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "Candidate");

  return (
    <div className="space-y-6">
      <PageHeader
        title={editRecord?.id ? "Edit Candidate Evaluation" : "Candidate Shortlisting & Evaluation"}
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Shortlisting and Interview Scheduling", path: "/short-listing" },
        ]}
      />
      <Card
        title={
          editRecord?.id
            ? `Edit Evaluation - ${titleShortlist}`
            : "Applicant Shortlisting & Interview Scheduling Details"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={12}
          buttonPosition="bottom"
          className="shortlisting-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <ShortlistingView hideHeader />
    </div>
  );
};

export default ShortListing;