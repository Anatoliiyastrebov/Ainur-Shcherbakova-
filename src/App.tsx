import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AdminProvider } from "@/context/AdminContext";
import { ContentProvider } from "@/context/ContentContext";
import { AdminSaveBar } from "@/components/AdminSaveBar";
import Index from "./pages/Index";
import Anketa from "./pages/Anketa";
import Success from "./pages/Success";
import NotFound from "./pages/NotFound";
import Impressum from "./pages/Impressum";
import QuestionnaireView from "./pages/QuestionnaireView";
import DataRequest from "./pages/DataRequest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner position="top-center" />
      <BrowserRouter>
        <LanguageProvider>
          <AdminProvider>
            <ContentProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/anketa" element={<Anketa />} />
                <Route path="/success" element={<Success />} />
                <Route path="/questionnaire/:id" element={<QuestionnaireView />} />
                <Route path="/data-request" element={<DataRequest />} />
                <Route path="/impressum" element={<Impressum />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <AdminSaveBar />
            </ContentProvider>
          </AdminProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
