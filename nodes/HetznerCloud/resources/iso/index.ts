import type { INodeProperties } from 'n8n-workflow';
import { limitField, pageOption, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['iso'] };

export const isoDescription: INodeProperties[] = [
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
				action: 'Get an ISO',
				description: 'Retrieve a single ISO by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/isos/{{ $parameter.isoId }}' },
					...unwrap('iso'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many isos',
				description: 'List the available ISOs',
				routing: { request: { method: 'GET', url: '/v1/isos' }, ...unwrap('isos') },
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'ISO ID',
		name: 'isoId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['get'] } },
		placeholder: 'e.g. 4711',
		description: 'The ID of the ISO',
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
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				routing: { send: { type: 'query', property: 'name', value: '={{ $value }}' } },
				description: 'Filter ISOs by their exact name',
			},
		],
	},
];
