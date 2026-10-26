import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, FormGenerator, PageHeader, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import employeeConfig from "../form-config/employeeDetails.json";
import "../styles/employeeDetails.css";

const EmployeeDetails = () => {
  const location = useLocation();
  const navigate = useAppNavigate();

  // If passed from the Edit button, this contains the editing record
  const editRecord = location.state?.editRecord;

  const handleSubmit = () => {
    showToast.success(editRecord?.id ? "Employee updated successfully!" : "Employee saved successfully!");
    navigate("/employee-details-view");
  };

  const fields = useMemo(() => {
    const rawFields = (employeeConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== "textarea");
    const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows && f.rows > 1 ? f.rows : 3,
    }));
    return [...regular, ...multiline];
  }, []);

  const titleEmployeeName = editRecord?.employeeName || editRecord?.fullName || editRecord?.firstName || (editRecord?.employeeId ? `ID: ${editRecord.employeeId}` : "Employee");

  return (
    <div className="space-y-4">
      <PageHeader title={editRecord?.id ? "Edit Employee" : "Add Employee"} />
      <Card title={editRecord?.id ? `Edit Employee - ${titleEmployeeName}` : "Add Employee Details"}>
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={editRecord || {}}
          gridColumns={5}
          buttonPosition="bottom"
          className="employee-details-form"
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

export default EmployeeDetails;
