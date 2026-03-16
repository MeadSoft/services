PRIMARY_COLOR=$COLOR_GRAY
SECONDARY_COLOR=$COLOR_NC
INFO_COLOR=$COLOR_CYAN

WELCOME_INFO="${SECONDARY_COLOR}
██     ██ ███████ ██       ██████  ██████  ███    ███ ███████
██     ██ ██      ██      ██      ██    ██ ████  ████ ██     
██  █  ██ █████   ██      ██      ██    ██ ██ ████ ██ █████  
██ ███ ██ ██      ██      ██      ██    ██ ██  ██  ██ ██     
 ███ ███  ███████ ███████  ██████  ██████  ██      ██ ███████
${PRIMARY_COLOR}
to the MeadSoft's ${INFO_COLOR}$(basename "$WORKSPACE_FOLDER")${PRIMARY_COLOR} mono-repository.
This mono-repository contains several projects, libraries, and tools

Workspace Folder       ${SECONDARY_COLOR}$WORKSPACE_FOLDER

${INFO_COLOR}Library Version(s)${PRIMARY_COLOR}
nvm                 ${SECONDARY_COLOR}$(nvm --version)${PRIMARY_COLOR}
Node                ${SECONDARY_COLOR}$(node --version)${PRIMARY_COLOR}
pnpm                ${SECONDARY_COLOR}$(pnpm --version)${PRIMARY_COLOR}
Angular             ${SECONDARY_COLOR}$(ng --version)${PRIMARY_COLOR}
gcloud              ${SECONDARY_COLOR}$(gcloud --version | head -n 1)${PRIMARY_COLOR}
Python              ${SECONDARY_COLOR}$(python --version 2>&1)${PRIMARY_COLOR}
Terraform           ${SECONDARY_COLOR}$(terraform --version | head -n 1)${PRIMARY_COLOR}

${INFO_COLOR}Git${PRIMARY_COLOR}
Username            ${SECONDARY_COLOR}$(git config user.name)${PRIMARY_COLOR}
Email               ${SECONDARY_COLOR}$(git config user.email)${PRIMARY_COLOR}
"

SSH_GITHUB_STATUS="$(ssh -T git@github.com 2>&1 || true)"

if [[ -n "$SSH_GITHUB_STATUS" ]]; then
WELCOME_INFO+="
${INFO_COLOR}SSH${PRIMARY_COLOR}
Github Connection   ${SECONDARY_COLOR}$SSH_GITHUB_STATUS${PRIMARY_COLOR}
"
fi

WELCOME_INFO+="
to see this info again, use the ${INFO_COLOR}welcome${PRIMARY_COLOR} command${COLOR_NC}
"

alias welcome='printf "$WELCOME_INFO"'
welcome