import type { INodeProperties } from 'n8n-workflow';
import { additionalBodyJsonField, labelSelectorOption, limitField, pageOption, sshKeyLocator, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['sshKey'] };
const showCreate = { ...showFor, operation: ['create'] };

export const sshKeyDescription: INodeProperties[] = [
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
				action: 'Create an SSH key',
				description: 'Add a new SSH key to the project',
				routing: { request: { method: 'POST', url: '/v1/ssh_keys' }, ...unwrap('ssh_key') },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an SSH key',
				description: 'Delete an SSH key',
				routing: { request: { method: 'DELETE', url: '=/v1/ssh_keys/{{ $parameter.sshKeyId }}' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an SSH key',
				description: 'Retrieve a single SSH key by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/ssh_keys/{{ $parameter.sshKeyId }}' },
					...unwrap('ssh_key'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many SSH keys',
				description: 'List SSH keys in the project',
				routing: { request: { method: 'GET', url: '/v1/ssh_keys' }, ...unwrap('ssh_keys') },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an SSH key',
				description: 'Update an existing SSH key (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/ssh_keys/{{ $parameter.sshKeyId }}' },
					...unwrap('ssh_key'),
				},
			},
		],
		default: 'getAll',
	},

	sshKeyLocator({ ...showFor, operation: ['get', 'delete', 'update'] }, { inPath: true }),

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'e.g. my-laptop',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the SSH key',
	},
	{
		displayName: 'Public Key',
		name: 'publicKey',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'ssh-ed25519 AAAA...',
		routing: { send: { type: 'body', property: 'public_key', value: '={{ $value }}' } },
		description: 'The public key in OpenSSH format',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new unique name for the SSH key',
	},
	additionalBodyJsonField({ ...showFor, operation: ['create', 'update'] }),

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
				description: 'Filter SSH keys by their exact name',
			},
		],
	},
];
