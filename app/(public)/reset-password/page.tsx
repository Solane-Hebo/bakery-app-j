import { Suspense } from "react";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F9F9F9] flex items-center justify-center px-6">
          <p className="text-sm text-gray-600">
            Loading...
          </p>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}