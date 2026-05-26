FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw
RUN ./mvnw -B -DskipTests clean package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/trmarket-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]