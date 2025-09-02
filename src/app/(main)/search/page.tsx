import { getServerSession } from "@/lib/get-session";
import { Metadata } from "next";
import { unauthorized } from "next/navigation";
import { PostList } from "../blog/post-list";
import { Separator } from "@/components/ui/separator";
import { SortButtons } from "../blog/sort-button";

export const metadata: Metadata = {
    title: "Blogs",
};

export default async function SearchPage() {
    const session = await getServerSession();
    const user = session?.user;
    if (!user) unauthorized();

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-12">
            <div className="space-y-6">
                <SortButtons />
                <Separator />
                <PostList />
            </div>
        </main>
    );
}
