import { useState, useEffect } from "react";
import { Download, Trash2, HardDrive, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  getDownloadedMeditations,
  deleteMeditationOffline,
  getStorageStats,
  clearAllOfflineData,
  checkStorageQuota,
} from "@/lib/offlineStorage";

export const DownloadManager = () => {
  const [downloads, setDownloads] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [quota, setQuota] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [downloadedMeditations, storageStats, quotaInfo] = await Promise.all([
        getDownloadedMeditations(),
        getStorageStats(),
        checkStorageQuota(),
      ]);

      setDownloads(downloadedMeditations);
      setStats(storageStats);
      setQuota(quotaInfo);
    } catch (error) {
      console.error('Failed to load download data:', error);
      toast.error("Failed to load downloads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteMeditationOffline(id);
      toast.success(`Deleted: ${title}`);
      await loadData();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Delete all offline data? This cannot be undone.')) {
      return;
    }

    try {
      await clearAllOfflineData();
      toast.success("All offline data cleared");
      await loadData();
    } catch (error) {
      console.error('Clear failed:', error);
      toast.error("Failed to clear data");
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Offline Storage</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const isNearQuota = stats?.total.percentUsed > 80;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Overview
          </CardTitle>
          <CardDescription>
            Manage your offline downloads and cached data
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Total storage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Total Storage</span>
              <span className="text-sm text-muted-foreground">
                {formatSize(stats?.total.size || 0)} / {formatSize(stats?.total.quota || 0)}
              </span>
            </div>
            <Progress value={stats?.total.percentUsed || 0} />
            {isNearQuota && (
              <Alert className="mt-3" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Storage nearly full. Delete downloads to free space.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Browser quota (if available) */}
          {quota && (
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Browser Storage</span>
                <span className="text-sm text-muted-foreground">
                  {formatSize(quota.usage)} / {formatSize(quota.quota)}
                </span>
              </div>
              <Progress value={quota.percentUsed} />
            </div>
          )}

          {/* Stats breakdown */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.meditations.count || 0}</div>
              <div className="text-xs text-muted-foreground">Meditations</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatSize(stats?.meditations.size || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.journals.count || 0}</div>
              <div className="text-xs text-muted-foreground">Journals</div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatSize(stats?.journals.size || 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats?.moods.count || 0}</div>
              <div className="text-xs text-muted-foreground">Moods</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Downloaded meditations */}
      {downloads.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Downloaded Meditations</CardTitle>
                <CardDescription>Available for offline playback</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {downloads.map((meditation) => (
                <div
                  key={meditation.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="font-medium truncate">{meditation.title}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatSize(meditation.size)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Downloaded {formatDate(meditation.downloaded_at)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(meditation.id, meditation.title)}
                    className="flex-shrink-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {downloads.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              <Download className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No offline downloads yet</p>
              <p className="text-sm mt-1">Download meditations for offline playback</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
