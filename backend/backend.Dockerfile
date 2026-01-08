FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-alpine
USER root
RUN apk add --no-cache curl && addgroup -S app-user && adduser -S user -G app-user

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar
RUN chown user:app-user app.jar
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

USER user
ENTRYPOINT ["java", "-jar", "app.jar"]