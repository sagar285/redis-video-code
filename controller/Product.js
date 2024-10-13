const Product = require('../models/Product');
const client = require('../rediClient');


const ListingInRedis = async(products)=>{
    await client.del(`ListProduct`);
    for(const product of products){
        await client.rPush(`ListProduct` ,JSON.stringify(product))
    }
    await client.expire(`ListProduct` ,60*60*24)
}



exports.getAllProducts = async(req, res)=>{
    try{
        const products = await client.lRange(`ListProduct` ,0,1);  
        if(products.length > 0){
            return res.status(200).json(products.map(product => JSON.parse(product)));
        }
        const productsdata = await Product.find();
        await ListingInRedis(productsdata);
      
        res.status(200).json(productsdata);
    }catch(err){
        res.status(500).json({ message: err.message });
    }
}


exports.createProduct = async (req, res) => {
    const { name, price, quantity } = req.body;
    try {
        const product = await Product.create({ name, price, quantity });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// get product by id with redis caching
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const cachedProduct = await client.get(`product:${id}`);
        if (cachedProduct) {
            return res.status(200).json(JSON.parse(cachedProduct));
        }
        const product = await Product.findById(id);
        await client.set(`product:${id}` ,JSON.stringify(product))
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// delete product by id with redis caching
exports.deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        await client.del(`product:${id}`);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
