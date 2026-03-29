import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, RefreshCw, GitPullRequest, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGitHub } from "@/hooks/useIntegrations";

export default function GitHub() {
  const { repos, issues, prs, loading, refetch } = useGitHub();

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GitHub</h1>
          <p className="text-muted-foreground mt-2">
            View your organization repositories, issues, and pull requests.
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repos.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{issues.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Open PRs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prs.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5 text-primary" />
              Repositories
            </CardTitle>
            <CardDescription>Your organization repositories (read-only)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-12">
              Loading repositories... (API integration in progress)
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5 text-primary" />
              Recent Pull Requests
            </CardTitle>
            <CardDescription>Latest PRs across your repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-12">
              No PRs found. Check back later.
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Recent Issues
            </CardTitle>
            <CardDescription>Latest issues across your repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-12">
              No issues found. Check back later.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
