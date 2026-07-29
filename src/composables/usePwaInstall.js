import { ref } from 'vue'

const deferredPrompt = ref(null)
const showPrompt = ref(false)
const isInstallable = ref(false)
let listenerInitialized = false

const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt.value = e
  isInstallable.value = true
  
  const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (!sessionStorage.getItem('pwa-prompt-dismissed') && isMobile) {
    showPrompt.value = true
  }
}

export function usePwaInstall() {
  const initPwaListener = () => {
    if (listenerInitialized) return
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    listenerInitialized = true
  }

  const installApp = async () => {
    if (!deferredPrompt.value) return
    
    deferredPrompt.value.prompt()
    
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    } else {
      console.log('User dismissed the install prompt')
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
    
    deferredPrompt.value = null
    showPrompt.value = false
    isInstallable.value = false
  }

  const dismissPrompt = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    showPrompt.value = false
  }

  return {
    isInstallable,
    showPrompt,
    initPwaListener,
    installApp,
    dismissPrompt
  }
}
