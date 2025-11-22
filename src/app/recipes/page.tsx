export const dynamic = 'force-dynamic';
import RecipesClient from '@/components/recipes/RecipesClient';
import { AppBackground } from '@/components/layout/AppBackground';
import LegacyPageWrapper from '@/components/layout/LegacyPageWrapper';

export default function RecipesPage() {
  return (
    <LegacyPageWrapper>
      <AppBackground variantOverride="recipes-neutral">
        <RecipesClient />
      </AppBackground>
    </LegacyPageWrapper>
  );
}