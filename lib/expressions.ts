import { createServerSupabase } from "@/lib/supabase/server";
import { Expression } from "@/types/database.types";

export async function getExpressions(): Promise<Expression[]> {
  const supabase = await createServerSupabase();

  const { data, error } = await supabase
    .from("expressions")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching expressions:", error);
    return [];
  }

  return data as Expression[];
}
