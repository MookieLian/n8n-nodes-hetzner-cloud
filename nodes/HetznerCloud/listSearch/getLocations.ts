import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Location = { id: number; name: string; city?: string };

export async function getLocations(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/locations', undefined, {
		per_page: 50,
	});
	const locations = (response.locations as Location[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = locations
		.filter((location) => !filter || location.name.toLowerCase().includes(lowerFilter))
		.map((location) => ({
			name: location.city ? `${location.name} (${location.city})` : location.name,
			value: String(location.id),
		}));

	return { results };
}
