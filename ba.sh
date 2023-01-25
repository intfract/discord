# Install Fly
curl -L https://fly.io/install.sh | sh
# Make the scripts available after installation
export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
# Follow the auth url
flyctl auth signup
# Launch the application
fly launch
# Launch Fly with environment variables
flyctl secrets set key=value