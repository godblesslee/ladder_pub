import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  console.log("Confirm route called:", { token_hash: !!token_hash, type, next });

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    console.log("verifyOtp result:", error?.message ?? "success");

    if (!error) {
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = next;
      redirectUrl.searchParams.delete("token_hash");
      redirectUrl.searchParams.delete("type");
      redirectUrl.searchParams.delete("next");

      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL("/auth/error", request.url));
}
