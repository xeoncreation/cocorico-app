import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';

export const dynamic = 'force-dynamic';

export default function RecipesPage() {
  return (
    <AppBackground variantOverride="recipes-neutral">
      <RecipesClient />
    </AppBackground>
  );
}
