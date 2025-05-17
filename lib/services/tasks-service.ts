import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Task = Database["public"]["Tables"]["tasks"]["Row"]
type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"]
type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"]

export const TasksService = {
  // Obtener todas las tareas de un empleado
  async getEmployeeTasks(employeeId: string): Promise<Task[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("tasks")
      .select("*, shelves(name, planogram_id, store_id, planograms:planogram_id(name))")
      .eq("employee_id", employeeId)
      .order("scheduled_time", { ascending: true })

    if (error) {
      console.error("Error fetching tasks:", error)
      throw error
    }

    return data || []
  },

  // Obtener tareas pendientes de un empleado
  async getPendingTasks(employeeId: string): Promise<Task[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("tasks")
      .select("*, shelves(name, planogram_id, store_id, planograms:planogram_id(name))")
      .eq("employee_id", employeeId)
      .eq("status", "pending")
      .order("scheduled_time", { ascending: true })

    if (error) {
      console.error("Error fetching pending tasks:", error)
      throw error
    }

    return data || []
  },

  // Crear una nueva tarea
  async createTask(task: TaskInsert): Promise<Task> {
    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").insert(task).select().single()

    if (error) {
      console.error("Error creating task:", error)
      throw error
    }

    return data
  },

  // Actualizar una tarea
  async updateTask(id: string, updates: TaskUpdate): Promise<Task> {
    const supabase = createClient()
    const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("Error updating task:", error)
      throw error
    }

    return data
  },

  // Marcar una tarea como completada
  async completeTask(id: string): Promise<Task> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error completing task:", error)
      throw error
    }

    return data
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      throw error
    }
  },
}
