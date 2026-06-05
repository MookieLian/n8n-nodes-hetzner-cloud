import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	imageLocator,
	labelSelectorOption,
	limitField,
	pageOption,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['image'] };

export const imageDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Change Protection',
				value: 'changeProtection',
				action: 'Change image protection',
				description: 'Change the delete protection of an image',
				routing: {
					request: {
						method: 'POST',
						url: '=/v1/images/{{ $parameter.imageId }}/actions/change_protection',
					},
					...unwrap('action'),
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete an image',
				description: 'Delete an image (snapshot or backup)',
				routing: { request: { method: 'DELETE', url: '=/v1/images/{{ $parameter.imageId }}' } },
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get an image',
				description: 'Retrieve a single image by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/images/{{ $parameter.imageId }}' },
					...unwrap('image'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many images',
				description: 'List images available to the project',
				routing: { request: { method: 'GET', url: '/v1/images' }, ...unwrap('images') },
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an image',
				description: 'Update an existing image (description, type, labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/images/{{ $parameter.imageId }}' },
					...unwrap('image'),
				},
			},
		],
		default: 'getAll',
	},

	imageLocator(
		{ ...showFor, operation: ['get', 'delete', 'update', 'changeProtection'] },
		{ inPath: true },
	),

	// Update
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'description', value: '={{ $value }}' } },
		description: 'A new description for the image',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [{ name: 'Snapshot', value: 'snapshot' }],
		default: 'snapshot',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'Convert a backup image to a snapshot',
	},
	additionalBodyJsonField({ ...showFor, operation: ['update'] }),

	// Change Protection
	{
		displayName: 'Delete Protection',
		name: 'deleteProtection',
		type: 'boolean',
		default: true,
		displayOptions: { show: { ...showFor, operation: ['changeProtection'] } },
		routing: { send: { type: 'body', property: 'delete', value: '={{ $value }}' } },
		description: 'Whether the image is protected against deletion',
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
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{ name: 'App', value: 'app' },
					{ name: 'Backup', value: 'backup' },
					{ name: 'Snapshot', value: 'snapshot' },
					{ name: 'System', value: 'system' },
				],
				default: 'system',
				routing: { send: { type: 'query', property: 'type', value: '={{ $value }}' } },
				description: 'Filter images by type',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'name', value: '={{ $value }}' } },
				description: 'Filter images by their exact name',
			},
		],
	},
];
