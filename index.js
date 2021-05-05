const { google } = require('googleapis');
const fs = require('fs');

module.exports = class GmailClient {
	constructor(credentialsPath, tokensPath){
		const credentials = JSON.parse(fs.readFileSync(credentialsPath));
    const tokens = JSON.parse(fs.readFileSync(tokensPath));
    const {client_id, client_secret, redirect_uris } = credentials.web;

    this.oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, (redirect_uris && redirect_uris[0]) || '');

    this.oAuth2Client.setCredentials(tokens);

		this.oAuth2Client.on('tokens', (tokens) => {
			//save tokens for next time
			let oldTokens = JSON.parse(fs.readFileSync(tokensPath));
		
			if (tokens.refresh_token)
				oldTokens.refresh_token = tokens.refresh_token;
		
			if (tokens.expiry_date)
				oldTokens.expiry_date = tokens.expiry_date;
		
			oldTokens.access_token = tokens.access_token;
		
			fs.writeFileSync(tokensPath, JSON.stringify(oldTokens));
		});

		this.gmail = google.gmail('v1');
	}

	async sendMail(from, to, subject, body){
		google.options({ auth: this.oAuth2Client });
  
		const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
		
		const messageParts = [
			`From: ${from}`,
			`To: ${to}`,
			'Content-Type: text/html; charset=utf-8',
			'MIME-Version: 1.0',
			`Subject: ${utf8Subject}`,
			'',
			body
		];
		const message = messageParts.join('\n');

		// The body needs to be base64url encoded.
		const encodedMessage = Buffer.from(message)
			.toString('base64')
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');

		const res = await this.gmail.users.messages.send({
			userId: 'me',
			requestBody: {
				raw: encodedMessage,
			},
		});
	}
}