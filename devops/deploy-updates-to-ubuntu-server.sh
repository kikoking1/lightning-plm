# rebuild and restart dotnet app
systemctl stop lightningplm.service

cd /home/ubuntu/apps/lightningplm-app/lightning-plm/server/
dotnet publish --configuration Release

# rotate signing keys. Careful as this will log everyone out.
appsettingsPath="/home/ubuntu/apps/lightningplm-app/lightning-plm/server/LIT.API/bin/Release/net7.0/publish/appsettings.json"
echo -E "$(jq --arg secret_key "$(uuidgen)" --arg secret_refresh_key "$(uuidgen)" '.AuthSettings.JwtSigningKey |= $secret_key | .AuthSettings.JwtRefreshTokenSigningKey |= $secret_refresh_key' ${appsettingsPath})" > ${appsettingsPath}

systemctl restart lightningplm.service

# rebuild and restart angular app
cd /home/ubuntu/apps/lightningplm-app/lightning-plm/client
npm i
ng build

systemctl restart nginx
