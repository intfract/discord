curl -L https://fly.io/install.sh | sh
export FLYCTL_INSTALL="/home/gitpod/.fly"
export PATH="$FLYCTL_INSTALL/bin:$PATH"
flyctl auth login
fly launch
flyctl secrets set
echo "Hello, World!"