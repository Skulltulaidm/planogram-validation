import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

type Verification = Database["public"]["Tables"]["verifications"]["Row"]
type VerificationInsert = Database["public"]["Tables"]["verifications"]["Insert"]
type AnalysisPoint = Database["public"]["Tables"]["analysis_points"]["Row"]
type AnalysisPointInsert = Database["public"]["Tables"]["analysis_points"]["Insert"]
type Shelf = Database["public"]["Tables"]["shelves"]["Row"]

// joined shelves
export type VerificationWithShelf = Verification & {
  shelves: Shelf | null
}

export const VerificationsService = {
  async getEmployeeVerifications(employeeId: string): Promise<VerificationWithShelf[]> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("verifications")
      .select(`
        *,
        shelves (
          name,
          planogram_id,
          store_id
        )
      `)
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching verifications:", error)
      return []
    }

    return (data || []) as VerificationWithShelf[]
  },

  async getVerification(id: string): Promise<{ verification: VerificationWithShelf | null; analysisPoints: AnalysisPoint[] }> {
    const supabase = await createClient()

    const { data: verification, error: verificationError } = await supabase
      .from("verifications")
      .select(`
        *,
        shelves (
          name,
          planogram_id,
          store_id
        )
      `)
      .eq("id", id)
      .single()

    if (verificationError) {
      console.error("Error fetching verification:", verificationError)
      return { verification: null, analysisPoints: [] }
    }

    const { data: analysisPoints, error: pointsError } = await supabase
      .from("analysis_points")
      .select(`
        *
      `)
      .eq("verification_id", id)

    if (pointsError) {
      console.error("Error fetching analysis points:", pointsError)
      return { verification: verification as VerificationWithShelf, analysisPoints: [] }
    }

    return {
      verification: verification as VerificationWithShelf,
      analysisPoints: analysisPoints || [],
    }
  },

  async createVerification(
    verification: VerificationInsert,
    analysisPoints: Omit<AnalysisPointInsert, "verification_id">[],
  ): Promise<{ verification: Verification | null; analysisPoints: AnalysisPoint[] }> {
    const supabase = await createClient()

    const { data: newVerification, error: verificationError } = await supabase
      .from("verifications")
      .insert(verification)
      .select(`
        *
      `)
      .single()

    if (verificationError) {
      console.error("Error creating verification:", verificationError)
      return { verification: null, analysisPoints: [] }
    }

    const pointsWithVerificationId = analysisPoints.map((point) => ({
      ...point,
      verification_id: newVerification.id,
    }))

    const { data: newPoints, error: pointsError } = await supabase
      .from("analysis_points")
      .insert(pointsWithVerificationId)
      .select(`
        *
      `)

    if (pointsError) {
      console.error("Error creating analysis points:", pointsError)
      // Still attempt to delete the verification but don't throw if that fails
      try {
        await supabase.from("verifications").delete().eq("id", newVerification.id)
      } catch (deleteError) {
        console.error("Error deleting verification after analysis points failure:", deleteError)
      }
      return { verification: null, analysisPoints: [] }
    }

    return {
      verification: newVerification,
      analysisPoints: newPoints || [],
    }
  },

  // Subir una imagen a Supabase Storage
  async uploadImage(file: File, employeeId: string): Promise<string | null> {
    const supabase = await createClient()

    // Crear un nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${employeeId}/${Date.now()}.${fileExt}`
    const filePath = `verification-images/${fileName}`

    const { data, error } = await supabase.storage.from("planogram-images").upload(filePath, file)

    if (error) {
      console.error("Error uploading image:", error)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("planogram-images").getPublicUrl(filePath)

    return publicUrl
  },
}