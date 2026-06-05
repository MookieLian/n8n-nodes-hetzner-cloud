import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Server = { id: number; name: string };

export async function getServers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/servers', undefined, {
		per_page: 50,
	});
	const servers = (response.servers as Server[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = servers
		.filter((server) => !filter || server.name.toLowerCase().includes(lowerFilter))
		.map((server) => ({ name: server.name, value: String(server.id) }));

	return { results };
}
