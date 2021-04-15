import { createClient } from "@supabase/supabase-js";

export interface World {
  id: string;
  name: string;
}

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODE3ODE5NSwiZXhwIjoxOTMzNzU0MTk1fQ.f_55XTes2oyFVNxNyEoXPyX1zslbiwFaaTqwS6tH9jE";
const SUPABASE_URL = "https://fgjmglnuzhqwlxmzfivm.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
