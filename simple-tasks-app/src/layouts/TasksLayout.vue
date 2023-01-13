<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      id="el-tasks-layout-header"
      reveal
      class="bg-primary-main q-px-sm q-py-xs header-shadow"
    >
      <q-toolbar class="row no-padding fit">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-select
          v-model="projectSelected"
          :options="projectOptions"
          borderless
          behavior="menu"
          label="Project"
          label-color="whity"
          color="primary-main"
          class="q-ml-lg q-px-sm w-110"
        >
          <template v-slot:selected>
            <div v-html="projectSelected" class="text-whity"/>
          </template>
        </q-select>

        <q-btn
          flat
          dense
          round
          icon="add"
          aria-label="Add"
          class="q-ml-xs"
        />

        <q-space />

        <q-btn
          flat
          dense
          round
          icon="search"
          aria-label="Search"
          @click="toggleSearchDialog"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item
          v-for="(route, index) in appRoutes"
          :key="index"
        >
          {{route.title}}
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-model="tasks"/>
    </q-page-container>

    <q-footer class="bg-secondary-filter">
      <q-toolbar class="row no-padding fit">
        <q-btn
          flat
          no-caps
          aria-label="Share"
          class="col-4 q-pt-sm"
        >
          <div class="column items-center justify-center">
            <q-icon name="share" size="24px" color="dark-common"/>
            <div v-html="'Share'" class="fs-12 lh-20 fw-regular text-secondary" />
          </div>
        </q-btn>
        <q-btn
          flat
          no-caps
          no-wrap
          aria-label="AddCircle"
          class="col-4 q-py-xs"
        >
          <div class="column items-center justify-center">
            <q-icon name="add_circle_outline" size="30px" color="primary-main"/>
            <div v-html="'Create Task'" class="fs-14 lh-20 fw-medium text-primary-lighter"/>
          </div>
        </q-btn>
        <q-btn
          flat
          no-caps
          no-wrap
          aria-label="Sort"
          class="col-4 q-pt-sm"
        >
          <div class="column items-center justify-center">
            <q-icon name="sort" size="24px" color="dark-common"/>
            <div v-html="'Sort'" class="fs-12 lh-20 fw-regular text-secondary"/>
          </div>
        </q-btn>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script lang="ts">
  import {
    defineComponent, ref, reactive,
  } from 'vue';
  import {
    Task, Urgency,
  } from 'components/models';

  const routesList = [
    {
      title: 'Docs',
      caption: 'quasar.dev',
      icon: 'school',
      link: 'https://quasar.dev',
    },
    {
      title: 'Github',
      caption: 'github.com/quasarframework',
      icon: 'code',
      link: 'https://github.com/quasarframework',
    },
    {
      title: 'Discord Chat Channel',
      caption: 'chat.quasar.dev',
      icon: 'chat',
      link: 'https://chat.quasar.dev',
    },
    {
      title: 'Forum',
      caption: 'forum.quasar.dev',
      icon: 'record_voice_over',
      link: 'https://forum.quasar.dev',
    },
    {
      title: 'Twitter',
      caption: '@quasarframework',
      icon: 'rss_feed',
      link: 'https://twitter.quasar.dev',
    },
    {
      title: 'Facebook',
      caption: '@QuasarFramework',
      icon: 'public',
      link: 'https://facebook.quasar.dev',
    },
    {
      title: 'Quasar Awesome',
      caption: 'Community Quasar projects',
      icon: 'favorite',
      link: 'https://awesome.quasar.dev',
    },
  ];

  const tasks: Task[] = [
    {
      taskId: 1,
      userId: 1,
      title: 'ct1',
      description: 'ok',
      creationDate: new Date(),
      urgency: Urgency.URGENT,
      done: false,
    },
    {
      taskId: 2,
      userId: 1,
      title: 'ct1',
      description: 'ok',
      creationDate: new Date(),
      dueDate: new Date('2022-11-30'),
      urgency: Urgency.URGENT,
      done: false,
    },
    {
      taskId: 3,
      userId: 1,
      title: 'ct1',
      description: 'ok',
      creationDate: new Date(),
      urgency: Urgency.IMPORTANT,
      done: false,
    },
    {
      taskId: 4,
      userId: 1,
      title: 'ct1',
      description: 'ok',
      creationDate: new Date(),
      urgency: Urgency.IMPORTANT,
      done: false,
    },
    {
      taskId: 5,
      userId: 1,
      title: 'ct1',
      description: 'ok',
      creationDate: new Date(),
      urgency: Urgency.COMMON,
      done: false,
    },
  ];

  const projectOptions = [
    'MyProject',
    'Second',
    'Party',
  ];

  export default defineComponent({
    name: 'MainLayout',
    setup () {
      const leftDrawerOpen = ref(false);
      const searchDialogOpen = ref(false);
      const projectSelected = ref('MyProject');
      const reactiveTasks = reactive(tasks);

      return {
        appRoutes: routesList,
        leftDrawerOpen,
        toggleLeftDrawer() {
          leftDrawerOpen.value = !leftDrawerOpen.value;
        },
        toggleSearchDialog() {
          searchDialogOpen.value = !searchDialogOpen.value;
        },
        searchDialogOpen,
        tasks: reactiveTasks,
        projectSelected,
        projectOptions,
      };
    },
  });
</script>

<style>
  #el-tasks-layout-header .q-select__dropdown-icon {
    color: rgb(250,250,250) !important;
  }

  .width-110 {
    width: 110px;
  }

  .header-shadow {
    box-shadow: 0 4px 4px rgba(0,0,0,0.1);
  }
</style>
