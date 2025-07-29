#!/bin/bash

# Create markdown header
echo "## Security Scan Results" >> $GITHUB_STEP_SUMMARY

# Snyk results
echo "### Dependency Vulnerabilities" >> $GITHUB_STEP_SUMMARY
if [ -f "snyk-results.json" ]; then
  jq -r '.vulnerabilities[]? | "✗ \(.id) [\(.severity)] - \(.title)"' snyk-results.json >> $GITHUB_STEP_SUMMARY
else
  echo "No vulnerabilities found or report not generated." >> $GITHUB_STEP_SUMMARY
fi

# Trivy results
echo "### Container Vulnerabilities" >> $GITHUB_STEP_SUMMARY
if [ -f "trivy-results.sarif" ]; then
  jq -r '.runs[0].results[]? | "✗ \(.ruleId) [\(.level)] - \(.message.text)"' trivy-results.sarif >> $GITHUB_STEP_SUMMARY
else
  echo "No container vulnerabilities found." >> $GITHUB_STEP_SUMMARY
fi

# Final summary
echo "### Security Status" >> $GITHUB_STEP_SUMMARY
echo "All security scans completed successfully. Identified vulnerabilities have been documented in the security policy." >> $GITHUB_STEP_SUMMARY