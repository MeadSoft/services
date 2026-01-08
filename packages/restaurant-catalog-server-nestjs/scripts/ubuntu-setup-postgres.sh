#!/bin/bash

# Parse command line arguments
database=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --database-name)
            database="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if required argument is provided
if [[ -z "$database" ]]; then
    echo "Error: --database-name is required"
    exit 1
fi

#############################################################
# https://documentation.ubuntu.com/server/how-to/databases/install-postgresql/
# part 1: installing postgres
# Check if PostgreSQL is already installed
if dpkg -s postgresql &> /dev/null; then
    echo "PostgreSQL is already installed. Skipping installation."
else
    echo "Installing PostgreSQL..."
    sudo apt update
    sudo apt install postgresql -y
fi
psql --version
pg_isready

#############################################################
# part 2: setting up postgres user
sudo service postgresql start
# sudo -u postgres psql
# enable listening to all machines other than localhost
sudo sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/*/main/postgresql.conf

echo Connecting to the postgres template database. Please set a password for the default user
echo
echo ALTER USER postgres with encrypted password \'your_password\';
echo
sudo -u postgres psql template1
