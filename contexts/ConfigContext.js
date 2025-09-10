import { createContext, useContext, useState, useEffect } from 'react'

const ConfigContext = createContext()

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    emailAddress: 'orders@teslamarkets.com',
    salesMessage: "Hi, I'm interested in placing an order for a Tesla. Could you please help me with the details?",
    customOrderMessage: "Hi, I'm interested in placing a custom order for a Tesla. Could you please help me with the details?"
  })
  const [loading, setLoading] = useState(true)

  // Fetch configuration on mount
  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const configData = await response.json()
        setConfig(configData)
      }
    } catch (error) {
      console.error('Failed to fetch configuration:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (newConfig) => {
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      })

      if (response.ok) {
        const result = await response.json()
        setConfig(result.config)
        return { success: true, message: 'Configuration updated successfully' }
      } else {
        const error = await response.json()
        return { success: false, message: error.error || 'Failed to update configuration' }
      }
    } catch (error) {
      console.error('Failed to update configuration:', error)
      return { success: false, message: 'Failed to update configuration' }
    }
  }

  const getEmailUrl = (isCustomOrder = false) => {
    const message = isCustomOrder ? config.customOrderMessage : config.salesMessage
    const subject = isCustomOrder ? 'Custom Order Request' : 'Order Request'
    return `mailto:${config.emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  }

  const value = {
    config,
    loading,
    updateConfig,
    getEmailUrl,
    fetchConfig
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}