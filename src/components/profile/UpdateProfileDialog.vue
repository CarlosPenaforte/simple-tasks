<template>
	<big-dialog
		v-model="isUpdateProfileOpen"
		:handle-save="updateProfile"
	>
		<h1 class="text-secondary fs-20 lh-22 ls-2 text-center text-uppercase fw-medium q-pa-none q-mb-sm q-mt-md">
			{{ $t('USER.PROFILE.UPDATE') }}
		</h1>

		<q-input
			ref="fullName"
			v-model="newProfile.full_name"
			bottom-slots
			clearable
			maxlength="500"
			name="full_name"
			:label="$t('REGISTER.FULL_NAME.NAME')"
			:rules="[val => !!val || $t('REGISTER.FULL_NAME.VALIDATE.EMPTY')]"
			lazy-rules
			color="primary-main"
			class="q-mb-md text-dark"
		>
			<template v-slot:hint>
				Max of 500 characters
			</template>
		</q-input>

		<q-select
			ref="sex"
			v-model="newProfile.sex"
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
					{{ genderToFullString($t, newProfile.sex) }}
				</div>
			</template>
			<template v-slot:option="scope">
				<q-item v-bind="scope.itemProps">
					<q-item-section>
						<span>{{ genderToFullString($t, scope.opt) }}</span>
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
					<q-popup-proxy
						transition-show="scale"
						transition-hide="scale"
					>
						<q-date
							:mask="qDateFormat"
							color="primary-main"
							:title="$t('REGISTER.BIRTHDAY.NAME')"
							:subtitle="$t('REGISTER.BIRTHDAY.SUBTITLE')"
							class="text-dark"
							:modelValue="newProfile.birthday"
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
	</big-dialog>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    defineComponent, computed, ref, inject, watch, reactive,
  } from 'vue';
  import {
    QInput, QSelect, QVueGlobals,
  } from 'quasar';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '../../stores/userStore';
  import {
    Gender,
  } from '../../models/mainModels';
  import {
    UpdateUserToSend,
  } from '../../models/apiModels';
  import BigDialog from '../BigDialog.vue';
  import {
    formatDateToLocale, genderToFullString, getLocaleFormat, getLocaleMask, dateStrToDate,
  } from '../../utils/commonFunctions';

  export default defineComponent({
    name: 'UpdateProfileDialog',
    components: {
      BigDialog,
    },
  });
</script>

<script setup lang="ts">
  // PROPS AND EMITS
  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // BASICS

  const $t = useI18n().t;

  const $q = inject<QVueGlobals>('quasar');

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  // UTILS

  const locale = navigator.language;

  const localeFormat = getLocaleFormat(locale);
  const qDateFormat = localeFormat.toUpperCase();

  const localeMask = getLocaleMask(locale);

  // MODELS

  const newProfile = reactive<UpdateUserToSend>({
    full_name: user.value?.fullName || '',
    sex: user.value?.sex || '',
    birthday: formatDateToLocale(user.value?.birthday, locale),
  });
  const fullName = ref<QInput|null>(null);
  const sex = ref<QSelect|null>(null);
  const birthday = ref<QInput|null>(null);

  const isUpdateProfileOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });

  const genderOptions: Gender[] = [
    Gender.MALE, Gender.FEMALE, Gender.NON_BINARY, Gender.NOT_INFORMED,
  ];

  // BIRTHDAY
  const setBirthday = (birthday: string|number|null) => {
    if (typeof birthday !== 'string') return;

    if (birthday.length > 10) {
      newProfile.birthday = birthday.slice(0, 10);
      return;
    }

    newProfile.birthday = birthday;
  };

  const formattedBirthday = ref(formatDateToLocale(dateStrToDate(newProfile.birthday, localeFormat), locale));

  watch(() => newProfile.birthday, (newValue) => {
    if (newValue.length < 10) {
      formattedBirthday.value = newValue;

      return;
    }

    formattedBirthday.value = formatDateToLocale(dateStrToDate(newValue, localeFormat), locale);
  });

  // ERROR CHECK

  const hasErrors = () => {
    const errorsCheckList = [
      fullName.value?.hasError,
      sex.value?.hasError,
      birthday.value?.hasError,
    ];

    return errorsCheckList.some((hasError) => hasError);
  };

  // ACTIONS

  async function updateProfile() {
    if (hasErrors()) {
      $q?.notify({
        type: 'negative',
        message: $t('FORM.INVALID_FIELDS'),
      });

      return;
    }

    if (!user.value?.userId) {
      $q?.notify({
        type: 'negative',
        message: $t('COMMON.INTERNAL_ERROR'),
      });

      return;
    }

    const [ updated, messageOrUser ] = await userStore.updateUser($t, user.value.userId, newProfile);

    if (updated && typeof messageOrUser !== 'string') {
      $q?.notify($t('USER.PROFILE.UPDATE_SUCCESS'));

      isUpdateProfileOpen.value = false;
    } else if (typeof messageOrUser === 'string') {
      $q?.notify({
        type: 'negative',
        message: messageOrUser,
      });
    } else {
      $q?.notify({
        type: 'negative',
        message: $t('COMMON.INTERNAL_ERROR'),
      });
    }
  }
</script>
