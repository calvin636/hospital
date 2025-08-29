#!/bin/bash

# Hospital Concierge SaaS - Push to GitHub
# This script initializes git and pushes the project to GitHub

echo "🏥 Hospital Concierge SaaS - GitHub Setup"
echo "========================================="

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo "✅ Git repository already exists"
else
    echo "📦 Initializing git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📝 Adding files to git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "⚠️  No changes to commit"
else
    echo "💾 Committing changes..."
    git commit -m "feat: hospital concierge SaaS starter (Agora + multi-tenant policies)"
fi

# Set remote if it doesn't exist
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Setting remote origin..."
    git remote add origin https://github.com/calvin636/hospital.git
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
if git push -u origin main; then
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Next steps:"
    echo "1. Visit https://github.com/calvin636/hospital"
    echo "2. Set up your environment variables"
    echo "3. Deploy to Vercel or your preferred platform"
    echo "4. Configure Supabase, Stripe, and Agora"
else
    echo "❌ Failed to push to GitHub"
    echo "💡 You may need to:"
    echo "   - Set up GitHub authentication (gh auth login)"
    echo "   - Create the repository first (gh repo create calvin636/hospital --public)"
    echo "   - Or manually create it at https://github.com/new"
fi
