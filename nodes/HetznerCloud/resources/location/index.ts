import type { INodeProperties } from 'n8n-workflow';
import { limitField, locationLocator, pageOption, unwrap } from '../../shared/descriptions';

const showFor = { resource: ['location'] };

export const locationDescription: INodeProperties[] = [
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
				action: 'Get a location',
				description: 'Retrieve a single location by ID',
				routing: {
					request: { method: 'GET', url: '=/v1/locations/{{ $parameter.locationId }}' },
					...unwrap('location'),
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many locations',
				description: 'List the available locations',
				routing: { request: { method: 'GET', url: '/v1/locations' }, ...unwrap('locations') },
			},
		],
		default: 'getAll',
	},

	locationLocator({ ...showFor, operation: ['get'] }, { inPath: true }),

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
