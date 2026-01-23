# Contributing to stepflow-mobile

Thank you for your interest in contributing to stepflow-mobile!

## Branch Naming Rules

When creating branches in this repository, please follow these naming conventions:

### 1. Prefix All Branches with `mobile/`

- **Prefix**: `mobile/`
- **Pattern**: `mobile/**/*`
- **Description**: Matches all branches starting with `mobile/` regardless of depth.

**Examples:**
- `mobile/feature/new-login-screen`
- `mobile/bugfix/fix-navigation`
- `mobile/hotfix/critical-patch`

### 2. Match All Branches Starting with `qa`

- **Prefix**: `qa/`
- **Pattern**: `qa/**`
- **Description**: Matches all branches starting with `qa/` followed by any characters.

**Examples:**
- `qa/testing-feature`
- `qa/integration-tests`
- `qa/regression-suite`

### 3. Match ANY Branch Starting with `qa`, Even if More Text Follows

- **Pattern**: `qa**/**/*`
- **Description**: Matches any branch starting with `qa` with optional additional text, regardless of slash depth.

**Examples:**
- `qa/test-branch`
- `qa-hotfix/urgent-fix`
- `qa-feature/new-validation`
- `qateam/automation/tests`

---

Following these naming conventions helps maintain consistency and organization across the repository.
