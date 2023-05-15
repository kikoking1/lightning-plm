# rebuild and restart dotnet app
systemctl stop lightningplm.service

cd /home/ubuntu/apps/lightningplm-app/lightningplm/server/
dotnet publish --configuration Release

# rotate signing keys. Careful as this will log everyone out.
appsettingsPath="/home/ubuntu/apps/lightningplm-app/lightningplm/server/MTT.API/bin/Release/net7.0/publish/appsettings.json"
echo -E "$(jq --arg secret_key "$(uuidgen)" --arg secret_refresh_key "$(uuidgen)" '.AuthSettings.JwtSigningKey |= $secret_key | .AuthSettings.JwtRefreshTokenSigningKey |= $secret_refresh_key' ${appsettingsPath})" > ${appsettingsPath}

systemctl restart lightningplm.service

# rebuild and restart react app
cd /home/ubuntu/apps/lightningplm-app/lightningplm/client
npm i
npm run build

systemctl restart nginx
