import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/auth/AdminLogin";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Projects from "../pages/projects/Projects";
import ProjectWorkspace from "../pages/projects/ProjectWorkspace";
import Planning from "../pages/planning/Planning";
import Notes from "../pages/notes/Notes";
import Tasks from "../pages/tasks/Tasks";
import PagesPlanner from "../pages/pages/PagesPlanner";
import Features from "../pages/features/Features";
import Database from "../pages/database/Database";
import Design from "../pages/design/Design";
import Learning from "../pages/learning/Learning";
import Prompts from "../pages/prompts/Prompts";
import Settings from "../pages/settings/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />

      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectWorkspace />} />
          <Route path="planning" element={<Planning />} />
          <Route path="notes" element={<Notes />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="pages" element={<PagesPlanner />} />
          <Route path="features" element={<Features />} />
          <Route path="database" element={<Database />} />
          <Route path="design" element={<Design />} />
          <Route path="learning" element={<Learning />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
