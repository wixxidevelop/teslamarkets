import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Head from 'next/head'
import { useAdmin } from '../../contexts/AdminContext'
import { useProducts } from '../../contexts/ProductContext'
import { useConfig } from '../../contexts/ConfigContext'
import { ShopItems } from '../../constants/data'
import Link from 'next/link'
import ProductUploadForm from '../../components/ProductUploadForm'
import ProductEditForm from '../../components/ProductEditForm'

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, logout } = useAdmin()
  const { products, addProduct, updateProduct, deleteProduct, getProductStats } = useProducts()
  const { config, updateConfig } = useConfig()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCars: 0,
    totalHouses: 0,
    totalValue: 0
  })
  const [configForm, setConfigForm] = useState({
    whatsappNumber: '',
    salesMessage: '',
    customOrderMessage: ''
  })
  const [configSaving, setConfigSaving] = useState(false)
  const [configMessage, setConfigMessage] = useState('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    // Calculate statistics from products context
    const productStats = getProductStats()
    setStats(productStats)
  }, [getProductStats])

  useEffect(() => {
    // Populate config form when config is loaded
    if (config) {
      setConfigForm({
        whatsappNumber: config.whatsappNumber || '',
        salesMessage: config.salesMessage || '',
        customOrderMessage: config.customOrderMessage || ''
      })
    }
  }, [config])

  const handleConfigSave = async (e) => {
    e.preventDefault()
    setConfigSaving(true)
    setConfigMessage('')
    
    const result = await updateConfig(configForm)
    
    if (result.success) {
      setConfigMessage('Configuration saved successfully!')
      setTimeout(() => setConfigMessage(''), 3000)
    } else {
      setConfigMessage(result.message || 'Failed to save configuration')
    }
    
    setConfigSaving(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push('/admin/login')
  }

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-${color}-500/50 transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-xs sm:text-sm font-medium truncate">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-1 truncate">{value}</p>
        </div>
        <div className={`p-2 sm:p-3 bg-${color}-500/20 rounded-lg flex-shrink-0 ml-2`}>
          {icon}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Admin Dashboard - Tesla</title>
        <meta name="description" content="Tesla Admin Dashboard" />
        <link rel="icon" href="/icon.png" />
      </Head>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 border-b border-gray-800 px-4 sm:px-6 py-4"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold">TESLA</h1>
            <span className="hidden sm:block text-gray-400">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push('/shop')}
              className="hidden sm:block text-gray-400 hover:text-white transition-colors duration-300"
            >
              View Shop
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </motion.header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'
          }}
          className={`
            fixed lg:relative lg:translate-x-0 z-50 lg:z-auto
            w-64 bg-gray-900 border-r border-gray-800 min-h-screen p-4 sm:p-6
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'products', label: 'Products', icon: '🚗' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsMobileMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          
          {/* Mobile View Shop Button */}
          <div className="lg:hidden mt-6 pt-6 border-t border-gray-800">
            <button
              onClick={() => {
                router.push('/shop')
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              <span>🛍️</span>
              <span>View Shop</span>
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-4 sm:p-6 w-full lg:w-auto">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h2>
                <p className="text-gray-400 text-sm sm:text-base">Overview of your Tesla shop</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="Total Products"
                  value={stats.totalProducts}
                  color="blue"
                  icon={<svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                />
                <StatCard 
                  title="Vehicles"
                  value={stats.totalCars}
                  color="green"
                  icon={<svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                  title="Homes"
                  value={stats.totalHouses}
                  color="purple"
                  icon={<svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                />
                <StatCard 
                  title="Total Value"
                  value={`$${stats.totalValue.toLocaleString()}`}
                  color="yellow"
                  icon={<svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>}
                />
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-3 sm:p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 text-left"
                  >
                    <h4 className="text-white font-semibold text-sm sm:text-base">Manage Products</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">View and edit existing products</p>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('products')
                      setShowUploadForm(true)
                    }}
                    className="p-3 sm:p-4 bg-white hover:bg-gray-200 text-black rounded-lg transition-colors duration-300 text-left"
                  >
                    <h4 className="font-semibold text-sm sm:text-base">Add New Product</h4>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">Upload a new vehicle or home</p>
                  </button>
                  <Link href="/shop" className="p-3 sm:p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-300 text-left block sm:col-span-2 lg:col-span-1">
                    <h4 className="text-white font-semibold text-sm sm:text-base">View Shop</h4>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">See the public shop page</p>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {showUploadForm ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
                    <h2 className="text-2xl sm:text-3xl font-bold">Add New Product</h2>
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base self-start sm:self-auto"
                    >
                      Back to Products
                    </button>
                  </div>
                  <ProductUploadForm
                    onSubmit={async (productData) => {
                      try {
                        await addProduct(productData)
                        setShowUploadForm(false)
                      } catch (error) {
                        console.error('Error adding product:', error)
                      }
                    }}
                    onCancel={() => setShowUploadForm(false)}
                  />
                </div>
              ) : editingProduct ? (
                <div>
                  <ProductEditForm
                    product={editingProduct}
                    onSubmit={async (updatedProduct) => {
                      try {
                        // Extract only the fields that should be updated (exclude id, createdAt, etc.)
                        const updates = {
                          name: updatedProduct.title,
                          title: updatedProduct.title,
                          type: updatedProduct.type,
                          price: updatedProduct.price,
                          description: updatedProduct.description,
                          image: updatedProduct.image,
                          specs: updatedProduct.specs,
                          features: updatedProduct.features
                        }
                        await updateProduct(editingProduct.id, updates)
                        setEditingProduct(null)
                      } catch (error) {
                        console.error('Error updating product:', error)
                      }
                    }}
                    onCancel={() => setEditingProduct(null)}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold mb-2">Products</h2>
                      <p className="text-gray-400 text-sm sm:text-base">Manage your product catalog</p>
                    </div>
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold text-sm sm:text-base self-start sm:self-auto whitespace-nowrap"
                    >
                      Add New Product
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {products.map((product) => (
                      <div key={product.id} className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
                        <div className="aspect-video bg-gray-800 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-white font-semibold mb-2 text-sm sm:text-base truncate">{product.title}</h4>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">{product.type === 'car' ? 'Vehicle' : 'Home'}</p>
                        <p className="text-white font-bold mb-3 text-sm sm:text-base">${product.price?.toLocaleString()}</p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
                          <button 
                            onClick={() => setEditingProduct(product)}
                            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs sm:text-sm transition-colors duration-300"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Are you sure you want to delete this product?')) {
                                deleteProduct(product.id)
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs sm:text-sm transition-colors duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {products.length === 0 && (
                    <div className="text-center py-12 sm:py-20">
                      <p className="text-gray-400 mb-4 text-sm sm:text-base">No products found</p>
                      <button
                        onClick={() => setShowUploadForm(true)}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold text-sm sm:text-base"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}



          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h2>
                <p className="text-gray-400 text-sm sm:text-base">Configure your admin panel</p>
              </div>
              
              {/* WhatsApp Configuration */}
              <div className="bg-gray-900 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4">WhatsApp Configuration</h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">Configure WhatsApp number and messages for order buttons</p>
                
                <form onSubmit={handleConfigSave} className="space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">WhatsApp Number</label>
                    <input
                      type="text"
                      value={configForm.whatsappNumber}
                      onChange={(e) => setConfigForm({...configForm, whatsappNumber: e.target.value})}
                      placeholder="Enter WhatsApp number (e.g., 1234567890)"
                      className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white text-sm sm:text-base"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter only numbers, no spaces or special characters</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Sales Message (Order Now buttons)</label>
                    <textarea
                      value={configForm.salesMessage}
                      onChange={(e) => setConfigForm({...configForm, salesMessage: e.target.value})}
                      placeholder="Message for regular order buttons"
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white resize-none text-sm sm:text-base"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium mb-2">Custom Order Message</label>
                    <textarea
                      value={configForm.customOrderMessage}
                      onChange={(e) => setConfigForm({...configForm, customOrderMessage: e.target.value})}
                      placeholder="Message for custom order button"
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white resize-none text-sm sm:text-base"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 gap-3">
                    <button
                      type="submit"
                      disabled={configSaving}
                      className="px-4 sm:px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                    >
                      {configSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                    
                    {configMessage && (
                      <p className={`text-xs sm:text-sm ${
                        configMessage.includes('successfully') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {configMessage}
                      </p>
                    )}
                  </div>
                </form>
                
                <div className="mt-6 p-3 sm:p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-xs sm:text-sm font-medium mb-2">Preview WhatsApp Links:</h4>
                  <div className="space-y-2 text-xs">
                    <div className="break-words">
                      <span className="text-gray-400 block sm:inline">Order Now: </span>
                      <span className="text-blue-400 break-all">
                        https://wa.me/{configForm.whatsappNumber}?text={encodeURIComponent(configForm.salesMessage)}
                      </span>
                    </div>
                    <div className="break-words">
                      <span className="text-gray-400 block sm:inline">Custom Order: </span>
                      <span className="text-blue-400 break-all">
                        https://wa.me/{configForm.whatsappNumber}?text={encodeURIComponent(configForm.customOrderMessage)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}