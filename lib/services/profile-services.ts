import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export const ProfileService = {
  // Get the current user's profile
  async getCurrentUserProfile(): Promise<Profile | null> {
    const supabase = createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error("Error getting user:", userError)
      return null
    }
    
    // Get the user's profile
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
    
    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }
    
    return data
  }
}