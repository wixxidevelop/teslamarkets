import ProductDatabase from '../../../utils/database';

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  if (!id) {
    return res.status(400).json({ 
      success: false, 
      error: 'Product ID is required' 
    });
  }

  try {
    switch (method) {
      case 'GET':
        const product = await ProductDatabase.getProductById(id);
        
        if (!product) {
          return res.status(404).json({ 
            success: false, 
            error: 'Product not found' 
          });
        }
        
        res.status(200).json({ success: true, data: product });
        break;

      case 'PUT':
        const updates = req.body;
        
        // Validate image field if provided
        if (updates.image && typeof updates.image !== 'string') {
          return res.status(400).json({ 
            success: false, 
            error: 'Image must be a valid URL string' 
          });
        }

        try {
          const updatedProduct = await ProductDatabase.updateProduct(id, updates);
          res.status(200).json({ success: true, data: updatedProduct });
        } catch (error) {
          if (error.message === 'Product not found') {
            return res.status(404).json({ 
              success: false, 
              error: 'Product not found' 
            });
          }
          throw error;
        }
        break;

      case 'DELETE':
        try {
          const deletedProduct = await ProductDatabase.deleteProduct(id);
          res.status(200).json({ 
            success: true, 
            data: deletedProduct,
            message: 'Product deleted successfully' 
          });
        } catch (error) {
          if (error.message === 'Product not found') {
            return res.status(404).json({ 
              success: false, 
              error: 'Product not found' 
            });
          }
          throw error;
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        res.status(405).json({ 
          success: false, 
          error: `Method ${method} Not Allowed` 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}