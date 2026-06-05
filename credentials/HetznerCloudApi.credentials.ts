import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

// Host for the Hetzner Cloud API. All resources live under the /v1 path, which is
// included in each request URL (so this stays a bare host).
export const hetznerBaseUrl = 'https://api.hetzner.cloud';

export class HetznerCloudApi implements ICredentialType {
	name = 'hetznerCloudApi';

	displayName = 'Hetzner Cloud API';

	icon: Icon = 'file:../nodes/HetznerCloud/hetznerCloud.svg';

	documentationUrl = 'https://docs.hetzner.cloud/';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'A project-scoped API token. Create one in the Hetzner Cloud Console under your project → Security → API tokens.',
		},
	];

	// Hetzner Cloud authenticates every request with a Bearer token.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	// Verifies the token against a lightweight, always-available read-only endpoint.
	test: ICredentialTestRequest = {
		request: {
			baseURL: hetznerBaseUrl,
			url: '/v1/server_types',
			method: 'GET',
			qs: { per_page: 1 },
		},
	};
}
