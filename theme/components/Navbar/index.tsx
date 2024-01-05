import { createRef } from 'airx'
import { useRouter } from 'airx-router'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  const router = useRouter()
  const htmlRef = createRef<HTMLElement | null>(null)

  return () => (<ThemeToggle />)
}
