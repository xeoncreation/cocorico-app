import GlassCard from "@/components/ui/GlassCard";
// import ChallengeCard from "@/components/community/ChallengeCard"; // To be created for enhanced challenge display

export default async function ChallengesPage({ params }: { params: { locale: string } }) {
  // TODO: Replace with actual DB fetch
  const challenges = [
    { id: 1, title: "Reto 1", description: "Completa 5 escaneos esta semana", type: "scanner", progress: 2, total: 5 },
    { id: 2, title: "Reto 2", description: "Cocina una receta nueva", type: "cooking", progress: 0, total: 1 },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold glass-text-strong">Retos Activos</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map(challenge => (
          <GlassCard key={challenge.id} className="p-6">
            <h2 className="text-xl font-bold mb-2">{challenge.title}</h2>
            <p className="glass-text-medium mb-2">{challenge.description}</p>
            <div className="glass-text-soft mb-2">Progreso: {challenge.progress} / {challenge.total}</div>
            <span className="glass-pill px-3 py-1 bg-green-500 text-white font-bold">{challenge.type}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
