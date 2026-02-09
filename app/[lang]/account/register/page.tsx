import React from 'react';

export default function RegisterPage() {
  return (
    <div className="container py-10 flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-4xl font-bold mb-4">Register</h1>
      <p className="text-lg text-muted-foreground">Create a new account</p>
      <div className="mt-4 p-4 border border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 rounded">
        <p className="font-semibold text-yellow-700 dark:text-yellow-500">Age Gate & Terms Acceptance Required</p>
      </div>
    </div>
  );
}
