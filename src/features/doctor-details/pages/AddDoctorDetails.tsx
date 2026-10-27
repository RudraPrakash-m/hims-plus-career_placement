// src/features/doctor-details/pages/AddDoctorDetails.tsx
import React, { useMemo } from 'react';
import { useParams } from "react-router-dom";
import { Button, Card, FormGenerator, showToast, useAppNavigate, type FormField } from '@mfe/components';
import { RotateCcw, Save } from 'lucide-react';
import { doctorDetailsFormConfig } from '../form-config/doctorDetailsFormConfig';
import '../styles/doctorDetails.css';

export const AddDoctorDetails: React.FC = () => {
  const navigate = useAppNavigate();
  const { id } = useParams<{ id: string }>();

  const handleSubmit = (_data: Record<string, any>) => {
    showToast.success(id ? 'DoctorDetails updated successfully!' : 'DoctorDetails created successfully!');
    navigate('/doctor-details');
  };

  const fields = useMemo(() => {
    const rawFields = (doctorDetailsFormConfig as FormField[]) || [];
    const regular = rawFields.filter((f) => f.type !== 'textarea');
    const multiline = rawFields.filter((f) => f.type === 'textarea').map((f) => ({
      ...f,
      gridColumn: 6,
      rows: f.rows ?? 3,
    }));
    return [...regular, ...multiline];
  }, []);

  return (
    <div className="space-y-6">
      <Card
        title={id ? 'Edit DoctorDetails' : 'Add New DoctorDetails'}
      >
        <FormGenerator
          fields={fields}
          onSubmit={handleSubmit}
          gridColumns={12}
          buttonPosition="bottom"
          className="doctor-details-form"
        >
          <div className="flex items-center gap-2">
            <Button type="reset" variant="outline" icon={<RotateCcw size={16} />} label="Reset" />
            <Button type="submit" variant="primary" icon={<Save size={16} />} label={!!id ? "Update" : "Save"} />
          </div>
        </FormGenerator>
      </Card>
    </div>
  );
};

export default AddDoctorDetails;
