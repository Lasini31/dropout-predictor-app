'use client';

import { useState } from "react";
import Papa from "papaparse";

export default function UploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setCsvFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results: Papa.ParseResult<any>) {
        const parsedData = results.data;

        const response = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: parsedData }),
        });

        const result = await response.json();
        const predictionArray = result.prediction;
        const explanations = result.explanation;

        console.log("Prediction Array:", predictionArray);
        console.log("Explanations:", explanations);

        // Attach predictions and top SHAP feature to the original data
        const combined = parsedData.map((row: any, idx: number) => {
          let top_feature;
          if (predictionArray[idx] == 1) {
            top_feature = Object.entries(explanations[idx] || {})
              .sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "N/A";
          } else {
            top_feature = Object.entries(explanations[idx] || {})
              .sort((a, b) => (a[1] as number) - (b[1] as number))[0]?.[0] || "N/A";
          }

          return {
            ...row,
            Prediction: predictionArray[idx] === 1 ? "Dropout" : "Graduate",
            "Reason": top_feature,
          };
        });

        setPredictions(combined);
        alert("Predictions complete! Scroll down to see results or download as CSV.");
      },
    });
  };

  const handleUploadFiles = async (file: File, type: "students" | "parents" | "predictions") => {
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: Papa.ParseResult<any>) => {
        try {
          const response = await fetch(`/api/upload/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: results.data }),
          });
  
          const result = await response.json();
          if (result.success) {
            alert(`${type} data uploaded successfully.`);
          } else {
            alert(`Failed to upload ${type} data.`);
          }
        } catch (err) {
          console.error(`Upload error for ${type}:`, err);
          alert(`Error uploading ${type} data.`);
        }
      },
    });
  };
  
  

  const handleDownload = () => {
    const csv = Papa.unparse(predictions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "predicted_students.csv");
    link.click();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#cde6ff" }}>
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Upload Student CSV</h1>
  
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Choose a CSV file
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full mb-4 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
  
        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out mr-4"
        >
          Upload and Predict
        </button>
  
        {predictions.length > 0 && (
          <div className="mt-8">
            <button
              onClick={handleDownload}
              className="bg-blue-950 text-white px-6 py-2 rounded-md hover:bg-blue-300 transition duration-150 ease-in-out mb-4"
            >
              Download CSV
            </button>
  
            <div className="overflow-x-auto border rounded-lg shadow mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100 text-gray-800 text-sm font-semibold">
                  <tr>
                    {Object.keys(predictions[0]).map((key) => (
                      <th key={key} className="px-4 py-3 border">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                  {predictions.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="px-4 py-2 border">
                          {String(val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
        <input
          type="file"
          accept=".csv"
          id="upload-students"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUploadFiles(e.target.files[0], "students");
          }}
        />

        <input
          type="file"
          accept=".csv"
          id="upload-parents"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUploadFiles(e.target.files[0], "parents");
          }}
        />

        <input
          type="file"
          accept=".csv"
          id="upload-predictions"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleUploadFiles(e.target.files[0], "predictions");
          }}
        />
        <div className="flex justify-center mt-8">
          <button
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-blue-500 transition duration-150 ease-in-out mr-4"
            onClick={() => document.getElementById("upload-students")?.click()}
          >
            Upload Students
          </button>

          <button
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-blue-500 transition duration-150 ease-in-out mr-4"
            onClick={() => document.getElementById("upload-parents")?.click()}
          >
            Upload Parents
          </button>

          <button
            className="bg-white text-black px-6 py-2 rounded-md hover:bg-blue-500 transition duration-150 ease-in-out mr-4"
            onClick={() => document.getElementById("upload-predictions")?.click()}
          >
            Upload Predictions
          </button>
        </div>
    </div>
    </div>
  );
}  