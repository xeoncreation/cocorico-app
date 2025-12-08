"use client";

import { useState } from "react";
import { Scan, FileText, GitCompare, Camera, Upload } from "lucide-react";
import { ToolSelector, Tool, ToolLayout } from "@/components/ui/tool-selector";
import { motion } from "framer-motion";
import Wallpaper from "@/components/layout/Wallpaper";

const ANALYSIS_TOOLS: Tool[] = [
  {
    id: "scanner",
    icon: <Scan />,
    label: "Escanear producto",
    description: "Código de barras",
  },
  {
    id: "nutrition",
    icon: <FileText />,
    label: "Análisis nutricional",
    description: "Analiza una receta",
  },
  {
    id: "compare",
    icon: <GitCompare />,
    label: "Comparar productos",
    description: "Compara opciones",
  },
];

export default function AnalysisPage() {
  const [selectedTool, setSelectedTool] = useState("scanner");

  return (
    <>
      <Wallpaper
        imageLight="/branding/COCORICO SCAN — Fondo tech + alimentos, modo claro.png"
        imageDark="/branding/COCORICO SCAN — Fondo futurista, modo oscuro.png"
      />
      <ToolLayout
        title="Análisis de Alimentos 🔬"
        subtitle="Escanea productos, analiza información nutricional y compara opciones para tomar mejores decisiones."
      >
        {/* Tool Selector */}
        <div className="max-w-4xl mx-auto mb-8">
          <ToolSelector
            tools={ANALYSIS_TOOLS}
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            layout="grid"
          />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {selectedTool === "scanner" && <ScannerView />}
          {selectedTool === "nutrition" && <NutritionView />}
          {selectedTool === "compare" && <CompareView />}
        </div>
      </ToolLayout>
    </>
  );
}

function ScannerView() {
  const [scanning, setScanning] = useState(false);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[500px]">
      {/* GIF de scanner */}
      <div className="mb-6 rounded-xl overflow-hidden max-w-2xl mx-auto">
        <img 
          src="/branding/scanner- video.gif" 
          alt="Escáner en acción"
          className="w-full h-auto"
        />
      </div>
      
      <div className="flex flex-col items-center justify-center h-full">
        {/* Camera/Scanner Area */}
        <div className="w-full max-w-md aspect-video bg-black/30 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center mb-6 relative overflow-hidden">
          {scanning ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 border-4 border-cocorico-turquoise rounded-xl"
            />
          ) : (
            <Camera className="w-16 h-16 text-white/40" />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full max-w-md">
          <button
            onClick={() => setScanning(!scanning)}
            className="flex-1 bg-cocorico-turquoise hover:bg-cocorico-turquoise/90 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Camera className="w-5 h-5" />
            {scanning ? "Detener" : "Abrir Cámara"}
          </button>
          <button className="flex-1 bg-white/10 hover:bg-white/15 border border-white/20 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2">
            <Upload className="w-5 h-5" />
            Subir Imagen
          </button>
        </div>

        <p className="text-white/50 text-sm text-center mt-6">
          Escanea el código de barras de cualquier producto para ver su información nutricional
        </p>
      </div>
    </div>
  );
}

function NutritionView() {
  const [recipeText, setRecipeText] = useState("");

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[500px]">
      {/* GIF de información nutricional */}
      <div className="mb-6 rounded-xl overflow-hidden max-w-2xl mx-auto">
        <img 
          src="/branding/informacion nutricional - video.gif" 
          alt="Información nutricional"
          className="w-full h-auto"
        />
      </div>
      
      <div className="mb-6">
        <label className="text-white/80 text-sm font-medium mb-2 block">
          Pega aquí la receta o lista de ingredientes
        </label>
        <textarea
          value={recipeText}
          onChange={(e) => setRecipeText(e.target.value)}
          placeholder="Ej: 200g de pasta, 100g de tomate, 50g de queso parmesano, aceite de oliva..."
          rows={8}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-cocorico-naranja/40 transition-colors resize-none"
        />
      </div>

      <button className="w-full bg-cocorico-naranja hover:bg-cocorico-naranja/90 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2">
        <FileText className="w-5 h-5" />
        Analizar Información Nutricional
      </button>

      {/* Example Results (shown when there's data) */}
      {recipeText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Calorías", value: "450 kcal", color: "bg-red-500/20" },
            { label: "Proteínas", value: "18g", color: "bg-blue-500/20" },
            { label: "Carbohidratos", value: "52g", color: "bg-yellow-500/20" },
            { label: "Grasas", value: "15g", color: "bg-green-500/20" },
          ].map((nutrient) => (
            <div
              key={nutrient.label}
              className={`${nutrient.color} backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center`}
            >
              <div className="text-2xl font-bold text-white mb-1">{nutrient.value}</div>
              <div className="text-xs text-white/60">{nutrient.label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function CompareView() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 min-h-[500px]">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Product 1 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="text-white/80 text-sm font-medium mb-3">Producto 1</div>
          <div className="aspect-square bg-black/20 rounded-xl flex items-center justify-center mb-3">
            <Upload className="w-8 h-8 text-white/40" />
          </div>
          <button className="w-full bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl text-sm transition-colors">
            Escanear o Subir
          </button>
        </div>

        {/* Product 2 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="text-white/80 text-sm font-medium mb-3">Producto 2</div>
          <div className="aspect-square bg-black/20 rounded-xl flex items-center justify-center mb-3">
            <Upload className="w-8 h-8 text-white/40" />
          </div>
          <button className="w-full bg-white/10 hover:bg-white/15 text-white py-2 rounded-xl text-sm transition-colors">
            Escanear o Subir
          </button>
        </div>
      </div>

      <button className="w-full bg-cocorico-turquoise hover:bg-cocorico-turquoise/90 text-white py-4 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2">
        <GitCompare className="w-5 h-5" />
        Comparar Productos
      </button>

      <p className="text-white/50 text-sm text-center mt-6">
        Compara dos productos para ver cuál es más saludable o se ajusta mejor a tus necesidades
      </p>
    </div>
  );
}
