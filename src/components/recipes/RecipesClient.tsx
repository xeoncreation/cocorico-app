'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Recipe, Visibility } from '@/types/recipes';
import { Clock, Users, ChefHat, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import { RippleButton } from '@/components/ui/ripple-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DEMO_RECIPES = [
  {
    title: 'Paella Valenciana',
    description: 'Arroz con mariscos, pollo y verduras al estilo tradicional valenciano.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '45 min',
    servings: 6
  },
  {
    title: 'Gazpacho Andaluz',
    description: 'Sopa fría de tomate, pepino y pimientos perfecta para el verano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '15 min',
    cookTime: '0 min',
    servings: 4
  },
  {
    title: 'Tortilla de Patatas',
    description: 'Clásica tortilla española con patatas y cebolla.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4
  },
  {
    title: 'Ensalada César',
    description: 'Lechuga romana con pollo, parmesano y aderezo César casero.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '10 min',
    servings: 2
  },
  {
    title: 'Pasta Carbonara',
    description: 'Spaghetti con panceta, huevo, parmesano y pimienta negra.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Tacos al Pastor',
    description: 'Tacos mexicanos con cerdo marinado, piña y cilantro.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '20 min',
    cookTime: '30 min',
    servings: 6
  },
  {
    title: 'Sushi Rolls',
    description: 'Rolls de salmón, aguacate y pepino con arroz sushi.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '40 min',
    cookTime: '20 min',
    servings: 4
  },
  {
    title: 'Lasaña Boloñesa',
    description: 'Capas de pasta con ragú de carne y bechamel gratinada.',
    image: '/branding/cocorico/default.png',
    prepTime: '30 min',
    cookTime: '60 min',
    servings: 8
  },
  {
    title: 'Pollo al Curry',
    description: 'Pollo en salsa de curry con leche de coco y especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '15 min',
    cookTime: '35 min',
    servings: 4
  },
  {
    title: 'Brownies de Chocolate',
    description: 'Brownies densos y chocolatosos con nueces.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '30 min',
    servings: 12
  },
  {
    title: 'Ramen Japonés',
    description: 'Sopa de fideos con caldo rico, huevo y verduras.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '25 min',
    cookTime: '40 min',
    servings: 4
  },
  {
    title: 'Pizza Margherita',
    description: 'Pizza clásica con tomate, mozzarella y albahaca fresca.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Fajitas de Res',
    description: 'Tiras de res salteadas con pimientos y cebolla.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 4
  },
  {
    title: 'Tiramisú Italiano',
    description: 'Postre de café, mascarpone y bizcochos de soletilla.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '0 min',
    servings: 8
  },
  {
    title: 'Pad Thai',
    description: 'Fideos de arroz salteados con camarones y cacahuates.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4
  },
  {
    title: 'Hamburguesa Gourmet',
    description: 'Burger de res con queso cheddar, bacon y aguacate.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '12 min',
    servings: 4
  },
  {
    title: 'Risotto de Hongos',
    description: 'Arroz cremoso con hongos porcini y parmesano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '10 min',
    cookTime: '30 min',
    servings: 4
  },
  {
    title: 'Ceviche Peruano',
    description: 'Pescado marinado en limón con cebolla y cilantro.',
    image: '/branding/cocorico/default.png',
    prepTime: '20 min',
    cookTime: '0 min',
    servings: 6
  },
  {
    title: 'Tarta de Queso',
    description: 'Cheesecake cremoso con base de galleta y frutos rojos.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '25 min',
    cookTime: '50 min',
    servings: 10
  },
  {
    title: 'Shakshuka',
    description: 'Huevos pochados en salsa de tomate con especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4
  }
];

export default function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState<"all" | "quick" | "medium" | "slow">("all");
  const router = useRouter();
  const supabase = createClientComponentClient();
  // Some pages render outside the /[locale] layout and therefore do not have
  // the next-intl provider. useLocale will throw if no provider is present, so
  // wrap it in try/catch and fall back to undefined.
  let locale: string | undefined;
  try {
    locale = useLocale();
  } catch (e) {
    locale = undefined;
  }

  const linkWithLocale = (href: string) => (locale ? `/${locale}${href}` : href);

  const plan =
    typeof document !== "undefined"
      ? (document.documentElement.dataset.theme as "free" | "premium")
      : "free";

  useEffect(() => {
    loadRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
      setShowDemo((data || []).length === 0);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GlassCard className={cn("p-8")} variant={plan === 'premium' ? 'premium' : 'accent'}>
          <p className={plan === "premium" ? "glass-text-premium" : ""}>Cargando recetas...</p>
        </GlassCard>
      </div>
    );
  }

  // Rendering branches below use `showDemo ? DEMO_RECIPES : recipes` directly
  
  // Filter recipes based on search and time
  const displayRecipes = showDemo ? DEMO_RECIPES : recipes;
  const filteredRecipes = displayRecipes.filter(recipe => {
    const title = 'title' in recipe ? recipe.title : '';
    const description = typeof recipe.description === 'string' ? recipe.description : '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // For demo recipes, check prepTime + cookTime
    if (showDemo && 'prepTime' in recipe && 'cookTime' in recipe) {
      const totalMin = parseInt(recipe.prepTime) + parseInt(recipe.cookTime);
      if (timeFilter === "quick" && totalMin > 30) return false;
      if (timeFilter === "medium" && (totalMin <= 30 || totalMin > 60)) return false;
      if (timeFilter === "slow" && totalMin <= 60) return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen py-8 bg-transparent">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <GlassCard className={cn(
            "flex flex-col sm:flex-row justify-between items-center mb-8 p-6",
            // keep a thinner radius in the glass card itself; the component provides default rounding
          )} variant={plan === 'premium' ? 'premium' : 'accent'}>
          <div>
            <h1 className={cn(
              "text-4xl font-bold mb-2",
              plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
            )}>
              Mis Recetas 🍳
            </h1>
            <p className={plan === "premium" ? "text-white/80" : "text-muted-foreground"}>
              {showDemo ? '20 recetas demo para inspirarte' : `${recipes.length} recetas guardadas`}
            </p>
          </div>
          <RippleButton
            asChild
            className={plan === "premium" ? "coco-btn-premium" : "coco-btn-primary"}
          >
            <Link href={linkWithLocale('/recipes/create')}>
              + Nueva Receta
            </Link>
          </RippleButton>
        </GlassCard>

        {/* Search and Filters */}
        <GlassCard className="p-4 mb-6" variant={plan === 'premium' ? 'premium' : 'base'}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Buscar recetas por nombre o ingredientes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-neutral-900/50"
              />
            </div>

            {/* Time filters */}
            <div className="flex gap-2">
              <Button
                variant={timeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("all")}
              >
                Todas
              </Button>
              <Button
                variant={timeFilter === "quick" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("quick")}
              >
                <Clock className="w-4 h-4 mr-1" />
                Rápidas (&lt;30min)
              </Button>
              <Button
                variant={timeFilter === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("medium")}
              >
                Medias (30-60min)
              </Button>
              <Button
                variant={timeFilter === "slow" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("slow")}
              >
                Largas (&gt;60min)
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Toggle Demo/Real */}
        {!showDemo && recipes.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowDemo(true)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                plan === "premium" ? "glass-droplet" : "bg-amber-100 text-amber-800"
              )}
            >
              Ver recetas demo
            </button>
          </div>
        )}
        {showDemo && recipes.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowDemo(false)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                plan === "premium" ? "glass-droplet" : "bg-amber-100 text-amber-800"
              )}
            >
              Ver mis recetas ({recipes.length})
            </button>
          </div>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <GlassCard className="p-8" variant={plan === 'premium' ? 'premium' : 'base'}>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  No se encontraron recetas con los filtros aplicados
                </p>
              </GlassCard>
            </div>
          ) : showDemo ? (
            // Demo recipes filtered
            filteredRecipes.map((recipe, idx) => (
              <GlassCard
                key={idx}
                className={cn(
                  "group overflow-hidden transition-all hover:scale-105 cursor-pointer",
                )}
                variant={plan === 'premium' ? 'premium' : 'accent'}
                onClick={() => router.push(linkWithLocale('/recipes/create'))}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={(('image' in recipe ? recipe.image : '/branding/cocorico/default.png') as string)}
                    alt={'title' in recipe ? recipe.title : ''}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className={cn(
                    "text-lg font-bold mb-2",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {'title' in recipe ? recipe.title : ''}
                  </h3>
                  <p className={cn(
                    "text-sm mb-4 line-clamp-2",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {'description' in recipe ? recipe.description : ''}
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{'prepTime' in recipe ? recipe.prepTime : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{'servings' in recipe ? recipe.servings : ''}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            // Real recipes from DB filtered
            filteredRecipes.map((recipe, idx) => (
              <GlassCard
                key={('id' in recipe && recipe.id) ? recipe.id : `demo-${idx}`}
                className={cn(
                  "overflow-hidden transition-all hover:scale-105",
                )}
                variant={plan === 'premium' ? 'premium' : 'accent'}
              >
                <div className="p-6">
                  <h2 className={cn(
                    "text-xl font-bold mb-2",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {recipe.title}
                  </h2>
                  <p className={cn(
                    "mb-4 line-clamp-2",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {recipe.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-lg",
                      plan === "premium" ? "glass-droplet" : "bg-orange-100 text-orange-800"
                    )}>
                      {'visibility' in recipe ? (recipe.visibility === Visibility.PUBLIC ? 'Pública' : 'Privada') : 'Demo'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if ('id' in recipe) {
                            router.push(`/${locale}/recipes/${recipe.id}`);
                          }
                        }}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-cocorico-turquoise hover:bg-cocorico-datil/10"
                        )}
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          if ('id' in recipe) {
                            router.push(`/${locale}/recipes/${recipe.id}/edit`);
                          }
                        }}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-green-600 hover:bg-green-50"
                        )}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          if ('id' in recipe) {
                            if (confirm('¿Estás seguro de eliminar esta receta?')) {
                              deleteRecipe(recipe.id);
                            }
                          }
                        }}
                        className={cn(
                          "text-sm px-3 py-1 rounded-lg",
                          plan === "premium" ? "glass-droplet" : "text-red-600 hover:bg-red-50"
                        )}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Empty State */}
        {recipes.length === 0 && !showDemo && (
          <GlassCard className={cn(
            "text-center mt-10 p-12",
          )} variant={plan === 'premium' ? 'premium' : 'accent'}>
            <p className={cn(
              "text-lg mb-6",
              plan === "premium" ? "glass-text-premium" : "text-neutral-600 dark:text-neutral-400"
            )}>
              No hay recetas todavía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/${locale}/recipes/create`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                )}
              >
                Crear receta
              </Link>
              <Link
                href={`/${locale}/dashboard/import`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all border-2 border-amber-500 text-amber-600 hover:bg-amber-50"
                )}
              >
                Importar desde URL/Foto
              </Link>
              <Link
                href={`/${locale}/recipes/search`}
                className={cn(
                  "px-6 py-3 rounded-xl font-semibold transition-all border-2 border-neutral-300 hover:bg-neutral-50"
                )}
              >
                Buscar recetas
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
