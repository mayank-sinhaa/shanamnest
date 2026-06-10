import { Routes, Route } from "react-router-dom";
import MemberLayout from "../layouts/MemberLayout";
import Dashboard from "../pages/member/Dashboard";
import SubmitGrievance from "../pages/member/SubmitGrievance";
import MyGrievances from "../pages/member/MyGrievances";
import GrievanceDetails from "../pages/member/GrievanceDetails";
import Profile from "../pages/member/Profile";

export default function MemberRoutes() {
  return (
    <Routes>
      <Route element={<MemberLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="submit-grievance" element={<SubmitGrievance />} />
        <Route path="my-grievances" element={<MyGrievances />} />
        <Route path="my-grievances/:id" element={<GrievanceDetails />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}