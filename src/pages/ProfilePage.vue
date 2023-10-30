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
					<q-item-label
						class="info-label text-weight-medium"
					>
						{{ info.key }}
					</q-item-label>
				</q-item-section>
				<q-item-section side>
					<q-item-label class="info-value">
						{{ info.text }}
					</q-item-label>
				</q-item-section>
			</q-item>

			<q-item>
				<q-item-section class="q-mt-xs">
					<q-btn
						id="btn-update-profile"
						unelevated
						color="primary"
						icon="update"
						class="q-ma-none"
						@click.stop.prevent="setUpdateProfileDialog(true)"
					>
						{{ $t('USER.PROFILE.UPDATE') }}
					</q-btn>
				</q-item-section>
				<q-item-section side
					class="q-mt-xs"
				>
					<q-btn
						id="btn-delete-user"
						outline
						color="negative"
						icon="delete"
						class="q-ma-none"
						@click.stop.prevent="setIsDeleteUserOpen(true)"
					>
						{{ $t('USER.DELETE') }}
					</q-btn>
				</q-item-section>
			</q-item>
		</q-list>

		<update-profile-dialog
			:model-value="isUpdateProfileDialogOpen"
			@update:model-value="setUpdateProfileDialog"
		/>

		<confirm-dialog
			:model-value="isDeleteUserOpen"
			:done-function="deleteUser"
			:confirmQuestion="$t('USER.CONFIRM_DELETE')"
			@update:model-value="setIsDeleteUserOpen"
		/>
	</q-page>
</template>

<script lang="ts">
  import {
    computed, inject,
  } from 'vue';
  import { useUserStore } from 'src/stores/userStore';
  import { genderToFullString } from 'src/utils/commonFunctions';
  import UpdateProfileDialog from 'src/components/profile/UpdateProfileDialog.vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { QVueGlobals } from 'quasar';
  import { useState } from '../utils/composables';
  import ConfirmDialog from '../components/dialogs/ConfirmDialog.vue';

  export default {
    name: 'ProfilePage',
    components: {
      UpdateProfileDialog,
      ConfirmDialog,
    },
  };
</script>

<script setup lang="ts">
  // BASICS

  const $t = useI18n().t;
  const $q = inject<QVueGlobals>('quasar');

  const userStore = useUserStore();
  const user = computed(() => userStore.$state.user);

  const router = useRouter();

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

  const [ isUpdateProfileDialogOpen, setUpdateProfileDialog ] = useState(false);

  const [ isDeleteUserOpen, setIsDeleteUserOpen ] = useState(false);

  // ACTIONS

  async function deleteUser(): Promise<void> {
    const userId = user.value?.userId;
    if (!userId) {
      await userStore.logout();

      router.push('/login');

      return;
    }

    try {
      const [ success, message ] = await userStore.deleteUser(userId);

      if (!success) {
        $q?.notify({
          type: 'negative',
          message,
        });

        return;
      }

      $q?.notify(message);
      setIsDeleteUserOpen(false);

      await userStore.logout();
      router.push('/login');
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: $t('USER.ERROR.DELETE'),
      });
    }
  }

</script>

<style scoped lang="scss">
</style>
