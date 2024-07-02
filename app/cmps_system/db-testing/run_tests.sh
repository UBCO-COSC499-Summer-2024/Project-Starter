#!/bin/bash
set -e

# Wait for PostgreSQL to start
until pg_isready -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}"; do
  echo "Waiting for PostgreSQL to start... Host: ${POSTGRES_HOST}, Port: ${POSTGRES_PORT}, User: ${POSTGRES_USER}"
  sleep 2
done

# Run the tests
echo "Running pgTAP tests..."
pg_prove -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -d "$POSTGRES_DB" -U "${POSTGRES_USER}" /tests/*.sql || { echo "pgTAP tests failed"; exit 1; }

echo "pgTAP tests completed successfully."