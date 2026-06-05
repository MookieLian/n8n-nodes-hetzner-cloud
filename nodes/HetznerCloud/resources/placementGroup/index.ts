import type { INodeProperties } from 'n8n-workflow';
import {
	additionalBodyJsonField,
	labelSelectorOption,
	limitField,
	pageOption,
	placementGroupLocator,
	unwrap,
} from '../../shared/descriptions';

const showFor = { resource: ['placementGroup'] };
const showCreate = { ...showFor, operation: ['create'] };

export const placementGroupDescription: INodeProperties[] = [
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
				action: 'Create a placement group',
				description: 'Create a new placement group',
				routing: {
					request: { method: 'POST', url: '/v1/placement_groups' },
					...unwrap('placement_group'),
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a placement group',
				description: 'Delete a placement group',
				routing: {
					request: { method: 'DELETE', url: '=/v1/placement_groups/{{ $parameter.placementGroupId }}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a placement group',
				description: 'Retrieve a single placement group by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/placement_groups/{{ $parameter.placementGroupId }}' },
					...unwrap('placement_group'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many placement groups',
				description: 'List placement groups in the project',
				routing: {
					request: { method: 'GET', url: '/v1/placement_groups' },
					...unwrap('placement_groups'),
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a placement group',
				description: 'Update an existing placement group (name and labels)',
				routing: {
					request: { method: 'PUT', url: '=/v1/placement_groups/{{ $parameter.placementGroupId }}' },
					...unwrap('placement_group'),
				},
			},
		],
		default: 'getAll',
	},

	placementGroupLocator({ ...showFor, operation: ['get', 'delete', 'update'] }, { inPath: true }),

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: showCreate },
		placeholder: 'e.g. my-spread-group',
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A unique name for the placement group',
	},
	{
		displayName: 'Type',
		name: 'type',
		type: 'options',
		options: [{ name: 'Spread', value: 'spread' }],
		default: 'spread',
		displayOptions: { show: showCreate },
		routing: { send: { type: 'body', property: 'type', value: '={{ $value }}' } },
		description: 'The scheduling type of the placement group',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showFor, operation: ['update'] } },
		routing: { send: { type: 'body', property: 'name', value: '={{ $value }}' } },
		description: 'A new unique name for the placement group',
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
				description: 'Filter placement groups by their exact name',
			},
		],
	},
];
