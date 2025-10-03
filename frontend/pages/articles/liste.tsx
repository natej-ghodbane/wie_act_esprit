"use client";

import Link from "next/link";

const articles = [
  { id: "1", title: "Techniques modernes de compostage pour des sols fertiles", summary: "Apprenez à créer et utiliser du compost pour améliorer vos cultures." },
  { id: "2", title: "Les plantes couvre-sol et la protection des sols", summary: "Découvrez comment protéger vos sols avec les plantes couvre-sol." },
  { id: "3", title: "Gestion de l’eau : méthodes d’irrigation économes", summary: "Comparez les techniques d’irrigation pour économiser l’eau." },
  { id: "4", title: "Les bienfaits de l’agriculture biologique pour la biodiversité", summary: "Comment l’agriculture bio favorise la faune et la flore." },
  { id: "5", title: "Planification des cultures pour des récoltes optimisées", summary: "Organisez vos semis et rotations pour maximiser vos rendements." },
  { id: "6", title: "Introduction aux cultures associées et compagnonnage de plantes", summary: "Apprenez quelles plantes cultivées ensemble s’entraident." },
  { id: "7", title: "Lutte intégrée contre les ravageurs sans pesticides chimiques", summary: "Protégez vos cultures naturellement des insectes et maladies." },
  { id: "8", title: "Suivi et analyse des rendements agricoles", summary: "Mesurez et analysez vos récoltes pour améliorer vos pratiques." },
];

export default function ArticlesPage() {
  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">📚 Articles internes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition block"
          >
            <h2 className="text-lg font-semibold text-pink-700 mb-2">{article.title}</h2>
            <p className="text-gray-600 text-sm">{article.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
