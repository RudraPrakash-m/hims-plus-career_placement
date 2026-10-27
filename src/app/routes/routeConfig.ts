

export const routes = {
    login: { path: "/login", label: "Login", protected: false },
    dashboard: { path: "/dashboard", label: "Dashboard", protected: true },

    employeedetails: { path: "/employee-details", label: "Employee details", protected: true },
    employeeDetailsView: { path: "/employee-details-view", label: "Employee Details View", protected: true },
    ProductDetails: { path: "/Product-details", label: "Product Details ", protected: true },
    ProductDetailsView: { path: "/Product-details-view", label: "Product Details View", protected: true },
    ProductApprovalView: { path: "/Product-approval-view", label: "Product Approval View", protected: true },
    addStudent: { path: "/student-details", label: "Student Details", protected: true },
    addEmployee: { path: "/employee-management", label: "Employee Details", protected: true },
    editableEmployeeList: { path: "/employee-editable", label: "Editable List", protected: true },
    addParent: { path: "/add-parent", label: "Parent Details", protected: true },
    AddDoctorDetails: { path: "/add-parents", label: "Parent Detailsss", protected: true },


    // Employee / Employer Registration and Management
    employeeRegistration: { path: "/employer-registration-profile", label: "Employer Registration Profile", protected: true },
    employerRegistration: { path: "/employer-registration", label: "Employer Registration", protected: true },
    registrationView: { path: "/registration-view", label: "Registration View", protected: true },

    studentEmployability: { path: "/student-employability-profile", label: "Student Employability Profile", protected: true },
    viewStudentEmployability: { path: "/view-student-employability", label: "View Student Employability", protected: true },
    carrierPreference: { path: "/carrier-preference", label: "Carrier Preference", protected: true },
    viewCarrierPreference: { path: "/view-carrier-preference", label: "View Carrier Preference", protected: true },
    carrierCounselling: { path: "/carrier-counselling", label: "Carrier Counselling", protected: true },
    carrierCounsellingView: { path: "/carrier-counselling-view", label: "Carrier Counselling View", protected: true },

    aptitude: { path: "/aptitude", label: "Aptitude", protected: true },
    aptitudeView: { path: "/aptitude-view", label: "Aptitude View", protected: true },
    addJob: { path: "/add-job", label: "Add Job", protected: true },
    viewJob: { path: "/view-job", label: "View Job", protected: true },

    placementDrive: { path: "/placement-drive", label: "Placement Drive", protected: true },
    placementDriveView: { path: "/placement-drive-view", label: "Placement Drive View", protected: true },

    studentApplication: { path: "/student-application", label: "Student Application", protected: true },
    studentApplicationView: { path: "/student-application-view", label: "Student Application View", protected: true },

    shortListing: { path: "/short-listing", label: "Short Listing", protected: true },
    shortlistingView: { path: "/shortlisting-view", label: "Shortlisting View", protected: true },
    campusPlacement: { path: "/campus-placement", label: "Campus Placement", protected: true },
    campusPlacementView: { path: "/campus-placement-view", label: "Campus Placement View", protected: true },

    offCampusPlacement: { path: "/off-campus-placement", label: "Off-campus Placement", protected: true },
    offCampusPlacementView: { path: "/off-campus-placement-view", label: "Off-campus Placement View", protected: true },

    trainingInternship: { path: "/training-internship", label: "Training & Internship", protected: true },
    trainingInternshipView: { path: "/training-internship-view", label: "View Programmes", protected: true },

    alumniEngagement: { path: "/alumni-engagement", label: "Alumni Engagement", protected: true },
    alumniEngagementView: { path: "/alumni-engagement-view", label: "View Alumni Engagements", protected: true },

    notificationCommunication: { path: "/notifications-communication", label: "Notifications & Communication", protected: true },
    notificationCommunicationView: { path: "/notifications-communication-view", label: "View Notifications", protected: true },

    placementOutcomesFeedback: { path: "/placement-outcomes-feedback", label: "Placement Outcomes & Feedback", protected: true },
    placementOutcomesFeedbackView: { path: "/placement-outcomes-feedback-view", label: "View Placement Outcomes", protected: true },
    dashboardAnalytics: { path: "/dashboard-analytics", label: "Dashboard Analytics", protected: true },
    viewDashboard: { path: "/view-dashboard", label: "View Dashboard", protected: true },
    integrationHimsModules: { path: "/integration-hims-modules", label: "Integration with HIMS Modules", protected: true },
    viewIntegrationHimsModules: { path: "/integration-hims-modules-view", label: "View HIMS Integrations", protected: true },
};
