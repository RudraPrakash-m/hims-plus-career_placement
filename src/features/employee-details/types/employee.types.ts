export interface EmployeeDetails {
    employeeId: string;
    employeeName: string;
    firstName: string;
    lastName: string;
    gender: 'Male' | 'Female' | 'Other';
    dateOfBirth: string;
    mobileNumber: string;
    emailId: string;
    profilePhoto?: string;
    maritalStatus?: 'Single' | 'Married';
    bloodGroup?: string;
    nationality?: string;
}

export interface EmployeeDetailsResponse {
    success: boolean;
    data?: EmployeeDetails;
    message?: string;
}

export interface EmployeeListResponse {
    success: boolean;
    data?: EmployeeDetails[];
    message?: string;
}
