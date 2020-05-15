ifeq ($(TARGET),arm64v8)
	DOCKER_IMAGE_NAMES = vbus-logs-arm64v8
	DOCKER_BASE_IMAGE = bamboo.vsys.local:5000/vsys/ies-app-base-alpine-arm64v8:2.1.2
	GO_BASE_IMAGE = balenalib/aarch64-alpine-golang:1.13-3.8-build
	NODE_BASE_IMAGE = balenalib/amd64-debian-node:latest-build
	CROSSBUILD = yes
	ENV_GOARCH = arm64
	ENV_GOARM = 
endif
ifeq ($(TARGET),armhf)
	DOCKER_IMAGE_NAMES = vbus-logs-armhf
	DOCKER_BASE_IMAGE = bamboo.vsys.local:5000/vsys/ies-app-base-alpine-armhf:2.1.3
	GO_BASE_IMAGE = balenalib/armv7hf-alpine-golang:latest-build
	NODE_BASE_IMAGE = balenalib/amd64-debian-node:latest-build
	CROSSBUILD = yes
	ENV_GOARCH = arm
	ENV_GOARM = 6
endif
ifeq ($(TARGET),amd64)
	DOCKER_IMAGE_NAMES = vbus-logs-amd64
	DOCKER_BASE_IMAGE = balenalib/amd64-alpine:latest-run
	GO_BASE_IMAGE = balenalib/amd64-alpine-golang:latest-run
	NODE_BASE_IMAGE = balenalib/amd64-debian-node:latest-build
	CROSSBUILD = no
	ENV_GOARCH = amd64
	ENV_GOARM = 
endif

DOCKER_FILE_NAMES =                              \
    Dockerfile                           \

DOCKER_BUILD_OPTIONS =                           \
    --build-arg BASEIMAGE=$(DOCKER_BASE_IMAGE)	\
    --build-arg TARGET=$(TARGET)		\
		--build-arg LIB_FOLDER=$(LIB_FOLDER) \
		--build-arg ENV_GOARCH=$(ENV_GOARCH) \
		--build-arg ENV_GOARM=$(ENV_GOARM) \
	--build-arg GO_BASE_IMAGE=$(GO_BASE_IMAGE)	\
	--build-arg NODE_BASE_IMAGE=$(NODE_BASE_IMAGE)	\
#   --no-cache					


DOCKER_RUN_OPTIONS =                             \
    -v $(realpath $(NODE_TOP)):/home/vsys/node   \
    -w /home/vsys/node/install                   \

DOCKER_BUILD_PREREQS =                           \


DOCKER_REPO_URL           ?= bamboo.vsys.local:5000
DOCKER_REPO_DIR           ?= $(USER)
ifdef TAG
    DOCKER_TAG             = $(TAG)
else
    DOCKER_TAG            ?= latest
endif
DOCKER_REPO_URL_DIR        = $(addsuffix /,$(DOCKER_REPO_URL))$(addsuffix /,$(DOCKER_REPO_DIR))
DOCKER_IMAGES_URL_DIR      = $(addprefix $(DOCKER_REPO_URL_DIR),$(DOCKER_IMAGE_NAMES))
DOCKER_IMAGES              = $(addprefix $(DOCKER_IMAGES_URL_DIR),$(addprefix :,$(DOCKER_TAG)))

build : $(DOCKER_BUILD_PREREQS)
	docker build -f $(DOCKER_FILE_NAMES) \
	$(DOCKER_BUILD_OPTIONS) \
	--build-arg DATE=$(shell date +%Y-%m-%d:%H:%M:%S) \
	--build-arg NAME=$(call find-docker-name,$(@)) \
	--build-arg REPO=$(DOCKER_REPO_URL_DIR:/=) \
	--build-arg TAG=$(DOCKER_TAG) \
	-t $(DOCKER_IMAGES) \
	.

store :
	docker image save -o $(addsuffix /,$(STORE_PATH))$(addprefix $(DOCKER_IMAGE_NAMES),$(addprefix -,$(DOCKER_TAG))) $(DOCKER_IMAGES)
push : 
	docker push $(DOCKER_IMAGES)

clean:
	rm -rf makeignore/
	rm -rf zipignore/
