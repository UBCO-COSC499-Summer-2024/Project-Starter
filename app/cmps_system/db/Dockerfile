FROM supabase/postgres:15.1.1.41

# Install pgTAP (for schema testing)
RUN apt-get update && \
    apt-get install -y pgtap && \
    apt-get clean
