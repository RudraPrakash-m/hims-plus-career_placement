import { useMemo } from "react";
import { Button, Card, FormGenerator, PageHeader, showToast, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import employeeManagementConfig from "../form-config/employeeManagement.json";
import "../styles/employeeDetails.css";

const EmployeeManagementDetails = () => {
    const fields = useMemo(() => {
        const rawFields = (employeeManagementConfig as FormField[]) || [];
        const regular = rawFields.filter((f) => f.type !== "textarea");
        const multiline = rawFields.filter((f) => f.type === "textarea").map((f) => ({
            ...f,
            gridColumn: 6,
            rows: f.rows ?? 3,
        }));
        return [...regular, ...multiline];
    }, []);

    const handleSubmit = () => {
        showToast.success("Employee management details saved successfully!");
    };

    return (
        <div className="space-y-4">
            <PageHeader title="Employee Management" />
            <Card title="Employee Management Details">
                <FormGenerator
                    fields={fields}
                    onSubmit={handleSubmit}
                    gridColumns={12}
                    buttonPosition="bottom"
                    className="employee-details-form"
                >
                    <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={false ? "Update" : "Save"} />
          </div>
                </FormGenerator>
            </Card>
        </div>
    );
};

export default EmployeeManagementDetails;
