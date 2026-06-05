import type { IDataObject, IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

// Merges the optional "Additional Body Fields (JSON)" parameter into the request body.
// Dedicated inputs take precedence; the JSON object fills in everything else.
export async function mergeAdditionalJson(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const raw = this.getNodeParameter('additionalBodyJson', {}) as IDataObject | string;
	if (raw === undefined || raw === null || raw === '' || raw === '{}') {
		return requestOptions;
	}

	let parsed: IDataObject;
	try {
		parsed = typeof raw === 'string' ? (JSON.parse(raw) as IDataObject) : raw;
	} catch {
		throw new NodeOperationError(this.getNode(), 'Additional Body Fields (JSON) is not valid JSON');
	}

	const existing = (requestOptions.body as IDataObject) ?? {};
	requestOptions.body = { ...parsed, ...existing };
	return requestOptions;
}

function csvToArray(value: unknown): string[] {
	return String(value)
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

// Hetzner IDs are integers; names (e.g. SSH key names, image names) are strings.
// Numeric-looking entries are converted to numbers, others kept as strings.
function csvToIdArray(value: unknown): Array<number | string> {
	return csvToArray(value).map((item) => (/^\d+$/.test(item) ? Number(item) : item));
}

function parseJsonParam(this: IExecuteSingleFunctions, name: string): IDataObject | undefined {
	const raw = this.getNodeParameter(name, '') as IDataObject | string;
	if (raw === undefined || raw === null || raw === '' || raw === '{}') {
		return undefined;
	}
	try {
		return typeof raw === 'string' ? (JSON.parse(raw) as IDataObject) : raw;
	} catch {
		throw new NodeOperationError(this.getNode(), `"${name}" is not valid JSON`);
	}
}

// Assembles the request body for Server create from the friendly inputs. The flat fields
// (name, server_type, image, location) are mapped to the body by their own routing.send;
// this fills in the array/object fields from the "Additional Fields" collection.
// Runs before mergeAdditionalJson, so the JSON escape hatch can add anything else.
export async function buildServerBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body: IDataObject = (requestOptions.body as IDataObject) ?? {};
	const add = this.getNodeParameter('additionalFields', {}) as IDataObject;

	if (add.datacenter) body.datacenter = add.datacenter;
	if (add.userData) body.user_data = add.userData;
	if (add.startAfterCreate !== undefined) body.start_after_create = add.startAfterCreate;
	if (add.automount !== undefined) body.automount = add.automount;
	if (add.placementGroup) body.placement_group = Number(add.placementGroup);
	if (add.sshKeys) body.ssh_keys = csvToIdArray(add.sshKeys);
	if (add.networks) body.networks = csvToIdArray(add.networks).map(Number);
	if (add.volumes) body.volumes = csvToIdArray(add.volumes).map(Number);
	if (add.firewalls) {
		body.firewalls = csvToIdArray(add.firewalls).map((id) => ({ firewall: Number(id) }));
	}

	if (add.enableIpv4 !== undefined || add.enableIpv6 !== undefined) {
		const publicNet: IDataObject = (body.public_net as IDataObject) ?? {};
		if (add.enableIpv4 !== undefined) publicNet.enable_ipv4 = add.enableIpv4;
		if (add.enableIpv6 !== undefined) publicNet.enable_ipv6 = add.enableIpv6;
		body.public_net = publicNet;
	}

	const labels = add.labels ? (() => {
		try {
			return JSON.parse(String(add.labels)) as IDataObject;
		} catch {
			throw new NodeOperationError(this.getNode(), 'Labels must be a valid JSON object');
		}
	})() : undefined;
	if (labels) body.labels = labels;

	requestOptions.body = body;
	return requestOptions;
}

// Parses the "Rules (JSON)" array for Firewall create / Set Rules into body.rules.
export async function buildFirewallBody(
	this: IExecuteSingleFunctions,
	requestOptions: IHttpRequestOptions,
): Promise<IHttpRequestOptions> {
	const body: IDataObject = (requestOptions.body as IDataObject) ?? {};
	const rules = parseJsonParam.call(this, 'rulesJson');
	if (rules !== undefined) {
		body.rules = rules as unknown as IDataObject[];
	}
	requestOptions.body = body;
	return requestOptions;
}
