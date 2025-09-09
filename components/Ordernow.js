import { motion } from "framer-motion";
import { textVariant } from "../constants/motion";
import { useConfig } from "../contexts/ConfigContext";
import Link from "next/link";

const Ordernow = ({Ordernowheading,url,black}) => {
    const { getWhatsAppUrl } = useConfig();
    return (
        <motion.div 
            className={`${black === "true" ? "bg-black text-white" : "bg-white text-black"} overflow-hidden`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            >
            <div className="max-w-[1100px] mx-auto my-4 flex items-center justify-center overflow-hidden flex-col-reverse sm:flex-row">
                <div className="flex flex-col mb-5 mx-4 overflow-hidden">
                    <motion.div variants={textVariant(0.6)} className="flex-1/2 mr-24">
                        <h1 className="font-bold text-xl overflow-hidden mb-3 mt-1 sm:text-3xl md:font-medium">{Ordernowheading}</h1>
                    </motion.div>
                    <a href={getWhatsAppUrl(false)} target="_blank" rel="noopener noreferrer">
                        <motion.button variants={textVariant(1.3)} className={`overflow-hidden w-[220px] mb-4 text-[18px] font-medium border-2 py-1 rounded-[5px] ${black === "true" ? "hover:bg-white border-white hover:text-black" : "hover:bg-black border-black hover:text-white"} sm:mb-3 lg:w-[240px] hover:duration-700 cursor-pointer`}>order now</motion.button>
                    </a>
                    <Link href="/shop">
                        <motion.button variants={textVariant(1.3)} className={`overflow-hidden w-[220px] text-[18px] font-medium py-1 rounded-[5px] bg-[#f4f4f4] sm:mb-2 lg:w-[240px] cursor-pointer hover:bg-gray-300 transition-colors`}>Shop</motion.button>
                    </Link>
                </div>
                <motion.div variants={textVariant(1.1)} className="flex-1">
                    <img src={url} className="text-sm object-contain overflow-hidden"/>
                </motion.div>            
            </div>
        </motion.div>
    )
}

export default Ordernow;