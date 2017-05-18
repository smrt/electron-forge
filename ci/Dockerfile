FROM malept/electron-forge-container:latest

ENV CI=true DEBUG=electron-installer-flatpak,flatpak-bundler

RUN mkdir /code
WORKDIR /code
ADD . /code/
