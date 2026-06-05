import type { INodeProperties } from 'n8n-workflow';
import { datacenterLocator, limitField, pageOption, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['datacenter'] };

export const datacenterDescription: INodeProperties[] = [
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
				action: 'Get a datacenter',
				description: 'Retrieve a single datacenter by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/datacenters/{{ $parameter.datacenterId }}' },
					...unwrap('datacenter'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many datacenters',
				description: 'List the available datacenters',
				routing: { request: { method: 'GET', url: '/v1/datacenters' }, ...unwrap('datacenters') },
			},
		],
		default: 'getAll',
	},

	datacenterLocator({ ...showFor, operation: ['get'] }, { inPath: true }),

	limitField({ ...showFor, operation: ['getAll'] }),
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { ...showFor, operation: ['getAll'] } },
		options: [pageOption],
	},
];
