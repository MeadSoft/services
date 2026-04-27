#!/bin/bash

apt update --yes
apt install git iputils-ping unzip sudo --yes
rm -rf /var/lib/apt/lists/*w
