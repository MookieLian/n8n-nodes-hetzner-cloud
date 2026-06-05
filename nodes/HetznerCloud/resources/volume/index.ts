import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	labelSelectorOption,
	limitField,
	locationLocator,
	pageOption,
	serverLocator,
	unwrap,
	volumeLocator,
} from '../../shared/descriptions';

const showFor = { resource: ['volume'] };
const showCreate = { ...showFor, operation: ['create'] };

export const volumeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Attach',
				value: 'attach',
				action: 'Attach a volume to a server',
				description: 'Attach a volume to a server',
				routing: {
					request: { method: 'POST', url: '=/v1/volumes/{{ $parameter.volumeId }}/actions/attach' },
					...unwrap('action'),
				},
			},
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change volume protection',
				description: 'Change the delete protection of a volume',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/volumes/{{ $parameter.volumeId }}/actions/change_protection',
					},
					...unwrap('action'),
				},
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a volume',
				description: 'Create a new volume',
				routing: { request: { method: 'POST', url: '/v1/volumes' } },
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a volume',
				description: 'Delete a volume',
				routing: { request: { method: 'DELETE', url: '=/v1/volumes/{{ $parameter.volumeId }}' } },
			},
			{
				name: 'Detach',
				value: 'detach',
				action: 'Detach a volume from its server',
				description: 'Detach a volume from the server it is attached to',
				routing: {
					request: { method: 'POST', url: '=/v1/volumes/{{ $parameter.volumeId }}/actions/detach' },
					...unwrap('action'),
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a volume',
				description: 'Retrieve a single volume by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/volumes/{{ $parameter.volumeId }}' },
					...unwrap('volume'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many volumes',
				description: 'List volumes in the project',
				routing: { request: { method: 'GET', url: '/v1/volumes' }, ...unwrap('volumes') },
			},
			{
				name: 'Resize',
				value: 'resize',
				action: 'Resize a volume',
				description: 'Increase the size of a volume',
				routing: {
					request: { method: 'POST', url: '=/v1/volumes/{{ $parameter.volumeId }}/actions/resize' },
					...unwrap('action'),
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a volume',
				description: 'Update an existing volume (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/volumes/{{ $parameter.volumeId }}' },
					...unwrap('volume'),
				},
			},
		],
		default: 'getAll',
	},

	volumeLocator(
		{ ...showFor, operation: ['get', 'delete', 'update', 'attach', 'detach', 'resize', 'changeProtection'] },
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
		placeholder: 'e.g. database-data',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the volume',
	},
	{
		displayName: 'Size (GB)',
		name: 'size',
		type: 'number',
		default: 10,
		required: true,
		typeOptions: { minValue: 10 },
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'size', value: '={{ $value }}' } },
		description: 'The size of the volume in GB (minimum 10)',
	},
	serverLocator({ ...showCreate }, { property: 'server', required: false }),
	locationLocator({ ...showCreate }, { property: 'location', required: false }),
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: showCreate },
		options: [
			{
				displayName: 'Automount',
				name: 'automount',
				type: 'boolean',
				default: false,
				routing: { send: { type: 'body', property: 'automount', value: '={{ $value }}' } },
				description: 'Whether to auto-mount the volume after attaching it (requires a server)',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'Ext4', value: 'ext4' },
					{ name: 'Xfs', value: 'xfs' },
				],
				default: 'ext4',
				routing: { send: { type: 'body', property: 'format', value: '={{ $value }}' } },
				description: 'File system to format the volume with on creation',
			},
		],
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
		description: 'A new unique name for the volume',
	},

	// Attach
	serverLocator({ ...showFor, operation: ['attach'] }, { property: 'server' }),
	{
		displayName: 'Automount',
		name: 'automount',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showFor, operation: ['attach'] } },
		routing: { send: { type: 'body', property: 'automount', value: '={{ $value }}' } },
		description: 'Whether to auto-mount the volume after attaching it',
	},

	// Resize
	{
		displayName: 'Size (GB)',
		name: 'size',
		type: 'number',
		default: 10,
		required: true,
		typeOptions: { minValue: 10 },
		displayOptions: { show: { ...showFor, operation: ['resize'] } },
		routing: { send: { type: 'body', property: 'size', value: '={{ $value }}' } },
		description: 'The new (larger) size of the volume in GB',
	},

	// Change Protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the volume is protected against deletion',
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
				description: 'Filter volumes by their exact name',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Available', value: 'available' },
					{ name: 'Creating', value: 'creating' },
				],
				default: 'available',
				routing: { send: { type: 'query', property: 'status', value: '={{ $value }}' } },
				description: 'Filter volumes by status',
			},
		],
	},
];
