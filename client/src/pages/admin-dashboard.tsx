import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute requireRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
