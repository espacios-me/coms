import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Friends() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
        <p className="text-muted-foreground mt-2">
          Social/context-sharing shell for collaborative interactions in Atom.
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Contacts
          </CardTitle>
          <CardDescription>Invite and collaboration features come in a later increment.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          No contacts connected yet.
        </CardContent>
      </Card>
    </div>
  );
}
