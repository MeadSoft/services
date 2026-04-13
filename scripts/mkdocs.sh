#!/bin/sh

CONTAINER_FILE=../cli/mkdocs/Containerfile
IMAGE_NAME=meadsoft-mkdocs

main() {
    if ! podman image exists "$IMAGE_NAME"; then
        podman build -f "$CONTAINER_FILE" -t "$IMAGE_NAME" . || return 1
    fi

    podman run \
        --rm \
        -v "$(pwd):/workspace" \
        -p "8000:8000" \
        -e WATCHDOG_FORCE_POLLING=1 \
        "$IMAGE_NAME" \
        "$@"
}

main "$@"
