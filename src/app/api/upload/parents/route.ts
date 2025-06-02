import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data } = body;

    // Correct function invocation
    const client = await connectToDatabase();
    const db = client.db("dropoutDB");
    const collection = db.collection("parents");

    // Preprocess: convert students string to array
    const processedData = data.map((entry: any) => ({
      ...entry,
      students: entry.students
        .replace(/"/g, "")        // remove all double quotes
        .split(",")
        .map((id: string) => id.trim()),
    }));

    await collection.insertMany(processedData);

    return NextResponse.json({ success: true, message: "Parents uploaded." });
  } catch (err) {
    console.error("Error uploading parents:", err);
    return NextResponse.json({ success: false, message: "Failed to upload parents." }, { status: 500 });
  }
}
