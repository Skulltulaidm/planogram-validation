import { createClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/database.types"
import { startOfWeek, endOfWeek, subWeeks, parseISO } from "date-fns"

type Verification = Database["public"]["Tables"]["verifications"]["Row"] & {
  shelves?: {
    store_id?: string
    planogram_id?: string
    planograms?: {
      department: string
    }
  }
}

export const ComplianceService = {
  // Get current compliance score for an employee (average of recent verifications)
  async getCurrentCompliance(employeeId: string): Promise<number> {
    if (!employeeId) {
      console.error("No employee ID provided to getCurrentCompliance")
      return 0
    }

    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("verifications")
        .select("compliance")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error fetching current compliance:", error)
        return 0
      }

      if (!data || data.length === 0) return 0

      const avgCompliance = data.reduce((sum, v) => sum + v.compliance, 0) / data.length
      return Math.round(avgCompliance)
    } catch (err) {
      console.error("Unexpected error in getCurrentCompliance:", err)
      return 0
    }
  },

  // Calculate weekly compliance (average of all verifications in the week)
  async getWeeklyCompliance(employeeId: string, weekStartDate: Date): Promise<number> {
    if (!employeeId) {
      console.error("No employee ID provided to getWeeklyCompliance")
      return 0
    }

    try {
      const supabase = await createClient()
      
      const startDate = startOfWeek(weekStartDate, { weekStartsOn: 1 })
      const endDate = endOfWeek(weekStartDate, { weekStartsOn: 1 })
      
      const { data, error } = await supabase
        .from("verifications")
        .select("compliance")
        .eq("employee_id", employeeId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())

      if (error) {
        console.error("Error fetching weekly compliance:", error)
        return 0
      }

      if (!data || data.length === 0) return 0

      const avgCompliance = data.reduce((sum, v) => sum + v.compliance, 0) / data.length
      return Math.round(avgCompliance)
    } catch (err) {
      console.error("Unexpected error in getWeeklyCompliance:", err)
      return 0
    }
  },

  // (current week vs previous week)
  async getComplianceTrend(employeeId: string): Promise<{ 
    trend: string; 
    currentCompliance: number;
    previousCompliance: number;
  }> {
    if (!employeeId) {
      console.error("No employee ID provided to getComplianceTrend")
      return { 
        trend: "0%",
        currentCompliance: 0,
        previousCompliance: 0
      }
    }

    try {
      const currentDate = new Date()
      const previousWeekDate = subWeeks(currentDate, 1)
      
      const currentWeekCompliance = await this.getWeeklyCompliance(employeeId, currentDate)
      const previousWeekCompliance = await this.getWeeklyCompliance(employeeId, previousWeekDate)
      
      // Calculate trend
      if (previousWeekCompliance === 0) {
        return { 
          trend: currentWeekCompliance > 0 ? `+${currentWeekCompliance}%` : "0%",
          currentCompliance: currentWeekCompliance,
          previousCompliance: 0
        }
      }
      
      const difference = currentWeekCompliance - previousWeekCompliance
      const percentageDifference = Math.round((difference / previousWeekCompliance) * 100)
      
      const trendText = percentageDifference > 0 
        ? `+${percentageDifference}%` 
        : `${percentageDifference}%`
      
      return { 
        trend: trendText,
        currentCompliance: currentWeekCompliance,
        previousCompliance: previousWeekCompliance
      }
    } catch (err) {
      console.error("Unexpected error in getComplianceTrend:", err)
      return { 
        trend: "0%",
        currentCompliance: 0,
        previousCompliance: 0
      }
    }
  },

  // Get store compliance based on verifications
  async getStoreCompliance(storeId: string): Promise<number> {
    if (!storeId) {
      console.error("No store ID provided to getStoreCompliance")
      return 0
    }

    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("verifications")
        .select("compliance, shelves(store_id)")
        .eq("shelves.store_id", storeId)
        .order("created_at", { ascending: false })
        .limit(20)

      if (error) {
        console.error("Error fetching store compliance:", error)
        return 0
      }

      if (!data || data.length === 0) return 0

      const avgCompliance = data.reduce((sum, v) => sum + v.compliance, 0) / data.length
      return Math.round(avgCompliance)
    } catch (err) {
      console.error("Unexpected error in getStoreCompliance:", err)
      return 0
    }
  },

  // Get department compliance (average compliance for planograms in a department)
  async getDepartmentCompliance(department: string): Promise<number> {
    if (!department) {
      console.error("No department provided to getDepartmentCompliance")
      return 0
    }

    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("verifications")
        .select("compliance, shelves(planogram_id, planograms:planogram_id(department))")
        .eq("shelves.planograms.department", department)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        console.error("Error fetching department compliance:", error)
        return 0
      }

      if (!data || data.length === 0) return 0

      const avgCompliance = data.reduce((sum, v) => sum + v.compliance, 0) / data.length
      return Math.round(avgCompliance)
    } catch (err) {
      console.error("Unexpected error in getDepartmentCompliance:", err)
      return 0
    }
  },

  // Get verification history with date ranges
  async getComplianceHistory(
    employeeId: string, 
    startDate: Date, 
    endDate: Date = new Date()
  ): Promise<{ date: string; compliance: number }[]> {
    if (!employeeId) {
      console.error("No employee ID provided to getComplianceHistory")
      return []
    }

    try {
      const supabase = await createClient()
      
      const { data, error } = await supabase
        .from("verifications")
        .select("compliance, created_at")
        .eq("employee_id", employeeId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching compliance history:", error)
        return []
      }

      if (!data || data.length === 0) return []

      // Group by day and calculate average compliance for each day
      const dailyCompliance = data.reduce((result: Record<string, number[]>, item) => {
        const date = parseISO(item.created_at).toISOString().split('T')[0]
        if (!result[date]) result[date] = []
        result[date].push(item.compliance)
        return result
      }, {})

      // Calculate average for each day
      return Object.entries(dailyCompliance).map(([date, values]) => ({
        date,
        compliance: Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      }))
    } catch (err) {
      console.error("Unexpected error in getComplianceHistory:", err)
      return []
    }
  }
}