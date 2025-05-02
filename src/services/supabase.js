import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://epntehkdxajosqqphvzt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwbnRlaGtkeGFqb3NxcXBodnp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDcwMTAsImV4cCI6MjA1NDE4MzAxMH0.O9QPxgnIvLpIoxyA_XjnXPUrnMnCHrX8Dg4lV6vGKB4';
export const supabase = createClient(supabaseUrl, supabaseKey);
