import { useMemo } from "react";
import { Button, Card, FormGenerator, PageHeader, showToast, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import employeeConfig from "../form-config/parentdetails.json";
import "../styles/employeeDetails.css";

const ParentForm = () => {
    const handleSubmit = () => {
        showToast.success("Parent details saved successfully!");
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

    return (
        <div className="space-y-4">
            <PageHeader title="Add Parent" />
            <Card title="Parent Details">
                <FormGenerator
                    fields={fields}
                    onSubmit={handleSubmit}
                    gridColumns={5}
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

export default ParentForm;
