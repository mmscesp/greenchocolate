import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default async function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Operational toggles and administrative preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Moderation Controls</CardTitle>
          <CardDescription>Safety controls for content and user actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label>Strict Club Verification</Label>
              <p className="text-xs text-muted-foreground">Require explicit admin verification before club visibility.</p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Audit Logging</Label>
              <p className="text-xs text-muted-foreground">Log all privileged admin mutations.</p>
            </div>
            <Switch checked disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Emergency Freeze Mode</Label>
              <p className="text-xs text-muted-foreground">Temporarily halt sensitive writes (future release).</p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
