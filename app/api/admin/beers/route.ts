import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_ORGANIZATION_ID = "11111111-1111-1111-1111-111111111111";

export async function POST(request: Request) {
  try {
    const { breweryName, productName, styleName, abv, volumeMl, countryCode, description } =
      await request.json();

    if (!breweryName || !productName || !styleName) {
      return NextResponse.json(
        { error: "厂牌、产品名称和种类为必填项" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("beers")
      .insert({
        organization_id: DEFAULT_ORGANIZATION_ID,
        brewery_name: breweryName,
        product_name: productName,
        style_name: styleName,
        abv: abv ?? null,
        volume_ml: volumeMl ?? null,
        country_code: countryCode ?? null,
        description: description ?? null,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id, success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}