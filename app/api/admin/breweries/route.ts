import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_ORGANIZATION_ID = "11111111-1111-1111-1111-111111111111";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("beers")
      .select("brewery_name")
      .eq("organization_id", DEFAULT_ORGANIZATION_ID)
      .order("brewery_name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const breweries = [...new Set((data ?? []).map((b) => b.brewery_name))];

    return NextResponse.json({ breweries });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}