#!/bin/bash
# filepath: /Users/aparnashastry/GreetsApp/GreetsApp/audit_firestore_rules.sh

# Print current Firestore rules
echo "Fetching current Firestore rules..."
firebase firestore:rules > firestore.rules

echo "Checking for insecure rules..."

# Look for allow read, write: if true;
if grep -q 'allow[[:space:]]\+\(read\|write\|update\|delete\|create\):[[:space:]]*if[[:space:]]*true' firestore.rules; then
  echo "WARNING: Found insecure rule: 'allow ...: if true;'"
else
  echo "No obviously insecure rules found."
fi

# Clean up
rm firestore.rules

echo "Audit complete."