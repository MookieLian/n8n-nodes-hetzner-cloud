import type {
	IDataObject,
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

export const HETZNER_BASE_URL = 'https://api.hetzner.cloud';

// Authenticated request helper for code paths that run outside the declarative
// routing pipeline (the listSearch methods that populate resource dropdowns).
// Applies the credential auth flow (Bearer token).
export async function hetznerApiRequest(
	this:
		| IExecuteFunctions
		| IExecuteSingleFunctions
		| ILoadOptionsFunctions
		| IHookFunctions
		| IWebhookFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		qs,
		body,
		url: `${HETZNER_BASE_URL}${resource}`,
		json: true,
	};

	if (body === undefined) {
		delete options.body;
	}

	return (await this.helpers.httpRequestWithAuthentication.call(
		this,
		'hetznerCloudApi',
		options,
	)) as IDataObject;
}
