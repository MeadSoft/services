#!/bin/bash

apt-get update --yes
apt-get install --yes postgresql-client
rm -rf /var/lib/apt/lists/*