#!/usr/bin/env bash
set -euo pipefail

# Creates an Upstash Redis database using management API credentials.
# Required: UPSTASH_EMAIL, UPSTASH_API_KEY
# Optional: UPSTASH_DB_NAME (default: neuroforge-prod), UPSTASH_REGION (default: eu-central-1)

: "${UPSTASH_EMAIL:?UPSTASH_EMAIL is required}"
: "${UPSTASH_API_KEY:?UPSTASH_API_KEY is required}"

UPSTASH_DB_NAME="${UPSTASH_DB_NAME:-neuroforge-prod}"
UPSTASH_REGION="${UPSTASH_REGION:-eu-central-1}"

response="$(curl -sS -u "${UPSTASH_EMAIL}:${UPSTASH_API_KEY}" \
  -H "Content-Type: application/json" \
  -X POST "https://api.upstash.com/v2/redis/database" \
  -d "{\"name\":\"${UPSTASH_DB_NAME}\",\"region\":\"${UPSTASH_REGION}\"}")"

echo "${response}" | jq '.'

endpoint="$(echo "${response}" | jq -r '.endpoint // empty')"
port="$(echo "${response}" | jq -r '.port // empty')"
password="$(echo "${response}" | jq -r '.password // empty')"

if [[ -n "${endpoint}" && -n "${port}" && -n "${password}" ]]; then
  cat <<OUT
# Export for Neuroforge env vars
REDIS_HOST=${endpoint}
REDIS_PORT=${port}
REDIS_PASSWORD=${password}
OUT
fi
