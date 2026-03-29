import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleDrive } from "@/hooks/useIntegrations";

export default function Google() {
  const { authUrl, files, filesLoading, filesError, refetch } = useGoogleDrive();
  const isAuthenticated = files.length > 0 || !filesError?.includes("Not authenticated");

  const handleGoogleSignIn = () => {
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Google Drive</h1>
          <p className="text-muted-foreground mt-2">
            Access your Google Drive files and folders through OAuth SSO.
          </p>
        </div>
        {isAuthenticated && (
          <Button
            onClick={handleRefresh}
            disabled={filesLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${filesLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      {filesError?.includes("Not authenticated") ? (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Authentication Required
            </CardTitle>
            <CardDescription>Sign in with your Google account to access Drive files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the button below to authorize Command Center to access your Google Drive.
              </p>
              <Button
                onClick={handleGoogleSignIn}
                disabled={filesLoading}
                className="w-full gap-2"
              >
                {filesLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                My Files
              </CardTitle>
              <CardDescription>Your Google Drive files and folders</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-3">
              {filesLoading ? (
                <div className="text-sm text-muted-foreground text-center py-8">Loading files...</div>
              ) : files.length > 0 ? (
                files.map((file: any) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.mimeType}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground text-center py-8">No files found</div>
              )}
            </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
