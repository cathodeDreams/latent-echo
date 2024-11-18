#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print status message
status() {
    echo -e "${CYAN}➤ $1${NC}"
}

# Check if we're in a git repo
if [ ! -d .git ]; then
    echo -e "${RED}Error: Must be run from root of Git repository${NC}"
    exit 1
fi

# Create pre-commit hook
status "Creating pre-commit hook..."
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
perl -pi -e 's/(Last updated: )\d{4}-\d{2}-\d{2}/Last updated: '"$(date +%Y-%m-%d)"'/g' index.html
git add index.html
EOF

# Make hook executable
chmod +x .git/hooks/pre-commit

# Create/update .gitattributes
status "Setting up .gitattributes..."
if ! grep -q "filter=dater" .gitattributes 2>/dev/null; then
    echo "index.html filter=dater" >> .gitattributes
fi

# Configure Git filters
status "Configuring Git filters..."
git config filter.dater.clean "sed 's/Last updated: .*/Last updated: AUTO-GENERATED/'"
git config filter.dater.smudge "sed \"s/Last updated: .*/Last updated: $(date +%Y-%m-%d)/\""

# Update index.html if needed
status "Updating index.html..."
if [ -f index.html ] && ! grep -q "<!-- AUTO-UPDATED -->" index.html; then
    sed -i 's/\(Last updated: [0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}\)/<!-- AUTO-UPDATED -->\1/' index.html
fi

echo -e "\n${GREEN}✓ Setup completed successfully!${NC}"
echo -e "The last updated date will now automatically update with each commit." 