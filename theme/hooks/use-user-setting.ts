import { ref } from 'vue'

declare global {
  interface Window {
    __VUEPRESS_SSR__: boolean;
  }
}

interface UserSetting {
  showWIP: boolean // 是否显示 WIP 的文章
}

export function useUserSetting(): UserSetting | null {
  const setting = ref<UserSetting | null>(null)
  if (window == null || window.__VUEPRESS_SSR__) {
    return null
  }

  const userSetting = localStorage.getItem('setting')
  if (userSetting == null) return setting.value
  return JSON.parse(userSetting)
}
