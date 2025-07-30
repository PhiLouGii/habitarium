# Changelog

All notable changes to this project will be documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-07-30

### Changed
- Updated signup button on the signup page to red.

## [1.0.0] - 2025-07-30

### Added
- Full CI/CD pipeline with GitHub Actions automating build, test, Docker image build, and deployment.
- Integrated automated security scanning tools Snyk (for dependencies) and Trivy (for containers) into CI/CD workflows.
- Docker image build and push automated to Azure Container Registry.
- Automated deployments to Azure Web App with staging and production slots.
- Manual approval gate implemented prior to production releases.
- Application Insights telemetry integration for comprehensive logging and performance monitoring.
- UptimeRobot monitoring configured for production and staging URLs, with a public status page.
- Operational alert configured for uptime and critical errors in the production environment.

### Security
- Automated dependency vulnerability scanning using Snyk during CI/CD.
- Container image security scans performed with Trivy at build time.
- Secure environment variable and secrets management within GitHub Actions and Azure portal.
- Manual approval gate configured to mitigate risks before production deployment.

### Monitoring
- Application Insights telemetry enabled with detailed logging and performance metrics.
- UptimeRobot monitors configured for uptime and response time tracking on production and staging endpoints.
- Public status page created for transparency on application availability: [Habitarium Web App Status](https://stats.uptimerobot.com/Benz2STvzI).
- Alerts and notifications established for downtime and critical error events.

### Infrastructure
- Azure App Service Plan upgraded to S1 tier to support scalable staging and production deployments.
- Network and health check URL configurations optimized for reliable deployments.
- Instrumentation key and connection strings correctly configured for telemetry data flow.

### Containerization
- Multi-stage Dockerfile used to optimize image sizes and build caching.
- Docker Compose used locally for multi-service orchestration during development.
- Health checks configured in Docker containers to ensure app resilience and automatic restart on failure.

### Deployment
- CI/CD pipeline automates building, testing, security scanning, container publishing, and deployment tasks.
- Separate staging and production deployment slots maintained with a smooth promotion flow.
- Live URLs provided for both staging and production environments.
- Environment-specific configuration files and secrets managed securely.

### Fixed
- Corrected staging health check URL to prevent DNS errors during deployment.
- Resolved application startup hang caused by Application Insights SDK initialization and configuration issues.

### Documentation
- Updated README file with detailed setup, deployment, and monitoring instructions.
- Added screenshots of monitoring dashboards and public status page for proof.
- Maintained CHANGELOG with versioned updates following conventional commit standards.

---

*All commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard to ensure clear version history.*
