<script lang="ts">
	import { browser } from '$app/environment';
	import { toast } from 'bulma-toast';
	import {
		type UiNodeInputAttributes,
		UiNodeTypeEnum,
		UiNodeInputAttributesTypeEnum,
	} from '@ory/kratos-client';
	import type { UiContainer } from '@ory/kratos-client';

	export let title: string;
	export let ui: UiContainer;

	if (browser) {
		if (ui.messages?.length) {
			for (const message of ui.messages) {
				toast({
					message: message.text,
					type: 'is-danger',
					animate: { in: 'fadeIn', out: 'fadeOut' },
					position: 'bottom-center',
				});
			}
		}
	}

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
				},
			};
		});
</script>

<div class="container box is-max-desktop mt-6 p-6">
	<h1 class="title">{title}</h1>
	<form action={ui.action} method={ui.method}>
		{#each inputNodes as node}
			<div class="field">
				{#if node.type === UiNodeTypeEnum.Input}
					{#if node.attributes.type === UiNodeInputAttributesTypeEnum.Submit}
						<div class="control">
							<button class="button is-link" {...node.attributes}>{node.meta.label?.text}</button>
						</div>
					{:else}
						{#if node.meta.label}
							<label class="label" for={node.attributes.name}>
								{node.meta.label?.text}
							</label>
						{/if}
						<div class="control">
							<input class="input" {...node.attributes} />
						</div>
					{/if}
				{/if}
			</div>
		{/each}
	</form>
</div>
