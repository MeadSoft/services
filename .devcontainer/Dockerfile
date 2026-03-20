FROM mcr.microsoft.com/devcontainers/base:ubuntu24.04

# TODO: add installation of Nx

SHELL ["/bin/bash", "-c"]

ENV NODE_VERSION=24

#################################################
# general ubuntu

RUN apt update --yes && \
    apt install git iputils-ping unzip sudo --yes && \
    rm -rf /var/lib/apt/lists/*w

# create user if it doesn't exist and add to sudo group
RUN if ! id -u vscode >/dev/null 2>&1; then \
        useradd -m -s /bin/bash -G sudo vscode; \
    fi
# allow vscode user to execute sudo commands without password
RUN echo 'vscode ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/vscode && \
    chmod 0440 /etc/sudoers.d/vscode

#################################################
# docker in docker

RUN curl -fsSL https://get.docker.com -o install-docker.sh
RUN bash install-docker.sh

#################################################
# node https://nodejs.org/en/download

USER vscode

# nvm
# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-in-docker
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
RUN bash -c "source /home/vscode/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION"

# pnpm
# https://pnpm.i/installation#in-a-docker-container

ENV PNPM_HOME=/home/vscode/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN source /home/vscode/.nvm/nvm.sh && \
    corepack enable pnpm

# angular and nestjs cli
RUN source /home/vscode/.nvm/nvm.sh && \
    pnpm i -g @angular/cli --loglevel verbose && \
    pnpm i -g @nestjs/cli --loglevel verbose && \
    pnpm i -g nx --loglevel verbose

USER root

#################################################
# python (LTS)

RUN apt install python3 -y && \
    apt install pipenv --yes && \
    alias python=python3 && \
    alias pip=pip3

#################################################
# gcloud

RUN sudo apt-get install apt-transport-https ca-certificates gnupg curl --yes && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    sudo apt-get update && sudo apt-get install google-cloud-cli --yes

#################################################
# Terraform cli

# https://developer.hashicorp.com/terraform/install
RUN wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list && \
    sudo apt update && sudo apt install terraform --yes

#################################################
# Hoppscotch CLI

# RUN sudo apt-get install python g++ build-essential --yes && \
#     npm i -g @hoppscotch/cli

#################################################

USER vscode

ENTRYPOINT ["tail", "-f", "/dev/null"]
