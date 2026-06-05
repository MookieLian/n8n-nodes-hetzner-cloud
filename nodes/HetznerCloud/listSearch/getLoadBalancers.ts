import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type LoadBalancer = { id: number; name: string };

export async function getLoadBalancers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/load_balancers', undefined, {
		per_page: 50,
	});
	const loadBalancers = (response.load_balancers as LoadBalancer[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = loadBalancers
		.filter((lb) => !filter || lb.name.toLowerCase().includes(lowerFilter))
		.map((lb) => ({ name: lb.name, value: String(lb.id) }));

	return { results };
}
