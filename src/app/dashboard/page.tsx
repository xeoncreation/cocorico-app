

"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import XpHud from "@/components/dashboard/XpHud";
import LegacyPageWrapper from "@/components/layout/LegacyPageWrapper";
import Wallpaper from "@/components/layout/Wallpaper";

export default function DashboardPage() {
  // TODO: Integrar lógica real de recetas y usuario
  const recipes: any[] = [];
  return (
    <>
      <Wallpaper
