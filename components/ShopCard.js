import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function ShopCard({ item }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Safety check for item prop
  if (!item) {
    return (
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="text-gray-400 text-center">Product not available</div>
      </div>
    )
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const fallbackImage = item.type === 'car' 
    ? '/model3/model-3.jpg' 
    : '/solarroof/solarroof.webp'

  return (
    <Link href={`/shop/${item.id}`}>
      <div className="bg-white rounded-lg overflow-hidden cursor-pointer group border border-gray-200 hover:border-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md">
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
            </div>
          )}
          <img
            src={imageError ? fallbackImage : item.image}
            alt={item.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <div className="absolute top-4 left-4">
            <span 
              className={`px-3 py-1 rounded-md text-xs font-medium ${
                item.type === 'car' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {item.type === 'car' ? 'Vehicle' : 'Home'}
            </span>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900 leading-tight">
              {item.title || 'Untitled Product'}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {item.description || 'No description available'}
          </p>
          
          {item.features && item.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.features.slice(0, 3).map((feature, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                >
                  {feature}
                </span>
              ))}
              {item.features.length > 3 && (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-md text-xs">
                  +{item.features.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                ${item.price ? item.price.toLocaleString() : '0'}
              </div>
              {item.type === 'car' && (
                <p className="text-sm text-gray-500">Starting price</p>
              )}
            </div>
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}