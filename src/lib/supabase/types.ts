export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          custom_avatar_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          custom_avatar_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          custom_avatar_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      one_more_second_scores: {
        Row: {
          user_id: string;
          display_name: string;
          best_seconds: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string;
          best_seconds: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          display_name?: string;
          best_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      website_inquiries: {
        Row: {
          id: string;
          payload: Json;
          looking_for: string | null;
          budget_range: string | null;
          contact_email: string | null;
          contact_name: string | null;
          contact_phone: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          payload: Json;
          looking_for?: string | null;
          budget_range?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          payload?: Json;
          looking_for?: string | null;
          budget_range?: string | null;
          contact_email?: string | null;
          contact_name?: string | null;
          contact_phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type OneMoreSecondScore = Database['public']['Tables']['one_more_second_scores']['Row'];
