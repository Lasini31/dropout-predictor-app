'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface StudentData {
  name: string;
  student_id: string;
  index: string;
  prediction: string;
  reason: string;
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const res = await fetch(`/api/parent-dashboard?parent_id=${session?.user?.id}`);
        const data = await res.json();
        console.log("Data: ", data);
        setStudents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) fetchStudentData();
  }, [session?.user?.id]);

  return (
    <div className="min-h-screen bg-blue-200 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Parent Dashboard</h1>

        <div className="text-center mt-12 mb-16">
          <h1 className="text-2xl font-semibold">Welcome, {session?.user?.name} 👋</h1>
          <p className="text-s mt-2">
            Predictions for {students.map(s => s.name).join(", ")} are available below:
          </p>
        </div>


        {loading ? (
          <p className="text-center">Loading student data...</p>
        ) : students.length === 0 ? (
          <p className="text-center text-gray-500">No students found.</p>
        ) : (
          <table className="w-full text-sm text-left border border-gray-300">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Student ID</th>
                <th className="p-3 border">Index</th>
                <th className="p-3 border">Prediction</th>
                <th className="p-3 border">Reason</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border">{s.name}</td>
                  <td className="p-3 border">{s.student_id}</td>
                  <td className="p-3 border">{s.index}</td>
                  <td className="p-3 border">
                    <span className={`font-semibold ${s.prediction === "dropout" ? "text-red-600" : "text-green-600"}`}>
                      {s.prediction}
                    </span> 
                  </td>
                  <td className="p-3 border">{s.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
