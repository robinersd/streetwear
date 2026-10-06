import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the server environment.");
}

// This module runs only in the Supabase Edge Function, never in the browser.
export const supabase = createClient(supabaseUrl, supabaseKey);

// ---- Set a value ----
export const set = async (key: string, value: unknown): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_48a815c5")
    .upsert({ key, value } as any);

  if (error) throw new Error(error.message);
};

// ---- Get a value ----
export const get = async (key: string): Promise<unknown> => {
  const { data, error } = await supabase
    .from("kv_store_48a815c5")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as any)?.value;
};

// ---- Delete a value ----
export const del = async (key: string): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_48a815c5")
    .delete()
    .eq("key", key);

  if (error) throw new Error(error.message);
};

// ---- Set multiple values ----
export const mset = async (keys: string[], values: unknown[]): Promise<void> => {
  const rows = keys.map((k, i) => ({ key: k, value: values[i] }));

  const { error } = await supabase
    .from("kv_store_48a815c5")
    .upsert(rows as any);

  if (error) throw new Error(error.message);
};

// ---- Get multiple values ----
export const mget = async (keys: string[]): Promise<unknown[]> => {
  const { data, error } = await supabase
    .from("kv_store_48a815c5")
    .select("value")
    .in("key", keys);

  if (error) throw new Error(error.message);
  return (data as any)?.map((d: any) => d.value) ?? [];
};

// ---- Delete multiple ----
export const mdel = async (keys: string[]): Promise<void> => {
  const { error } = await supabase
    .from("kv_store_48a815c5")
    .delete()
    .in("key", keys);

  if (error) throw new Error(error.message);
};

// ---- Search by prefix ----
export const getByPrefix = async (prefix: string): Promise<unknown[]> => {
  const { data, error } = await supabase
    .from("kv_store_48a815c5")
    .select("value")
    .like("key", `${prefix}%`);

  if (error) throw new Error(error.message);
  return (data as any)?.map((d: any) => d.value) ?? [];
};