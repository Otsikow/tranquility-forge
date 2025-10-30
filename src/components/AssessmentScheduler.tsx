import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AssessmentType } from "@/lib/assessmentService";

interface AssessmentSchedule {
  id: string;
  assessmentType: AssessmentType;
  frequency: "daily" | "weekly" | "biweekly" | "monthly";
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  enabled: boolean;
  nextScheduledDate: Date;
}

const assessmentNames = {
  phq9: "PHQ-9 Depression",
  gad7: "GAD-7 Anxiety",
  pss10: "PSS-10 Stress",
  sleep_hygiene: "Sleep Hygiene",
};

const frequencyLabels = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
};

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AssessmentScheduler() {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<AssessmentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load schedules from localStorage on mount
  useEffect(() => {
    const loadSchedules = () => {
      try {
        const saved = localStorage.getItem("assessment_schedules");
        if (saved) {
          const parsed = JSON.parse(saved);
          setSchedules(
            parsed.map((s: any) => ({
              ...s,
              nextScheduledDate: new Date(s.nextScheduledDate),
            }))
          );
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedules();
  }, []);

  // Save schedules to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("assessment_schedules", JSON.stringify(schedules));
    }
  }, [schedules, isLoading]);

  const calculateNextDate = (
    frequency: AssessmentSchedule["frequency"],
    time: string,
    dayOfWeek?: number,
    dayOfMonth?: number
  ): Date => {
    const now = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    const nextDate = new Date();
    nextDate.setHours(hours, minutes, 0, 0);

    switch (frequency) {
      case "daily":
        if (nextDate <= now) {
          nextDate.setDate(nextDate.getDate() + 1);
        }
        break;

      case "weekly":
        if (dayOfWeek !== undefined) {
          nextDate.setDate(nextDate.getDate() + ((dayOfWeek - nextDate.getDay() + 7) % 7));
          if (nextDate <= now) {
            nextDate.setDate(nextDate.getDate() + 7);
          }
        }
        break;

      case "biweekly":
        if (dayOfWeek !== undefined) {
          nextDate.setDate(nextDate.getDate() + ((dayOfWeek - nextDate.getDay() + 7) % 7));
          if (nextDate <= now) {
            nextDate.setDate(nextDate.getDate() + 14);
          }
        }
        break;

      case "monthly":
        if (dayOfMonth) {
          nextDate.setDate(dayOfMonth);
          if (nextDate <= now) {
            nextDate.setMonth(nextDate.getMonth() + 1);
          }
        }
        break;
    }

    return nextDate;
  };

  const addSchedule = (assessmentType: AssessmentType) => {
    const newSchedule: AssessmentSchedule = {
      id: Date.now().toString(),
      assessmentType,
      frequency: "weekly",
      dayOfWeek: 1, // Monday
      time: "09:00",
      enabled: true,
      nextScheduledDate: calculateNextDate("weekly", "09:00", 1),
    };

    setSchedules([...schedules, newSchedule]);
    toast({
      title: "Schedule Added",
      description: `${assessmentNames[assessmentType]} assessment scheduled`,
    });
  };

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    toast({
      title: "Schedule Removed",
      description: "Assessment schedule has been removed",
    });
  };

  const toggleSchedule = (id: string) => {
    setSchedules(
      schedules.map((s) =>
        s.id === id
          ? {
              ...s,
              enabled: !s.enabled,
            }
          : s
      )
    );
  };

  const updateSchedule = (
    id: string,
    updates: Partial<Omit<AssessmentSchedule, "id" | "nextScheduledDate">>
  ) => {
    setSchedules(
      schedules.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          updated.nextScheduledDate = calculateNextDate(
            updated.frequency,
            updated.time,
            updated.dayOfWeek,
            updated.dayOfMonth
          );
          return updated;
        }
        return s;
      })
    );
  };

  const availableAssessments: AssessmentType[] = ["phq9", "gad7", "pss10", "sleep_hygiene"];
  const scheduledTypes = new Set(schedules.map((s) => s.assessmentType));
  const unscheduledAssessments = availableAssessments.filter((type) => !scheduledTypes.has(type));

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading schedules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Bell className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Assessment Reminders</h3>
              <p className="text-sm text-blue-800">
                Schedule regular assessments to track your progress over time. You'll receive
                browser notifications when it's time to complete an assessment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Schedules */}
      {schedules.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Schedules</h3>
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{assessmentNames[schedule.assessmentType]}</h4>
                      <p className="text-sm text-muted-foreground">
                        Next: {schedule.nextScheduledDate.toLocaleDateString()} at {schedule.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => toggleSchedule(schedule.id)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={schedule.frequency}
                        onValueChange={(value: AssessmentSchedule["frequency"]) =>
                          updateSchedule(schedule.id, { frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(frequencyLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {(schedule.frequency === "weekly" || schedule.frequency === "biweekly") && (
                      <div className="space-y-2">
                        <Label>Day of Week</Label>
                        <Select
                          value={schedule.dayOfWeek?.toString()}
                          onValueChange={(value) =>
                            updateSchedule(schedule.id, { dayOfWeek: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {dayNames.map((day, index) => (
                              <SelectItem key={index} value={index.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {schedule.frequency === "monthly" && (
                      <div className="space-y-2">
                        <Label>Day of Month</Label>
                        <Select
                          value={schedule.dayOfMonth?.toString()}
                          onValueChange={(value) =>
                            updateSchedule(schedule.id, { dayOfMonth: parseInt(value) })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Time</Label>
                      <input
                        type="time"
                        value={schedule.time}
                        onChange={(e) => updateSchedule(schedule.id, { time: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Schedule */}
      {unscheduledAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Assessment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {unscheduledAssessments.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  className="justify-start"
                  onClick={() => addSchedule(type)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {assessmentNames[type]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {schedules.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schedules Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first assessment schedule to receive regular reminders.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
