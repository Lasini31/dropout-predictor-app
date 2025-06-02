"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface StudentData {
  name: string;
  student_id: string;
  index: string;
  prediction: string;
}

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const [student, setStudent] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const res = await fetch(`/api/student-data?id=${session.user.id}`);
        const data = await res.json();
        if (data.success) {
          setStudent(data.student);
        }
      }
    };

    fetchData();
  }, [session]);

  if (status === "loading") return <div className="p-8">Loading...</div>;
  if (!session) return <div className="p-8">Access Denied</div>;

  return (
    <div className="min-h-screen bg-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>
        {student ? (
          <>
            <p><strong>Name:</strong> {student.name}</p>
            <p><strong>Student ID:</strong> {student.student_id}</p>
            <p><strong>Index:</strong> {student.index}</p>
            <p><strong>Prediction:</strong> {student.prediction}</p>
          </>
        ) : (
          <p>Loading student data...</p>
        )}
      </div>
    </div>
  );
}
