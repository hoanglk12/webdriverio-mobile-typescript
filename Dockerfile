# Use Ubuntu base image
FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV ANDROID_HOME=/opt/android-sdk
ENV ANDROID_SDK_ROOT=${ANDROID_HOME}
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools:${ANDROID_HOME}/emulator

# Install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    git \
    openjdk-11-jdk \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 24 (required by appium@3 / eslint@10 engine ranges)
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
    && apt-get install -y nodejs

# Install Android SDK
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip -q commandlinetools-linux-9477386_latest.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm commandlinetools-linux-9477386_latest.zip

# Accept Android licenses
RUN yes | sdkmanager --licenses

# Install Android SDK packages
RUN sdkmanager "platform-tools" "platforms;android-30" "build-tools;30.0.3" "emulator"

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm ci

# Install Appium globally
RUN npm install -g appium@next && \
    appium driver install uiautomator2

# Copy project files
COPY . .

# Expose Appium port
EXPOSE 4723

# Default command
CMD ["npm", "test"]
