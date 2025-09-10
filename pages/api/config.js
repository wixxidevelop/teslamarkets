import fs from 'fs'
import path from 'path'

const configPath = path.join(process.cwd(), 'database', 'config.json')

// Helper function to read config
function readConfig() {
  try {
    const configData = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } catch (error) {
    // Return default config if file doesn't exist
    return {
      emailAddress: 'orders@teslamarkets.com',
      salesMessage: "Hi, I'm interested in placing an order for a Tesla. Could you please help me with the details?",
      customOrderMessage: "Hi, I'm interested in placing a custom order for a Tesla. Could you please help me with the details?"
    }
  }
}

// Helper function to write config
function writeConfig(config) {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const config = readConfig()
      res.status(200).json(config)
    } catch (error) {
      res.status(500).json({ error: 'Failed to read configuration' })
    }
  } else if (req.method === 'POST') {
    try {
      const { emailAddress, salesMessage, customOrderMessage } = req.body
      
      // Validate required fields
      if (!emailAddress) {
        return res.status(400).json({ error: 'Email address is required' })
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailAddress)) {
        return res.status(400).json({ error: 'Please provide a valid email address' })
      }
      
      const config = {
        emailAddress: emailAddress.trim().toLowerCase(),
        salesMessage: salesMessage || "Hi, I'm interested in placing an order for a Tesla. Could you please help me with the details?",
        customOrderMessage: customOrderMessage || "Hi, I'm interested in placing a custom order for a Tesla. Could you please help me with the details?"
      }
      
      writeConfig(config)
      res.status(200).json({ message: 'Configuration updated successfully', config })
    } catch (error) {
      res.status(500).json({ error: 'Failed to update configuration' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}