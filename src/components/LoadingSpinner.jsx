import React from "react";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-2 text-indigo-600">
      <Loader2 className="animate-spin w-12 h-12" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
}
