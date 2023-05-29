NOTE: This project can be viewed live at [https://lightningplm.com/](https://lightningplm.com/) (THIS PROJECT IS NOT LIVE AT THE MOMENT)

# Initial Deployment Setup on a New Ubuntu ec2 Server

REQUIRES: ubuntu 20.04 ec2 t2.small instance (defaults on the rest). Uses .NET 7.0, which does NOT work on ubuntu version 22.04 at the time of writing this.

make sure your domain is pointed at the server's ip address before trying to do the certbot let's encrypt ssl step

## Connect to Instance and Download Repo, Then Execute Server Setup Bash File

```
ssh -i "C:\Users\kiko\.ssh\kikos_aws\aws_mth_key.pem" ubuntu@ec2-35-183-0-106.ca-central-1.compute.amazonaws.com

# once connected, execute the following
sudo -s
cd /home/ubuntu/
mkdir apps
cd apps
mkdir lightningplm-app
cd lightningplm-app
git clone https://github.com/kikoking1/lightning-plm.git
bash /home/ubuntu/apps/lightningplm-app/lightning-plm/devops/new-ubuntu-server-setup.sh
```

NOTE: the only prompts should be the certbot prompts at the very end.

Put in a real email, say yes twice, and it should be live

# Deployment Updates Ubuntu ec2 Server

```
ssh -i "C:\Users\kiko\.ssh\kikos_aws\aws_mth_key.pem" ubuntu@ec2-35-183-0-106.ca-central-1.compute.amazonaws.com

# once connected, execute the following
sudo -s

# get latest version of app from github
cd /home/ubuntu/apps/lightningplm-app/lightning-plm/
git pull

# let the updated devops file take care of the rest
bash /home/ubuntu/apps/lightningplm-app/lightning-plm/devops/deploy-updates-to-ubuntu-server.sh
```
