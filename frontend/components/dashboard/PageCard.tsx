"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, MousePointerClick, ExternalLink, Pencil, BarChart2 } from "lucide-react";
import type { BusinessPage } from "@/types";

interface PageCardProps {
    page: BusinessPage;
}

const themeColors: Record<string, string> = {
    default: "bg-emerald-100 text-emerald-800",
    dark: "bg-gray-800 text-gray-100",
    minimal: "bg-gray-100 text-gray-800",
    vibrant: "bg-purple-100 text-purple-800",
};

export default function PageCard({ page }: PageCardProps) {
    const publicUrl = `/${page.slug}`;

    return (
        <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">
                        {page.business_name}
                    </CardTitle>
                    <Badge variant="secondary" className={themeColors[page.theme] ?? ""}>
                        {page.theme}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground">/{page.slug}</p>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {page.page_views.toLocaleString()} views
                    </span>
                    <span className="flex items-center gap-1">
                        <MousePointerClick className="h-3.5 w-3.5" />
                        {page.whatsapp_clicks.toLocaleString()} clicks
                    </span>
                </div>
            </CardContent>

            <CardFooter className="gap-2">
                <Link href={`/dashboard/pages/${page.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                    </Button>
                </Link>
                <Link href={`/dashboard/pages/${page.id}/analytics`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1.5">
                        <BarChart2 className="h-3.5 w-3.5" />
                        Analytics
                    </Button>
                </Link>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button
                        size="sm"
                        className="w-full gap-1.5 bg-[#25D366] hover:bg-[#1da851] text-white"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Live
                    </Button>
                </a>
            </CardFooter>
        </Card>
    );
}
