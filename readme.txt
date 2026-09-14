===============================================================================
  DEPLOYMENT GUIDE FOR NOTFOUND.HOST (DOCKER + GITHUB DEPLOY KEYS)
===============================================================================

This guide outlines how to download this project, push it to a secure, private GitHub
repository, set up read-only deploy keys on your server to pull the code, run it
via Docker, and configure Nginx with SSL for "notfound.host".

-------------------------------------------------------------------------------
STEP 1: DOWNLOAD & INITIALIZE LOCAL GIT REPOSITORY
-------------------------------------------------------------------------------
1. Download the ZIP file of this project from the settings menu in Google AI Studio.
2. Extract the files on your local machine and open a terminal inside the project folder.
3. Initialize git and make your first commit:
   git init
   git add .
   git commit -m "feat: initial commit for notfound.host"

-------------------------------------------------------------------------------
STEP 2: CREATE A PRIVATE GITHUB REPOSITORY & PUSH CODE
-------------------------------------------------------------------------------
1. Go to GitHub and create a new repository. Make sure to set it to PRIVATE.
2. Link your local directory to your new GitHub repository:
   git remote add origin git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main

-------------------------------------------------------------------------------
STEP 3: SET UP GITHUB DEPLOY KEYS ON YOUR VPS / VPS SERVER
-------------------------------------------------------------------------------
Deploy keys allow your remote VPS to pull your code from your private GitHub repository
without using your personal account password/keys.

1. SSH into your VPS server:
   ssh user@your_server_ip

2. Generate a new SSH key specifically for this project:
   ssh-keygen -t ed25519 -C "vps@notfound.host"
   # Press Enter to accept the default file path (~/.ssh/id_ed25519)
   # Press Enter twice to skip passphrase (important for automatic pulls)

3. View and copy the generated public key:
   cat ~/.ssh/id_ed25519.pub

4. Add it as a GitHub Deploy Key:
   - Go to your private repository page on GitHub.
   - Click "Settings" -> "Deploy keys" -> "Add deploy key".
   - Paste the public key.
   - Give it a name (e.g., "VPS notfound.host").
   - Leave "Allow write access" unchecked (keep it read-only for safety).
   - Click "Add key".

5. Test the connection on your VPS:
   ssh -T git@github.com
   # Type 'yes' when prompted. It should say "You've successfully authenticated!"

-------------------------------------------------------------------------------
STEP 4: CLONE THE CODE ONTO YOUR SERVER
-------------------------------------------------------------------------------
On your VPS, navigate to the folder where you want to keep the app and clone:

cd /var/www
git clone git@github.com:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git grid-dashboard
cd grid-dashboard

-------------------------------------------------------------------------------
STEP 5: INSTALL DOCKER & DOCKER COMPOSE ON YOUR SERVER
-------------------------------------------------------------------------------
If your server doesn't have Docker installed yet, run these commands (for Ubuntu/Debian):

sudo apt update
sudo apt install -y docker.io docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

-------------------------------------------------------------------------------
STEP 6: CONFIGURE ENVIRONMENT VARIABLES & LAUNCH APPS
-------------------------------------------------------------------------------
1. Create a ".env" file in the cloned directory on your VPS:
   nano .env

2. Add your server secrets and API keys:
   GEMINI_API_KEY=your_actual_gemini_api_key_here

3. Build and launch the container in the background (detached mode):
   sudo docker-compose up --build -d

4. Verify that the container is running and listening on port 3000:
   sudo docker ps

-------------------------------------------------------------------------------
STEP 7: CONFIGURE NGINX REVERSE PROXY & FREE SSL CERTIFICATE
-------------------------------------------------------------------------------
To route traffic from "notfound.host" (and optional "www.notfound.host") to your
Docker container on port 3000, use Nginx and Let's Encrypt Certbot.

1. Install Nginx and Certbot:
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx

2. Create an Nginx server block configuration:
   sudo nano /etc/nginx/sites-available/notfound.host

3. Paste the following configuration:
   server {
       listen 80;
       server_name notfound.host www.notfound.host;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }

4. Enable the site configuration and test Nginx:
   sudo ln -s /etc/nginx/sites-available/notfound.host /etc/nginx/sites-enabled/
   sudo nginx -t

5. Reload Nginx to apply changes:
   sudo systemctl reload nginx

6. Generate your free SSL certificate automatically with Let's Encrypt:
   sudo certbot --nginx -d notfound.host -d www.notfound.host
   # Follow the interactive prompts. Choose "Redirect" all HTTP traffic to HTTPS.

-------------------------------------------------------------------------------
STEP 8: HOW TO UPDATE YOUR APP IN THE FUTURE
-------------------------------------------------------------------------------
When you make changes locally:
1. Push your changes to GitHub from your local machine:
   git add .
   git commit -m "update: visual tweaks"
   git push

2. SSH into your VPS, pull, and rebuild the container:
   ssh user@your_server_ip
   cd /var/www/grid-dashboard
   git pull
   sudo docker-compose up --build -d

Your application is now securely running on your private server, fully dockerized,
and accessible via SSL (HTTPS) at https://notfound.host!
===============================================================================
