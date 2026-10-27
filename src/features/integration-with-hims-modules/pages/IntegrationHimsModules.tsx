import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { Briefcase, Database, GraduationCap, RotateCcw, Save } from 'lucide-react';
import integrationConfig from "../form-config/integrationHimsModules.json";
import "../styles/integrationHimsModules.css";
import IntegrationHimsModulesView from "./IntegrationHimsModulesView";

const IntegrationHimsModules = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit/Reconcile button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(
      editRecord?.id
        ? "HIMS integration & mapping record updated successfully!"
        : "HIMS integration record synchronized and mapped successfully!"
    );
    navigate("/integration-hims-modules-view");
  };

  const fields = useMemo(() => {
    const rawFields = (integrationConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);
  const titleIdentifier =
    editRecord?.studentIdentifier ||
    editRecord?.studentName ||
    (editRecord?.id ? `ID: ${editRecord.id}` : "HIMS Integration");

  const defaultValues = editRecord || {
    sourceModule: "Student Lifecycle",
    studentIdentifier: "HIMS-STU-2024-001",
    studentName: "Aarav Sharma",
    academicRollNo: "STU-2022-001",
    internshipRecord: "AWS Cloud Solutions Summer Internship",
    alumniRecord: "Not Applicable (Current Student)",
    synchronizationStatus: "Successful",
    reconciliation: "Reconciled",
    errorDetails: "",
    reconciliationNotes: "Record successfully mapped to existing HIMS student master lifecycle repository with approved interface handshake.",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          editRecord?.id
            ? "Edit / Reconcile HIMS Integration Record"
            : "Integration with HIMS Modules - Sync & Map"
        }
        breadcrumb={[
          { label: "Home", path: "/" },
          { label: "Integration with HIMS Modules", path: "/integration-hims-modules" },
        ]}
      />

      {/* Overview Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Source Modules</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">3 Supported Repositories</p>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-muted leading-relaxed">
            Identifies and syncs across Student Lifecycle, Internship Management, and Alumni database interfaces.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Internship & Alumni</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">Approved Interface Links</p>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-muted leading-relaxed">
            Bi-directionally links approved internship records and eligible former-student alumni data where available.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Reconciliation</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">Mismatch Resolution</p>
            </div>
          </div>
          <p className="mt-2.5 text-xs text-muted leading-relaxed">
            Records sync errors for troubleshooting and enables authorized personnel to review mismatches and reconcile.
          </p>
        </div>
      </div>

      <Card
        title={
          editRecord?.id
            ? `Edit Integration - ${titleIdentifier}`
            : "HIMS Module Integration & Synchronization Mapping"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          gridColumns={12}
          buttonPosition="bottom"
          className="integration-hims-modules-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!editRecord?.id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>

      <IntegrationHimsModulesView hideHeader />
    </div>
  );
};

export default IntegrationHimsModules;
