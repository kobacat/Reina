const EncodedClient = 'MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE=';

async function getAccessToken() {
	const res = await fetch(
		'https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token',
		{
			method: 'post',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `basic ${EncodedClient}`,
			},
			body: new URLSearchParams({
				grant_type: 'device_auth',
				account_id: process.env.FNaccountID,
				device_id: process.env.FNdeviceID,
				secret: process.env.FNsecret,
			}),
		},
	);
	if (!res.ok) throw new Error(`Unexpected Epic response status: [${res.status}] ${res.statusText}`);
	return res.json();
}

module.exports.getAccessToken = getAccessToken;

/**
 *
 * @param {string} url
 */
async function epicFetch(url) {
	const { access_token } = await getAccessToken();
	const res = await fetch(url, {
		headers: {
			Authorization: `bearer ${access_token}`,
		},
	});
	return res.json();
}

module.exports.epicFetch = epicFetch;