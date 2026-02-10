import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import UserDashboard from "@/components/dashboard/UserDashboard";
import JotshiDashboard from "@/components/jotshi/JotshiDashboard";

const Index = () => {
  const { isComplete, userData } = useOnboardingStore();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [checkingRole, setCheckingRole] = useState(true);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Check if user is admin and redirect
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }
      const { data } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (data === true) {
        navigate('/admin');
        return;
      }
      setCheckingRole(false);
    };
    if (!loading && user) {
      checkAdmin();
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth or role
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isComplete) {
    return <OnboardingFlow />;
  }

  if (userData.role === 'jotshi') {
    return <JotshiDashboard />;
  }

  return <UserDashboard />;
};

export default Index;
