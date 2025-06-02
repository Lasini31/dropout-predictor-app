import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await connectToDatabase();
    const db = client.db("dropoutDB");

    const studentId = req.nextUrl.searchParams.get("id");

    const student = await db.collection("students").findOne({ student_id: studentId });
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" });
    }

    const predictionDoc = await db.collection("predictions").findOne({ Index: student.index });
    const prediction = predictionDoc?.Prediction ?? "N/A";

    return NextResponse.json({
      success: true,
      student: {
        name: student.name,
        student_id: student.student_id,
        index: student.index,
        prediction,
      },
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
