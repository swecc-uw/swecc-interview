export type Json =
  | string
  | number
  | boolean
  | undefined
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      email_notifications: {
        Row: {
          contents: string
          created_at: string
          form_id: number
          id: number
          subject: string
          user_id: string
        }
        Insert: {
          contents: string
          created_at?: string
          form_id: number
          id?: number
          subject: string
          user_id?: string
        }
        Update: {
          contents?: string
          created_at?: string
          form_id?: number
          id?: number
          subject?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_emails_form_id_fkey'
            columns: ['form_id']
            isOneToOne: false
            referencedRelation: 'forms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_emails_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['user_id']
          }
        ]
      }
      forms: {
        Row: {
          created_at: string
          id: number
          state: string
        }
        Insert: {
          created_at?: string
          id?: number
          state?: string
        }
        Update: {
          created_at?: string
          id?: number
          state?: string
        }
        Relationships: []
      }
      pairs: {
        Row: {
          created_at: string
          form_id: number
          id: number
          p1_id: string
          p2_id: string
        }
        Insert: {
          created_at?: string
          form_id: number
          id?: number
          p1_id?: string
          p2_id?: string
        }
        Update: {
          created_at?: string
          form_id?: number
          id?: number
          p1_id?: string
          p2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_pairs_form_id_fkey'
            columns: ['form_id']
            isOneToOne: false
            referencedRelation: 'forms'
            referencedColumns: ['id']
          }
        ]
      }
      problems: {
        Row: {
          created_at: string
          form_id: number
          problem_number: number
          problem_url: string
          seq: number
          topic: string
        }
        Insert: {
          created_at?: string
          form_id: number
          problem_number: number
          problem_url: string
          seq: number
          topic: string
        }
        Update: {
          created_at?: string
          form_id?: number
          problem_number?: number
          problem_url?: string
          seq?: number
          topic?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_problems_form_id_fkey'
            columns: ['form_id']
            isOneToOne: false
            referencedRelation: 'forms'
            referencedColumns: ['id']
          }
        ]
      }
      signups: {
        Row: {
          availability: Json
          created_at: string
          form_id: number
          user_id: string
        }
        Insert: {
          availability: Json
          created_at?: string
          form_id: number
          user_id?: string
        }
        Update: {
          availability?: Json
          created_at?: string
          form_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_signups_form_id_fkey'
            columns: ['form_id']
            isOneToOne: false
            referencedRelation: 'forms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_signups_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      unpaired: {
        Row: {
          created_at: string
          form_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          form_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          form_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_unpaired_form_id_fkey'
            columns: ['form_id']
            isOneToOne: false
            referencedRelation: 'forms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_unpaired_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['user_id']
          }
        ]
      }
      users: {
        Row: {
          created_at: string
          discord: string
          email: string
          first_name: string
          grad_year: number
          last_name: string
          leetcode: string | undefined
          major: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord: string
          email: string
          first_name: string
          grad_year: number
          last_name: string
          leetcode?: string | undefined
          major: string
          user_id?: string
        }
        Update: {
          created_at?: string
          discord?: string
          email?: string
          first_name?: string
          grad_year?: number
          last_name?: string
          leetcode?: string | undefined
          major?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'public_users_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never
