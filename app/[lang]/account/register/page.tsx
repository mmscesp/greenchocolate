import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-base px-4 pt-24 pb-16 sm:px-6 md:pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,205,200,0.13),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_42%)]" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-10rem)] w-full max-w-7xl items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
