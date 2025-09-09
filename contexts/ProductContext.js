import { createContext, useContext, useState, useEffect } from 'react'
import { ShopItems } from '../constants/data'

const ProductContext = createContext()

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize products from JSON database API
  useEffect(() => {
    const initializeProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          setProducts(data.data)
        } else {
          // Initialize with default shop data if database is empty
          console.log('Database empty, initializing with default data')
          for (const item of ShopItems) {
            await fetch('/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: item.title,
                title: item.title,
                type: item.type,
                price: item.price,
                description: item.description,
                image: item.image,
                specs: item.specs,
                features: item.features
              })
            })
          }
          // Fetch updated products after initialization
          const updatedResponse = await fetch('/api/products')
          const updatedData = await updatedResponse.json()
          if (updatedData.success) {
            setProducts(updatedData.data)
          }
        }
      } catch (error) {
        console.error('Error initializing products:', error)
        // Fallback to default data
        setProducts(ShopItems)
      } finally {
        setLoading(false)
      }
    }

    initializeProducts()
  }, [])

  const addProduct = async (newProduct) => {
    try {
      // Validate required fields
      if (!newProduct.title || !newProduct.price) {
        throw new Error('Missing required fields')
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProduct.title,
          title: newProduct.title,
          type: newProduct.type,
          price: newProduct.price,
          description: newProduct.description,
          image: newProduct.image,
          specs: newProduct.specs,
          features: newProduct.features
        })
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to add product')
      }

      // Update local state
      setProducts(prev => [data.data, ...prev])
      return data.data
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const updateProduct = async (productId, updates) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to update product')
      }

      // Update local state
      setProducts(prev => prev.map(product => 
        product.id === productId ? data.data : product
      ))
      
      // Refresh products from server to ensure consistency
      await fetchProducts()
      
      return data.data
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete product')
      }

      // Update local state
      setProducts(prev => prev.filter(product => product.id !== productId))
      return data.data
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  const getProductById = (productId) => {
    return products.find(product => product.id === productId)
  }

  const getProductsByType = (type) => {
    return products.filter(product => product.type === type)
  }

  const searchProducts = (query) => {
    if (!query) return products
    
    const lowercaseQuery = query.toLowerCase()
    return products.filter(product => 
      product.title.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      (product.features && product.features.some(feature => 
        feature.toLowerCase().includes(lowercaseQuery)
      ))
    )
  }

  const getProductStats = () => {
    const totalProducts = products.length
    const cars = products.filter(p => p.type === 'car').length
    const houses = products.filter(p => p.type === 'house').length
    const totalValue = products.reduce((sum, product) => sum + (product.price || 0), 0)
    const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0

    return {
      totalProducts,
      cars,
      houses,
      totalValue,
      averagePrice
    }
  }

  const value = {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByType,
    searchProducts,
    getProductStats
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}