# Load environment variables, this is to sync with the docker environment. It makes it easy to run build test on GitHub actions
source ../.env 
export NEXT_PUBLIC_SUPABASE_PUBLIC_URL=${SUPABASE_PUBLIC_URL}
export NEXT_PUBLIC_ANON_KEY=${ANON_KEY}
export NEXT_PUBLIC_SITE_URL=${SITE_URL}
export OPENAI_API_KEY=${OPENAI_API_KEY}
__NEXT_TEST_MODE=true npm run build