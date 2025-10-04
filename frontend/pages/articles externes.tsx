// app/external/page.tsx
export default function ExternalArticlesPage() {
  const links = [
    { 
      title: "Optimisez les rendements de vos cultures grâce à l’irrigation par aspersion", 
      url: "https://www.isagri.fr/ressources/articles/optimisez-les-rendements-de-vos-cultures-grace-a-l-irrigation-par-aspersion?utm_source=chatgpt.com" 
    },
    { 
      title: "Rotation des cultures : Le guide définitif", 
      url: "https://richmondvale.org/fr/rotation-des-cultures-le-guide-definitif/?utm_source=chatgpt.com" 
    },
    { 
      title: "Agriculture de conservation / Rotation des cultures", 
      url: "https://www.agro-league.com/agriculture-de-conservation/rotation-des-cultures?utm_source=chatgpt.com" 
    },
    { 
      title: "Articles sur l’arrosage – Arrosage Distribution", 
      url: "https://www.arrosage-distribution.fr/blog/tag/arrosage" 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-200 p-10">
      <h1 className="text-3xl font-bold text-purple-700 mb-8">
        🌍 Articles externes
      </h1>

      {/* Cartes des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 hover:shadow-xl transition block"
          >
            <h3 className="text-lg font-semibold text-pink-700 mb-2">
              {link.title}
            </h3>
            <p className="text-sm text-gray-600">
              Cliquez pour lire l’article complet →
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}