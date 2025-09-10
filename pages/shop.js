import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbarbanner'
import ShopCard from '../components/ShopCard'
import { useProducts } from '../contexts/ProductContext'
import { useConfig } from '../contexts/ConfigContext'

export default function Shop() {
    const { products, loading } = useProducts()
    const { getEmailUrl } = useConfig()
    const [filter, setFilter] = useState('all')
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        let filtered = products

        // Apply type filter
        if (filter !== 'all') {
            filtered = filtered.filter(product => product.type === filter)
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.features && product.features.some(feature => 
                    feature.toLowerCase().includes(searchTerm.toLowerCase())
                ))
            )
        }

        setFilteredProducts(filtered)
    }, [filter, searchTerm, products])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading...</div>
            </div>
        )
    }

    return (
        <>
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Shop - Tesla</title>
        <meta name="description" content="Shop Tesla vehicles and homes" />
        <link rel="icon" href="/icon.png" />
      </Head>

      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="px-6 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Tesla Shop
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our collection of vehicles and sustainable homes
          </p>
        </section>

        {/* Search and Filter Section */}
        <section className="px-6 mb-12">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {[{label: 'All Items', value: 'all'}, {label: 'Vehicles', value: 'car'}, {label: 'Homes', value: 'house'}].map((filterItem) => (
                <button
                  key={filterItem.value}
                  onClick={() => setFilter(filterItem.value)}
                  className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                    filter === filterItem.value
                      ? 'bg-gray-900 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {filterItem.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    filter === filterItem.value ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {filterItem.value === 'all' ? filteredProducts.length : 
                     filteredProducts.filter(p => p.type === filterItem.value).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center mb-6">
              <p className="text-gray-600">
                {searchTerm ? (
                  <>Showing <span className="font-semibold">{filteredProducts.length}</span> results for "{searchTerm}"</>
                ) : (
                  <>{filteredProducts.length} {filter === 'all' ? 'products' : filter === 'car' ? 'vehicles' : 'homes'} available</>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <div key={item.id}>
                  <ShopCard item={item} />
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {searchTerm ? (
                      <>No products match "{searchTerm}". Try a different search term.</>
                    ) : (
                      "No products available in this category."
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => { setFilter('all'); setSearchTerm(''); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="bg-gray-50 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Ready to Go Electric?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join millions who have chosen sustainable innovation. Experience the future of transportation.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a href={getEmailUrl(false)} target="_blank" rel="noopener noreferrer">
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Buy Now
                </button>
              </a>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="text-center">
                <div className="text-sm text-gray-500">
                  © 2024 Tesla Clone. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
    </>
  )
}