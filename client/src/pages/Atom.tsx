import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Activity } from "lucide-react";

export default function Atom() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Atom</h1>
        <p className="text-muted-foreground mt-2">
          Your personal context engine shell. This is the starting point for the Atom mobile rebuild.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Context Summary
          </CardTitle>
          <CardDescription>Backend is wired; source-first product features come next.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This placeholder confirms routing, auth, and API connectivity are live for Atom tab development.
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Build status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Navigation shell and mock backend are now runnable via <code>npm run dev</code>.
        </CardContent>
      </Card>
    </div>
  );
}
