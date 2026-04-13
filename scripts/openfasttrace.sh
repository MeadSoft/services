#!/bin/sh

CONTAINER_FILE=../cli/openfasttrace/Containerfile
IMAGE_NAME=meadsoft-openfasttrace
SRC_TO_INCLUDE="../docs"

main() {
    if ! podman image exists $IMAGE_NAME; then
        podman build -f $CONTAINER_FILE -t $IMAGE_NAME . || return 1
    fi

    ISO_TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    REPORT_NAME="${ISO_TIMESTAMP}.html"

    mkdir -p docs/reports
    podman run --rm -v "$(pwd):/workspace" "$IMAGE_NAME" trace -o html -f "docs/reports/${REPORT_NAME}" $SRC_TO_INCLUDE "$@"
}

main "$@"
