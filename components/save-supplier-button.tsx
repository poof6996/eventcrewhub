"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleSaveSupplier } from "@/actions/user";

interface SaveSupplierButtonProps {
  supplierId: number;
  isInitiallySaved: boolean;
}

export function SaveSupplierButton({ supplierId, isInitiallySaved }: SaveSupplierButtonProps) {
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await toggleSaveSupplier(supplierId);
      setIsSaved(result.saved);
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      <Heart className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-red-500' : 'text-gray-500'}`} />
      <span>{isSaved ? "Saved" : "Save"}</span>
    </button>
  );
}