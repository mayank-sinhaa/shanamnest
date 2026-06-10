import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Grievances from "../pages/admin/Grievances";
import GrievanceDetail from "../pages/admin/GrievanceDetail";
import Members from "../pages/admin/Members";
import Reports from "../pages/admin/Reports";
import ContactMessages from "../pages/admin/ContactMessages";
import LiveChats from "../pages/admin/LiveChats";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="grievances" element={<Grievances />} />
        <Route path="grievances/:id" element={<GrievanceDetail />} />
        <Route path="members" element={<Members />} />
        <Route path="contact-messages" element={<ContactMessages />} />
        <Route path="live-chats" element={<LiveChats />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}