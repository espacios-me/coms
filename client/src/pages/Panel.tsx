import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutPanelTop } from "lucide-react";

export default function Panel() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel</h1>
        <p className="text-muted-foreground mt-2">
          A focused action surface for task triage, summaries, and quick commands.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutPanelTop className="h-5 w-5 text-primary" />
            Panel Queue
          </CardTitle>
          <CardDescription>Ready for source-based feature implementation.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No items yet. Hook this screen to real backend workflows in the next phase.
        </CardContent>
      </Card>
    </div>
  );
}
