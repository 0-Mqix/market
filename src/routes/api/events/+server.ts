import type { RequestHandler } from './$types';

export const connections: Map<number, ReadableStreamDefaultController<string>> = new Map();
let last_id = 0;

export const GET = (({ cookies }) => {
	const user_id = cookies.get('user_id');

	let id: number;

	if (!user_id) {
		cookies.set('user_id', last_id.toString());
		id = last_id;
		last_id++;
	} else {
		id = parseInt(user_id);
	}

	const readable = new ReadableStream<string>({
		start(stream) {
			connections.set(id, stream);
		},
		cancel() {
			connections.delete(id);
			cookies.delete('user_id');
		}
	});

	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream'
		}
	});
}) satisfies RequestHandler;
