import { type FormField } from '@mfe/components';
// src/features/doctor-details/form-config/doctorDetailsFormConfig.ts

export const doctorDetailsFormConfig: FormField[] = [
  {
    name: 'name',
    label: 'DoctorDetails Name',
    type: 'text',
    placeholder: 'Enter name',
    gridColumn: 6,
    validation: {
      required: true,
      minLength: 2,
      message: 'DoctorDetails Name is required (at least 2 characters)',
    },
  },
  {
    name: 'code',
    label: 'Identifier Code',
    type: 'text',
    placeholder: 'e.g. DOC-001',
    gridColumn: 6,
    validation: {
      required: true,
      message: 'Identifier Code is required',
    },
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'Select status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    gridColumn: 6,
    validation: {
      required: true,
      message: 'Please select a status',
    },
  },
  {
    name: 'description',
    label: 'Description / Notes',
    type: 'textarea',
    placeholder: 'Enter optional notes...',
    gridColumn: 12,
  },
];
