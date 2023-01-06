<script lang="ts">
	import {
		type UiNodeInputAttributes,
		UiNodeTypeEnum,
		UiNodeInputAttributesTypeEnum,
	} from '@ory/kratos-client';
	import type { UiContainer } from '@ory/kratos-client';

	export let title: string;
	export let ui: UiContainer;

	// if (browser) {
	// 	if (ui.messages?.length) {
	// 		for (const message of ui.messages) {
	// 			toast({
	// 				message: message.text,
	// 				type: 'is-danger',
	// 				animate: { in: 'fadeIn', out: 'fadeOut' },
	// 				position: 'bottom-center',
	// 			});
	// 		}
	// 	}
	// }

	const inputNodes = ui.nodes
		.filter((node) => node.type === UiNodeTypeEnum.Input)
		.map((node) => {
			const attributes = node.attributes as UiNodeInputAttributes;
			return {
				...node,
				attributes: {
					...attributes,
					label: attributes.label?.text,
					onclick: undefined,
					node_type: undefined,
					type: attributes.type as 'button' | 'submit' | 'reset' | null | undefined,
				},
			};
		});
</script>

<div class="grid place-content-center h-3/4">
	<div>
		<h1 class="text-4xl text-center mb-4">{title}</h1>
		<form class="flex flex-col" action={ui.action} method={ui.method}>
			{#each inputNodes as node}
				{#if node.type === UiNodeTypeEnum.Input}
					{#if node.attributes.type === UiNodeInputAttributesTypeEnum.Submit}
						<button class="btn btn-primary mt-4" {...node.attributes}>
							{node.meta.label?.text}
						</button>
					{:else}
						{#if node.meta.label}
							<label class="label" for={node.attributes.name}>
								{node.meta.label?.text}
							</label>
						{/if}
						<input class="input input-bordered" {...node.attributes} />
					{/if}
				{/if}
			{/each}
		</form>
	</div>
</div>
