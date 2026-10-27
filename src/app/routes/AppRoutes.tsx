import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import EmployeeRegistration from "@/features/employee-registartion/pages/EmployeeRegistration";
import { routes } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "@/shared/components/layout/AuthLayout";
import MainLayout from "@/shared/components/layout/MainLayout";
import PublicRoute from "./PublicRoute";

import StudentEmployability from "@/features/student-employability-profile/pages/StudentEmployability";
import CarrierPreference from "@/features/carrier-preference/pages/CarrierPreference";
import CarrierCounselling from "@/features/carrier-counselling/pages/CarrierCounselling";
import Aptitude from "@/features/aptitude/pages/Aptitude";
import AddJob from "@/features/job-internship/pages/AddJob";
import PlacementDrive from "@/features/placement-drive/pages/PlacementDrive";
import StudentApplication from "@/features/student-application/pages/StudentApplication";
import ShortListing from "@/features/shortlisting/pages/ShortListing";
import CampusPlacement from "@/features/campus-placement/pages/CampusPlacement";
import OffCampusPlacement from "@/features/off-campus-placement-workflow/pages/OffCampusPlacement";
import InternshipTraining from "@/features/internship-training-skill-enhancement/pages/InternshipTraining";
import AlumniEngagement from "@/features/alumni-engagement-referrals/pages/AlumniEngagement";
import NotificationCommunication from "@/features/notifications-communication/pages/NotificationCommunication";
import PlacementOutcomesFeedback from "@/features/placement-outcomes-employer-feedback/pages/PlacementOutcomesFeedback";
import DashboardAnalytics from "@/features/dashboard-analytics/pages/DashboardAnalytics";
import IntegrationHimsModules from "@/features/integration-with-hims-modules/pages/IntegrationHimsModules";

const Login = lazy(() => import("@/features/auth/pages/Login"));
const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const EmployeeDetails = lazy(() => import("@/features/employee-details/pages/EmployeeDetails"));
const EmployeeDetailsView = lazy(() => import("@/features/employee-details/pages/EmployeeDetailsView"));
const AddProduct = lazy(() => import("@/features/Product-details/pages/AddProduct"));
const ProductView = lazy(() => import("@/features/Product-details/pages/ProductView"));
const ProductTabs = lazy(() => import("@/features/Product-details/pages/ProductTabs"));
const AddStudentDetails = lazy(() => import("@/features/student-details/pages/AddStudentDetails"));
const EmployeeManagementDetails = lazy(() => import("@/features/employee-details/pages/EmployeeManagementDetails"));
const EditableEmployeeTable = lazy(() => import("@/features/employee-details/pages/EditableEmployeeTable"));
const ParentForm = lazy(() => import("@/features/employee-details/pages/ParentForm"));
const AddDoctorDetails = lazy(() => import("@/features/doctor-details/pages/DoctorDetailsList"));

const AppRoutes = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthRedirect = (e: Event) => {
            const customEvent = e as CustomEvent<string>;
            navigate(customEvent.detail);
        };
        window.addEventListener("auth-redirect", handleAuthRedirect);
        return () => window.removeEventListener("auth-redirect", handleAuthRedirect);
    }, [navigate]);

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen bg-gray-100">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-full bg-gray-300 h-16 w-16 mb-4" />
                        <div className="h-4 bg-gray-300 rounded w-48 mb-4" />
                        <div className="h-4 bg-gray-300 rounded w-64 mb-4" />
                        <div className="h-4 bg-gray-300 rounded w-40" />
                    </div>
                </div>
            }
        >
            <Routes>
                <Route path="/" element={<Navigate to={routes.login.path} replace />} />

                <Route element={<PublicRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route path={routes.login.path} element={<Login />} />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route path={routes.dashboard.path} element={<Dashboard />} />
                        <Route path={routes.employeedetails.path} element={<EmployeeDetails />} />
                        <Route path={routes.employeeDetailsView.path} element={<EmployeeDetailsView />} />
                        <Route path={routes.ProductDetails.path} element={<AddProduct />} />
                        <Route path={routes.ProductDetailsView.path} element={<ProductView />} />
                        <Route path={routes.ProductApprovalView.path} element={<ProductTabs />} />
                        <Route path={routes.addStudent.path} element={<AddStudentDetails />} />
                        <Route path={routes.addEmployee.path} element={<EmployeeManagementDetails />} />
                        <Route path={routes.editableEmployeeList.path} element={<EditableEmployeeTable />} />
                        <Route path={routes.addParent.path} element={<ParentForm />} />
                        <Route path={routes.AddDoctorDetails.path} element={<AddDoctorDetails />} />

                        {/* Employee / Employer Registration and Management */}
                        <Route path={routes.employeeRegistration.path} element={<EmployeeRegistration />} />
                        <Route path={routes.employerRegistration.path} element={<EmployeeRegistration />} />
                        <Route path="/my-employability-profile" element={<EmployeeRegistration />} />
                        <Route path={routes.registrationView.path} element={<EmployeeRegistration />} />

                        {/* Student Employability Profile */}
                        <Route path={routes.studentEmployability.path} element={<StudentEmployability />} />
                        <Route path="/student-employability" element={<StudentEmployability />} />
                        <Route path={routes.viewStudentEmployability.path} element={<StudentEmployability />} />

                        {/* Career Preferences */}
                        <Route path={routes.carrierPreference.path} element={<CarrierPreference />} />
                        <Route path={routes.viewCarrierPreference.path} element={<CarrierPreference />} />

                        {/* Career Counselling */}
                        <Route path={routes.carrierCounselling.path} element={<CarrierCounselling />} />
                        <Route path={routes.carrierCounsellingView.path} element={<CarrierCounselling />} />

                        {/* Aptitude Assessment */}
                        <Route path={routes.aptitude.path} element={<Aptitude />} />
                        <Route path={routes.aptitudeView.path} element={<Aptitude />} />

                        {/* Job / Opportunity Management */}
                        <Route path={routes.addJob.path} element={<AddJob />} />
                        <Route path={routes.viewJob.path} element={<AddJob />} />

                        {/* Placement Drive Management */}
                        <Route path={routes.placementDrive.path} element={<PlacementDrive />} />
                        <Route path={routes.placementDriveView.path} element={<PlacementDrive />} />

                        {/* Student Applications */}
                        <Route path={routes.studentApplication.path} element={<StudentApplication />} />
                        <Route path={routes.studentApplicationView.path} element={<StudentApplication />} />

                        {/* Shortlisting */}
                        <Route path={routes.shortListing.path} element={<ShortListing />} />
                        <Route path={routes.shortlistingView.path} element={<ShortListing />} />

                        {/* Campus Placement */}
                        <Route path={routes.campusPlacement.path} element={<CampusPlacement />} />
                        <Route path={routes.campusPlacementView.path} element={<CampusPlacement />} />

                        {/* Off-Campus Placement */}
                        <Route path={routes.offCampusPlacement.path} element={<OffCampusPlacement />} />
                        <Route path={routes.offCampusPlacementView.path} element={<OffCampusPlacement />} />

                        {/* Internship & Training */}
                        <Route path={routes.trainingInternship.path} element={<InternshipTraining />} />
                        <Route path={routes.trainingInternshipView.path} element={<InternshipTraining />} />

                        {/* Alumni Engagement */}
                        <Route path={routes.alumniEngagement.path} element={<AlumniEngagement />} />
                        <Route path={routes.alumniEngagementView.path} element={<AlumniEngagement />} />

                        {/* Notification & Communication */}
                        <Route path={routes.notificationCommunication.path} element={<NotificationCommunication />} />
                        <Route path={routes.notificationCommunicationView.path} element={<NotificationCommunication />} />

                        {/* Placement Outcomes & Feedback */}
                        <Route path={routes.placementOutcomesFeedback.path} element={<PlacementOutcomesFeedback />} />
                        <Route path={routes.placementOutcomesFeedbackView.path} element={<PlacementOutcomesFeedback />} />

                        {/* Dashboard & Analytics */}
                        <Route path={routes.dashboardAnalytics.path} element={<DashboardAnalytics />} />
                        <Route path={routes.viewDashboard.path} element={<DashboardAnalytics />} />

                        {/* Integration with HIMS Modules */}
                        <Route path={routes.integrationHimsModules.path} element={<IntegrationHimsModules />} />
                        <Route path={routes.viewIntegrationHimsModules.path} element={<IntegrationHimsModules />} />
                    </Route>
                </Route>

            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
