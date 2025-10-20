import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeNotificationScheduler } from "./lib/notifications";

// Initialize notification scheduler on app load
initializeNotificationScheduler();

createRoot(document.getElementById("root")!).render(<App />);
