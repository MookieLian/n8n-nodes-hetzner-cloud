import type { INodeProperties } from 'n8n-workflow';
import { limitField, pageOption, serverTypeLocator, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['serverType'] };

export const serverTypeDescription: INodeProperties[] = [
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
				action: 'Get a server type',
				description: 'Retrieve a single server type by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/server_types/{{ $parameter.serverTypeId }}' },
					...unwrap('server_type'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many server types',
				description: 'List the available server types',
				routing: { request: { method: 'GET', url: '/v1/server_types' }, ...unwrap('server_types') },
			},
		],
		default: 'getAll',
	},

	serverTypeLocator({ ...showFor, operation: ['get'] }, { inPath: true }),

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
