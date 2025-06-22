import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';

export default function EmployeeDashboardPage() {
  return (
    <ProtectedRoute>
      <EmployeeDashboard />
    </ProtectedRoute>
  );
}
