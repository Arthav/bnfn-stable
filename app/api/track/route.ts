import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { path } = body;

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        // Get IP address from headers
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ipAddress = forwardedFor ? forwardedFor.split(",")[0] : req.headers.get("x-real-ip") || "unknown";

        // Get User Agent
        const userAgent = req.headers.get("user-agent") || "unknown";

        // Check if there's already a visit for this IP/Path today
        // For simple analytics, we'll just insert a new row for every visit right now, 
        // but let's see if the row already exists to increment clicks instead.

        const { data: existingVisit } = await supabase
            .from("analytics_visits")
            .select("id, clicks")
            .eq("path", path)
            .eq("ip_address", ipAddress)
            // Ideally we'd filter by today's date, but for simplicity of the schema we just check exact match
            // and maybe order by created_at desc limit 1
            .order('created_at', { ascending: false })
            .limit(1)
            .single();


        if (existingVisit) {
            // Increment clicks/visits for this session
            await supabase
                .from("analytics_visits")
                .update({ clicks: existingVisit.clicks + 1 })
                .eq("id", existingVisit.id);
        } else {
            // Insert new visit
            const { error } = await supabase.from("analytics_visits").insert({
                path,
                ip_address: ipAddress,
                user_agent: userAgent,
                clicks: 1, // initialize with 1 
            });

            if (error) {
                console.error("Error inserting analytics:", error);
                return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
    }
}
