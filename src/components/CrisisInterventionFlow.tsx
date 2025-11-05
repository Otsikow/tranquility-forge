import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Phone,
  MessageSquare,
  Heart,
  Shield,
  ExternalLink,
  CheckCircle,
  X,
} from "lucide-react";

interface CrisisInterventionFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessmentType: string;
  score: number;
  severity: string;
}

const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    description: "24/7 free and confidential support",
    phone: "988",
    type: "call",
    icon: Phone,
  },
  {
    name: "Crisis Text Line",
    description: "Text HOME to connect with a counselor",
    phone: "741741",
    type: "text",
    icon: MessageSquare,
  },
  {
    name: "Emergency Services",
    description: "For immediate life-threatening emergencies",
    phone: "911",
    type: "call",
    icon: AlertTriangle,
  },
  {
    name: "Veterans Crisis Line",
    description: "Support for veterans and their families",
    phone: "988 (Press 1)",
    type: "call",
    icon: Shield,
  },
];

const safetyPlanSteps = [
  {
    title: "Warning Signs",
    description: "Recognize thoughts, feelings, or behaviors that signal a crisis",
    examples: ["Feeling hopeless", "Intense emotional pain", "Thoughts of suicide"],
  },
  {
    title: "Internal Coping Strategies",
    description: "Activities you can do on your own",
    examples: ["Deep breathing", "Taking a walk", "Listening to calming music"],
  },
  {
    title: "People for Distraction",
    description: "Social contacts who can help take your mind off problems",
    examples: ["Close friends", "Family members", "Support group members"],
  },
  {
    title: "People for Help",
    description: "Trusted individuals who can help during a crisis",
    examples: ["Therapist", "Family member", "Close friend", "Crisis counselor"],
  },
  {
    title: "Professional Resources",
    description: "Mental health professionals and emergency contacts",
    examples: ["Therapist's number", "Crisis hotline", "Emergency room"],
  },
  {
    title: "Making Environment Safe",
    description: "Remove or secure items that could be used for self-harm",
    examples: ["Lock up medications", "Remove weapons", "Ask someone to hold items"],
  },
];

export default function CrisisInterventionFlow({
  open,
  onOpenChange,
  assessmentType,
  score,
  severity,
}: CrisisInterventionFlowProps) {
  const [step, setStep] = useState<"warning" | "resources" | "safety-plan" | "confirmation">(
    "warning"
  );
  const [acknowledgedWarning, setAcknowledgedWarning] = useState(false);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  const handleClose = () => {
    setStep("warning");
    setAcknowledgedWarning(false);
    setSelectedResources([]);
    onOpenChange(false);
  };

  const handleNext = () => {
    if (step === "warning" && acknowledgedWarning) {
      setStep("resources");
    } else if (step === "resources") {
      setStep("safety-plan");
    } else if (step === "safety-plan") {
      setStep("confirmation");
    }
  };

  const handleContactResource = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-6 w-6" />
            Crisis Support & Safety Resources
          </DialogTitle>
        </DialogHeader>

        {/* Warning Step */}
        {step === "warning" && (
          <div className="space-y-6">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-red-900 text-lg mb-2">
                        Your Assessment Results Require Immediate Attention
                      </h3>
                      <p className="text-red-800 mb-4">
                        Your {assessmentType.toUpperCase()} score of {score} indicates {severity}{" "}
                        symptoms. Your safety and well-being are our top priority.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <p className="font-semibold text-red-900">
                      If you are experiencing thoughts of suicide or self-harm:
                    </p>
                    <ul className="space-y-2 text-sm text-red-800">
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Call 988 (Suicide & Crisis Lifeline) immediately</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Text HOME to 741741 (Crisis Text Line)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>
                          Go to your nearest emergency room or call 911 if in immediate danger
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold">•</span>
                        <span>Reach out to a trusted friend, family member, or therapist</span>
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-white rounded-lg">
                    <Checkbox
                      id="acknowledge"
                      checked={acknowledgedWarning}
                      onCheckedChange={(checked) => setAcknowledgedWarning(checked === true)}
                    />
                    <Label htmlFor="acknowledge" className="text-sm cursor-pointer">
                      I understand the severity of my results and acknowledge that I should seek
                      professional help. I am not currently in immediate danger, but I want to learn
                      about available resources.
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleContactResource("988")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call 988 Now
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleNext}
                      disabled={!acknowledgedWarning}
                    >
                      View Resources
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resources Step */}
        {step === "resources" && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Crisis Support Resources</h3>
              <p className="text-muted-foreground">
                These resources are available 24/7 and provide free, confidential support
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crisisResources.map((resource) => {
                const Icon = resource.icon;
                return (
                  <Card key={resource.name} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleContactResource(resource.phone)}
                        >
                          {resource.type === "call" ? (
                            <>
                              <Phone className="h-4 w-4 mr-2" />
                              Call {resource.phone}
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Text {resource.phone}
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("warning")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Create Safety Plan
              </Button>
            </div>
          </div>
        )}

        {/* Safety Plan Step */}
        {step === "safety-plan" && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Safety Planning</h3>
              <p className="text-muted-foreground">
                A safety plan can help you get through a crisis. Here are the key components:
              </p>
            </div>

            <div className="space-y-4">
              {safetyPlanSteps.map((step, index) => (
                <Card key={step.title}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-start gap-3">
                        <Badge className="mt-1">{index + 1}</Badge>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {step.description}
                          </p>
                          <div className="bg-muted/50 rounded p-3">
                            <p className="text-xs font-semibold mb-1">Examples:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {step.examples.map((example, i) => (
                                <li key={i}>• {example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      We recommend creating your safety plan with a therapist
                    </h4>
                    <p className="text-sm text-blue-800">
                      A mental health professional can help you develop a personalized safety plan
                      tailored to your specific needs and circumstances.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("resources")} className="flex-1">
                Back
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {step === "confirmation" && (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">You've Taken an Important Step</h3>
              <p className="text-muted-foreground">
                Acknowledging that you need support is a sign of strength, not weakness.
              </p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-semibold">Recommended Next Steps:</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Contact a mental health professional or your primary care doctor
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Share your assessment results with a trusted healthcare provider
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Create a safety plan with professional guidance
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Keep crisis hotline numbers easily accessible
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Reach out to supportive friends and family members
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">You Are Not Alone</h4>
                    <p className="text-sm text-green-800">
                      Millions of people experience mental health challenges. With proper support
                      and treatment, recovery is possible. The crisis resources listed above are
                      available 24/7 whenever you need them.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
