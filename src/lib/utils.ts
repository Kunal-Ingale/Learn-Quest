  import { clsx, type ClassValue } from "clsx"
  import { twMerge } from "tailwind-merge"

  export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
  }



  export async function fetcher<T>(url: string): Promise<T> {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const data = await res.json();

    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format");
    }

    return data;
  }
