import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await connectToDatabase();
    const db = client.db("dropoutDB");

    const parentId = req.nextUrl.searchParams.get("parent_id");
    if (!parentId) {
      return NextResponse.json({ error: "Missing parent_id" }, { status: 400 });
    }

    const parent = await db.collection("parents").findOne({ parent_id: parentId });
    if (!parent || !Array.isArray(parent.students)) {
      return NextResponse.json({ error: "Parent or students not found" }, { status: 404 });
    }

    const students = await db
      .collection("students")
      .find({ student_id: { $in: parent.students } })
      .toArray();

    const predictions = await db.collection("predictions").find({}).toArray();

    const result = students.map((student) => {
      const match = predictions.find((p) => p.Index === student.index);
      return {
        student_id: student.student_id,
        name: student.name,
        index: student.index,
        prediction: match?.Prediction || "N/A",
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in parent dashboard API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
