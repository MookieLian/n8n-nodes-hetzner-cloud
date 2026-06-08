import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type FloatingIp = { id: number; name: string | null; ip: string | null };

export async function getFloatingIps(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/floating_ips', undefined, {
		per_page: 50,
	});
	const floatingIps = (response.floating_ips as FloatingIp[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = floatingIps
		.map((floatingIp) => ({
			label: floatingIp.name ?? floatingIp.ip ?? String(floatingIp.id),
			floatingIp,
		}))
		.filter(({ label }) => !filter || label.toLowerCase().includes(lowerFilter))
		.map(({ label, floatingIp }) => ({ name: label, value: String(floatingIp.id) }));

	return { results };
}
