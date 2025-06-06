export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cover p-6" style={{ backgroundImage: `url('/bg2.jpg')` }}>
      <div className="text-center bg-white p-10 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Dropout Predictor App</h1>
        <p className="text-gray-700 mb-6">Welcome! Please login to access your dashboard.</p>
        <a
          href="/login"
          className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Go to Login
        </a>
      </div>
    </main>
  );
}
