export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          phone_number: string
          password_hash: string
          name: string | null
          email: string | null
          total_points: number
          current_points: number
          total_earned_points: number
          total_used_points: number
          first_visit_date: string | null
          last_visit_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          password_hash: string
          name?: string | null
          email?: string | null
          total_points?: number
          current_points?: number
          total_earned_points?: number
          total_used_points?: number
          first_visit_date?: string | null
          last_visit_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          password_hash?: string
          name?: string | null
          email?: string | null
          total_points?: number
          current_points?: number
          total_earned_points?: number
          total_used_points?: number
          first_visit_date?: string | null
          last_visit_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      casts: {
        Row: {
          id: string
          name: string
          code: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          code?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      visits: {
        Row: {
          id: string
          customer_id: string
          visit_date: string
          amount: number
          points_earned: number
          points_used: number
          cast_id: string | null
          service_type: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          visit_date: string
          amount: number
          points_earned?: number
          points_used?: number
          cast_id?: string | null
          service_type: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          visit_date?: string
          amount?: number
          points_earned?: number
          points_used?: number
          cast_id?: string | null
          service_type?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      point_transactions: {
        Row: {
          id: string
          customer_id: string
          visit_id: string | null
          transaction_type: string
          points: number
          balance_after: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          visit_id?: string | null
          transaction_type: string
          points: number
          balance_after: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          visit_id?: string | null
          transaction_type?: string
          points?: number
          balance_after?: number
          description?: string | null
          created_at?: string
        }
      }
      settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          customer_id: string
          alert_type: string
          message: string
          is_resolved: boolean
          notified_at: string | null
          resolved_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          alert_type: string
          message: string
          is_resolved?: boolean
          notified_at?: string | null
          resolved_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          alert_type?: string
          message?: string
          is_resolved?: boolean
          notified_at?: string | null
          resolved_at?: string | null
          created_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string | null
          role: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string | null
          role?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

