<script lang="ts">
	import { error } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let texts: { id: number; user: string; content: string }[] = [];
	let new_message: string;
	let name: string;
	let sending = false;

	const send = async () => {
		sending = true;

		if (new_message == '') {
			return;
		}

		const res = await fetch('/api/text', {
			method: 'POST',
			body: JSON.stringify({ name, content: new_message })
		}).catch((err) => console.log(err));

		if (res?.status == 200) {
			new_message = '';
		}

		sending = false;
	};

	onMount(() => {
		console.log('load');

		let events = new EventSource('/api/events');

		events.addEventListener('message', (event) => {
			const str = event.data as string;
			const data = str.split(',');

			console.log(str);

			texts = [...texts, { id: parseInt(data[0]), user: data[1], content: data[2] }];
		});
	});
</script>

<div class="w-[100vw] h-[100vh] flex justify-center">
	<div class="flex flex-col h-[100%] justify-between w-[500px]">
		<div class="overflow-hidden flex flex-col-reverse">
			{#each texts.slice().reverse() as text (text.id)}
				<div class="text flex">
					<div class="font-bold text-xl text-pink-400 mx-3">{text.user}</div>
					<div class="break-all">{text.content}</div>
				</div>
			{/each}
		</div>
		<div
			class=" bg-gradient-to-r from-indigo-500 to-blue-800 rounded-lg m-3 text-center p-1 flex-row justify-between"
		>
			<div
				class="rounded-lg text-center flex justify-between bg-white flex-nowrap"
				on:keydown={(e) => {
					if (e.key == 'Enter' && !sending) {
						send();
					}
				}}
			>
				<input class="p-1 flex m-1 w-[60px]" bind:value={name} placeholder="Name" maxlength="10" />
				<input class="p-1 flex m-1 w-[100%]" bind:value={new_message} placeholder="message" />
				<button
					on:click={() => {
						send();
					}}
					class="text px-6 text-center font-bold">push</button
				>
			</div>
		</div>
	</div>
</div>

<style>
	.text {
		@apply bg-gradient-to-r from-indigo-500 to-blue-800;
		@apply rounded-lg m-3 py-4;
		@apply font-mono text-white;
	}
</style>
