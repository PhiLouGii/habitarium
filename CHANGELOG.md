# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] - 2025-07-30
### Added
- Full CI/CD pipeline with GitHub Actions
- Snyk and Trivy security scanning
- Docker image build and push to Azure Container Registry
- Automated deploy to staging and production slots in Azure Web App
- Manual approval gate before production release

### Changed
- Migrated manual deployment scripts into automated GitHub workflows
- Upgraded Azure App Service Plan to S1 for staging

### Fixed
- Corrected staging health check URL to avoid DNS errors during deploy
