
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Quiz from "./components/Quiz";
import QuizResults from "./components/QuizResults";
import CareerDetails from "./components/CareerDetails";
import CareerSearch from "./components/CareerSearch";
import CollegesScholarships from "./components/CollegesScholarships";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/quiz-results" element={<QuizResults />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/career-search" element={<CareerSearch />} />
          <Route path="/career/:careerSlug" element={<CareerDetails />} />
          <Route path="/career/:careerSlug/colleges-scholarships" element={<CollegesScholarships />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
