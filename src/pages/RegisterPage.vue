<template>
	<q-page class="row justify-center items-center rolling-bg">
		<q-card
			:bordered="!shouldFillScreen"
			:square="shouldFillScreen"
			:flat="shouldFillScreen"
			class="bg-white q-py-lg q-px-md"
			:class="shouldFillScreen ? 'fit q-ma-none' : 'w-300 q-ma-md'"
		>
			<q-card-section class="text-center q-mb-sm">
				<q-input
					ref="email"
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
							<q-item-section>
								<span>{{ genderToFullString($t,scope.opt) }}</span>
							</q-item-section>
						</q-item>
					</template>
				</q-select>
				<q-input
					ref="birthday"
					:modelValue="formattedBirthday"
					@update:modelValue="setBirthday"
					name="birthday"
					:label="$t('REGISTER.BIRTHDAY.NAME')"
					:mask="localeMask"
					:rules="[val => !!val || $t('REGISTER.BIRTHDAY.VALIDATE.EMPTY'),
						val => val.length == 10 || $t('REGISTER.BIRTHDAY.VALIDATE.INVALID')
					]"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-xs"
				>
					<template v-slot:append>
						<q-icon name="event"
							class="cursor-pointer"
						>
							<q-popup-proxy cover
								transition-show="scale"
								transition-hide="scale"
							>
								<q-date
									:mask="qDateMask"
									color="primary-main"
									:title="$t('REGISTER.BIRTHDAY.NAME')"
									:subtitle="$t('REGISTER.BIRTHDAY.SUBTITLE')"
									class="text-dark"
									:modelValue="form.birthday"
									@update:modelValue="setBirthday"
								>
									<div class="row items-center justify-end">
										<q-btn v-close-popup
											label="Close"
											color="primary"
											flat
										/>
									</div>
								</q-date>
							</q-popup-proxy>
						</q-icon>
					</template>
				</q-input>
				<q-input
					ref="password"
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
					:label="$t('FORM.BUTTONS.LOGIN')"
					outline
					color="negative"
					class="col-5 no-padding no-margin text-weight-bold"
					@click.stop.prevent="pushToUrl('login')"
				/>
				<q-space />
				<q-btn
					:label="$t('FORM.BUTTONS.REGISTER')"
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
    defineComponent, reactive, watch, ref, inject, computed,
  } from 'vue';
  import { useUserStore } from 'src/stores/userStore';
  import { CreateUserToSend } from 'src/models/apiModels';
  import { Gender } from 'src/models/mainModels';
  import {
    formatDateToLocale,
    getLocaleMask,
    getLocaleFormat,
    genderToFullString,
    dateStrToDate,
  } from 'src/utils/commonFunctions';
  import {
    QInput, QSelect, QVueGlobals,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { useState } from '../utils/composables';

  export default defineComponent({
    name: 'RegisterPage',
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

  const form: UnwrapNestedRefs<CreateUserToSend> = reactive(
    {
      user_password: '',
      full_name: '',
      email: '',
      sex: Gender.NOT_INFORMED,
      birthday: '2020-12-31',
      confirm_password: '',
    },
  );

  // UTILS

  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateMask = localeFormat.toUpperCase();

  const localeMask = getLocaleMask(locale);

  const windowWidth = computed(() => (window.innerWidth));
  const shouldFillScreen = windowWidth.value < 600;

  // BIRTHDAY SETTER AND GETTER

  const setBirthday = (birthday: string|number|null) => {
    if (typeof birthday !== 'string') return;

    if (birthday.length > 10) {
      form.birthday = birthday.slice(0, 10);
      return;
    }

    form.birthday = birthday;
  };

  const formattedBirthday = ref(formatDateToLocale(dateStrToDate(form.birthday, localeFormat), locale));

  watch(() => form.birthday, (newValue) => {
    if (newValue.length < 10) {
      formattedBirthday.value = newValue;

      return;
    }

    formattedBirthday.value = formatDateToLocale(dateStrToDate(newValue, localeFormat), locale);
  });

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
      fullName.value?.hasError,
      email.value?.hasError,
      sex.value?.hasError,
      birthday.value?.hasError,
      password.value?.hasError,
      confirmPassword.value?.hasError,
    ];

    return errorsCheckList.some((hasError) => hasError);
  };

  // ACTIONS

  const tryRegistering = async() => {
    if (hasErrors()) {
      $q?.notify({
        type: 'negative',
        message: $t('FORM.INVALID_FIELDS'),
      });

      return;
    }

    const [ registered, message ] = await userStore.createUser(form);

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
  };
</script>
