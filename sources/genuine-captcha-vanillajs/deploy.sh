#!/bin/bash

# Deployment script for genuine-captcha web application
set -e  # Exit on any error

# Initialize variables
FORCE_DEPLOY=false
COMMIT_MSG="updated js files"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force|-f)
            FORCE_DEPLOY=true
            shift
            ;;
        *)
            COMMIT_MSG="$1"
            shift
            ;;
    esac
done

echo "🚀 Starting deployment process..."

# Step 0: Version check
echo "🔍 Checking package versions..."

SOURCE_DIR=~/genuine-captcha/sources/genuine-captcha-vanillajs
DEST_DIR=~/genuine-captcha-vanillajs

SOURCE_VERSION=$(node -p "require('$SOURCE_DIR/package.json').version" 2>/dev/null || echo "unknown")
DEST_VERSION=$(node -p "require('$DEST_DIR/package.json').version" 2>/dev/null || echo "unknown")

echo "   Source version: $SOURCE_VERSION"
echo "   Destination version: $DEST_VERSION"

if [[ "$SOURCE_VERSION" == "$DEST_VERSION" ]] && [[ "$FORCE_DEPLOY" == false ]]; then
    echo ""
    echo "❌ ERROR: Versions are identical ($SOURCE_VERSION)"
    echo "   Please bump the version in package.json before deploying."
    echo "   Or use --force to deploy anyway."
    echo ""
    echo "   Example: npm version patch"
    exit 1
elif [[ "$SOURCE_VERSION" == "$DEST_VERSION" ]] && [[ "$FORCE_DEPLOY" == true ]]; then
    echo "⚠️  WARNING: Forcing deployment with same version ($SOURCE_VERSION)"
fi

# Step 1: Clean up old dist folder
echo "📁 Cleaning up old dist folder..."
cd "$DEST_DIR"
# Safer cleanup - remove only non-hidden files and directories
find . -maxdepth 1 -type f ! -name '.*' -delete
find . -maxdepth 1 -type d ! -name '.' ! -name '..' ! -name '.git' ! -name 'node_modules' -exec rm -rf {} +

# Step 2: Copy the application
echo "🔨 Copying application..."
cd "$SOURCE_DIR"

rsync -av --exclude='*deploy.sh' --exclude='node_modules' "$SOURCE_DIR/" "$DEST_DIR"

# Step 3: Commit and push changes
echo "📤 Committing and pushing changes..."
cd "$DEST_DIR"

# Check if there are changes to commit
if [[ -n $(git status -s) ]]; then
    git add -A
    git commit -m "$COMMIT_MSG"
    git push
    echo "✅ Changes committed with message: '$COMMIT_MSG'"
else
    echo "ℹ️  No changes to commit"
fi

# Step 4: Publish to npm
echo "📦 Publishing to npm..."
npm publish --access public

echo "✅ Deployment completed successfully! (v$SOURCE_VERSION)"