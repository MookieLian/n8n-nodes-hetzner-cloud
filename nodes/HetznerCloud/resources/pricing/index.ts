import type { INodeProperties } from 'n8n-workflow';
import { unwrap } from '../../shared/descriptions';

const showFor = { resource: ['pricing'] };

export const pricingDescription: INodeProperties[] = [
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
				action: 'Get pricing',
				description: 'Retrieve current prices for all resources',
				routing: { request: { method: 'GET', url: '/v1/pricing' }, ...unwrap('pricing') },
			},
		],
		default: 'get',
	},
];
