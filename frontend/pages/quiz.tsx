"use client";

export default function QuizPage() {
  const questions = [
    { id: 1, question: "Which crop is best for water conservation?", options: ["Rice", "Millet", "Wheat"] },
    { id: 2, question: "What is organic fertilizer made from?", options: ["Chemicals", "Natural materials", "Plastic"] },
  ];

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">Quiz Agricole</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <h3 className="text-lg font-semibold text-pink-700 mb-4">
              {q.question}
            </h3>
            <ul className="flex flex-col gap-2">
              {q.options.map((opt, index) => (
                <li key={index} className="bg-pink-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-200">
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}