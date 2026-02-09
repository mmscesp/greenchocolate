import SafetyKitForm from '@/components/marketing/SafetyKitForm';

interface ArticleInterrupterProps {
  variant?: 'inline' | 'sidebar';
}

export default function ArticleInterrupter({ variant = 'inline' }: ArticleInterrupterProps) {
  if (variant === 'sidebar') {
    return (
      <div className="my-8 lg:sticky lg:top-24">
        <SafetyKitForm />
      </div>
    );
  }

  return (
    <div className="my-12 max-w-2xl mx-auto">
      <SafetyKitForm />
    </div>
  );
}
