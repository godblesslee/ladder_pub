import { createClient } from "@/lib/supabase/browser";

export async function sendMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      should_create_user: false,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
