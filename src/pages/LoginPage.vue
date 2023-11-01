<template>
	<q-page
		class="row justify-center items-center rolling-bg"
	>
		<q-card
			:bordered="!shouldFillScreen"
			:square="shouldFillScreen"
			:flat="shouldFillScreen"
			class="bg-gray-100 q-py-lg q-px-md"
			:class="shouldFillScreen ? 'fit q-ma-none' : 'w-400 q-ma-md'"
		>
			<q-card-section class="text-center q-pt-sm q-pb-md">
				<q-img src="full_logo.png"
					spinner-color="primary-main"
					height="80px"
					fit="scale-down"
				/>
			</q-card-section>
			<q-card-section class="text-center">
				<q-form
					ref="loginForm"
					autofocus
					@keydown.enter.stop.prevent="tryLoggingIn"
				>
					<q-input
						v-model="email"
						type="text"
						name="email"
						:label="$t('AUTH.EMAIL.NAME')"
						:rules="[val => !!val || $t('AUTH.EMAIL.VALIDATE.EMPTY'), isValidEmail]"
						lazy-rules
						autofocus
						color="primary-main"
						class="full-width text-dark q-mb-sm"
					/>
					<q-input
						v-model="password"
						:type="togglePwdVisibility ? 'text' : 'password'"
						name="password"
						:label="$t('AUTH.PASSWORD.NAME')"
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
				</q-form>
			</q-card-section>
			<q-card-actions class="row gap-3">
				<q-btn
					id="btn-register-route"
					:label="$t('AUTH.FORM.BUTTONS.REGISTER')"
					:disable="isLogging"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('register')"
				/>
				<q-space />
				<q-btn
					id="btn-login-action"
					:label="$t('AUTH.FORM.BUTTONS.LOGIN')"
					:loading="isLogging"
					unelevated
					color="positive"
					text-color="whity"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="tryLoggingIn"
				/>
			</q-card-actions>
		</q-card>
	</q-page>
</template>

<script lang="ts">
  import { useRouter } from 'vue-router';
  import {
    computed,
    defineComponent, inject, ref, Ref,
  } from 'vue';
  import { useWindowSize } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import {
    QForm, QVueGlobals,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '../stores/userStore';
  import { useState } from '../utils/composables';

  export default defineComponent({
    name: 'LoginPage',

  });
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;
  const $q = inject<QVueGlobals>('quasar');

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  const router = useRouter();

  const { width: windowWidth } = useWindowSize();

  const shouldFillScreen = computed(() => windowWidth.value < 550);

  // MODELS

  const loginForm = ref<QForm|null>(null);

  const email: Ref<string> = ref('');
  const password: Ref<string> = ref('');
  const [ togglePwdVisibility, setPwdVisibility ] = useState(false);

  const isValidEmail = (val: string) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || $t('AUTH.EMAIL.VALIDATE.INVALID');
  };

  const [ isLogging, setIsLogging ] = useState(false);

  // ACTIONS

  const pushToUrl = (path: string) => {
    router.push(path);
  };

  const tryLoggingIn = async() => {
    const isValidForm = await loginForm.value?.validate();
    if (!isValidForm) {
      $q?.notify({
        type: 'negative',
        message: $t('AUTH.FORM.INVALID_FIELDS'),
      });

      return;
    }

    try {
      setIsLogging(true);

      const [ logged, message ] = await userStore.login($t, email.value, password.value);

      setIsLogging(false);

      if (logged && user && window.sessionStorage.getItem('simple-tasks/token')) {
        $q?.notify(message);

        pushToUrl('/');
        return;
      }

      if (!logged) {
        $q?.notify({
          type: 'negative',
          message,
        });
      }
    } catch (e) {
      setIsLogging(false);

      $q?.notify({
        type: 'negative',
        message: $t('AUTH.WRONG_CREDENTIALS'),
      });
    }
  };
</script>
