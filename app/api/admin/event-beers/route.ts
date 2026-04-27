import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { eventId, beerId, notes, servingOrder } = await request.json();

    if (!eventId || !beerId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("event_beers").insert({
      event_id: eventId,
      beer_id: beerId,
      notes: notes || null,
      serving_order: servingOrder || null,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { eventBeerId, servingOrder, notes } = await request.json();

    if (!eventBeerId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const updates: Record<string, string | number | null> = {};

    if (servingOrder !== undefined) {
      updates.serving_order = servingOrder;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    const { error } = await supabase
      .from("event_beers")
      .update(updates as never)
      .eq("id", eventBeerId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { eventId, beerId } = await request.json();

    if (!eventId || !beerId) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("event_beers")
      .delete()
      .eq("event_id", eventId)
      .eq("beer_id", beerId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}