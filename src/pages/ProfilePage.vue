<template>
	<q-page class="column justify-start fit">
		<q-list
			dense
			separator
			class="fit q-mt-md"
		>
			<q-item v-for="(info, index) in profileInfo"
				:key="index"
			>
				<q-item-section>
					<q-item-label class="text-weight-medium">
						{{ info.key }}
					</q-item-label>
				</q-item-section>
				<q-item-section side>
					<q-item-label>
						{{ info.text }}
					</q-item-label>
				</q-item-section>
			</q-item>

			<q-item>
				<q-item-section>
					<q-btn
						flat
						color="primary"
						icon="update"
						class="q-ma-none"
						@click.stop.prevent="openUpdateProfileDialog"
					>
						{{ $t('USER.PROFILE.UPDATE') }}
					</q-btn>
				</q-item-section>
			</q-item>
		</q-list>

		<update-profile-dialog
			v-model="isUpdateProfileDialogOpen"
		/>
	</q-page>
</template>

<script lang="ts">
  import {
    computed, ref,
  } from 'vue';
  import { useUserStore } from 'src/stores/userStore';
  import { genderToFullString } from 'src/utils/commonFunctions';
  import UpdateProfileDialog from 'src/components/profile/UpdateProfileDialog.vue';
  import { useI18n } from 'vue-i18n';

  export default {
    name: 'ProfilePage',
    components: {
      UpdateProfileDialog,
    },
  };
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;

  const userStore = useUserStore();
  const user = computed(() => userStore.$state.user);

  // MODELS
  const profileInfo = computed(() => [
    {
      key: $t('REGISTER.FULL_NAME.NAME'), text: user.value?.fullName,
    },
    {
      key: $t('AUTH.EMAIL.NAME'), text: user.value?.email,
    },
    {
      key: $t('REGISTER.GENDER.NAME'), text: genderToFullString($t, user.value?.sex || ''),
    },
    {
      key: $t('REGISTER.BIRTHDAY.NAME'), text: user.value?.birthday.toLocaleDateString(navigator.language, { timeZone: 'UTC' }),
    },
  ]);

  const isUpdateProfileDialogOpen = ref(false);

  // ACTIONS

  const openUpdateProfileDialog = () => {
    isUpdateProfileDialogOpen.value = true;
  };
</script>

<style scoped lang="scss">
</style>
