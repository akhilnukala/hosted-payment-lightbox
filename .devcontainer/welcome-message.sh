#!/bin/sh

set -e

SERVER_DIR="/workspaces/hosted-payment-lightbox/server/node"
CLIENT_DIR="/workspaces/hosted-payment-lightbox/client/react"

ALTERNATE_WELCOME_MESSAGE="
👋 Welcome to the \"Hosted Payment Lightbox Integration Example\"

Please rename the \".env.example\" file to \".env\" and update \"MERCHANT_ALIAS\" and \"SECRET_KEY\"."

WELCOME_MESSAGE="
👋 Welcome to the \"Hosted Payment Lightbox Integration Example\""

# Frontend setup functions
setup_frontend() {
    cd "$CLIENT_DIR" && npm install
}

# Backend setup functions
setup_backend() {
    cd "$SERVER_DIR" && npm install
}

# Post-create commands
post_create() {
    echo "Running post-create commands..."
    setup_backend
    setup_frontend
}

# Frontend start functions
start_frontend() {
    cd "$CLIENT_DIR" && npm run dev
}

# Backend start functions
start_backend() {
    cd "$SERVER_DIR" && npm run dev
}

# Post-attach commands
post_attach() {
    echo "Running post-attach commands..."
    start_backend &
    start_frontend
}

# # Check if file exists
# test -f server/node/.env && echo "File exists" || echo "File not found"
# grep -E "^(MERCHANT_ALIAS|SECRET_KEY)=" server/node/.env | sed 's/=.*/=***/'

# # Check for the variables (values masked for security)
# test -f /workspaces/hosted-payment-lightbox/server/node/.env && echo "File exists" || echo "File not found"
# grep -E "^(MERCHANT_ALIAS|SECRET_KEY)=" /workspaces/hosted-payment-lightbox/server/node/.env | sed 's/=.*/=***/'

# Check if .env file exists and contains required values
ENV_FILE="/workspaces/hosted-payment-lightbox/server/node/.env"

if [ -f "$ENV_FILE" ] && grep -q "^MERCHANT_ALIAS=" "$ENV_FILE" && grep -q "^SECRET_KEY=" "$ENV_FILE"; then
    sudo bash -c "echo \"${WELCOME_MESSAGE}\""
    
    npm config set registry https://registry.npmjs.org/
    echo "✓ NPM registry set to https://registry.npmjs.org/"
    
    npm config set strict-ssl false
    echo "✓ NPM strict-ssl set to false"

    # SETUP BACKEND
    cd "/workspaces/hosted-payment-lightbox/server/node"
    echo "✓ Changed directory to server/node"

    rm -rf node_modules
    echo "✓ Removed node_modules"
    
    npm cache clean --force
    echo "✓ Cleaned npm cache"

    npm install
    echo "✓ Installed dependencies"
    
    # START BACKEND
    npm run dev &
    echo "✓ Started backend server"

    # SETUP FRONTEND 
    cd "/workspaces/hosted-payment-lightbox/client/react"
    echo "✓ Changed directory to client/react"

    rm -rf node_modules
    echo "✓ Removed node_modules"
    
    npm cache clean --force
    echo "✓ Cleaned npm cache"
    
    npm install
    echo "✓ Installed dependencies"
    
    # START FRONTEND 
    npm run dev &
    echo "✓ Started frontend server"
    
    tail -f /dev/null
else
    sudo bash -c "echo \"${ALTERNATE_WELCOME_MESSAGE}\""
    # exit 1
fi
