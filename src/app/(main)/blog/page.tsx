import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { MailIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import { PostList } from "./post-list";

export const metadata: Metadata = {
  title: "Blogs",
};

export default async function BlogPage() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="md:text-2xl text-xl font-semibold">Welcome back, {user.name} 🌠</h1>
        </div>
        {!user.emailVerified && <EmailVerificationAlert />}
          <PostList />
      </div>
    </main>
  );
}

function EmailVerificationAlert() {
  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800/50 dark:bg-yellow-950/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MailIcon className="size-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-yellow-800 dark:text-yellow-200">
            Please verify your email address to access all features.
          </span>
        </div>
        <Button size="sm" asChild>
          <Link href="/verify-email">Verify Email</Link>
        </Button>
      </div>
    </div>
  );
}
