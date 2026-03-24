#!/usr/bin/env bash
set -euo pipefail

# Provision and deploy Neuroforge on Railway using token auth.
# This script is idempotent for service creation and safe to rerun.

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 1
  }
}

require_cmd railway
require_cmd jq
require_cmd openssl

: "${RAILWAY_API_TOKEN:?RAILWAY_API_TOKEN is required}"
: "${RESEND_API_KEY:?RESEND_API_KEY is required}"
: "${OPENAI_API_KEY:?OPENAI_API_KEY is required}"

export RAILWAY_TOKEN="${RAILWAY_API_TOKEN}"

RAILWAY_PROJECT_NAME="${RAILWAY_PROJECT_NAME:-neuroforge-prod}"
RAILWAY_ENVIRONMENT="${RAILWAY_ENVIRONMENT:-production}"
RAILWAY_WEB_SERVICE="${RAILWAY_WEB_SERVICE:-neuroforge-web}"
RAILWAY_WORKER_SERVICE="${RAILWAY_WORKER_SERVICE:-neuroforge-worker}"
RAILWAY_POSTGRES_SERVICE="${RAILWAY_POSTGRES_SERVICE:-neuroforge-postgres}"
RAILWAY_REDIS_SERVICE="${RAILWAY_REDIS_SERVICE:-neuroforge-redis}"
CUSTOM_DOMAIN="${CUSTOM_DOMAIN:-}"
SENTRY_DSN="${SENTRY_DSN:-}"

secrets_origin="provided"

if [[ -z "${SESSION_SECRET:-}" || -z "${CSRF_SECRET:-}" ]]; then
  generated="$(bash scripts/deploy/generate-secrets.sh)"
  SESSION_SECRET="$(echo "${generated}" | awk -F= '/^SESSION_SECRET=/{print $2}')"
  CSRF_SECRET="$(echo "${generated}" | awk -F= '/^CSRF_SECRET=/{print $2}')"
  secrets_origin="generated"
fi

if [[ -n "${RAILWAY_PROJECT_ID:-}" ]]; then
  railway link --project "${RAILWAY_PROJECT_ID}" >/dev/null
else
  railway init --name "${RAILWAY_PROJECT_NAME}" >/dev/null 2>&1 || true
fi

railway environment "${RAILWAY_ENVIRONMENT}" >/dev/null 2>&1 || true

# Create services if they don't exist already.
railway add --database postgres --service "${RAILWAY_POSTGRES_SERVICE}" >/dev/null 2>&1 || true
railway add --database redis --service "${RAILWAY_REDIS_SERVICE}" >/dev/null 2>&1 || true
railway add --service "${RAILWAY_WEB_SERVICE}" >/dev/null 2>&1 || true
railway add --service "${RAILWAY_WORKER_SERVICE}" >/dev/null 2>&1 || true

db_ref="\${{${RAILWAY_POSTGRES_SERVICE}.DATABASE_URL}}"
redis_host_ref="\${{${RAILWAY_REDIS_SERVICE}.RAILWAY_TCP_PROXY_DOMAIN}}"
redis_port_ref="\${{${RAILWAY_REDIS_SERVICE}.RAILWAY_TCP_PROXY_PORT}}"
redis_password_ref="\${{${RAILWAY_REDIS_SERVICE}.REDIS_PASSWORD}}"

# Configure web service variables.
railway variable set -s "${RAILWAY_WEB_SERVICE}" \
  "SESSION_SECRET=${SESSION_SECRET}" \
  "CSRF_SECRET=${CSRF_SECRET}" \
  "OPENAI_API_KEY=${OPENAI_API_KEY}" \
  "RESEND_API_KEY=${RESEND_API_KEY}" \
  "SENTRY_DSN=${SENTRY_DSN}" \
  "DATABASE_URL=${db_ref}" \
  "REDIS_HOST=${redis_host_ref}" \
  "REDIS_PORT=${redis_port_ref}" \
  "REDIS_PASSWORD=${redis_password_ref}" \
  "START_COMMAND=npm start" >/dev/null

# Configure worker service variables.
railway variable set -s "${RAILWAY_WORKER_SERVICE}" \
  "SESSION_SECRET=${SESSION_SECRET}" \
  "CSRF_SECRET=${CSRF_SECRET}" \
  "OPENAI_API_KEY=${OPENAI_API_KEY}" \
  "RESEND_API_KEY=${RESEND_API_KEY}" \
  "SENTRY_DSN=${SENTRY_DSN}" \
  "DATABASE_URL=${db_ref}" \
  "REDIS_HOST=${redis_host_ref}" \
  "REDIS_PORT=${redis_port_ref}" \
  "REDIS_PASSWORD=${redis_password_ref}" \
  "START_COMMAND=npm run worker" >/dev/null

# Deploy web + worker from current repo.
railway up -s "${RAILWAY_WEB_SERVICE}" --detach
railway up -s "${RAILWAY_WORKER_SERVICE}" --detach

# Create/attach web domain.
if [[ -n "${CUSTOM_DOMAIN}" ]]; then
  domain_json="$(railway domain "${CUSTOM_DOMAIN}" -s "${RAILWAY_WEB_SERVICE}" --json)"
else
  domain_json="$(railway domain -s "${RAILWAY_WEB_SERVICE}" --json)"
fi

domain="$(echo "${domain_json}" | jq -r '.domain // .hostname // empty')"
if [[ -z "${domain}" ]]; then
  domain="$(echo "${domain_json}" | jq -r '.[0].domain // .[0].hostname // empty')"
fi

if [[ -n "${domain}" ]]; then
  APP_URL="https://${domain}"
  railway variable set -s "${RAILWAY_WEB_SERVICE}" "APP_URL=${APP_URL}" >/dev/null
  railway variable set -s "${RAILWAY_WORKER_SERVICE}" "APP_URL=${APP_URL}" >/dev/null
fi

cat <<OUT
Provisioning request submitted.
Web service: ${RAILWAY_WEB_SERVICE}
Worker service: ${RAILWAY_WORKER_SERVICE}
App URL: ${APP_URL:-pending-domain}
SESSION_SECRET: ${secrets_origin}
CSRF_SECRET: ${secrets_origin}
OUT
