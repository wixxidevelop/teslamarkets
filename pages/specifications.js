import Head from 'next/head';
import Navbar from '../components/Navbarbanner';
import Specs from '../components/Specs';
import { useState } from 'react';

export default function Specifications() {
    const [activeTab, setActiveTab] = useState('car');

    return (
        <>
            <Head>
                <title>Specifications - Tesla Clone</title>
                <meta name="description" content="Compare car and home specifications" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />
            
            <div className="min-h-screen bg-black text-white">
                {/* Header */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl lg:text-6xl font-bold mb-4">Specifications</h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Explore detailed specifications for our vehicles and homes
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-800 rounded-full p-2 flex space-x-2">
                            <button
                                onClick={() => setActiveTab('car')}
                                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                                    activeTab === 'car'
                                        ? 'bg-white text-black'
                                        : 'text-white hover:bg-gray-700'
                                }`}
                            >
                                Vehicles
                            </button>
                            <button
                                onClick={() => setActiveTab('home')}
                                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                                    activeTab === 'home'
                                        ? 'bg-white text-black'
                                        : 'text-white hover:bg-gray-700'
                                }`}
                            >
                                Homes
                            </button>
                            <button
                                onClick={() => setActiveTab('solar')}
                                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                                    activeTab === 'solar'
                                        ? 'bg-white text-black'
                                        : 'text-white hover:bg-gray-700'
                                }`}
                            >
                                Solar
                            </button>
                        </div>
                    </div>

                    {/* Specifications Content */}
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'car' && (
                            <div className="space-y-16">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-4">Vehicle Specifications</h2>
                                    <p className="text-gray-300">Advanced electric vehicle technology and performance</p>
                                </div>
                                <Specs 
                                    type="car" 
                                    model="models"
                                    title="Model S Specifications"
                                />
                            </div>
                        )}

                        {activeTab === 'home' && (
                            <div className="space-y-16">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-4">Home Specifications</h2>
                                    <p className="text-gray-300">Smart homes designed for sustainable living</p>
                                </div>
                                <Specs 
                                    type="home"
                                    title="Tesla Home Specifications"
                                    image="/home/home-specs.jpg"
                                />
                            </div>
                        )}

                        {activeTab === 'solar' && (
                            <div className="space-y-16">
                                <div className="text-center mb-8">
                                    <h2 className="text-3xl font-bold mb-4">Solar Specifications</h2>
                                    <p className="text-gray-300">Clean energy solutions for your home</p>
                                </div>
                                <Specs 
                                    type="solar"
                                    title="Solar Roof Specifications"
                                />
                            </div>
                        )}
                    </div>

                    {/* Comparison Section */}
                    <div className="mt-20 text-center">
                        <h2 className="text-3xl font-bold mb-8">Why Choose Tesla?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Vehicles</h3>
                                <p className="text-gray-300">
                                    Industry-leading electric vehicles with cutting-edge technology, 
                                    exceptional performance, and sustainable design.
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Homes</h3>
                                <p className="text-gray-300">
                                    Smart homes integrated with Tesla's ecosystem, featuring 
                                    energy-efficient design and sustainable living solutions.
                                </p>
                            </div>
                            <div className="bg-gray-900 rounded-lg p-6">
                                <h3 className="text-xl font-bold mb-4">Solar</h3>
                                <p className="text-gray-300">
                                    Revolutionary solar roof technology that generates clean energy 
                                    while maintaining the aesthetic appeal of your home.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}