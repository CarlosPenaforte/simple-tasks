<template>
	<div class="fullscreen bg-primary-main text-white text-center q-pa-md flex flex-center">
		<div>
			<div style="font-size: 30vh">
				404
			</div>

			<div class="text-h2"
				style="opacity:.4"
			>
				{{ $t('NOT_FOUND_PAGE.SUBTITLE') }}
			</div>

			<q-btn
				class="q-mt-xl"
				color="white"
				text-color="primary-main"
				unelevated
				to="/"
				:label="$t('NOT_FOUND_PAGE.GO_HOME')"
				no-caps
			/>
		</div>
	</div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'ErrorNotFound',
  });
</script>
