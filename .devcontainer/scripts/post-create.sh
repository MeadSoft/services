#!/bin/bash

CUSTOM_BASHRC_SCRIPT_NAME=".bashrc.meadsoft-services"
CUSTOM_BASHRC_SCRIPT_PATH="${WORKSPACE_FOLDER}/.devcontainer/scripts/$CUSTOM_BASHRC_SCRIPT_NAME"

# check if custom bashrc script exists. it should
if [[ ! -f "$CUSTOM_BASHRC_SCRIPT_PATH" ]]; then
    echo "No custom bashrc script found at '$CUSTOM_BASHRC_SCRIPT_PATH'"
    exit 1
fi

# check if custom bashrc script is already sourced in ~/.bashrc
IS_CUSTOM_BASH_RC_ALREADY_CALLED=$(grep -c "$CUSTOM_BASHRC_SCRIPT_NAME" ~/.bashrc) # returns 0 if false because grep found nothing
if [[ $IS_CUSTOM_BASH_RC_ALREADY_CALLED -eq 0 ]]; then
    echo "source $CUSTOM_BASHRC_SCRIPT_PATH" >> ~/.bashrc
fi
