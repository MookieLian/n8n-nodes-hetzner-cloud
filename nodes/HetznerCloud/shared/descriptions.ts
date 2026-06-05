import type { IDisplayOptions, INodeProperties } from 'n8n-workflow';

type DisplayShow = IDisplayOptions['show'];
type Routing = NonNullable<INodeProperties['routing']>;

// Hetzner wraps responses in a root property (e.g. { "servers": [...] } or { "server": {...} }).
// This returns the routing.output fragment that unwraps a given root property so the node emits
// the bare resource(s). Spread it into an operation's `routing` object.
//
// IMPORTANT: do NOT unwrap composite responses (e.g. POST /servers returns
// { server, action, next_actions, root_password }) — unwrapping would silently drop fields.
export function unwrap(property: string): Pick<Routing, 'output'> {
	return { output: { postReceive: [{ type: 'rootProperty', properties: { property } }] } };
}

interface LocatorOptions {
	// When true the value is used only in the URL path (no routing.send is attached);
	// reference it in the URL with {{ $parameter.<name> }}.
	inPath?: boolean;
	// Where to place the value when not a path parameter.
	sendType?: 'body' | 'query';
	// The request property name to send the value as (defaults to the field name).
	property?: string;
	required?: boolean;
}

// Generic searchable resource picker (From List via a listSearch method, or By ID).
function locator(
	displayName: string,
	name: string,
	searchListMethod: string,
	description: string,
	show: DisplayShow,
	{ inPath = false, sendType = 'body', property, required = true }: LocatorOptions = {},
): INodeProperties {
	const field: INodeProperties = {
		displayName,
		name,
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required,
		displayOptions: { show },
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				typeOptions: { searchListMethod, searchable: true },
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 42',
			},
		],
		description,
	};

	if (!inPath) {
		// Hetzner reference fields in request bodies expect the integer ID, while the
		// resourceLocator value is a string. Coerce to a number for body params.
		const value = sendType === 'body' ? '={{ Number($value) }}' : '={{ $value }}';
		field.routing = { send: { type: sendType, property: property ?? name, value } };
	}

	return field;
}

export function serverLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Server', 'serverId', 'getServers', 'The server to operate on', show, opts);
}

export function sshKeyLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('SSH Key', 'sshKeyId', 'getSshKeys', 'The SSH key to operate on', show, opts);
}

export function volumeLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Volume', 'volumeId', 'getVolumes', 'The volume to operate on', show, opts);
}

export function networkLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Network', 'networkId', 'getNetworks', 'The network to operate on', show, opts);
}

export function firewallLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Firewall', 'firewallId', 'getFirewalls', 'The firewall to operate on', show, opts);
}

export function loadBalancerLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator(
		'Load Balancer',
		'loadBalancerId',
		'getLoadBalancers',
		'The load balancer to operate on',
		show,
		opts,
	);
}

export function floatingIpLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Floating IP', 'floatingIpId', 'getFloatingIps', 'The Floating IP to operate on', show, opts);
}

export function primaryIpLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Primary IP', 'primaryIpId', 'getPrimaryIps', 'The Primary IP to operate on', show, opts);
}

export function certificateLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Certificate', 'certificateId', 'getCertificates', 'The certificate to operate on', show, opts);
}

export function imageLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Image', 'imageId', 'getImages', 'The image to operate on', show, opts);
}

export function placementGroupLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator(
		'Placement Group',
		'placementGroupId',
		'getPlacementGroups',
		'The placement group to operate on',
		show,
		opts,
	);
}

export function serverTypeLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Server Type', 'serverTypeId', 'getServerTypes', 'The server type', show, opts);
}

export function locationLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Location', 'locationId', 'getLocations', 'The location', show, opts);
}

export function datacenterLocator(show: DisplayShow, opts: LocatorOptions = {}): INodeProperties {
	return locator('Datacenter', 'datacenterId', 'getDatacenters', 'The datacenter', show, opts);
}

// Standard "Limit" field for Get Many operations (Hetzner caps page size at 50).
export function limitField(show: DisplayShow): INodeProperties {
	return {
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 50 },
		default: 50,
		displayOptions: { show },
		routing: { send: { type: 'query', property: 'per_page', value: '={{ $value }}' } },
		description: 'Max number of results to return',
	};
}

// "Page" option (1-based) for paging through Get Many results.
export const pageOption: INodeProperties = {
	displayName: 'Page',
	name: 'page',
	type: 'number',
	typeOptions: { minValue: 1 },
	default: 1,
	routing: { send: { type: 'query', property: 'page', value: '={{ $value }}' } },
	description: 'The page of results to return (1-based)',
};

// "Label Selector" filter option for Get Many operations.
export const labelSelectorOption: INodeProperties = {
	displayName: 'Label Selector',
	name: 'label_selector',
	type: 'string',
	default: '',
	placeholder: 'e.g. env=prod',
	routing: { send: { type: 'query', property: 'label_selector', value: '={{ $value }}' } },
	description: 'Filter results by labels (see the Hetzner Cloud label selector syntax)',
};

// A free-form JSON object merged into the request body, letting power users set any
// field the Hetzner Cloud API supports that is not exposed as a dedicated input.
export function additionalBodyJsonField(show: DisplayShow): INodeProperties {
	return {
		displayName: 'Additional Body Fields (JSON)',
		name: 'additionalBodyJson',
		type: 'json',
		default: '{}',
		displayOptions: { show },
		description:
			'Extra properties merged into the request body. Use this for any field not exposed above (see the Hetzner Cloud API reference).',
	};
}
