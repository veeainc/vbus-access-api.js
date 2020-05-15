#BEGIN vhx09-10
FROM bamboo.vsys.local:5000/vbus/vbus-logs-arm64v8:latest
ARG OSARCH="arm64v8"
#END

#BEGIN vhc05
FROM bamboo.vsys.local:5000/vbus/vbus-logs-armhf:latest
ARG OSARCH="armhf"
#END

RUN mkdir /app
COPY src/ /app/
WORKDIR /app

RUN cp /app/start.sh /usr/local/bin/ && \
    chmod a+rx /usr/local/bin/start.sh


RUN mkdir -p /var/lib/veea/config/

WORKDIR /app

ENV VBUS_PATH=/var/lib/veea/vbus
# ENV GIN_MODE=release

EXPOSE 8080
 
ARG name="vbus-logs-${OSARCH}"
ARG version="1.0.5"
LABEL com.veea.image.name=$name
LABEL com.veea.image.tag=$version
LABEL com.virtuosys.image.name=$name
LABEL com.virtuosys.image.tag=$version

CMD ["start.sh",""]
