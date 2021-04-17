import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface WorldInfoBasic {
  id: string;
  name: string;
}

export interface WorldInfoFull {
  id: string;
  name: string;
}

export interface Coordinate {
  id: number;
  name: string;
  x: number;
  y: number;
  z: number;
  color: string;
  world_id: string;
}

export const supabase = (): SupabaseClient => {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;
  if (!url || !key) {
    throw new Error("Supabase URL or key missing from environment");
  }
  return createClient(url, key);
};
