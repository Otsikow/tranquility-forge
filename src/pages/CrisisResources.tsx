import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Phone, Globe, MessageSquare, AlertCircle, ExternalLink } from "lucide-react";
import { CrisisResource } from "@/types/db";

export default function CrisisResources() {
  const { toast } = useToast();
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCountry, setUserCountry] = useState("US");

  useEffect(() => {
    loadResources();
    detectUserCountry();
  }, []);

  const detectUserCountry = () => {
    // Try to detect user's country - in a real app, use geolocation API or IP-based service
    // For now, default to US
    setUserCountry("US");
  };

  const loadResources = async () => {
    try {
      const { data, error } = await supabase
        .from("crisis_resources")
        .select("*")
        .order("country_code");

      if (error) throw error;

      setResources(data || []);
    } catch (error) {
      console.error("Error loading crisis resources:", error);
      toast({
        title: "Error loading resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getCountryResources = (countryCode: string) => {
    return resources.filter((r) => r.country_code === countryCode);
  };

  const allCountries = [...new Set(resources.map((r) => r.country_code))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <AppBar title="Crisis Resources" />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Warning Card */}
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-destructive mb-2">
                    If you're in immediate danger
                  </h3>
                  <p className="text-sm text-destructive/90">
                    Please call your local emergency services (911 in US, 999 in UK, 000 in Australia) 
                    or go to your nearest emergency room immediately.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-destructive mb-2">
                    These resources are here to help
                  </h3>
                  <p className="text-sm text-destructive/90">
                    All services listed below provide free, confidential support. You are not alone, 
                    and reaching out for help is a sign of strength.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Country Resources */}
        {getCountryResources(userCountry).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Resources in Your Area
              <Badge>{userCountry}</Badge>
            </h2>
            {getCountryResources(userCountry).map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{resource.organization_name}</span>
                    {resource.available_24_7 && (
                      <Badge variant="secondary">24/7</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resource.description && (
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  )}

                  <div className="flex flex-col gap-2">
                    {resource.phone_number && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={`tel:${resource.phone_number.replace(/\s/g, "")}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          Call: {resource.phone_number}
                        </a>
                      </Button>
                    )}

                    {resource.website_url && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={resource.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visit Website
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      </Button>
                    )}

                    {resource.chat_url && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={resource.chat_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Start Chat
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* International Resources */}
        {allCountries.filter((c) => c !== userCountry).map((countryCode) => {
          const countryResources = getCountryResources(countryCode);
          if (countryResources.length === 0) return null;

          return (
            <div key={countryCode} className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                Resources in {countryCode}
              </h2>
              {countryResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{resource.organization_name}</span>
                      {resource.available_24_7 && (
                        <Badge variant="secondary">24/7</Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resource.description && (
                      <p className="text-sm text-muted-foreground">
                        {resource.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-2">
                      {resource.phone_number && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <a href={`tel:${resource.phone_number.replace(/\s/g, "")}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call: {resource.phone_number}
                          </a>
                        </Button>
                      )}

                      {resource.website_url && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <a
                            href={resource.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Visit Website
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        </Button>
                      )}

                      {resource.chat_url && (
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <a
                            href={resource.chat_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Start Chat
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}

        {/* Additional Help Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Other Ways to Get Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Talk to someone you trust:</strong> Reach out to a friend, family member, 
              teacher, or counselor about how you're feeling.
            </p>
            <p>
              <strong>Schedule an appointment:</strong> Contact a mental health professional, 
              therapist, or your primary care doctor.
            </p>
            <p>
              <strong>Use our CBT tools:</strong> Try evidence-based exercises that can help 
              you manage difficult thoughts and feelings.
            </p>
            <p>
              <strong>Join our community:</strong> Connect with others who understand what 
              you're going through in our support forums.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
