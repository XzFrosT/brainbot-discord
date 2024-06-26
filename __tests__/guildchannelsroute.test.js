require('dotenv').config({
	path: __dirname.substring(0, (__dirname.lastIndexOf("/"))) + "/.env"
});
const { fetch } = require('undici');

(async function main()
{
	const ServerUrl = String(process.env.SERVER_URL).replace("$SERVER_PORT", process.env.SERVER_PORT);
	const Guild = "793734270635212822";
	const User = process.env.DISCORD_APP_ID;
	
	console.log( await (await fetch(`${ServerUrl}/_guild/${Guild}/channels?permissionsfor=${User}`, {
		method: "GET",
		headers: {
			"Authorization": process.env.SERVER_RSA
		}
	})).json() );
})();