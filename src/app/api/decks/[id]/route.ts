import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { auth } from "@clerk/nextjs/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify deck belongs to user
    const { data: deck, error: fetchError } = await supabase
      .from("decks")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (fetchError || !deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    if (deck.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the deck
    const { error: deleteError } = await supabase
      .from("decks")
      .delete()
      .eq("id", id)
      .eq("owner_id", userId);

    if (deleteError) {
      console.error("Error deleting deck:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete deck" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/decks/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
