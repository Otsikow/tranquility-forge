import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Moods from "./pages/Moods";
import Journal from "./pages/Journal";
import JournalNew from "./pages/JournalNew";
import JournalEdit from "./pages/JournalEdit";
import Affirmations from "./pages/Affirmations";
import Breathe from "./pages/Breathe";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ProfileSecurity from "./pages/settings/ProfileSecurity";
import Notifications from "./pages/settings/Notifications";
import Help from "./pages/settings/Help";
import About from "./pages/settings/About";
import Legal from "./pages/settings/Legal";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot" element={<ForgotPassword />} />
            <Route path="/auth/reset" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/moods" element={<Moods />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/new" element={<JournalNew />} />
            <Route path="/journal/:id" element={<JournalEdit />} />
            <Route path="/affirmations" element={<Affirmations />} />
            <Route path="/breathe" element={<Breathe />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/profile-security" element={<ProfileSecurity />} />
            <Route path="/settings/notifications" element={<Notifications />} />
            <Route path="/settings/help" element={<Help />} />
            <Route path="/settings/about" element={<About />} />
            <Route path="/settings/legal" element={<Legal />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
