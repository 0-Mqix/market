import { connections } from '../events/+server';
import type { RequestHandler } from './$types';

let last_id = 0;

function truncate(str: string, n: number) {
	return str.length > n ? str.slice(0, n - 1) + '&hellip;' : str;
}

export const POST = (async ({ request, cookies }) => {
	const data = await request.json();

	if (!data.content || !data.name) {
		return new Response('', { status: 400 });
	}

	const user_id = cookies.get('user_id');
	const message = `data: ${last_id},${truncate(data.name as string, 10)}#${user_id},${
		data.content
	}\n\n`;

	last_id++;

	connections.forEach((steam) => {
		steam.enqueue(message);
	});

	return new Response('', { status: 200 });
}) satisfies RequestHandler;
