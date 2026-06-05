import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	labelSelectorOption,
	limitField,
	pageOption,
	primaryIpLocator,
	serverLocator,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['primaryIp'] };
const showCreate = { ...showFor, operation: ['create'] };
const actionPath = (verb: string) => `=/v1/primary_ips/{{ $parameter.primaryIpId }}/actions/${verb}`;

export const primaryIpDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Assign',
				value: 'assign',
				action: 'Assign a primary ip to a server',
				description: 'Assign a Primary IP to a server',
				routing: { request: { method: 'POST', url: actionPath('assign') }, ...unwrap('action') },
			},
			{
				name: 'Change DNS PTR',
				value: 'changeDnsPtr',
				action: 'Change the reverse dns of a primary ip',
				description: 'Change the reverse DNS (PTR) entry of a Primary IP',
				routing: {
					request: { method: 'POST', url: actionPath('change_dns_ptr') },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change primary ip protection',
				description: 'Change the delete protection of a Primary IP',
				routing: {
					request: { method: 'POST', url: actionPath('change_protection') },
					...unwrap('action'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a primary ip',
				description: 'Create a new Primary IP',
				routing: { request: { method: 'POST', url: '/v1/primary_ips' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a primary ip',
				description: 'Delete a Primary IP',
				routing: {
					request: { method: 'DELETE', url: '=/v1/primary_ips/{{ $parameter.primaryIpId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a primary ip',
				description: 'Retrieve a single Primary IP by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/primary_ips/{{ $parameter.primaryIpId }}' },
					...unwrap('primary_ip'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many primary ips',
				description: 'List Primary IPs in the project',
				routing: { request: { method: 'GET', url: '/v1/primary_ips' }, ...unwrap('primary_ips') },
			},
			{
				name: 'Unassign',
				value: 'unassign',
				action: 'Unassign a primary ip',
				description: 'Unassign a Primary IP from its server',
				routing: { request: { method: 'POST', url: actionPath('unassign') }, ...unwrap('action') },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a primary ip',
				description: 'Update an existing Primary IP (name, labels, auto-delete)',
				routing: {
					request: { method: 'PUT', url: '=/v1/primary_ips/{{ $parameter.primaryIpId }}' },
					...unwrap('primary_ip'),
				},
			},
		],
		default: 'getAll',
	},

	primaryIpLocator(
		{
			...showFor,
			operation: ['get', 'delete', 'update', 'assign', 'unassign', 'changeDnsPtr', 'changeProtection'],
		},
		{ inPath: true },
	),

	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'e.g. my-primary-ip',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the Primary IP',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'IPv4', value: 'ipv4' },
			{ name: 'IPv6', value: 'ipv6' },
		],
		default: 'ipv4',
		required: true,
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'The type of the Primary IP',
	},
	{
		displayName: 'Datacenter',
		name: 'datacenter',
		type: 'string',
		default: '',
		displayOptions: { show: showCreate },
		placeholder: 'e.g. fsn1-dc14',
		routing: { send: { type: 'body', property: 'datacenter', value: '={{ $value }}' } },
		description: 'The datacenter name to create the Primary IP in (required unless assigned to a server)',
	},
	{
		displayName: 'Assignee Type',
		name: 'assigneeType',
		type: 'options',
		options: [{ name: 'Server', value: 'server' }],
		default: 'server',
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'assignee_type', value: '={{ $value }}' } },
		description: 'The type of resource the Primary IP can be assigned to',
	},
	additionalBodyJsonField({ ...showFor, operation: ['create', 'update'] }),

	// Update
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new unique name for the Primary IP',
	},

	// Assign
	serverLocator({ ...showFor, operation: ['assign'] }, { property: 'assignee_id' }),
	{
		displayName: 'Assignee Type',
		name: 'assigneeType',
		type: 'options',
		options: [{ name: 'Server', value: 'server' }],
		default: 'server',
		displayOptions: { show: { ...showFor, operation: ['assign'] } },
		routing: { send: { type: 'body', property: 'assignee_type', value: '={{ $value }}' } },
		description: 'The type of resource to assign the Primary IP to',
	},

	// Change DNS PTR
	{
		displayName: 'IP',
		name: 'ip',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['changeDnsPtr'] } },
		placeholder: 'e.g. 1.2.3.4',
		routing: { send: { type: 'body', property: 'ip', value: '={{ $value }}' } },
		description: 'The IP address for which to set the reverse DNS entry',
	},
	{
		displayName: 'DNS Pointer',
		name: 'dnsPtr',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['changeDnsPtr'] } },
		placeholder: 'e.g. server.example.com',
		routing: { send: { type: 'body', property: 'dns_ptr', value: '={{ $value }}' } },
		description: 'The hostname to set as the reverse DNS entry',
	},

	// Change Protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the Primary IP is protected against deletion',
	},

	limitField({ ...showFor, operation: ['getAll'] }),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showFor, operation: ['getAll'] } },
		options: [pageOption, labelSelectorOption],
	},
];
