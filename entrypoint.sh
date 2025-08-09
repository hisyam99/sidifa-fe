#!/bin/sh

set -e

BUILD_DIR=./dist

ORIGIN_URL=${ORIGIN}
BASE_URL=${PUBLIC_BASE_URL}
API_URL=${PUBLIC_API_URL}
UPLOADS_URL=${PUBLIC_UPLOADS_URL}

echo ">> Substituting environment variables in $BUILD_DIR"

# Ganti placeholder dengan urutan baru
find $BUILD_DIR -type f \( -name '*.js' -o -name '*.html' \) -exec sed -i \
  -e "s|__ORIGIN__|${ORIGIN_URL}|g" \
  -e "s|__origin__|${ORIGIN_URL}|g" \
  -e "s|__PUBLIC_BASE_URL__|${BASE_URL}|g" \
  -e "s|__public_base_url__|${BASE_URL}|g" \
  -e "s|__PUBLIC_API_URL__|${API_URL}|g" \
  -e "s|__public_api_url__|${API_URL}|g" \
  -e "s|__PUBLIC_UPLOADS_URL__|${UPLOADS_URL}|g" \
  -e "s|__public_uploads_url__|${UPLOADS_URL}|g" {} +

echo ">> Substitution complete. Starting server..."

exec "$@"