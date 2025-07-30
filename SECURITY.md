# Security Scanning Summary

This project integrates DevSecOps principles with continuous security scanning.

---

## Tools Used

- **Snyk**: Scans `package-lock.json` for known vulnerabilities
- **Trivy**: Scans Docker image before pushing to Azure

---

## Example Findings (2025-07-30)

| Tool   | Location   | Severity | Description                | Remediation                        |
|--------|------------|----------|----------------------------|------------------------------------|
| Snyk   | frontend   | High     | Vulnerable lodash version  | Updated to lodash ^4.17.21         |
| Trivy  | container  | Critical | OpenSSL 1.1 CVE-2023-0286  | Added `apk upgrade` in Dockerfile  |

---

## Remediation Process

- All high-severity issues are addressed before deployment.
- Scans are configured to **continue-on-error**, but flagged in reports.
- A GitHub issue will be opened for any critical vulnerability not fixed in the same PR.
