# CLI Tools

These tools are intended to be used by developers and technical users who are working with the specification.

Each tool should have a

- run script at the root of the repo
- Containerfile
- optional containerfile entrypoint script

that serves as a wrapper for running cli tools without having to actually install dependencies on the host machine. The run script should check if the container image exists and build it if it doesn't, then run the container with the appropriate command.

## Prerequisites

- [Podman](https://podman.io/)
    - or [Docker](https://www.docker.com/), but Podman is preferred because its free and rootless
    - podman provides software through containers so people dont have to worry about how to install dependencies
- [Git](https://git-scm.com/)
- Run the `git submodule update --init --recursive` command at the root of the repo
    - this clones all of the repositories that are part of this repo into the `repos` folder, which is necessary for the Open Fast Trace tool to work

## CLI

### Open Fast Trace

To run the Open Fast Trace CLI tool, use the following command at the root of the repo

```sh
./oft.sh [EXTRA ARGS]
```

It will then output an HTML report to the `reports` directory with a timestamped filename that shows a trace of all of our requirements in all of the repositories related to this repo. You can open this report in a web browser to explore the trace.

### MkDocs

TODO
