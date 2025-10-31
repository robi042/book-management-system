#!/usr/bin/env bash
set -euo pipefail

# Base config
PORT=${PORT:-3001}
BASE_URL="http://localhost:${PORT}/bms"
OUT_DIR="api-results"
mkdir -p "$OUT_DIR"

header_json=( -H "Content-Type: application/json" )

echo "Calling APIs against ${BASE_URL} ..."

# 1) AUTHORS
echo "\n==> Create Author" | tee -a "$OUT_DIR/steps.log"
AUTHOR_CREATE_RES=$(curl -s -X POST "$BASE_URL/authors" "${header_json[@]}" \
  -d '{"firstName":"John","lastName":"Doe","bio":"Script created"}')
echo "$AUTHOR_CREATE_RES" | tee "$OUT_DIR/author.create.json" >/dev/null
AUTHOR_ID=$(echo "$AUTHOR_CREATE_RES" | sed -n 's/.*"id"\s*:\s*\([0-9]\+\).*/\1/p' | head -1)

echo "==> List Authors" | tee -a "$OUT_DIR/steps.log"
curl -s "$BASE_URL/authors?page=1&limit=10" | tee "$OUT_DIR/author.list.json" >/dev/null

echo "==> Get Author ${AUTHOR_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s "$BASE_URL/authors/${AUTHOR_ID}" | tee "$OUT_DIR/author.get.json" >/dev/null

echo "==> Update Author ${AUTHOR_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s -X PATCH "$BASE_URL/authors/${AUTHOR_ID}" "${header_json[@]}" \
  -d '{"bio":"Script updated"}' | tee "$OUT_DIR/author.update.json" >/dev/null

# 2) BOOKS
echo "\n==> Create Book" | tee -a "$OUT_DIR/steps.log"
BOOK_CREATE_RES=$(curl -s -X POST "$BASE_URL/books" "${header_json[@]}" \
  -d '{"title":"Script Book","isbn":"9780306406157","publishedDate":"2024-01-01","authorId":'"${AUTHOR_ID}"'}')
echo "$BOOK_CREATE_RES" | tee "$OUT_DIR/book.create.json" >/dev/null
BOOK_ID=$(echo "$BOOK_CREATE_RES" | sed -n 's/.*"id"\s*:\s*\([0-9]\+\).*/\1/p' | head -1)

echo "==> List Books" | tee -a "$OUT_DIR/steps.log"
curl -s "$BASE_URL/books?page=1&limit=10" | tee "$OUT_DIR/book.list.json" >/dev/null

echo "==> Get Book ${BOOK_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s "$BASE_URL/books/${BOOK_ID}" | tee "$OUT_DIR/book.get.json" >/dev/null

echo "==> Update Book ${BOOK_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s -X PATCH "$BASE_URL/books/${BOOK_ID}" "${header_json[@]}" \
  -d '{"genre":"ScriptGenre"}' | tee "$OUT_DIR/book.update.json" >/dev/null

# 3) NEGATIVE CASES (to generate warn/error logs if logger is enabled)
echo "\n==> Negative: Get missing Book (404)" | tee -a "$OUT_DIR/steps.log"
curl -s -o "$OUT_DIR/book.404.json" -w "HTTP:%{http_code}\n" "$BASE_URL/books/999999" | tee -a "$OUT_DIR/steps.log" >/dev/null

echo "\n==> Cleanup: Delete Book ${BOOK_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s -X DELETE "$BASE_URL/books/${BOOK_ID}" -o /dev/null -w "HTTP:%{http_code}\n" | tee -a "$OUT_DIR/steps.log" >/dev/null

echo "==> Cleanup: Delete Author ${AUTHOR_ID}" | tee -a "$OUT_DIR/steps.log"
curl -s -X DELETE "$BASE_URL/authors/${AUTHOR_ID}" -o /dev/null -w "HTTP:%{http_code}\n" | tee -a "$OUT_DIR/steps.log" >/dev/null

echo "\nAll API calls completed. Results saved under ${OUT_DIR}/"


