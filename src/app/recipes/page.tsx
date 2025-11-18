export const dynamic = 'force-dynamic';
import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';

export default function RecipesPage() {
  return (
    <AppBackground variantOverride="recipes-neutral">
      <RecipesClient />
    </AppBackground>
  );
}