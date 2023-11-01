<template>
	<q-page class="row justify-center items-center rolling-bg">
		<q-card
			:bordered="!shouldFillScreen"
			:square="shouldFillScreen"
			:flat="shouldFillScreen"
			class="bg-white q-py-lg q-px-md"
			:class="shouldFillScreen ? 'fit q-ma-none' : 'w-400 q-ma-md'"
		>
			<q-card-section class="text-center q-mb-sm">
				<q-input
					ref="email"
					for="npt-register-email"
					v-model="form.email"
					type="text"
					name="email"
					max-length="255"
					:label="$t('AUTH.EMAIL.NAME')"
					:rules="[val => !!val || $t('AUTH.EMAIL.VALIDATE.EMPTY'), isValidEmail]"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-xs"
				/>
				<q-input
					ref="fullName"
					for="npt-register-full-name"
					v-model="form.full_name"
					type="text"
					name="full_name"
					max-length="255"
					:label="$t('REGISTER.FULL_NAME.NAME')"
					:rules="[val => !!val || $t('REGISTER.FULL_NAME.VALIDATE.EMPTY')]"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-xs"
				/>
				<q-select
					ref="sex"
					for="npt-register-gender"
					v-model="form.sex"
					:options="genderOptions"
					:label="$t('REGISTER.GENDER.NAME')"
					behavior="menu"
					:rules="[val => !!val || $t('REGISTER.GENDER.VALIDATE.EMPTY')]"
					color="primary-main"
					transition-show="jump-down"
					transition-hide="jump-up"
					class="full-width text-dark q-mb-xs"
				>
					<template v-slot:selected>
						<div
							class="text-dark fw-medium text-capitalize"
						>
							{{ genderToFullString($t,form.sex) }}
						</div>
					</template>
					<template v-slot:option="scope">
						<q-item v-bind="scope.itemProps">
							<q-item-section
								:id="`el-gender-option-${scope.opt.toLowerCase().replace(/ /g, '-')}`"
							>
								<span>{{ genderToFullString($t,scope.opt) }}</span>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
				<date-input
					input-id="npt-register-birthday"
					v-model="form.birthday"
					max-date="2020-12-31"
					:title="$t('REGISTER.BIRTHDAY.NAME')"
					:subtitle="$t('REGISTER.BIRTHDAY.SUBTITLE')"
					:short-message="$t('REGISTER.BIRTHDAY.VALIDATE.SHORT')"
					:invalid-message="$t('REGISTER.BIRTHDAY.VALIDATE.INVALID')"
				/>
				<q-input
					ref="password"
					for="npt-register-password"
					v-model="form.user_password"
					:type="togglePwdVisibility ? 'text' : 'password'"
					name="password"
					:label="$t('AUTH.PASSWORD.NAME')"
					:rules="[
						val => !!val || $t('AUTH.PASSWORD.VALIDATE.EMPTY'),
						val => val.length >= 6 || $t('AUTH.PASSWORD.VALIDATE.LENGTH'),
					]"
					max-length="50"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-xs"
				>
					<template v-slot:append>
						<q-icon
							:name="togglePwdVisibility ? 'visibility' : 'visibility_off'"
							class="cursor-pointer"
							@click="setPwdVisibility(!togglePwdVisibility)"
						/>
					</template>
				</q-input>
				<q-input
					ref="confirmPassword"
					for="npt-register-confirm-password"
					v-model="form.confirm_password"
					:type="togglePwdVisibility ? 'text' : 'password'"
					name="confirmPassword"
					:label="$t('REGISTER.CONFIRM_PASSWORD.NAME')"
					:rules="[val => !!val || $t('REGISTER.CONFIRM_PASSWORD.VALIDATE.EMPTY'),
						val => val == form.user_password || $t('REGISTER.CONFIRM_PASSWORD.VALIDATE.MATCH')
					]"
					max-length="50"
					lazy-rules
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
					id="btn-login-route"
					:label="$t('AUTH.FORM.BUTTONS.LOGIN')"
					:disable="isRegistering"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('login')"
				/>
				<q-space />
				<q-btn
					id="btn-register-action"
					:label="$t('AUTH.FORM.BUTTONS.REGISTER')"
					:loading="isRegistering"
					unelevated
					color="positive"
					text-color="whity"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="tryRegistering"
				/>
			</q-card-actions>
		</q-card>
	</q-page>
</template>

<script lang="ts">
  import { useRouter } from 'vue-router';
  import {
    UnwrapNestedRefs,
    defineComponent, reactive, ref, inject, computed,
  } from 'vue';
  import {
    QInput, QSelect, QVueGlobals,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { useWindowSize } from '@vueuse/core';
  import { DateTime } from 'luxon';
  import { useUserStore } from '../stores/userStore';
  import { CreateUserToSend } from '../models/apiModels';
  import { Gender } from '../models/mainModels';
  import {
    genderToFullString,
  } from '../utils/commonFunctions';
  import { useState } from '../utils/composables';
  import DateInput from '../components/form/DateInput.vue';

  export default defineComponent({
    name: 'RegisterPage',
    components: {
      DateInput,
    },
  });
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;
  const $q = inject<QVueGlobals>('quasar');
  const userStore = useUserStore();

  const router = useRouter();
  const pushToUrl = (path: string) => {
    router.push(path);
  };

  // FORM

  const threeYearsAgo = DateTime.now().minus({ years: 3 }).toISODate();

  const form: UnwrapNestedRefs<CreateUserToSend> = reactive(
    {
      user_password: '',
      full_name: '',
      email: '',
      sex: Gender.NOT_INFORMED,
      birthday: threeYearsAgo || '',
      confirm_password: '',
    },
  );

  // UTILS

  const { width: windowWidth } = useWindowSize();
  const shouldFillScreen = computed(() => windowWidth.value < 550);

  const [ isRegistering, setIsRegistering ] = useState(false);

  // INPUT INFO AND STATES

  const genderOptions: Gender[] = [
    Gender.MALE, Gender.FEMALE, Gender.NON_BINARY, Gender.NOT_INFORMED,
  ];

  const [ togglePwdVisibility, setPwdVisibility ] = useState(false);

  const isValidEmail = (val: string) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || $t('AUTH.EMAIL.VALIDATE.INVALID');
  };

  const fullName = ref<QInput|null>(null);
  const email = ref<QInput|null>(null);
  const sex = ref<QSelect|null>(null);
  const birthday = ref<QInput|null>(null);
  const password = ref<QInput|null>(null);
  const confirmPassword = ref<QInput|null>(null);

  // ERROR CHECK

  const hasErrors = () => {
    const errorsCheckList = [
      fullName.value,
      email.value,
      sex.value,
      birthday.value,
      password.value,
      confirmPassword.value,
    ];

    errorsCheckList.forEach((field) => field?.validate());

    return errorsCheckList.some((field) => field?.hasError);
  };

  // ACTIONS

  const tryRegistering = async() => {
    if (hasErrors()) {
      $q?.notify({
        type: 'negative',
        message: $t('AUTH.FORM.INVALID_FIELDS'),
      });

      return;
    }

    try {
      setIsRegistering(true);

      const [ registered, message ] = await userStore.createUser(form);

      setIsRegistering(false);

      if (registered) {
        $q?.notify({
          type: 'positive',
          message: $t('REGISTER.SUCCESS'),
        });

        pushToUrl('/login');

        return;
      }

      $q?.notify({
        type: 'negative',
        message,
      });
    } catch (e) {
      setIsRegistering(false);

      $q?.notify({
        type: 'negative',
        message: (e as Error)?.message || '',
      });
    }
  };
</script>
