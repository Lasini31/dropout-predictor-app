import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;

    const client = await connectToDatabase;
    const db = client.db("dropoutDB"); // or whatever your DB name is
    const collection = db.collection("predictions");

    await collection.insertMany(data);

    return NextResponse.json({ success: true, message: "Predictions uploaded." });
  } catch (err) {
    console.error("Error uploading predictions:", err);
    return NextResponse.json({ success: false, message: "Failed to upload predictions." }, { status: 500 });
  }
}
