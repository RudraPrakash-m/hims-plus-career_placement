import { MultiStepForm, PageHeader, showToast, type FormField } from '@mfe/components';
import studentConfig from '../form-config/studentDetails.json';
import { useMemo } from 'react';
import '../styles/studentDetails.css';

interface Step {
    id: string;
    label: string;
    fields: FormField[];
}

const AddStudentDetails = () => {
    const steps: Step[] = useMemo(() => {
        const rawSteps = (studentConfig.steps as Step[]) || [];
        return rawSteps.map((step) => {
            const regular = step.fields.filter((f) => f.type !== 'textarea');
            const multiline = step.fields.filter((f) => f.type === 'textarea').map((f) => ({
                ...f,
                gridColumn: f.gridColumn || 4,
                rows: f.rows && f.rows > 1 ? f.rows : 3,
            }));
            return {
                ...step,
                fields: [...regular, ...multiline],
            };
        });
    }, []);

    const handleSubmit = () => {
        showToast.success("Student details submitted successfully!");
    };

    const handleCancel = () => {
        showToast.info("Form cancelled");
    };

    return (
        <div className="space-y-4 student-details-form">
            <PageHeader title="Add Student" />
            <MultiStepForm
                steps={steps}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                gridColumn={4}
                title="Add Student Details"
            />
        </div>
    );
};

export default AddStudentDetails;
