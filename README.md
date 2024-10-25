# {TODO}

> A monorepo for {TODO}.

## Developer Quick start

```bash
# Install dependencies
pnpm install

# Run tests
pnpm run test
```

## Developer Setup

### NPM Configuration

This repository uses [@ismyclub scoped packages](https://github.com/orgs/ismyclub/packages), which have been published to the GitHub Package Registry. In
order to have permission to install these packages, follow these steps to configure your npm environment:

1. Navigate to the [User Settings / Access Tokens page](https://github.com/settings/tokens) and select 'Generate new token' | 'Generate new token (classic)'.
2. Add 'personal - npm read' as note, 'No Expiration' as Expiration, 'read:packages' as scope, and click the 'Generate token' button.
3. Run the following command in your terminal, replacing **{YOUR_PERSONAL_ACCESS_TOKEN}** with your actual token:

```bash
npm config set "@ismyclub:registry" https://npm.pkg.github.com/
npm config set "//npm.pkg.github.com/:_authToken" {YOUR_PERSONAL_ACCESS_TOKEN}
```

> Note: This only needs to be done once, for all repositories in the ismyclub GitHub group.

## CI/CD Setup

The CI/CD pipeline for this repository uses a Personal Access Token with the correct scope, stored in an action secret called **NPM_TOKEN**, so that:

- The CI/CD's npm environment can be configured to grant access to install @ismyclub scoped dependencies from the GitHub Package Registry.
- [Changesets](https://github.com/changesets/changesets) can automate the process of updating package versions and changelogs, in addition to publishing new
  versions of @ismyclub scoped packages.

To create/rotate the token:

1. Navigate to the [User Settings / Access Tokens page](https://github.com/settings/tokens) and select 'Generate new token' | 'Generate new token (classic)'.
2. Add '<REPO_NAME> - npm write' as note, 'No Expiration' as expiration, 'write:packages' as scope, and click the 'Generate token' button.
3. Copy the value of the new token into the **NPM_TOKEN** action secret in the [Actions secrets and variables page](https://github.com/ismyclub/tools/settings/secrets/actions).

> Note: If other repositories are using the same **NPM_TOKEN** in CI/CD, be sure to change them too.

## References

- [npm-config](https://docs.npmjs.com/cli/v8/commands/npm-config)
- [Changesets (General)](https://github.com/changesets/changesets)
