import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle2 } from '@/lib/icons';

interface AdminActionNoticeProps {
  message?: string;
  status?: string;
}

export function AdminActionNotice({
  message,
  status,
}: AdminActionNoticeProps) {
  if (!message || (status !== 'success' && status !== 'error')) {
    return null;
  }

  const isSuccess = status === 'success';
  const Icon = isSuccess ? CheckCircle2 : AlertTriangle;

  return (
    <Alert
      variant={isSuccess ? 'default' : 'destructive'}
      className={
        isSuccess
          ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-100'
          : undefined
      }
    >
      <Icon className={`h-4 w-4 ${isSuccess ? 'text-green-700 dark:text-green-200' : ''}`} />
      <AlertTitle>{isSuccess ? 'Update applied' : 'Action failed'}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
