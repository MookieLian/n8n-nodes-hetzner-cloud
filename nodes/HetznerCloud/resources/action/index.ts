import type { INodeProperties } from 'n8n-workflow';
import { limitField, pageOption, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['action'] };

export const actionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showFor },
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an action',
				description: 'Retrieve a single action by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/actions/{{ $parameter.actionId }}' },
					...unwrap('action'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many actions',
				description: 'List actions across many resources',
				routing: { request: { method: 'GET', url: '/v1/actions' }, ...unwrap('actions') },
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Action ID',
		name: 'actionId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['get'] } },
		placeholder: 'e.g. 1337',
		description: 'The ID of the action',
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
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Error', value: 'error' },
					{ name: 'Running', value: 'running' },
					{ name: 'Success', value: 'success' },
				],
				default: 'running',
				routing: { send: { type: 'query', property: 'status', value: '={{ $value }}' } },
				description: 'Filter actions by their status',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: [
					{ name: 'ID (Ascending)', value: 'id:asc' },
					{ name: 'ID (Descending)', value: 'id:desc' },
					{ name: 'Command (Ascending)', value: 'command:asc' },
					{ name: 'Status (Ascending)', value: 'status:asc' },
				],
				default: 'id:asc',
				routing: { send: { type: 'query', property: 'sort', value: '={{ $value }}' } },
				description: 'How to sort the returned actions',
			},
		],
	},
];
