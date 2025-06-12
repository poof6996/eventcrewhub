"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export function ToastHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const reviewSuccess = searchParams.get("review_success");
    if (reviewSuccess === "true") {
      toast.success("Thank you for your review!");
    }
  }, [searchParams]);

  // This component renders nothing, it just handles the toast logic
  return null; 
}