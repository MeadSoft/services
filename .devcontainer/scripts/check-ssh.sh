#!/bin/bash

# Sometimes when mounting volumes, the files unexpectedly change their read-write-execute status.
# This is dependent on the OS the Docker container is mounting from, and how it exposes its
# files permissions, ownership, and executability to the container and the containers user.
# 
# More about specific permissions inside the .ssh folder 
# https://serverfault.com/a/253314
if [ -d "$HOME/.ssh" ]; then
    find ~/.ssh -maxdepth 1 -type f -exec chmod 600 {} \;
    chmod u+r ~/.ssh/config
    chmod u+r ~/.ssh/known_hosts

    echo "Checking SSH connection to GitHub..."
    SSH_GITHUB_STATUS=$(ssh -T git@github.com)
    export SSH_GITHUB_STATUS
fi 
