FROM malept/electron-forge-container:latest

ENV CI=true DEBUG=electron-installer-flatpak,flatpak-bundler

RUN flatpak remote-add --from gnome https://sdk.gnome.org/gnome.flatpakrepo && \
    flatpak install --runtime gnome org.freedesktop.Platform//1.4

RUN mkdir /code
WORKDIR /code
ADD . /code/
