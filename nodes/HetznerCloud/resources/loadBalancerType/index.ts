import type { INodeProperties } from 'n8n-workflow';
import { limitField, pageOption, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['loadBalancerType'] };

export const loadBalancerTypeDescription: INodeProperties[] = [
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
				action: 'Get a load balancer type',
				description: 'Retrieve a single load balancer type by ID',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/load_balancer_types/{{ $parameter.loadBalancerTypeId }}',
					},
					...unwrap('load_balancer_type'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many load balancer types',
				description: 'List the available load balancer types',
				routing: {
					request: { method: 'GET', url: '/v1/load_balancer_types' },
					...unwrap('load_balancer_types'),
				},
			},
		],
		default: 'getAll',
	},

	{
		displayName: 'Load Balancer Type ID',
		name: 'loadBalancerTypeId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: { show: { ...showFor, operation: ['get'] } },
		placeholder: 'e.g. 1',
		description: 'The ID of the load balancer type',
	},

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
