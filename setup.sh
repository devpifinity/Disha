#!/bin/bash

# Disha Project Setup Script
# This script sets up the Disha career platform for development

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}
╔══════════════════════════════════════════════════════════════╗
║                    Disha Setup Script                       ║
║              Career Discovery Platform                      ║
╚══════════════════════════════════════════════════════════════╝
${NC}"
}

print_step() {
    echo -e "${BLUE}📦 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        echo "Please install Node.js (version 18 or higher) from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version $NODE_VERSION is too old!"
        echo "Please upgrade to Node.js 18 or higher"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        echo "Please install npm (comes with Node.js)"
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

install_dependencies() {
    print_step "Installing project dependencies..."
    
    if [ -f "package-lock.json" ]; then
        print_warning "Found package-lock.json, running npm ci for faster install"
        npm ci
    else
        npm install
    fi
    
    print_success "Dependencies installed successfully"
}

setup_environment() {
    print_step "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success "Created .env file from .env.example"
            print_warning "Please review and update the .env file with your configuration"
        else
            print_warning "No .env.example file found, skipping environment setup"
        fi
    else
        print_success ".env file already exists"
    fi
}

run_type_check() {
    print_step "Running TypeScript type check..."
    
    if npm run typecheck &> /dev/null; then
        print_success "TypeScript type check passed"
    else
        print_warning "TypeScript type check found issues (this is normal for a new setup)"
    fi
}

run_lint() {
    print_step "Running code linting..."
    
    if npm run lint &> /dev/null; then
        print_success "Code linting passed"
    else
        print_warning "Linting found issues (this is normal for a new setup)"
    fi
}

start_dev_server() {
    print_step "Starting development server..."
    echo -e "${YELLOW}The development server will start on http://localhost:8080${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    echo ""
    
    # Give user a chance to read the message
    sleep 2
    
    npm run dev
}

# Main setup process
main() {
    print_header
    
    echo -e "${BLUE}Setting up Disha Career Discovery Platform...${NC}"
    echo ""
    
    # Check prerequisites
    print_step "Checking prerequisites..."
    check_node
    check_npm
    echo ""
    
    # Install dependencies
    install_dependencies
    echo ""
    
    # Setup environment
    setup_environment
    echo ""
    
    # Run checks
    run_type_check
    run_lint
    echo ""
    
    # Final success message
    print_success "Setup completed successfully!"
    echo ""
    echo -e "${GREEN}🚀 Disha is ready for development!${NC}"
    echo ""
    echo "Available commands:"
    echo "  npm run dev      - Start development server"
    echo "  npm run build    - Build for production"
    echo "  npm run preview  - Preview production build"
    echo "  npm run lint     - Run ESLint"
    echo "  npm run typecheck - Run TypeScript checks"
    echo ""
    
    # Ask if user wants to start the dev server
    read -p "Would you like to start the development server now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        start_dev_server
    else
        echo ""
        print_success "Setup complete! Run 'npm run dev' when you're ready to start developing."
    fi
}

# Run the main function
main "$@"