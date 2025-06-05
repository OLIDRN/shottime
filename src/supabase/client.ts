import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ceuebwnngclrwstuadya.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldWVid25uZ2NscndzdHVhZHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMTY2ODMsImV4cCI6MjA2NDY5MjY4M30.Rcei5myFZ9-vkRTRw6k8goeBhMcD4Q-DRkUe7jePJXE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);