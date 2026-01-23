# Branch Protection Rules for STEPFLOW Mobile

This document outlines the branch protection rules that should be configured in the GitHub repository settings for the STEPFLOW Mobile project.

## Protected Branches

The following branches are protected and require special rules:

### 1. `main` Branch (Production)
### 2. `develop` Branch (Development/Staging)

## Required Protection Rules

### Pull Request Requirements
- ✅ **Require pull request reviews before merging**
  - Minimum number of approving reviews: **1**
  - Dismiss stale pull request approvals when new commits are pushed: **Enabled**
  - Require review from Code Owners: **Optional** (if CODEOWNERS file exists)

### Status Checks
- ✅ **Require status checks to pass before merging**
  - Require branches to be up to date before merging: **Enabled**
  - Required status checks:
    - `test` (CI Pipeline - main tests job)
    - `pr-validation` (PR validation job)
    - `TypeScript type checking`
    - `ESLint checks`
    - `Prettier formatting`
    - `Unit and Integration tests`

### Additional Restrictions
- ✅ **Require conversation resolution before merging**: Enabled
- ✅ **Require linear history**: Optional (recommended for cleaner history)
- ✅ **Include administrators**: Enabled (applies rules to admins too)
- ✅ **Restrict who can push to matching branches**: Optional
- ✅ **Allow force pushes**: Disabled
- ✅ **Allow deletions**: Disabled

## How to Configure Branch Protection Rules

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click on **Settings** → **Branches**
3. Under "Branch protection rules", click **Add rule**
4. Enter branch name pattern: `main` (repeat for `develop`)
5. Enable the following settings:
   - ☑️ Require a pull request before merging
     - ☑️ Require approvals (minimum: 1)
     - ☑️ Dismiss stale pull request approvals when new commits are pushed
   - ☑️ Require status checks to pass before merging
     - ☑️ Require branches to be up to date before merging
     - Search and select required checks:
       - `test`
       - `pr-validation`
   - ☑️ Require conversation resolution before merging
   - ☑️ Include administrators
   - ☑️ Do not allow bypassing the above settings
6. Click **Create** or **Save changes**

### Via GitHub CLI (Optional)

```bash
# Protect main branch
gh api repos/elove333/stepflow-mobile/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test","pr-validation"]}' \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field enforce_admins=true \
  --field restrictions=null

# Protect develop branch
gh api repos/elove333/stepflow-mobile/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["test","pr-validation"]}' \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field enforce_admins=true \
  --field restrictions=null
```

## Workflow Impact

With these branch protection rules in place:

1. **Developers cannot push directly** to `main` or `develop`
2. **All changes must go through a Pull Request**
3. **At least 1 team member must approve** the PR
4. **All CI checks must pass** before merging
5. **Branch must be up to date** with the target branch
6. **All conversations must be resolved** before merging

## Benefits

- 🛡️ **Code Quality**: Ensures all code is reviewed and tested
- 🚀 **Reliability**: Catches bugs before they reach production
- 📋 **Documentation**: PRs serve as documentation of changes
- 🤝 **Collaboration**: Encourages team collaboration and knowledge sharing
- 🔒 **Security**: Prevents accidental or malicious changes

## Exceptions

In emergency situations (e.g., critical production bug), repository administrators can:
1. Temporarily disable branch protection
2. Make the necessary fix
3. Re-enable branch protection immediately

However, this should be:
- ⚠️ **Rarely used** (only for true emergencies)
- 📝 **Documented** (create a post-incident report)
- 🔍 **Reviewed** (create a follow-up PR with tests)

## Related Documentation

- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines and DoD
- [Pull Request Template](./.github/pull_request_template.md) - PR template
- [CI Workflow](./.github/workflows/ci.yml) - CI/CD configuration

---

**Last Updated**: January 2026  
**Maintained By**: STEPFLOW Mobile Team
