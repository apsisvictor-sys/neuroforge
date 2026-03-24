#!/usr/bin/env bash
set -euo pipefail

# Generates 32-byte URL-safe secrets for session and CSRF signing.
gen_secret() {
  openssl rand -base64 48 | tr -d '\n' | tr '+/' '-_' | cut -c1-64
}

SESSION_SECRET="$(gen_secret)"
CSRF_SECRET="$(gen_secret)"

cat <<OUT
SESSION_SECRET=${SESSION_SECRET}
CSRF_SECRET=${CSRF_SECRET}
OUT
