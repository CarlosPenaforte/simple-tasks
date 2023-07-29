<template>
	<q-page class="row justify-center items-center bg-primary-darker">
		<q-card bordered
			class="w-300 q-ma-md bg-white q-py-lg q-px-md"
		>
			<q-card-section horizontal
				class="text-center q-mb-sm"
			>
				<span class="full-width text-h5 text-weight-medium text-dark text-uppercase">Create an account</span>
			</q-card-section>
			<q-card-section class="text-center q-mb-sm">
				<q-input
					v-model="form.email"
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
					v-model="form.password"
					:type="togglePwdVisibility ? 'text' : 'password'"
					name="password"
					label="Passsword"
					:rules="[val => !!val || 'Password is missing', val => val.length >= 6 || 'Password length must be at least 6']"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-md"
				>
					<template v-slot:append>
						<q-icon
							:name="togglePwdVisibility ? 'visibility' : 'visibility_off'"
							class="cursor-pointer"
							@click="togglePwdVisibility = !togglePwdVisibility"
						/>
					</template>
				</q-input>
				<q-input
					v-model="form.confirmPassword"
					:type="togglePwdVisibility ? 'text' : 'password'"
					name="confirmPassword"
					label="Confirm Passsword"
					:rules="[val => !!val || 'Confirm the password', val => val == form.password || 'Passwords not match']"
					lazy-rules
					color="primary-main"
					class="full-width text-dark"
				>
					<template v-slot:append>
						<q-icon
							:name="togglePwdVisibility ? 'visibility' : 'visibility_off'"
							class="cursor-pointer"
							@click="togglePwdVisibility = !togglePwdVisibility"
						/>
					</template>
				</q-input>
			</q-card-section>
			<q-card-actions class="row">
				<q-btn
					label="Login"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('login')"
				/>
				<q-space />
				<q-btn
					label="Register"
					unelevated
					color="positive"
					text-color="whity"
					class="col-5 no-padding no-margin text-weight-bold"
				/>
			</q-card-actions>
		</q-card>
	</q-page>
</template>

<script lang="ts">
import { useRouter } from 'vue-router';
import {
	defineComponent, reactive, ref, Ref,
} from 'vue';

  interface RegisterForm {
    email: string,
    password: string,
    confirmPassword: string,
  }

export default defineComponent({
	name: 'RegisterPage',
	setup() {
		const form: RegisterForm = reactive(
			{
				email: '',
				password: '',
				confirmPassword: '',
			},
		);

		const togglePwdVisibility: Ref<boolean> = ref(false);

		const isValidEmail = (val: string) => {
			const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
			return emailPattern.test(val) || 'Invalid email';
		};

		const router = useRouter();
		const pushToUrl = (path: string) => {
			router.push(path);
		};

		return {
			form,
			togglePwdVisibility,
			isValidEmail,
			pushToUrl,
		};
	},
});
</script>
