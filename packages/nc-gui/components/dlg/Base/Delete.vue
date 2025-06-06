<script lang="ts" setup>
const props = defineProps<{
  visible: boolean
  baseId: string
}>()

const emits = defineEmits(['update:visible'])

const visible = useVModel(props, 'visible', emits)

const basesStore = useBases()
const { deleteProject, navigateToFirstProjectOrHome } = basesStore
const { bases } = storeToRefs(basesStore)

const { removeFromRecentViews } = useViewsStore()

const { refreshCommandPalette } = useCommandPalette()

const base = computed(() => bases.value.get(props.baseId))

const isLoading = ref(false)

const onDelete = async () => {
  if (!base.value) return

  const toBeDeletedProject = JSON.parse(JSON.stringify(base.value))

  isLoading.value = true
  try {
    await deleteProject(toBeDeletedProject.id!)

    refreshCommandPalette()

    visible.value = false

    if (toBeDeletedProject.id === basesStore.activeProjectId) {
      await navigateToFirstProjectOrHome()
    }
  } catch (e: any) {
    message.error(await extractSdkResponseErrorMsg(e))
  } finally {
    isLoading.value = false
    removeFromRecentViews({ baseId: toBeDeletedProject.id! })
  }
}
</script>

<template>
  <GeneralDeleteModal v-model:visible="visible" :entity-name="$t('objects.project')" :on-delete="onDelete">
    <template #entity-preview>
      <div v-if="base" class="flex flex-row items-center py-2 px-2.25 bg-gray-50 rounded-lg text-gray-700">
        <GeneralProjectIcon :color="parseProp(base.meta).iconColor" :type="base.type" class="nc-view-icon w-6 h-6 mx-1" />
        <div
          class="capitalize text-ellipsis overflow-hidden select-none w-full pl-1.75"
          :style="{ wordBreak: 'keep-all', whiteSpace: 'nowrap', display: 'inline' }"
        >
          {{ base.title }}
        </div>
      </div>
    </template>
  </GeneralDeleteModal>
</template>
