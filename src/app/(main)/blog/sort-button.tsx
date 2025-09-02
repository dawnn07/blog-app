"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react";

export function SortButtons() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "desc";

    const handleSort = (sortOrder: "desc" | "asc") => {
        const params = new URLSearchParams(searchParams);
        params.set("sort", sortOrder);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button
                variant={currentSort === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("desc")}
                className="flex items-center gap-1"
            >
                <ArrowDown className="h-4 w-4" />
                Newest
            </Button>
            <Button
                variant={currentSort === "asc" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("asc")}
                className="flex items-center gap-1"
            >
                <ArrowUp className="h-4 w-4" />
                Oldest
            </Button>
        </div>
    );
}