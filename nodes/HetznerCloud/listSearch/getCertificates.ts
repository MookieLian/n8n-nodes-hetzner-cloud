import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Certificate = { id: number; name: string };

export async function getCertificates(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/certificates', undefined, {
		per_page: 50,
	});
	const certificates = (response.certificates as Certificate[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = certificates
		.filter((cert) => !filter || cert.name.toLowerCase().includes(lowerFilter))
		.map((cert) => ({ name: cert.name, value: String(cert.id) }));

	return { results };
}
