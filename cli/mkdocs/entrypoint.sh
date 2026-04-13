#!/bin/sh

main() {
    if [ "$#" -eq 0 ]; then
        mkdocs
        return
    fi

    cmd="$1"
    shift

    if [ "$cmd" = "serve" ]; then
        # Check if -a/--dev-addr is already specified
        addr_specified=false
        for arg in "$@"; do
            if [ "$arg" = "-a" ] || [ "$arg" = "--dev-addr" ]; then
                addr_specified=true
                break
            fi
        done

        mkdocs_command="mkdocs serve"

        # add watch arguments if not specified
        if [ "$watch_specified" = "false" ]; then
            mkdocs_command="$mkdocs_command --watch /workspace/docs"
        fi

        # Add default address if not specified
        if [ "$addr_specified" = "false" ]; then
            mkdocs_command="$mkdocs_command -a 0.0.0.0:8000"
        fi

        echo "Running command: $mkdocs_command $@"
        # Execute the final command
        eval "$mkdocs_command $@"
    else
        mkdocs "$cmd" "$@"
    fi
}

main "$@"
