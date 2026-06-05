import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';
import { hetznerApiRequest } from '../shared/transport';

type Image = { id: number; name: string | null; description: string | null; type: string };

export async function getImages(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const response = await hetznerApiRequest.call(this, 'GET', '/v1/images', undefined, {
		per_page: 50,
	});
	const images = (response.images as Image[]) ?? [];

	const lowerFilter = (filter ?? '').toLowerCase();
	const results: INodeListSearchItems[] = images
		.map((image) => ({
			label: image.name ?? image.description ?? String(image.id),
			image,
		}))
		.filter(({ label }) => !filter || label.toLowerCase().includes(lowerFilter))
		.map(({ label, image }) => ({ name: `${label} (${image.type})`, value: String(image.id) }));

	return { results };
}
