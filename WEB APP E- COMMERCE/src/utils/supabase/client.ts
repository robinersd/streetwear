import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, publicAnonKey, isSupabaseConfigured } from "./info";
import { getStoredSession, clearStoredSession, localSignUp, localSignIn } from "./localAuth";

export type Database = {
  public: {
    Tables: {
      kv_store_48a815c5: {
        Row: {
          key: string;
          value: any;
        };
        Insert: {
          key: string;
          value: any;
        };
        Update: {
          key?: string;
          value?: any;
        };
      };
    };
  };
};

let realSupabaseInstance: SupabaseClient<Database> | null = null;

if (isSupabaseConfigured) {
  try {
    realSupabaseInstance = createSupabaseClient<Database>(supabaseUrl, publicAnonKey);
  } catch (err) {
    console.warn("Failed to initialize remote Supabase client:", err);
  }
}

export function createClient(): any {
  return {
    auth: {
      getSession: async () => {
        if (realSupabaseInstance) {
          try {
            const res = await realSupabaseInstance.auth.getSession();
            if (res.data?.session) return res;
          } catch (e) {
            console.warn("Remote getSession failed, checking local session:", e);
          }
        }
        const localSession = getStoredSession();
        return { data: { session: localSession }, error: null };
      },

      signOut: async () => {
        clearStoredSession();
        if (realSupabaseInstance) {
          try {
            await realSupabaseInstance.auth.signOut();
          } catch {
            // ignore network failure on signout
          }
        }
        return { error: null };
      },

      signUp: async (params: any) => {
        if (realSupabaseInstance) {
          try {
            return await realSupabaseInstance.auth.signUp(params);
          } catch (e) {
            console.warn("Remote signUp failed, using local signUp:", e);
          }
        }
        const res = localSignUp(
          params.email,
          params.password,
          params.options?.data?.username || ''
        );
        return { data: { user: res.user, session: getStoredSession() }, error: null };
      },

      signInWithPassword: async (params: any) => {
        if (realSupabaseInstance) {
          try {
            return await realSupabaseInstance.auth.signInWithPassword(params);
          } catch (e) {
            console.warn("Remote signIn failed, using local signIn:", e);
          }
        }
        const res = localSignIn(params.email, params.password);
        return { data: { user: res.user, session: getStoredSession() }, error: null };
      },

      onAuthStateChange: (callback: any) => {
        if (realSupabaseInstance) {
          return realSupabaseInstance.auth.onAuthStateChange(callback);
        }
        return {
          data: {
            subscription: {
              unsubscribe: () => {}
            }
          }
        };
      }
    }
  };
}

export const supabase = createClient();
