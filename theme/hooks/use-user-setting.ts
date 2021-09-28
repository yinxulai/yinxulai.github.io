import { ref } from 'vue'

interface UserSetting {
  // 添加 command+. 显示开发模式的功能
  showHidden: boolean // 是否展示隐藏项目
}

export function useUserSetting(): UserSetting | null {
  const setting = ref<UserSetting | null>(null)

  const userSetting = localStorage.getItem('setting')
  if (userSetting == null || userSetting === '') return setting.value
  return null
}
