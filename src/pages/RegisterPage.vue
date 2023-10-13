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
					ref="username"
					v-model="form.username"
					type="text"
					name="username"
					label="Username"
					:rules="[val => !!val || 'Username is missing']"
					lazy-rules
					autofocus
					color="primary-main"
					class="full-width text-dark q-mb-md"
				/>
				<q-input
					ref="fullName"
					v-model="form.full_name"
					type="text"
					name="full_name"
					label="Full name"
					:rules="[val => !!val || 'Full name is missing']"
					lazy-rules
					autofocus
					color="primary-main"
					class="full-width text-dark q-mb-md"
				/>
				<q-input
					ref="email"
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
				<q-select
					ref="sex"
					v-model="form.sex"
					:options="genderOptions"
					behavior="menu"
					color="primary-main"
					transition-show="jump-down"
					transition-hide="jump-up"
				>
					<template v-slot:selected>
						<div
							class="text-dark fw-medium text-capitalize"
						>
							{{ form.sex }}
						</div>
					</template>
				</q-select>
				<q-input
					ref="birthday"
					:modelValue="formattedBirthday"
					@update:modelValue="setBirthday"
					name="birthday"
					label="Birthday"
					:rules="[val => !!val || 'Birthday is missing']"
					lazy-rules
					autofocus
					color="primary-main"
					class="full-width text-dark q-mb-md"
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
					label="Passsword"
					:rules="[
						val => !!val || 'Password is missing',
						val => val.length >= 6 || 'Password length must be at least 6'
					]"
					lazy-rules
					color="primary-main"
					class="full-width text-dark q-mb-md"
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
					label="Confirm Passsword"
					:rules="[val => !!val || 'Confirm the password', val => val == form.user_password || 'Passwords not match']"
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
    defineComponent, reactive, watch, ref, inject,
  } from 'vue';
  import { useUserStore } from 'src/stores/userStore';
  import { UserToSend } from 'src/models/apiModels';
  import { Gender } from 'src/models/mainModels';
  import { formatDateToLocale } from 'src/utils/commonFunctions';
  import {
    QInput, QSelect, QVueGlobals,
  } from 'quasar';
  import { useState } from '../utils/composables';

  export default defineComponent({
    name: 'RegisterPage',
  });
</script>

<script setup lang="ts">
  const $q = inject<QVueGlobals>('quasar');
  const userStore = useUserStore();

  const form: UnwrapNestedRefs<UserToSend> = reactive(
    {
      username: '',
      user_password: '',
      full_name: '',
      email: '',
      sex: '',
      birthday: '',
      confirm_password: '',
    },
  );

  const setBirthday = (birthday: string|number|null) => {
    if (typeof birthday !== 'string') return;
    form.birthday = birthday;
  };

  const locale = navigator.language;

  const birthdayStrToDate = (birthday: string) => {
    if (!birthday) return undefined;

    return new Date(birthday);
  };

  const formattedBirthday = ref(formatDateToLocale(birthdayStrToDate(form.birthday), locale));

  watch(() => form.birthday, (newValue) => {
    formattedBirthday.value = formatDateToLocale(birthdayStrToDate(newValue), locale);
  });

  const genderOptions: Gender[] = [
    Gender.MALE, Gender.FEMALE, Gender.NON_BINARY, Gender.NOT_INFORMED,
  ];

  const [ togglePwdVisibility, setPwdVisibility ] = useState(false);

  const isValidEmail = (val: string) => {
    const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'Invalid email';
  };

  const router = useRouter();
  const pushToUrl = (path: string) => {
    router.push(path);
  };

  const username = ref<QInput|null>(null);
  const fullName = ref<QInput|null>(null);
  const email = ref<QInput|null>(null);
  const sex = ref<QSelect|null>(null);
  const birthday = ref<QInput|null>(null);
  const password = ref<QInput|null>(null);
  const confirmPassword = ref<QInput|null>(null);

  const hasErrors = () => {
    const errorsCheckList = [
      username.value?.hasError,
      fullName.value?.hasError,
      email.value?.hasError,
      sex.value?.hasError,
      birthday.value?.hasError,
      password.value?.hasError,
      confirmPassword.value?.hasError,
    ];

    return errorsCheckList.some((hasError) => hasError);
  };

  const tryRegistering = async() => {
    if (hasErrors()) {
      $q?.notify({
        type: 'negative',
        message: 'Please, fill all the fields correctly',
      });

      return;
    }

    const registered = await userStore.createUser(form);

    if (registered) {
      $q?.notify({
        type: 'positive',
        message: 'Success! Use your credentials to login',
      });

      pushToUrl('/login');
    }
  };
</script>
