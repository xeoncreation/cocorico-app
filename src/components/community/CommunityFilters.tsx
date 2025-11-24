"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FilterTab = "recent" | "popular" | "following";

interface CommunityFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: FilterTab) => void;
  activeFilter: FilterTab;
}

export default function CommunityFilters({ onSearch, onFilterChange, activeFilter }: CommunityFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          type="text"
          placeholder="Buscar en la comunidad..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={activeFilter === "recent" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("recent")}
        >
          Recientes
        </Button>
        <Button
          variant={activeFilter === "popular" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("popular")}
        >
          Populares
        </Button>
        <Button
          variant={activeFilter === "following" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("following")}
        >
          Siguiendo
        </Button>
      </div>
    </div>
  );
}
