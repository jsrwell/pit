#!/usr/bin/env bash
# Builds or pushes the backend and frontend release images.
#
# Usage: release_images.sh <build|push> <version> [channel]
#
# Called by semantic-release with nextRelease.version and
# nextRelease.channel ("beta" on develop, empty on main). `build` runs
# from `prepareCmd`, so a broken image aborts the release before the
# release commit and the tag exist; `push` runs from `publishCmd`.
#
# Backend and frontend are released in lockstep: both images always get
# the same tags, so a frontend tag always names the backend it was
# built against.
#
#   ghcr.io/<owner>/<repo>/backend:<version>   plus :latest or :beta
#   ghcr.io/<owner>/<repo>/frontend:<version>  plus :latest or :beta

set -euo pipefail

if [ "$#" -lt 2 ]; then
    echo "Usage: release_images.sh <build|push> <version> [channel]" >&2
    exit 1
fi

action="$1"
version="$2"
channel="${3:-}"
moving_tag="${channel:-latest}"
components=(backend frontend)

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"

# GHCR refuses an uppercase path, which GITHUB_REPOSITORY may carry.
registry="ghcr.io/$(echo "${GITHUB_REPOSITORY}" | tr '[:upper:]' '[:lower:]')"

build() {
    local component="$1"
    local image="${registry}/${component}"

    echo "[release_images] building ${image}:${version}"
    docker build \
        --file "${repository_root}/docker/release/${component}/Dockerfile" \
        --platform linux/amd64 \
        --build-arg "APP_VERSION=${version}" \
        --label "org.opencontainers.image.source=https://github.com/${GITHUB_REPOSITORY}" \
        --label "org.opencontainers.image.version=${version}" \
        --tag "${image}:${version}" \
        --tag "${image}:${moving_tag}" \
        "${repository_root}"
}

push() {
    local component="$1"
    local image="${registry}/${component}"

    echo "[release_images] pushing ${image}:${version} and :${moving_tag}"
    docker push "${image}:${version}"
    docker push "${image}:${moving_tag}"
}

case "${action}" in
    build | push)
        for component in "${components[@]}"; do
            "${action}" "${component}"
        done
        ;;
    *)
        echo "Unknown action '${action}', expected build or push" >&2
        exit 1
        ;;
esac
