#!/bin/bash

# nvm
# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-in-docker
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
source $HOME/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION

# pnpm
# https://pnpm.i/installation#in-a-docker-container

PNPM_HOME=$HOME/.local/share/pnpm
PATH=$PNPM_HOME:$PATH
source $HOME/.nvm/nvm.sh
corepack enable pnpm

# angular and nestjs cli
source $HOME/.nvm/nvm.sh
pnpm i -g @angular/cli --loglevel verbose
pnpm i -g @nestjs/cli --loglevel verbose
pnpm i -g nx --loglevel verbose
