import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type ServerType = { id: number; name: string; cores?: number; memory?: number };

export async function getServerTypes(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/server_types', undefined, {
		per_page: 50,
	});
	const serverTypes = (response.server_types as ServerType[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = serverTypes
		.filter((type) => !filter || type.name.toLowerCase().includes(lowerFilter))
		.map((type) => {
			const specs =
				type.cores && type.memory ? ` (${type.cores} vCPU, ${type.memory} GB)` : '';
			return { name: `${type.name}${specs}`, value: String(type.id) };
		});

	return { results };
}
