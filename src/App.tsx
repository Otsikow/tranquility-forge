import { CommandPalette } from "@/components/CommandPalette";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { usePWA } from "@/hooks/usePWA";
import { lazy, Suspense } from "react";

// Eager load critical routes
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/Dashboard";

// Lazy load for optimization
const Wellness = lazy(() => import("./pages/Wellness"));
const Chat = lazy(() => import("./pages/EnhancedChat"));
const Moods = lazy(() => import("./pages/Moods"));
const Journal = lazy(() => import("./pages/Journal"));
const JournalNew = lazy(() => import("./pages/JournalNew"));
const JournalEdit = lazy(() => import("./pages/JournalEdit"));
const Meditations = lazy(() => import("./pages/Meditations"));
const MeditationPlayer = lazy(() => import("./pages/MeditationPlayer"));
const Affirmations = lazy(() => import("./pages/Affirmations"));
const Breathe = lazy(() => import("./pages/Breathe"));

// Phase Two Feature Pages
const Community = lazy(() => import("./pages/Community"));
const ForumPost = lazy(() => import("./pages/ForumPost"));
const NewForumPost = lazy(() => import("./pages/NewForumPost"));
const CBTTools = lazy(() => import("./pages/CBTTools"));
const Sleep = lazy(() => import("./pages/Sleep"));
const Assessments = lazy(() => import("./pages/Assessments"));

// Settings & Admin Pages
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Subscription = lazy(() => import("./pages/Subscription"));
const NotificationSettings = lazy(() => import("./pages/NotificationSettings"));
const ProfileSecurity = lazy(() => import("./pages/settings/ProfileSecurity"));
const Notifications = lazy(() => import("./pages/settings/Notifications"));
const Help = lazy(() => import("./pages/settings/Help"));
const About = lazy(() => import("./pages/settings/About"));
const Legal = lazy(() => import("./pages/settings/Legal"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  usePWA();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CommandPalette />
            <PWAInstallPrompt />
            <PWAUpdatePrompt />
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }
            >
              <Routes>
                {/* Core */}
                <Route path="/" element={<Index />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot" element={<ForgotPassword />} />
                <Route path="/auth/reset" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Main Features */}
                <Route path="/wellness" element={<Wellness />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/moods" element={<Moods />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/journal/new" element={<JournalNew />} />
                <Route path="/journal/:id" element={<JournalEdit />} />
                <Route path="/meditations" element={<Meditations />} />
                <Route path="/meditations/:id" element={<MeditationPlayer />} />
                <Route path="/affirmations" element={<Affirmations />} />
                <Route path="/breathe" element={<Breathe />} />

                {/* Phase Two Features */}
                <Route path="/community" element={<Community />} />
                <Route path="/community/post/:id" element={<ForumPost />} />
                <Route path="/community/new-post" element={<NewForumPost />} />
                <Route path="/cbt" element={<CBTTools />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/assessments" element={<Assessments />} />

                {/* Settings & Admin */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/settings/profile-security" element={<ProfileSecurity />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="/settings/help" element={<Help />} />
                <Route path="/settings/about" element={<About />} />
                <Route path="/settings/legal" element={<Legal />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
