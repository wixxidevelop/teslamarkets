import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Navbar from "../../components/Navbarbanner";
import Link from 'next/link';
import { useProducts } from '../../contexts/ProductContext';
import { useConfig } from '../../contexts/ConfigContext';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { products, loading: productsLoading, getProductById } = useProducts();
    const { getEmailUrl } = useConfig();
    const [item, setItem] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        if (id && !productsLoading) {
            const foundItem = getProductById(id);
            setItem(foundItem);
        }
    }, [id, productsLoading, getProductById]);

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    const getFallbackImage = (type) => {
        if (type === 'car') {
            return '/home/model-3.jpg';
        } else {
            return '/home/solarroof.jpg';
        }
    };

    // Create multiple image views (for demo purposes, we'll use the same image)
    const productImages = [
        imageError ? getFallbackImage(item.type) : item.image,
        imageError ? getFallbackImage(item.type) : item.image,
        imageError ? getFallbackImage(item.type) : item.image
    ];

    return (
        <>
            <Head>
                <title>{item.title} | Tesla Shop</title>
                <meta name="description" content={item.description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/icon.png" />
            </Head>
            
            <Navbar fixed={true} white={"false"} />
            
            <div className="min-h-screen bg-white pt-20">
                {/* Breadcrumb */}
                <div className="px-6 lg:px-16 py-4">
                    <nav className="text-sm text-gray-600">
                        <Link href="/" className="hover:text-black">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href="/shop" className="hover:text-black">Shop</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black">{item.title}</span>
                    </nav>
                </div>

                <div className="px-6 lg:px-16 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={productImages[selectedImage]}
                                    alt={item.title}
                                    className="w-full h-96 object-cover"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                            
                            {/* Thumbnail Images */}
                            <div className="flex space-x-4">
                                {productImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImage === index ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${item.title} view ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            {/* Type Badge */}
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                                    item.type === 'car' ? 'bg-blue-600' : 'bg-green-600'
                                }`}>
                                    {item.type === 'car' ? 'Vehicle' : 'Home'}
                                </span>
                            </div>

                            {/* Title and Price */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-medium mb-2">{item.title}</h1>
                                <p className="text-2xl lg:text-3xl font-bold text-black">{item.price}</p>
                            </div>

                            {/* Description */}
                            <p className="text-lg text-gray-600 leading-relaxed">{item.description}</p>



                            {/* Features */}
                            <div>
                                <h3 className="text-xl font-medium mb-4">Key Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {item.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-black rounded-full"></div>
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-6">
                                <a href={getEmailUrl(false)} target="_blank" rel="noopener noreferrer">
                                    <button className="w-full bg-black text-white py-4 px-6 rounded-full text-lg font-medium hover:bg-gray-800 transition-colors duration-300">
                                        Buy Now
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}