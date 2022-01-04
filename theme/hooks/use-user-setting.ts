import { ref } from 'vue'

interface UserSetting {
  showWIP: boolean // 是否显示 WIP 的文章
}

export function useUserSetting(): UserSetting | null {
  const setting = ref<UserSetting | null>(null)

  const userSetting = localStorage.getItem('setting')
  if (userSetting == null) return setting.value
  return JSON.parse(userSetting)
}
