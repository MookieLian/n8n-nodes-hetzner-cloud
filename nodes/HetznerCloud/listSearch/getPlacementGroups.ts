import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type PlacementGroup = { id: number; name: string };

export async function getPlacementGroups(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/placement_groups', undefined, {
		per_page: 50,
	});
	const placementGroups = (response.placement_groups as PlacementGroup[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = placementGroups
		.filter((group) => !filter || group.name.toLowerCase().includes(lowerFilter))
		.map((group) => ({ name: group.name, value: String(group.id) }));

	return { results };
}
