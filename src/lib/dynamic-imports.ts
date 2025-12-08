/**
 * Centralized Dynamic Imports Configuration
 * 
 * This file manages all dynamic imports with their loading states
 * to optimize bundle size and improve initial load performance.
 */

import dynamic from "next/dynamic";

/**
 * Scanner Components
 * Heavy component with camera/barcode processing
 */
export const DynamicBarcodeScanner = dynamic(
  () => import("@/components/scanner/BarcodeScanner"),
  {
    ssr: false,
  }
);

/**
 * Chat Components
 * Includes real-time functionality
 */
export const DynamicChatMessagesClient = dynamic(
  () => import("@/app/[locale]/community/chat/community-chat-client"),
  {
    ssr: false,
  }
);

/**
 * Chart Components (Recharts library)
 */
export const DynamicLineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  {
    ssr: false,
  }
);

export const DynamicBarChart = dynamic(
  () => import("recharts").then((mod) => mod.BarChart),
  {
    ssr: false,
  }
);

export const DynamicPieChart = dynamic(
  () => import("recharts").then((mod) => mod.PieChart),
  {
    ssr: false,
  }
);
