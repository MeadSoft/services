FROM mcr.microsoft.com/devcontainers/base:ubuntu24.04

# TODO: add installation of Nx

SHELL ["/bin/bash", "-c"]

ENV USER=vscode
ENV NODE_VERSION=24

#################################################
# general ubuntu

RUN apt update --yes && \
    apt install git iputils-ping unzip sudo --yes && \
    rm -rf /var/lib/apt/lists/*w

# create user if it doesn't exist and add to sudo group
RUN if ! id -u $USER >/dev/null 2>&1; then \
        useradd -m -s /bin/bash -G sudo $USER; \
    fi
# allow vscode user to execute sudo commands without password
RUN echo '$USER ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/$USER && \
    chmod 0440 /etc/sudoers.d/$USER

#################################################
# docker in docker

RUN curl -fsSL https://get.docker.com -o install-docker.sh
RUN bash install-docker.sh

#################################################
# node https://nodejs.org/en/download

USER $USER

# nvm
# https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-in-docker
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
RUN bash -c "source /home/$USER/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION"

# pnpm
# https://pnpm.i/installation#in-a-docker-container
RUN source /home/$USER/.nvm/nvm.sh && \
    corepack enable pnpm
# RUN mkdir -p "$PNPM_HOME" && \
#     chown -R $USER:$USER "$PNPM_HOME" && \
#     chmod -R u+rwX,go+rX "$PNPM_HOME"
# RUN curl -fsSL https://get.pnpm.io/install.sh | SHELL="$(which bash)" bash -

# angular and nestjs cli
RUN source /home/$USER/.nvm/nvm.sh && \
    npm i -g @angular/cli --loglevel verbose && \
    npm i -g @nestjs/cli --loglevel verbose

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
