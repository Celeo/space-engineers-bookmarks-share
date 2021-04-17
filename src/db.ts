import { createClient } from "@supabase/supabase-js";

export interface WorldInfoBasic {
  id: string;
  name: string;
}

export interface WorldInfoFull {
  id: string;
  name: string;
}

export interface Bookmark {
  id: number;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  world_id: string;
}

const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxODE3ODE5NSwiZXhwIjoxOTMzNzU0MTk1fQ.f_55XTes2oyFVNxNyEoXPyX1zslbiwFaaTqwS6tH9jE";
const SUPABASE_URL = "https://fgjmglnuzhqwlxmzfivm.supabase.co";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
