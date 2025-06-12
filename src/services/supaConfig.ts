import { createClient } from '@supabase/supabase-js';

const supabaseUrl="https://mvqpebqiqzggtxuilevl.supabase.co"
const supabaseKey="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12cXBlYnFpcXpnZ3R4dWlsZXZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNDQ0MzQsImV4cCI6MjA2NDcyMDQzNH0.d_wLZVTPP0kEwNQYReNbMJ-Q-krj0PTjP8QJ7AekibA"



const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
        