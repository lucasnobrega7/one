#!/bin/bash
set -e

echo "🧹 Starting repository cleanup..."

# Remove system files
echo "Removing .DS_Store files..."
find . -name ".DS_Store" -delete

# Clean npm/node artifacts
echo "Cleaning npm cache..."
npm cache clean --force 2>/dev/null || echo "npm cache clean skipped"

# Remove temporary files
echo "Removing temporary files..."
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name "*.temp" -delete 2>/dev/null || true

# Remove TypeScript build cache
echo "Cleaning TypeScript cache..."
rm -f *.tsbuildinfo
rm -f .tsbuildinfo

# Git cleanup
echo "Running git cleanup..."
git gc --prune=now 2>/dev/null || echo "git gc skipped"
git remote prune origin 2>/dev/null || echo "git remote prune skipped"

# Remove editor files
echo "Removing editor files..."
find . -name "*.swp" -delete 2>/dev/null || true
find . -name "*.swo" -delete 2>/dev/null || true
find . -name "*~" -delete 2>/dev/null || true

echo "✅ Repository cleanup complete!"
echo "📊 Repository size after cleanup:"
du -sh . 2>/dev/null || echo "Size calculation unavailable"