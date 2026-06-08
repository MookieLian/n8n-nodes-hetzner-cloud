import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type PrimaryIp = { id: number; name: string | null; ip: string | null };

export async function getPrimaryIps(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/primary_ips', undefined, {
		per_page: 50,
	});
	const primaryIps = (response.primary_ips as PrimaryIp[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = primaryIps
		.map((primaryIp) => ({
			label: primaryIp.name ?? primaryIp.ip ?? String(primaryIp.id),
			primaryIp,
		}))
		.filter(({ label }) => !filter || label.toLowerCase().includes(lowerFilter))
		.map(({ label, primaryIp }) => ({ name: label, value: String(primaryIp.id) }));

	return { results };
}
