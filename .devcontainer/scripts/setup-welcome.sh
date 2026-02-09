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
to the MeadSoft's  ${INFO_COLOR}$(basename "$WORKSPACE_FOLDER")${PRIMARY_COLOR} mono-repository.
This mono-repository contains several projects, libraries, and tools

Workspace Folder       ${SECONDARY_COLOR}$WORKSPACE_FOLDER

${INFO_COLOR}Library Version(s)${PRIMARY_COLOR}
Node Version           ${SECONDARY_COLOR}$(node --version)${PRIMARY_COLOR}
Angular Version        ${SECONDARY_COLOR}$(ng --version)${PRIMARY_COLOR}

${INFO_COLOR}Git${PRIMARY_COLOR}
Username               ${SECONDARY_COLOR}$(git config user.name)${PRIMARY_COLOR}
Email                  ${SECONDARY_COLOR}$(git config user.email)${PRIMARY_COLOR}

to see this info again, use the ${INFO_COLOR}welcome${PRIMARY_COLOR} command${COLOR_NC}
"

alias welcome='printf "$WELCOME_INFO"'
welcome