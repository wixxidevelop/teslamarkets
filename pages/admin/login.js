import { useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { useAdmin } from '../../contexts/AdminContext'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdmin()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = login(credentials.username, credentials.password)
    
    if (result.success) {
      router.push('/admin')
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Head>
        <title>Admin Login - Tesla</title>
        <meta name="description" content="Tesla Admin Panel Login" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8"
      >
        {/* Tesla Logo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">TESLA</h1>
          <p className="text-gray-400 text-lg">Admin Panel</p>
        </motion.div>

        {/* Login Form */}
        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </motion.form>

        {/* Demo Credentials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 p-4 bg-gray-900/50 border border-gray-800 rounded-lg"
        >
          <p className="text-sm text-gray-400 mb-2">Demo Credentials:</p>
          <p className="text-sm text-gray-300">Username: <span className="font-mono">admin</span></p>
          <p className="text-sm text-gray-300">Password: <span className="font-mono">tesla2024</span></p>
        </motion.div>

        {/* Back to Shop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push('/shop')}
            className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to Shop
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}