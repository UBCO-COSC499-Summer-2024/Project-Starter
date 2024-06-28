#!/bin/bash
set -e

# Wait for PostgreSQL to start
until pg_isready -h db -U "${POSTGRES_USER}"; do
  echo "Waiting for PostgreSQL to start..."
  sleep 2
done

# Run the tests
echo "Running pgTAP tests..."
pg_prove -d "$POSTGRES_DB" /tests/*.sql || { echo "pgTAP tests failed"; exit 1; }

echo "pgTAP tests completed successfully."