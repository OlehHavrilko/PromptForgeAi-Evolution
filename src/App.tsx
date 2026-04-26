import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SavedPrompts from "./pages/SavedPrompts";
import Settings from "./pages/Settings";
import Templates from "./pages/Templates";
import MyTemplates from "./pages/MyTemplates";
import Promo from "./pages/Promo";
import History from "./pages/History";
import PromptChat from "./pages/PromptChat";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import ImageAnalyzerPage from "./pages/ImageAnalyzerPage";
import TextToolsPage from "./pages/TextToolsPage";
import Observability from "./pages/Observability";
import AdminPrompts from "./pages/AdminPrompts";
import AdminEvals from "./pages/AdminEvals";
import AdminApiKeys from "./pages/AdminApiKeys";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public pages — no sidebar */}
              <Route path="/" element={<Promo />} />
              <Route path="/auth" element={<Auth />} />

              {/* App pages — with sidebar */}
              <Route path="/app" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/app/images" element={<AppLayout><ImageAnalyzerPage /></AppLayout>} />
              <Route path="/app/text-tools" element={<AppLayout><TextToolsPage /></AppLayout>} />
              <Route path="/chat" element={<AppLayout><PromptChat /></AppLayout>} />
              <Route path="/prompts" element={<AppLayout><SavedPrompts /></AppLayout>} />
              <Route path="/templates" element={<AppLayout><Templates /></AppLayout>} />
              <Route path="/my-templates" element={<AppLayout><MyTemplates /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="/history" element={<AppLayout><History /></AppLayout>} />
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/marketplace" element={<AppLayout><Marketplace /></AppLayout>} />
              <Route path="/admin/observability" element={<AppLayout><Observability /></AppLayout>} />
              <Route path="/admin/prompts" element={<AppLayout><AdminPrompts /></AppLayout>} />
              <Route path="/admin/evals" element={<AppLayout><AdminEvals /></AppLayout>} />
              <Route path="/admin/api-keys" element={<AppLayout><AdminApiKeys /></AppLayout>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
