#!/usr/bin/env bash
echo "deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen" | tee -a /etc/apt/sources.list # MongoDB Prep
apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10                                                 # MongoDB Prep
add-apt-repository -y ppa:chris-lea/node.js                                                                  # Node.js Prep
apt-get -y update                                                                                            # Start with a fresh update

# Required Packages
apt-get -y install python-software-properties libssl-dev git-core pkg-config build-essential curl gcc g++ openssl libreadline6 libreadline6-dev zlib1g zlib1g-dev libyaml-dev libsqlite3-0 libsqlite3-dev sqlite3 libxml2-dev libxslt-dev autoconf libc6-dev ncurses-dev automake libtool bison subversion traceroute

# MongoDB Nginx Redis Node.js
apt-get -y install mongodb-10gen nginx redis-server nodejs-dev nodejs

# Nginx Setup
mkdir -p /var/www         # common deploy-to location for our code
mkdir -p /etc/nginx/certs # place SSL certs here

# NPM
curl http://npmjs.org/install.sh | sudo sh