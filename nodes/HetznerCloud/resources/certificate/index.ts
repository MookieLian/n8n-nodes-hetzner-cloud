import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	certificateLocator,
	labelSelectorOption,
	limitField,
	pageOption,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['certificate'] };
const showCreate = { ...showFor, operation: ['create'] };

export const certificateDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a certificate',
				description: 'Upload or request a managed certificate',
				routing: { request: { method: 'POST', url: '/v1/certificates' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a certificate',
				description: 'Delete a certificate',
				routing: {
					request: { method: 'DELETE', url: '=/v1/certificates/{{ $parameter.certificateId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a certificate',
				description: 'Retrieve a single certificate by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/certificates/{{ $parameter.certificateId }}' },
					...unwrap('certificate'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many certificates',
				description: 'List certificates in the project',
				routing: { request: { method: 'GET', url: '/v1/certificates' }, ...unwrap('certificates') },
			},
			{
				name: 'Retry',
				value: 'retry',
				action: 'Retry a managed certificate',
				description: 'Retry issuance of a failed managed certificate',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/certificates/{{ $parameter.certificateId }}/actions/retry',
					},
					...unwrap('action'),
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a certificate',
				description: 'Update an existing certificate (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/certificates/{{ $parameter.certificateId }}' },
					...unwrap('certificate'),
				},
			},
		],
		default: 'getAll',
	},

	certificateLocator({ ...showFor, operation: ['get', 'delete', 'update', 'retry'] }, { inPath: true }),

	// Create
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'e.g. example-com-cert',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the certificate',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [
			{ name: 'Managed', value: 'managed' },
			{ name: 'Uploaded', value: 'uploaded' },
		],
		default: 'managed',
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'Whether Hetzner manages the certificate (via ACME) or you upload your own',
	},
	{
		displayName: 'Domain Names',
		name: 'domainNames',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showCreate, type: ['managed'] } },
		placeholder: 'example.com,www.example.com',
		routing: {
			send: {
				type: 'body',
				property: 'domain_names',
				value: '={{ $value.split(",").map(d => d.trim()).filter(Boolean) }}',
			},
		},
		description: 'Comma-separated domains the managed certificate is issued for',
	},
	{
		displayName: 'Certificate (PEM)',
		name: 'certificate',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		displayOptions: { show: { ...showCreate, type: ['uploaded'] } },
		routing: { send: { type: 'body', property: 'certificate', value: '={{ $value }}' } },
		description: 'The PEM-encoded TLS certificate (full chain)',
	},
	{
		displayName: 'Private Key (PEM)',
		name: 'privateKey',
		type: 'string',
		typeOptions: { password: true, rows: 4 },
		default: '',
		displayOptions: { show: { ...showCreate, type: ['uploaded'] } },
		routing: { send: { type: 'body', property: 'private_key', value: '={{ $value }}' } },
		description: 'The PEM-encoded private key for the certificate',
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
		description: 'A new unique name for the certificate',
	},

	limitField({ ...showFor, operation: ['getAll'] }),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showFor, operation: ['getAll'] } },
		options: [
			pageOption,
			labelSelectorOption,
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'name', value: '={{ $value }}' } },
				description: 'Filter certificates by their exact name',
			},
		],
	},
];
