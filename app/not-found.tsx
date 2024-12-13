"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="mt-4 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button
        className="mt-6"
        onClick={() => router.push("/")} 
      >
        Go Back Home
      </Button>
    </div>
  );
}
