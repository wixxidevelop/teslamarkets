import { useState } from "react";
import { ModelSPlaid1_Specs, ModelSPlaid2_Specs, ModelS1_Specs, ModelS2_Specs, Roof1_Specs, Roof2_Specs, Home1_Specs, Home2_Specs } from "../constants/data";

const Specs = ({ type = "car", model = "models", title, image, variants = [] }) => {
    const [specs, setSpecs] = useState(0);

    // Define specifications based on type and model
    const getSpecsData = () => {
        if (type === "home") {
            return {
                title: title || "Home Specifications",
                image: image || "/home/home-specs.jpg",
                variants: [
                    {
                        name: "Home Features",
                        specs: [Home1_Specs, Home2_Specs]
                    }
                ]
            };
        }
        
        if (type === "solar") {
            return {
                title: title || "Solar Roof Specs",
                image: image || "/solarroof/roof.png",
                variants: [
                    {
                        name: "Solar Specifications",
                        specs: [Roof1_Specs, Roof2_Specs]
                    }
                ]
            };
        }
        
        // Car specifications (default)
        if (model === "models" || !model) {
            return {
                title: title || "Model S Specs",
                image: image || "/models/model-s-specs.jpg",
                variants: [
                    {
                        name: "Model S Plaid",
                        specs: [ModelSPlaid1_Specs, ModelSPlaid2_Specs]
                    },
                    {
                        name: "Model S",
                        specs: [ModelS1_Specs, ModelS2_Specs]
                    }
                ]
            };
        }
        
        // For other car models, use generic car specs or custom variants
        return {
            title: title || `${model.toUpperCase()} Specs`,
            image: image || `/models/${model}-specs.jpg`,
            variants: variants.length > 0 ? variants : [
                {
                    name: "Standard",
                    specs: [ModelS1_Specs, ModelS2_Specs] // Fallback specs
                }
            ]
        };
    };

    const specsData = getSpecsData();
    const currentVariant = specsData.variants[specs] || specsData.variants[0];

    return (
        <div className="flex flex-col lg:flex-row">
            <div>
                <img className="md:w-[800px]" src={specsData.image} alt={`${type}-specs`} />
            </div>
            <div className="my-16">
                <h1 className="text-white text-center text-2xl font-bold">{specsData.title}</h1>
                
                {/* Variant buttons - only show if more than one variant */}
                {specsData.variants.length > 1 && (
                    <div className="flex my-4 mx-2 items-center justify-center flex-wrap gap-2">
                        {specsData.variants.map((variant, index) => (
                            <button 
                                key={index}
                                onClick={() => setSpecs(index)} 
                                className={`overflow-hidden text-white w-[180px] text-[14px] py-2 border-2 ${
                                    specs === index ? "border-white" : "border-[#3b3b3b]"
                                } font-medium rounded-[5px] hover:border-gray-300 transition-colors`}
                            >
                                {variant.name}
                            </button>
                        ))}
                    </div>
                )}
                
                {/* Specifications display */}
                <div className="flex items-center justify-center mt-6">
                    {currentVariant.specs.map((specGroup, groupIndex) => (
                        <div key={groupIndex} className="text-white flex flex-col w-[140px] justify-evenly mx-4 lg:w-[170px]">
                            {specGroup.map((spec) => (
                                <div key={spec.id} className="my-3">
                                    <h1 className="font-bold text-xl">{spec.heading}</h1>
                                    <p className="text-sm">{spec.description}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Specs