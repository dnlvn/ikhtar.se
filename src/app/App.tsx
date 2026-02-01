import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import { SupabaseSetupGuide } from "@/app/components/SupabaseSetupGuide";
import { EnvErrorBoundary } from "@/app/components/EnvErrorBoundary";
import { hasSupabaseCredentials } from "@/lib/supabase";
import { router } from "@/app/routes";
import { useEffect } from "react";

export default function App() {
  // Set document language and direction for RTL
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  // Check for environment variables first
  if (!hasSupabaseCredentials) {
    return <EnvErrorBoundary />;
  }

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}