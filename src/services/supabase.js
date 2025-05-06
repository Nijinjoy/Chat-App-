import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovpqfvivvwdbvcopyhun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHFmdml2dndkYnZjb3B5aHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTU3NTQsImV4cCI6MjA2MTk5MTc1NH0.7WGH_uVJbBtCVOPApxb1w7djC5_JPv_dafpDF-lelgs';
export const supabase = createClient(supabaseUrl, supabaseKey);
