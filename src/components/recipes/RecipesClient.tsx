'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { createClientComponentClient } from '@/lib/supabase/client';
import { Recipe, Visibility } from '@/types/recipes';
import { Clock, Users, ChefHat, Search, Star, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassCard from '@/components/ui/GlassCard';
import { RippleButton } from '@/components/ui/ripple-button';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecipeFiltersComponent, { RecipeFilters } from './RecipeFilters';

const DEMO_RECIPES = [
  {
    title: 'Paella Valenciana',
    description: 'Arroz con mariscos, pollo y verduras al estilo tradicional valenciano.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '45 min',
    servings: 6,
    difficulty: 'medium' as const,
    category: 'lunch',
    diet: [],
    rating: 4.8,
    likes: 127
  },
  {
    title: 'Gazpacho Andaluz',
    description: 'Sopa fría de tomate, pepino y pimientos perfecta para el verano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '15 min',
    cookTime: '0 min',
    servings: 4,
    difficulty: 'easy' as const,
    category: 'appetizer',
    diet: ['vegetarian', 'vegan'],
    rating: 4.6,
    likes: 89
  },
  {
    title: 'Tortilla de Patatas',
    description: 'Clásica tortilla española con patatas y cebolla.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4,
    difficulty: 'medium' as const,
    category: 'lunch',
    diet: ['vegetarian'],
    rating: 4.7,
    likes: 112
  },
  {
    title: 'Ensalada César',
    description: 'Lechuga romana con pollo, parmesano y aderezo César casero.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '10 min',
    servings: 2,
    difficulty: 'easy' as const,
    category: 'salad',
    diet: [],
    rating: 4.5,
    likes: 78
  },
  {
    title: 'Pasta Carbonara',
    description: 'Spaghetti con panceta, huevo, parmesano y pimienta negra.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'easy' as const,
    category: 'dinner',
    diet: [],
    rating: 4.9,
    likes: 156
  },
  {
    title: 'Tacos al Pastor',
    description: 'Tacos mexicanos con cerdo marinado, piña y cilantro.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '20 min',
    cookTime: '30 min',
    servings: 6,
    difficulty: 'medium' as const,
    category: 'dinner',
    diet: [],
    rating: 4.8,
    likes: 134
  },
  {
    title: 'Sushi Rolls',
    description: 'Rolls de salmón, aguacate y pepino con arroz sushi.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '40 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'hard' as const,
    category: 'dinner',
    diet: ['pescatarian'],
    rating: 4.7,
    likes: 98
  },
  {
    title: 'Lasaña Boloñesa',
    description: 'Capas de pasta con ragú de carne y bechamel gratinada.',
    image: '/branding/cocorico/default.png',
    prepTime: '30 min',
    cookTime: '60 min',
    servings: 8,
    difficulty: 'hard' as const,
    category: 'lunch',
    diet: [],
    rating: 4.9,
    likes: 187
  },
  {
    title: 'Pollo al Curry',
    description: 'Pollo en salsa de curry con leche de coco y especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '15 min',
    cookTime: '35 min',
    servings: 4,
    difficulty: 'medium' as const,
    category: 'dinner',
    diet: ['gluten-free'],
    rating: 4.6,
    likes: 91
  },
  {
    title: 'Brownies de Chocolate',
    description: 'Brownies densos y chocolatosos con nueces.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '30 min',
    servings: 12,
    difficulty: 'easy' as const,
    category: 'dessert',
    diet: ['vegetarian'],
    rating: 4.8,
    likes: 142
  },
  {
    title: 'Ramen Japonés',
    description: 'Sopa de fideos con caldo rico, huevo y verduras.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '25 min',
    cookTime: '40 min',
    servings: 4,
    difficulty: 'hard' as const,
    category: 'dinner',
    diet: [],
    rating: 4.7,
    likes: 103
  },
  {
    title: 'Pizza Margherita',
    description: 'Pizza clásica con tomate, mozzarella y albahaca fresca.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'medium' as const,
    category: 'dinner',
    diet: ['vegetarian'],
    rating: 4.8,
    likes: 167
  },
  {
    title: 'Fajitas de Res',
    description: 'Tiras de res salteadas con pimientos y cebolla.',
    image: '/branding/cocorico/cocorico-cutting.png',
    prepTime: '15 min',
    cookTime: '20 min',
    servings: 4,
    difficulty: 'easy' as const,
    category: 'dinner',
    diet: ['gluten-free'],
    rating: 4.5,
    likes: 76
  },
  {
    title: 'Tiramisú Italiano',
    description: 'Postre de café, mascarpone y bizcochos de soletilla.',
    image: '/branding/cocorico/chef.png',
    prepTime: '30 min',
    cookTime: '0 min',
    servings: 8,
    difficulty: 'medium' as const,
    category: 'dessert',
    diet: ['vegetarian'],
    rating: 4.9,
    likes: 201
  },
  {
    title: 'Pad Thai',
    description: 'Fideos de arroz salteados con camarones y cacahuates.',
    image: '/branding/cocorico/thinking.png',
    prepTime: '20 min',
    cookTime: '15 min',
    servings: 4,
    difficulty: 'medium' as const,
    category: 'dinner',
    diet: ['pescatarian', 'gluten-free'],
    rating: 4.7,
    likes: 118
  },
  {
    title: 'Hamburguesa Gourmet',
    description: 'Burger de res con queso cheddar, bacon y aguacate.',
    image: '/branding/cocorico/happy.png',
    prepTime: '15 min',
    cookTime: '12 min',
    servings: 4,
    difficulty: 'easy' as const,
    category: 'lunch',
    diet: [],
    rating: 4.6,
    likes: 95
  },
  {
    title: 'Risotto de Hongos',
    description: 'Arroz cremoso con hongos porcini y parmesano.',
    image: '/branding/cocorico/cocorico-cooking.png',
    prepTime: '10 min',
    cookTime: '30 min',
    servings: 4,
    difficulty: 'medium' as const,
    category: 'dinner',
    diet: ['vegetarian', 'gluten-free'],
    rating: 4.8,
    likes: 129
  },
  {
    title: 'Ceviche Peruano',
    description: 'Pescado marinado en limón con cebolla y cilantro.',
    image: '/branding/cocorico/default.png',
    prepTime: '20 min',
    cookTime: '0 min',
    servings: 6,
    difficulty: 'easy' as const,
    category: 'appetizer',
    diet: ['pescatarian', 'gluten-free'],
    rating: 4.7,
    likes: 84
  },
  {
    title: 'Tarta de Queso',
    description: 'Cheesecake cremoso con base de galleta y frutos rojos.',
    image: '/branding/cocorico/cocorico-smiling.png',
    prepTime: '25 min',
    cookTime: '50 min',
    servings: 10,
    difficulty: 'hard' as const,
    category: 'dessert',
    diet: ['vegetarian'],
    rating: 4.9,
    likes: 178
  },
  {
    title: 'Shakshuka',
    description: 'Huevos pochados en salsa de tomate con especias.',
    image: '/branding/cocorico/chef.png',
    prepTime: '10 min',
    cookTime: '25 min',
    servings: 4,
    difficulty: 'easy' as const,
    category: 'breakfast',
    diet: ['vegetarian', 'gluten-free'],
    rating: 4.6,
    likes: 87
  }
];

export default function RecipesClient() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<RecipeFilters>({
    sortBy: 'recent'
  });
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

  // Filter and sort recipes with useMemo for performance
  const filteredRecipes = useMemo(() => {
    const displayRecipes = showDemo ? DEMO_RECIPES : recipes;
    
    let filtered = displayRecipes.filter(recipe => {
      const title = 'title' in recipe ? recipe.title : '';
      const description = typeof recipe.description === 'string' ? recipe.description : '';
      
      // Search filter
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 description.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;
      
      // Time filter (only for demo recipes with prepTime/cookTime)
      if (filters.maxTime && showDemo && 'prepTime' in recipe && 'cookTime' in recipe) {
        const prepMin = parseInt(recipe.prepTime);
        const cookMin = parseInt(recipe.cookTime);
        const totalMin = prepMin + cookMin;
        if (totalMin > filters.maxTime) return false;
      }
      
      // Difficulty filter
      if (filters.difficulty && 'difficulty' in recipe) {
        if (recipe.difficulty !== filters.difficulty) return false;
      }
      
      // Category filter
      if (filters.category && 'category' in recipe) {
        if (recipe.category !== filters.category) return false;
      }
      
      // Diet filter (multi-select - recipe must match ALL selected diets)
      if (filters.diet && filters.diet.length > 0 && 'diet' in recipe) {
        const recipeDiet = recipe.diet || [];
        const hasAllDiets = filters.diet.every(d => recipeDiet.includes(d));
        if (!hasAllDiets) return false;
      }
      
      return true;
    });
    
    // Sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'recent':
            // For real recipes, sort by created_at; for demo, keep order
            if ('created_at' in a && 'created_at' in b) {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
          
          case 'popular':
            // Sort by likes (descending)
            const likesA = 'likes' in a ? a.likes : 0;
            const likesB = 'likes' in b ? b.likes : 0;
            return likesB - likesA;
          
          case 'rating':
            // Sort by rating (descending)
            const ratingA = 'rating' in a ? a.rating : 0;
            const ratingB = 'rating' in b ? b.rating : 0;
            return ratingB - ratingA;
          
          case 'time':
            // Sort by total time (ascending)
            if ('prepTime' in a && 'cookTime' in a && 'prepTime' in b && 'cookTime' in b) {
              const timeA = parseInt(a.prepTime) + parseInt(a.cookTime);
              const timeB = parseInt(b.prepTime) + parseInt(b.cookTime);
              return timeA - timeB;
            }
            return 0;
          
          default:
            return 0;
        }
      });
    }
    
    return filtered;
  }, [showDemo, recipes, searchQuery, filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <GlassCard className={cn("p-8")} variant={plan === 'premium' ? 'premium' : 'accent'}>
          <p className={plan === "premium" ? "glass-text-premium" : ""}>Cargando recetas...</p>
        </GlassCard>
      </div>
    );
  }

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

        {/* Search Bar */}
        <GlassCard className="p-4 mb-4" variant={plan === 'premium' ? 'premium' : 'base'}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <Input
              type="text"
              placeholder="Buscar recetas por nombre o ingredientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 dark:bg-neutral-900/50"
            />
          </div>
        </GlassCard>

        {/* Advanced Filters */}
        <div className="mb-6">
          <RecipeFiltersComponent
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ sortBy: 'recent' })}
          />
        </div>

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
                  "group overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:brightness-110 cursor-pointer",
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
                  {/* Difficulty Badge */}
                  {'difficulty' in recipe && recipe.difficulty && (
                    <Badge 
                      className={cn(
                        "absolute top-2 right-2 text-xs font-bold uppercase animate-in slide-in-from-right-2",
                        recipe.difficulty === 'easy' && "bg-green-500 text-white",
                        recipe.difficulty === 'medium' && "bg-yellow-500 text-white",
                        recipe.difficulty === 'hard' && "bg-red-500 text-white"
                      )}
                    >
                      {recipe.difficulty === 'easy' ? 'F\u00e1cil' : recipe.difficulty === 'medium' ? 'Medio' : 'Dif\u00edcil'}
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h3 className={cn(
                    "text-lg font-bold mb-2",
                    plan === "premium" ? "glass-text-premium" : "text-orange-900 dark:text-orange-300"
                  )}>
                    {'title' in recipe ? recipe.title : ''}
                  </h3>
                  <p className={cn(
                    "text-sm mb-3 line-clamp-2",
                    plan === "premium" ? "text-white/70" : "text-neutral-600 dark:text-neutral-400"
                  )}>
                    {'description' in recipe ? recipe.description : ''}
                  </p>
                  
                  {/* Diet Badges */}
                  {'diet' in recipe && recipe.diet && recipe.diet.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {recipe.diet.map((diet, dietIdx) => (
                        <Badge 
                          key={dietIdx} 
                          variant="outline"
                          className="text-[10px] animate-in slide-in-from-left-2 delay-75"
                        >
                          {diet === 'vegetarian' && '\ud83e\udd57 Vegetariano'}
                          {diet === 'vegan' && '\ud83c\udf31 Vegano'}
                          {diet === 'gluten-free' && '\ud83c\udf3e Sin gluten'}
                          {diet === 'dairy-free' && '\ud83e\udd5b Sin l\u00e1cteos'}
                          {diet === 'pescatarian' && '\ud83d\udc1f Pescetariano'}
                          {diet === 'keto' && '\ud83e\udd51 Keto'}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{'prepTime' in recipe ? recipe.prepTime : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{'servings' in recipe ? recipe.servings : ''}</span>
                      </div>
                    </div>
                    
                    {/* Rating & Likes */}
                    <div className="flex items-center gap-2">
                      {'rating' in recipe && recipe.rating && (
                        <div className="flex items-center gap-0.5 text-yellow-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-semibold">{recipe.rating}</span>
                        </div>
                      )}
                      {'likes' in recipe && recipe.likes && (
                        <div className="flex items-center gap-0.5 text-pink-500">
                          <Heart className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-semibold">{recipe.likes}</span>
                        </div>
                      )}
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
