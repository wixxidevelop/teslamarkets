import ProductDatabase from '../../../utils/database';

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        const { search, type } = req.query;
        let products;
        
        if (search) {
          products = await ProductDatabase.searchProducts(search);
        } else if (type) {
          products = await ProductDatabase.getProductsByType(type);
        } else {
          products = await ProductDatabase.getAllProducts();
        }
        
        res.status(200).json({ success: true, data: products });
        break;

      case 'POST':
        const productData = req.body;
        
        // Validate required fields
        if (!productData.name || !productData.price) {
          return res.status(400).json({ 
            success: false, 
            error: 'Name and price are required' 
          });
        }

        // Ensure image is a string URL (from ImgBB)
        if (productData.image && typeof productData.image !== 'string') {
          return res.status(400).json({ 
            success: false, 
            error: 'Image must be a valid URL string' 
          });
        }

        const newProduct = await ProductDatabase.addProduct(productData);
        res.status(201).json({ success: true, data: newProduct });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}