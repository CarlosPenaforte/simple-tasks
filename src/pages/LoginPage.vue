<template>
	<q-page
		class="row justify-center items-center rolling-bg"
	>
		<q-card
			:bordered="!shouldFillScreen"
			:square="shouldFillScreen"
			:flat="shouldFillScreen"
			class="bg-gray-100 q-py-lg q-px-md"
			:class="shouldFillScreen ? 'fit q-ma-none' : 'w-300 q-ma-md'"
		>
			<q-card-section class="text-center q-mb-sm">
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
						class="full-width text-dark q-mb-md"
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
			<q-card-actions class="row">
				<q-btn
					:label="$t('FORM.BUTTONS.REGISTER')"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('register')"
				/>
				<q-space />
				<q-btn
					:label="$t('FORM.BUTTONS.LOGIN')"
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
  import { useState } from 'src/utils/composables';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from 'src/stores/userStore';
  import {
    QForm, QVueGlobals,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';

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

  const windowWidth = computed(() => (window.innerWidth));
  const shouldFillScreen = windowWidth.value < 600;

  // MODELS

  const loginForm = ref<QForm|null>(null);

  const email: Ref<string> = ref('');
  const password: Ref<string> = ref('');
  const [ togglePwdVisibility, setPwdVisibility ] = useState(false);

  const isValidEmail = (val: string) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || $t('AUTH.EMAIL.VALIDATE.INVALID');
  };

  // ACTIONS

  const pushToUrl = (path: string) => {
    router.push(path);
  };

  const tryLoggingIn = async() => {
    const isValidForm = await loginForm.value?.validate();
    if (!isValidForm) {
      $q?.notify({
        type: 'negative',
        message: $t('FORM.INVALID_FIELDS'),
      });

      return;
    }

    try {
      const [ logged, message ] = await userStore.login(email.value, password.value);

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
      $q?.notify({
        type: 'negative',
        message: $t('AUTH.WRONG_CREDENTIALS'),
      });
    }
  };
</script>
