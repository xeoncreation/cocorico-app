import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import {
  LiquidGlassContainer,
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassInput,
  LiquidGlassBadge,
} from '@/components/ui/LiquidGlass';
import { ShoppingCart, Plus, Check, X, Trash2 } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'shopping' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  checked: boolean;
  category: string;
}

const demoItems: ShoppingItem[] = [
  { id: '1', name: 'Tomates frescos', quantity: '1 kg', checked: false, category: 'Verduras' },
  { id: '2', name: 'Pollo orgánico', quantity: '500g', checked: true, category: 'Carnes' },
  { id: '3', name: 'Aceite de oliva', quantity: '1 L', checked: false, category: 'Despensa' },
  { id: '4', name: 'Pasta integral', quantity: '500g', checked: true, category: 'Despensa' },
  { id: '5', name: 'Queso parmesano', quantity: '200g', checked: false, category: 'Lácteos' },
  { id: '6', name: 'Albahaca fresca', quantity: '1 manojo', checked: false, category: 'Hierbas' },
];

export default async function ListaCompraPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <LiquidGlassContainer fullscreen>
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/branding/lista compra - video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lista de Compra
            </h1>
          </div>
          <p className="text-gray-300">
            Organiza tus ingredientes y haz la compra más eficiente
          </p>
        </div>

        {/* Add Item Card */}
        <LiquidGlassCard variant="ios" blur="xl" className="mb-6">
          <div className="flex gap-3">
            <LiquidGlassInput
              placeholder="Agregar nuevo producto..."
              className="flex-1"
              icon={<Plus className="w-5 h-5" />}
            />
            <LiquidGlassButton variant="primary" size="lg">
              <Plus className="w-5 h-5" />
            </LiquidGlassButton>
          </div>
        </LiquidGlassCard>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-blue-400">6</div>
            <div className="text-sm text-gray-400">Total</div>
          </LiquidGlassCard>
          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-green-400">2</div>
            <div className="text-sm text-gray-400">Comprados</div>
          </LiquidGlassCard>
          <LiquidGlassCard variant="subtle" blur="md" className="text-center">
            <div className="text-3xl font-bold text-orange-400">4</div>
            <div className="text-sm text-gray-400">Pendientes</div>
          </LiquidGlassCard>
        </div>

        {/* Shopping List */}
        <div className="space-y-3">
          {demoItems.map((item) => (
            <LiquidGlassCard
              key={item.id}
              variant="frosted"
              blur="lg"
              className={`transition-all ${item.checked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-4">
                {/* Checkbox */}
                <button
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.checked
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-400 hover:border-green-400'
                  }`}
                >
                  {item.checked && <Check className="w-4 h-4 text-white" />}
                </button>

                {/* Item Info */}
                <div className="flex-1">
                  <div className={`font-medium ${item.checked ? 'line-through text-gray-500' : 'text-white'}`}>
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <span>{item.quantity}</span>
                    <span>•</span>
                    <LiquidGlassBadge variant="primary" size="sm">
                      {item.category}
                    </LiquidGlassBadge>
                  </div>
                </div>

                {/* Actions */}
                <LiquidGlassButton variant="danger" size="sm">
                  <Trash2 className="w-4 h-4" />
                </LiquidGlassButton>
              </div>
            </LiquidGlassCard>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4">
          <LiquidGlassButton variant="default" size="lg" className="flex-1">
            <X className="w-5 h-5 mr-2" />
            Limpiar Completados
          </LiquidGlassButton>
          <LiquidGlassButton variant="primary" size="lg" className="flex-1">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ir a Comprar
          </LiquidGlassButton>
        </div>
      </div>
    </LiquidGlassContainer>
  );
}
