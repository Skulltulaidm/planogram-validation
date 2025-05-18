import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"

type Task = Database['public']['Tables']['tasks']['Row'] & {
  shelves?: {
    name: string
    planogram_id?: string
    store_id?: string
    planograms?: {
      name: string
    }
  }
}

type TaskInsert = Database['public']['Tables']['tasks']['Insert']
type TaskUpdate = Database['public']['Tables']['tasks']['Update']

export const TasksService = {
  // Obtener todas las tareas de un empleado
  async getEmployeeTasks(employeeId: string): Promise<Task[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("tasks")
      .select(`
        *,
        shelves (
          name,
          planogram_id,
          store_id,
          planograms:planogram_id (
            name
          )
        )
      `)
      .eq("employee_id", employeeId)
      .order("scheduled_time", { ascending: true })

    if (error) {
      console.error("Error fetching tasks:", error)
      return []
    }

    return data || []
  },

  // Obtener tareas pendientes de un empleado
  async getPendingTasks(employeeId: string): Promise<Task[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        shelves (
          name
        )
      `)
      .eq('employee_id', employeeId)
      .in('status', ['pending', 'overdue'])
      .order('priority', { ascending: false })
      .order('scheduled_time', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error al obtener tareas:', error)
      return []
    }

    return data || []
  },

  // Crear una nueva tarea
  async createTask(task: TaskInsert): Promise<Task | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("tasks")
      .insert(task)
      .select(`
        *,
        shelves (
          name
        )
      `)
      .single()

    if (error) {
      console.error("Error creating task:", error)
      return null
    }

    return data
  },

  // Actualizar una tarea
  async updateTask(id: string, updates: TaskUpdate): Promise<Task | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        shelves (
          name
        )
      `)
      .single()

    if (error) {
      console.error("Error updating task:", error)
      return null
    }

    return data
  },

  // Marcar una tarea como completada
  async completeTask(id: string): Promise<Task | null> {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(`
        *,
        shelves (
          name
        )
      `)
      .single()

    if (error) {
      console.error("Error completing task:", error)
      return null
    }

    return data
  },

  // Eliminar una tarea
  async deleteTask(id: string): Promise<boolean> {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
      return false
    }

    return true
  },
}