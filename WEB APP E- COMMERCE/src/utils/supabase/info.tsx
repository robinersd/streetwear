export const projectId = "zppjqbzzdcteluneavhm";

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// An active project is configured only when a real URL is provided and it's not the dead demo reference
export const isSupabaseConfigured = Boolean(
  envUrl &&
  !envUrl.includes("YOUR_PROJECT_REF") &&
  !envUrl.includes("zppjqbzzdcteluneavhm")
);

export const supabaseUrl = (
  isSupabaseConfigured
    ? envUrl
    : `https://${projectId}.supabase.co`
).replace(/\/+$/, '');

export const apiUrl = `${supabaseUrl}/functions/v1/make-server-48a815c5`;
export const publicAnonKey = envAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcGpxYnp6ZGN0ZWx1bmVhdmhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NzgzNTQsImV4cCI6MjA3OTQ1NDM1NH0.Y-HxTUFA5DMzk9vi8ctp7xZQ4FDFzRmXHiWgJrsxoVY";
