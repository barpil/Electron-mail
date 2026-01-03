FROM container-registry.oracle.com/database/free:latest-lite
COPY ./sql/* /opt/oracle/scripts/startup/