export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: Json;
          excerpt: string | null;
          thumbnail_url: string | null;
          thumbnail_type: "auto" | "custom" | null;
          status: "draft" | "published" | "private";
          published_at: string | null;
          created_at: string;
          updated_at: string;
          author_id: string | null;
          meta_description: string | null;
          view_count: number;
          is_featured: boolean;
          og_image_url: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: Json;
          excerpt?: string | null;
          thumbnail_url?: string | null;
          thumbnail_type?: "auto" | "custom" | null;
          status?: "draft" | "published" | "private";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          author_id?: string | null;
          meta_description?: string | null;
          view_count?: number;
          is_featured?: boolean;
          og_image_url?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: Json;
          excerpt?: string | null;
          thumbnail_url?: string | null;
          thumbnail_type?: "auto" | "custom" | null;
          status?: "draft" | "published" | "private";
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
          author_id?: string | null;
          meta_description?: string | null;
          view_count?: number;
          is_featured?: boolean;
          og_image_url?: string | null;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          color: string | null;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          color?: string | null;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          order?: number;
          created_at?: string;
        };
      };
      post_categories: {
        Row: {
          id: string;
          post_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      analytics_cache: {
        Row: {
          id: string;
          cache_key: string;
          data: Json;
          expires_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cache_key: string;
          data: Json;
          expires_at: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cache_key?: string;
          data?: Json;
          expires_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
