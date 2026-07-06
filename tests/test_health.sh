#!/bin/bash
set -e
sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080)
echo "Status HTTP: $STATUS"
if [ "$STATUS" -eq 200 ]; then
  echo "TEST PASSED"
  exit 0
else
  echo "TEST FAILED"
  exit 1
fi