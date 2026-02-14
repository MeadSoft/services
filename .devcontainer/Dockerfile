FROM mcr.microsoft.com/devcontainers/base:ubuntu24.04

# TODO: add installation of Nx

SHELL ["/bin/bash", "-c"]

ENV USER=vscode
ENV NODE_VERSION=24
ENV HOME=/home/$USER

#################################################
# general ubuntu

RUN apt update --yes && \
    apt install git iputils-ping unzip --yes && \
    rm -rf /var/lib/apt/lists/*

#################################################
# docker in docker

RUN curl -fsSL https://get.docker.com -o install-docker.sh
RUN bash install-docker.sh

#################################################
# node https://nodejs.org/en/download

# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-in-docker
USER vscode
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
ENV NVM_DIR=$HOME/.nvm
RUN bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION"
# https://pnpm.io/installation#in-a-docker-container
RUN curl -fsSL https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
RUN pnpm i -g @angular/cli --loglevel verbose && \
    pnpm i -g @nestjs/cli --loglevel verbose
USER root

#################################################
# python (LTS)

RUN apt install python3 -y && \
    apt install pipenv --yes

#################################################
# gcloud

RUN sudo apt-get install apt-transport-https ca-certificates gnupg curl --yes && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    sudo apt-get update && sudo apt-get install google-cloud-cli --yes

#################################################
# Terraform cli

# https://developer.hashicorp.com/terraform/install
RUN wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update && sudo apt install terraform

#################################################
# Hoppscotch CLI

# RUN sudo apt-get install python g++ build-essential --yes && \
#     npm i -g @hoppscotch/cli

#################################################

ENTRYPOINT ["tail", "-f", "/dev/null"]
