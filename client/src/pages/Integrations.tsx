import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Github, Zap } from "lucide-react";
import { useGitHub, useGoogleDrive, useWorkers } from "@/hooks/useIntegrations";

export default function Integrations() {
  const { workers, workersLoading } = useWorkers();
  const { repos, loading } = useGitHub();
  const { files, filesLoading } = useGoogleDrive();

  const cards = [
    {
      label: "Workers",
      value: workersLoading ? "…" : workers.length,
      icon: Zap,
      detail: "Cloudflare runtime",
    },
    {
      label: "GitHub",
      value: loading ? "…" : repos.length,
      icon: Github,
      detail: "Repos + issues",
    },
    {
      label: "Google Drive",
      value: filesLoading ? "…" : files.length,
      icon: FolderOpen,
      detail: "Connected files",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground mt-2">Status surface for connected providers and sync health.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label} className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                {card.label}
                <card.icon className="h-4 w-4 text-primary" />
              </CardTitle>
              <CardDescription>{card.detail}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
