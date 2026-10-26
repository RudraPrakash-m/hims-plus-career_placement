
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { routes } from "./routeConfig";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "@/shared/components/layout/AuthLayout";
import MainLayout from "@/shared/components/layout/MainLayout";
import PublicRoute from "./PublicRoute";

import RegistrationView from "@/features/employee-registartion/pages/RegistrationView";
import StudentEmployability from "@/features/student-employability-profile/pages/StudentEmployability";
import ViewstudentEmployability from "@/features/student-employability-profile/pages/ViewstudentEmployability";
import CarrierPreference from "@/features/carrier-preference/pages/CarrierPreference";
import ViewcarrierPreference from "@/features/carrier-preference/pages/viewcarrierPreference";
import CarrierCounselling from "@/features/carrier-counselling/pages/CarrierCounselling";
import CarriercounsellingView from "@/features/carrier-counselling/pages/carriercounsellingView";
import Aptitude from "@/features/aptitude/pages/Aptitude";
import AptitudeView from "@/features/aptitude/pages/AptitudeView";
import AddJob from "@/features/job-internship/pages/AddJob";
import ViewJob from "@/features/job-internship/pages/ViewJob";
import PlacementDrive from "@/features/placement-drive/pages/PlacementDrive";
import PlacementdriveView from "@/features/placement-drive/pages/PlacementdriveView";
import StudentApplication from "@/features/student-application/pages/StudentApplication";
import StudentapplicationView from "@/features/student-application/pages/StudentapplicationView";
import ShortListing from "@/features/shortlisting/pages/ShortListing";
import ShortlistingView from "@/features/shortlisting/pages/ShortlistingView";
import CampusPlacement from "@/features/campus-placement/pages/CampusPlacement";
import CampusplacementView from "@/features/campus-placement/pages/CampusplacementView";
import OffCampusPlacement from "@/features/off-campus-placement-workflow/pages/OffCampusPlacement";
import OffCampusPlacementView from "@/features/off-campus-placement-workflow/pages/OffCampusPlacementView";
import InternshipTraining from "@/features/internship-training-skill-enhancement/pages/InternshipTraining";
import InternshipTrainingView from "@/features/internship-training-skill-enhancement/pages/InternshipTrainingView";
import AlumniEngagement from "@/features/alumni-engagement-referrals/pages/AlumniEngagement";
import AlumniEngagementView from "@/features/alumni-engagement-referrals/pages/AlumniEngagementView";
import NotificationCommunication from "@/features/notifications-communication/pages/NotificationCommunication";
import NotificationCommunicationView from "@/features/notifications-communication/pages/NotificationCommunicationView";
import PlacementOutcomesFeedback from "@/features/placement-outcomes-employer-feedback/pages/PlacementOutcomesFeedback";
import PlacementOutcomesFeedbackView from "@/features/placement-outcomes-employer-feedback/pages/PlacementOutcomesFeedbackView";
import DashboardAnalytics from "@/features/dashboard-analytics/pages/DashboardAnalytics";
import ViewDashBoard from "@/features/dashboard-analytics/pages/ViewDashBoard";
import IntegrationHimsModules from "@/features/integration-with-hims-modules/pages/IntegrationHimsModules";
import IntegrationHimsModulesView from "@/features/integration-with-hims-modules/pages/IntegrationHimsModulesView";

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
                        <Route path={routes.employeeRegistration.path} element={<StudentEmployability />} />
                        <Route path={routes.employerRegistration.path} element={<StudentEmployability />} />
                        <Route path="/my-employability-profile" element={<Navigate to={routes.employeeRegistration.path} replace />} />
                        <Route path={routes.registrationView.path} element={<RegistrationView />} />

                      <Route path={routes.studentEmployability.path} element={<StudentEmployability />} />
                      <Route path="/student-employability" element={<Navigate to={routes.studentEmployability.path} replace />} />
                     <Route path={routes.viewStudentEmployability.path} element={<ViewstudentEmployability/>} />

                      <Route path={routes.carrierPreference.path} element={<CarrierPreference/>} />
                       <Route path={routes.viewCarrierPreference.path} element={<ViewcarrierPreference/>} />

                       <Route path={routes.carrierCounselling.path} element={<CarrierCounselling/>} />
                       <Route path={routes.carrierCounsellingView.path} element={<CarriercounsellingView/>} />

                       <Route path={routes.aptitude.path} element={<Aptitude/>} />
                       <Route path={routes.aptitudeView.path} element={<AptitudeView/>} />

                  <Route path={routes.addJob.path} element={<AddJob/>} />
                 <Route path={routes.viewJob.path} element={<ViewJob/>} />

                 <Route path={routes.placementDrive.path} element={<PlacementDrive/>} />
                <Route path={routes.placementDriveView.path} element={<PlacementdriveView/>} />

                <Route path={routes.studentApplication.path} element={<StudentApplication/>} />
                 <Route path={routes.studentApplicationView.path} element={<StudentapplicationView/>} />

                 <Route path={routes.shortListing.path} element={<ShortListing/>} />
               <Route path={routes.shortlistingView.path} element={<ShortlistingView/>} />

               <Route path={routes.campusPlacement.path} element={<CampusPlacement/>} />
               <Route path={routes.campusPlacementView.path} element={<CampusplacementView/>} />

               <Route path={routes.offCampusPlacement.path} element={<OffCampusPlacement/>} />
               <Route path={routes.offCampusPlacementView.path} element={<OffCampusPlacementView/>} />

               <Route path={routes.trainingInternship.path} element={<InternshipTraining/>} />
               <Route path={routes.trainingInternshipView.path} element={<InternshipTrainingView/>} />

               <Route path={routes.alumniEngagement.path} element={<AlumniEngagement/>} />
               <Route path={routes.alumniEngagementView.path} element={<AlumniEngagementView/>} />

               <Route path={routes.notificationCommunication.path} element={<NotificationCommunication/>} />
               <Route path={routes.notificationCommunicationView.path} element={<NotificationCommunicationView/>} />

               <Route path={routes.placementOutcomesFeedback.path} element={<PlacementOutcomesFeedback/>} />
               <Route path={routes.placementOutcomesFeedbackView.path} element={<PlacementOutcomesFeedbackView/>} />

                <Route path={routes.dashboardAnalytics.path} element={<DashboardAnalytics/>} />
                <Route path={routes.viewDashboard.path} element={<ViewDashBoard/>} />
                <Route path={routes.integrationHimsModules.path} element={<IntegrationHimsModules/>} />
                <Route path={routes.viewIntegrationHimsModules.path} element={<IntegrationHimsModulesView/>} />


                        
                    

                    </Route>
                </Route>

            </Routes>
        </Suspense>
    );
};

export default AppRoutes;

