// src/features/doctor-details/types/doctor-details.types.ts

export interface DoctorDetailsItem {
  id: string | number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export interface DoctorDetailsFormData {
  name: string;
  code: string;
  status: string;
  description?: string;
}
