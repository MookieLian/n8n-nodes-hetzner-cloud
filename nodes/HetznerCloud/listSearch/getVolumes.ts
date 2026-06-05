import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Volume = { id: number; name: string };

export async function getVolumes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/volumes', undefined, {
		per_page: 50,
	});
	const volumes = (response.volumes as Volume[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = volumes
		.filter((volume) => !filter || volume.name.toLowerCase().includes(lowerFilter))
		.map((volume) => ({ name: volume.name, value: String(volume.id) }));

	return { results };
}
