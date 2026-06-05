import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Datacenter = { id: number; name: string };

export async function getDatacenters(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/datacenters', undefined, {
		per_page: 50,
	});
	const datacenters = (response.datacenters as Datacenter[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = datacenters
		.filter((dc) => !filter || dc.name.toLowerCase().includes(lowerFilter))
		.map((dc) => ({ name: dc.name, value: String(dc.id) }));

	return { results };
}
