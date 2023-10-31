<template>
	<big-dialog
		v-model="isUpdateProfileOpen"
		:handle-save="updateProfile"
		save-button-id="btn-user-submit"
	>
		<h1 class="text-secondary fs-20 lh-22 ls-2 text-center text-uppercase fw-medium q-pa-none q-mb-sm q-mt-md">
			{{ $t('USER.PROFILE.UPDATE') }}
		</h1>

		<q-input
			ref="fullName"
			for="npt-user-full-name"
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
			for="npt-user-gender"
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

		<date-input
			ref="birthday"
			v-model="newProfile.birthday"
			max-date="2020-12-31"
			:title="$t('REGISTER.BIRTHDAY.NAME')"
			:subtitle="$t('REGISTER.BIRTHDAY.SUBTITLE')"
			:short-message="$t('REGISTER.BIRTHDAY.VALIDATE.SHORT')"
			:invalid-message="$t('REGISTER.BIRTHDAY.VALIDATE.INVALID')"
		/>
	</big-dialog>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import {
    defineComponent, computed, ref, inject, reactive,
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
  import BigDialog from '../dialogs/BigDialog.vue';
  import {
    formatDateToIso,
    genderToFullString,
  } from '../../utils/commonFunctions';
  import DateInput from '../form/DateInput.vue';

  export default defineComponent({
    name: 'UpdateProfileDialog',
    components: {
      BigDialog,
      DateInput,
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

  // MODELS

  const newProfile = reactive<UpdateUserToSend>({
    full_name: user.value?.fullName || '',
    sex: user.value?.sex || '',
    birthday: formatDateToIso(user.value?.birthday),
  });
  const fullName = ref<QInput|null>(null);
  const sex = ref<QSelect|null>(null);
  const birthday = ref<typeof DateInput|null>(null);

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
