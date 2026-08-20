import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  );
}
