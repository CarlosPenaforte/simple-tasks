<template>
	<q-page class="row justify-center items-center bg-primary-darker">
		<q-card bordered
			class="w-300 q-ma-md bg-white q-py-lg q-px-md"
		>
			<q-card-section horizontal
				class="text-center q-mb-sm"
			>
				<span
					class="full-width text-h5 text-weight-medium text-dark text-uppercase"
				>Login to continue</span>
			</q-card-section>
			<q-card-section class="text-center q-mb-sm">
				<q-input
					v-model="email"
					type="text"
					name="email"
					label="Email"
					:rules="[val => !!val || 'Email is missing', isValidEmail]"
					lazy-rules
					autofocus
					color="primary-main"
					class="full-width text-dark q-mb-md"
				/>
				<q-input
					v-model="password"
					:type="togglePwdVisibility ? 'text' : 'password'"
					name="password"
					label="Passsword"
					color="primary-main"
					class="full-width text-dark"
				>
					<template v-slot:append>
						<q-icon
							:name="togglePwdVisibility ? 'visibility' : 'visibility_off'"
							class="cursor-pointer"
							@click="setPwdVisibility(!togglePwdVisibility)"
						/>
					</template>
				</q-input>
			</q-card-section>
			<q-card-actions class="row">
				<q-btn
					label="Register"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('register')"
				/>
				<q-space />
				<q-btn
					label="Login"
					unelevated
					color="positive"
					text-color="whity"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('/')"
				/>
			</q-card-actions>
		</q-card>
	</q-page>
</template>

<script lang="ts">
  import { useRouter } from 'vue-router';
  import {
    defineComponent, ref, Ref,
  } from 'vue';
  import { useState } from 'src/utils/composables';

  export default defineComponent({
    name: 'LoginPage',

  });
</script>

<script setup lang="ts">
  const email: Ref<string> = ref('');
  const password: Ref<string> = ref('');
  const [ togglePwdVisibility, setPwdVisibility ] = useState(false);

  const isValidEmail = (val: string) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'Invalid email';
  };

  const router = useRouter();

  const pushToUrl = (path: string) => {
    router.push(path);
  };
</script>
