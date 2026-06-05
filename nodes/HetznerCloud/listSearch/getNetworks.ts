import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Network = { id: number; name: string };

export async function getNetworks(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/networks', undefined, {
		per_page: 50,
	});
	const networks = (response.networks as Network[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = networks
		.filter((network) => !filter || network.name.toLowerCase().includes(lowerFilter))
		.map((network) => ({ name: network.name, value: String(network.id) }));

	return { results };
}
