<template>
	<big-dialog
		v-model="isCreateProjectOpen"
		:handle-save="saveProject"
	>
		<q-input
			v-model="newProject.name"
			bottom-slots
			counter
			clearable
			maxlength="20"
			label="Project name"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 20 characters
			</template>
		</q-input>
		<q-input
			v-model="newProject.description"
			bottom-slots
			counter
			clearable
			maxlength="50"
			label="Description"
			color="primary-main"
			class="q-mb-md"
		>
			<template v-slot:hint>
				Max of 50 characters
			</template>
		</q-input>
	</big-dialog>
</template>

<script lang="ts">
  import {
    defineComponent, computed, reactive, inject, onBeforeMount,
  } from 'vue';
  import {
    QVueGlobals,
  } from 'quasar';
  import { useProjectStore } from 'src/stores/projectStore';
  import { useUserStore } from 'src/stores/userStore';
  import { CreateProjectToSend } from 'src/models/apiModels';
  import { useRouter } from 'vue-router';
  import BigDialog from '../BigDialog.vue';

  export default defineComponent({
    name: 'CreateProjectDialog',
    components: {
      BigDialog,
    },
  });
</script>

<script setup lang="ts">
  // PROPS AND EMIT

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits([ 'update:modelValue' ]);

  // BASICS

  const $q = inject<QVueGlobals>('quasar');

  const router = useRouter();

  const projectStore = useProjectStore();
  const userStore = useUserStore();

  const userId = userStore.user?.userId;

  onBeforeMount(async() => {
    if (!userId) {
      await userStore.logout();

      router.push('/login');
    }
  });

  // MODELS

  const newProject = reactive<CreateProjectToSend>({
    user_id: userId as number,
    name: '',
    description: '',
  });

  const isCreateProjectOpen = computed({
    get():boolean {
      return props.modelValue;
    },
    set(newState: boolean) {
      emit('update:modelValue', newState);
    },
  });

  // ACTIONS

  async function saveProject() {
    try {
      const [ success, result ] = await projectStore.createProject(userId as number, newProject);

      if (!success) {
        $q?.notify({
          type: 'negative',
          message: result,
        });

        return;
      }

      isCreateProjectOpen.value = false;
      $q?.notify({
        type: 'positive',
        message: result,
      });
    } catch (e) {
      $q?.notify({
        type: 'negative',
        message: 'Error while creating project',
      });
    }
  }
</script>
