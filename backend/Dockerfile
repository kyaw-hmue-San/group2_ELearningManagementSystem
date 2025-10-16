# ===========================
# Stage 1: Build the JAR file
# ===========================
FROM maven:3.9.8-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the entire project and build
COPY src ./src
COPY .mvn/ .mvn/
COPY mvnw ./
RUN ./mvnw clean package -DskipTests

# ===========================
# Stage 2: Run the app
# ===========================
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
