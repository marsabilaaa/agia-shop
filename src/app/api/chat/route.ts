import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: "message dan sessionId wajib diisi" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // 1. Ambil semua produk sebagai konteks
    const { data: products } = await supabase
      .from("products")
      .select("name, description, price, category, stock")
      .order("category");

    const productContext = products
      ? products
          .map(
            (p) =>
              `- ${p.name} | Kategori: ${p.category} | Harga: Rp ${p.price.toLocaleString("id-ID")} | Stok: ${p.stock} | Deskripsi: ${p.description ?? "-"}`,
          )
          .join("\n")
      : "Tidak ada produk tersedia.";

    // 2. Ambil atau buat conversation
    let conversationId: string;

    const { data: existingConv } = await supabase
      .from("conversations")
      .select("id")
      .eq("session_id", sessionId)
      .single();

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv, error: convError } = await supabase
        .from("conversations")
        .insert({ session_id: sessionId })
        .select("id")
        .single();

      if (convError || !newConv) {
        return NextResponse.json(
          { error: "Gagal membuat conversation" },
          { status: 500 },
        );
      }
      conversationId = newConv.id;
    }

    // 3. Ambil riwayat pesan sebelumnya (max 10 pesan terakhir)
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(10);

    // 4. Simpan pesan user
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: message,
    });

    // 5. Bangun chat history untuk Gemini
    const chatHistory = (history ?? []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 6. Kirim ke Gemini dengan konteks produk
    const chat = geminiModel.startChat({
      history: chatHistory,
    });

    const prompt = `Data produk yang tersedia di AGIA Shop saat ini:\n${productContext}\n\nPertanyaan pelanggan: ${message}`;

    const result = await chat.sendMessage(prompt);
    const aiResponse = result.response.text();

    // 7. Simpan respons AI
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      role: "assistant",
      content: aiResponse,
    });

    // 8. Update timestamp conversation
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return NextResponse.json({
      message: aiResponse,
      conversationId,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
