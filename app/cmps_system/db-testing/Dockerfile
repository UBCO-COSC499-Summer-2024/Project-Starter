FROM perl:latest

# Install pgTAP (for schema testing)
# Install dependencies for building pg_prove
RUN apt-get update && apt-get install -y \
    postgresql-15-pgtap \
    cpanminus \
    make \
    perl \
    gcc

# Install dependencies for pg_prove
RUN cpanm TAP::Parser::SourceHandler::pgTAP

# Copy the test script
COPY run_tests.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/run_tests.sh

# Copy the test files
COPY tests /tests
