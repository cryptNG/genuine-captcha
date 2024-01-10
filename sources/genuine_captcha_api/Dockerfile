FROM mcr.microsoft.com/dotnet/sdk:7.0
EXPOSE 5100/tcp
WORKDIR /app
COPY . .
RUN dotnet dev-certs https
RUN dotnet restore 
RUN dotnet build
ENTRYPOINT dotnet bin/Debug/net7.0/genuine_captcha_api.dll
      
      