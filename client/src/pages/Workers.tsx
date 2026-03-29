import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkers } from "@/hooks/useIntegrations";

export default function Workers() {
  const { workers, workersLoading, refetch } = useWorkers();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloudflare Workers</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and control your active Workers, view logs, and check status.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={workersLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${workersLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Active Workers ({workers.length})
            </CardTitle>
            <CardDescription>List of deployed Workers and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workersLoading ? (
                <div className="text-sm text-muted-foreground text-center py-8">Loading Workers...</div>
              ) : workers.length > 0 ? (
                workers.map((worker: any) => (
                  <div key={worker.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.id}</p>
                    </div>
                    <Badge variant="outline">{worker.status || "unknown"}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No Workers found</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Worker Logs</CardTitle>
            <CardDescription>Recent logs from your Workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground text-center py-12">
                No logs available. Deploy a Worker to see logs here.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
