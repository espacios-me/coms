import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Zap, Github, FolderOpen, MessageSquare } from "lucide-react";

export default function Overview() {
  const stats = [
    { label: "Active Workers", value: "—", icon: Zap, color: "text-primary" },
    { label: "GitHub Repos", value: "—", icon: Github, color: "text-blue-600" },
    { label: "Drive Files", value: "—", icon: FolderOpen, color: "text-yellow-600" },
    { label: "Chat Sessions", value: "—", icon: MessageSquare, color: "text-green-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor and manage your Cloudflare Workers, GitHub repositories, Google Drive, and AI chat sessions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across all integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                No recent activity yet. Start by connecting your integrations.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                View Workers Status
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-accent transition-colors">
                Fetch GitHub Data
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-accent transition-colors">
                Connect Google Drive
              </button>
              <button className="w-full px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-accent transition-colors">
                Start AI Chat
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
