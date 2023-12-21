import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://jipkcigqpyyzugjskqer.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcGtjaWdxcHl5enVnanNrcWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA5ODQ0MzcsImV4cCI6MjAxNjU2MDQzN30.Eh94IrBFVES8SsJQlr6Xv7rB4nld7fJl2w29lrqW9pE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
