'use client';

import { ProfileSidebar } from '@/components/profile/ProfileSidebar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-bg-base pt-24 text-white">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg-surface/20 via-bg-base to-bg-base" />
        <div className="absolute -top-24 left-[12%] h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] h-[400px] w-[400px] rounded-full bg-brand/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1680px] items-start gap-4 px-4 pb-8 lg:gap-8 lg:px-6 xl:px-8">
        <ProfileSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Page content */}
          <main className="relative flex-1 px-0 py-2 md:py-3 lg:py-2">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
