import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import dashboardAnalyticsConfig from "../form-config/dashboardAnalytics.json";
import "../styles/dashboardAnalytics.css";

const DashboardAnalytics = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button in view page, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = (data: Record<string, any>) => {
    showToast.success(
      editRecord?.id
        ? "Dashboard analytics configuration updated successfully!"
        : "Analytics report generated and filters applied successfully!"
    );
    navigate("/view-dashboard", {
      state: {
        filterConfig: data,
        reportTitle: data.reportTitle || "Custom Analytics Report",
      },
    });
  };

  const fields = useMemo(() => {
    const rawFields = (dashboardAnalyticsConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const defaultValues = editRecord || {
    reportTitle: "Placement & Employability Comprehensive Analytics 2024-2025",
    academicSession: "2024 - 2025",
    institutionProgramme: "All Programmes",
    employer: "All Employers",
    opportunityType: "All Opportunity Types",
    placementStatistics: "Comprehensive Overview",
    employerParticipation: "All Registered & Active",
    salaryTrends: "All Packages",
    studentEngagement: "All Indicators",
    exportFormat: "Excel (.xlsx)",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    remarks: "Standard institutional reporting for Career & Placement cell compliance and executive review.",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          editRecord?.id
            ? "Edit Analytics Configuration"
            : "Dashboard Analytics & Reports Configuration"
        }
      />
      <Card
        title={
          editRecord?.id
            ? "Edit Analytics Configuration"
            : "Dashboard Analytics & Reports Configuration"
        }
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          gridColumns={12}
          buttonPosition="bottom"
          className="dashboard-analytics-form"
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

export default DashboardAnalytics;