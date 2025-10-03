"use client";

import { useParams } from "next/navigation";

const articles = {
  "1": {
    title: "Techniques modernes de compostage pour des sols fertiles",
    content: `Le compostage permet de recycler les déchets organiques et d'améliorer la fertilité du sol. Vous pouvez créer du compost à partir de résidus végétaux, fumier et déchets alimentaires, et l’appliquer sur vos cultures pour stimuler la croissance.`,
  },
  "2": {
    title: "Les plantes couvre-sol et la protection des sols",
    content: `Les plantes couvre-sol protègent le sol de l'érosion, maintiennent l'humidité et enrichissent la terre en nutriments. Elles peuvent être utilisées entre les rangs de cultures pour améliorer la santé globale du terrain.`,
  },
  "3": {
    title: "Gestion de l’eau : méthodes d’irrigation économes",
    content: `L’irrigation goutte-à-goutte et l’aspersion permettent d’économiser l’eau tout en maintenant une bonne croissance des plantes. Il est essentiel de mesurer l’humidité du sol et d’adapter la quantité d’eau selon les besoins des cultures.`,
  },
  "4": {
    title: "Les bienfaits de l’agriculture biologique pour la biodiversité",
    content: `L’agriculture biologique limite l’usage de pesticides chimiques, favorise la faune et la flore, et préserve la qualité des sols. Elle contribue également à la santé des consommateurs et à la durabilité des exploitations.`,
  },
  "5": {
    title: "Planification des cultures pour des récoltes optimisées",
    content: `La planification des cultures permet de choisir le bon moment pour semer, récolter et alterner les cultures. Cela optimise les rendements et réduit le risque de maladies et d’épuisement des sols.`,
  },
  "6": {
    title: "Introduction aux cultures associées et compagnonnage de plantes",
    content: `Certaines plantes, lorsqu’elles sont cultivées ensemble, se protègent mutuellement et améliorent la croissance. Exemples : le maïs avec les haricots, la carotte avec l’oignon. Cette pratique augmente la productivité et réduit les nuisibles.`,
  },
  "7": {
    title: "Lutte intégrée contre les ravageurs sans pesticides chimiques",
    content: `La lutte intégrée combine méthodes biologiques, mécaniques et culturelles pour protéger les cultures. Utiliser des insectes auxiliaires, barrières physiques et rotations de cultures réduit la dépendance aux produits chimiques.`,
  },
  "8": {
    title: "Suivi et analyse des rendements agricoles",
    content: `Mesurer la production, noter les interventions et analyser les résultats permet d’identifier les pratiques efficaces et d’améliorer les rendements futurs. Les tableaux de suivi et applications agricoles sont des outils utiles.`,
  },
};

export default function ArticleDetail() {
  const { id } = useParams();
  const article = articles[id as keyof typeof articles];

  if (!article) {
    return (
      <div className="p-10 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <h1 className="text-3xl font-bold text-red-600">❌ Article introuvable</h1>
        <p className="text-gray-700 mt-4">L’article que vous cherchez n’existe pas.</p>
      </div>
    );
  }

  return (
    <div className="p-10 min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">{article.title}</h1>
      <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <p className="text-gray-600 whitespace-pre-line">{article.content}</p>
      </div>
    </div>
  );
}
