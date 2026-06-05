import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Firewall = { id: number; name: string };

export async function getFirewalls(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/firewalls', undefined, {
		per_page: 50,
	});
	const firewalls = (response.firewalls as Firewall[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = firewalls
		.filter((firewall) => !filter || firewall.name.toLowerCase().includes(lowerFilter))
		.map((firewall) => ({ name: firewall.name, value: String(firewall.id) }));

	return { results };
}
