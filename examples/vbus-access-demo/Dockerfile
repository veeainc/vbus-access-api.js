ARG BASEIMAGE
ARG GO_BASE_IMAGE
ARG NODE_BASE_IMAGE

###############################################################################
# Buidler for Go Api                                                          #
###############################################################################
FROM $GO_BASE_IMAGE as builder

RUN [ "cross-build-start" ]

RUN apk add dbus-x11

ENV GO111MODULE on
ARG ENV_GOARCH
ARG ENV_GOARM
ENV GOARCH=$ENV_GOARCH
ENV GOARM=$ENV_GOARM

RUN mkdir -p /home/build/vbus-info/
WORKDIR /home/build/vbus-info/

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY . .
RUN go build -v

RUN [ "cross-build-end" ]

###############################################################################
# Runtime                                                                     #
###############################################################################
FROM $BASEIMAGE as runtime

# required dependencies
RUN apk add dbus-x11

# copy go
COPY --from=builder /home/build/vbus-info/info /usr/local/bin/

# some env
ENV LD_LIBRARY_PATH="${LD_LIBRARY_PATH:+${LD_LIBRARY_PATH}:}/usr/local/lib"
# Update the path to pick up the Docker client, assuming the container has the /srv/node volume mounted.
ENV PATH="${PATH}:/srv/node/usr/bin"

# Startup configuration, stage is a utility used to run common install actions
COPY start.sh /usr/local/bin/

# packages
RUN chmod a+rx /usr/local/bin/start.sh

# Pass monitor as CMD, other CMDs will also use tini by default
CMD ["start.sh"]

ARG DATE
ARG NAME
ARG REPO
ARG TAG
ENV BUILD_DATE=$DATE BUILD_NAME=$NAME BUILD_REPO=$REPO BUILD_TAG=$TAG
