export interface Expression {
  id: string;
  expression: string;
  meaning: string;
  example_en: string;
  example_kr: string;
  origin_url?: string | null;
  tags?: string[] | null;
  published_at: string;
  created_at: string;
}
