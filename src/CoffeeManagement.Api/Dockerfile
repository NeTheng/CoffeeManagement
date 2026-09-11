FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["CoffeeManagement.Api/CoffeeManagement.Api.csproj", "."]
COPY ["CoffeeManagement.Api/", "."]
RUN dotnet restore "CoffeeManagement.Api.csproj"
RUN dotnet tool install --global dotnet-ef
RUN dotnet build "CoffeeManagement.Api.csproj" -c Release

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENV PATH="${PATH}:/root/.dotnet/tools"
COPY --from=build /root/.dotnet/tools /root/.dotnet/tools
COPY --from=build /src /src
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
CMD ["dotnet", "run", "--project", "/src/CoffeeManagement.Api.csproj", "--no-launch-profile", "--urls", "http://0.0.0.0:8080"]
