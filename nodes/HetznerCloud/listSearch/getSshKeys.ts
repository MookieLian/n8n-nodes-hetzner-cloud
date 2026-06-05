import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type SshKey = { id: number; name: string };

export async function getSshKeys(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/ssh_keys', undefined, {
		per_page: 50,
	});
	const sshKeys = (response.ssh_keys as SshKey[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = sshKeys
		.filter((key) => !filter || key.name.toLowerCase().includes(lowerFilter))
		.map((key) => ({ name: key.name, value: String(key.id) }));

	return { results };
}
