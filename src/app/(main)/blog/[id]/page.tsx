import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostDetail } from "./post-detail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Post",
};

export default async function BlogDetailPage({ params }: { params: { id: string } }) {

    const { id } = await params;


    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
            <div className="space-y-4">
                <Link href="/blog" className="inline-block mb-6">
                    <Button variant="outline">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Blogs
                    </Button>
                </Link>
                <PostDetail id={id} />
            </div>
        </div>

    )
}
