const productModel = require('../models/product.model');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify'); // bỏ dấu tạo tên đường dẫn

const createProduct = asyncHandler( async (req, res) => {
    if(Object.keys(req.body).length === 0) throw new Error('Missing inputs');
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title, {replacement: '-', lower: true});
    const newProduct = await productModel.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : "Cannot create new product"
    })
});

const getProduct = asyncHandler( async (req, res) => {
    const { pid } = req.params;
    // console.log(pid);
    const product = await productModel.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : "Cannot get product"
    }) 
});

const getAllProducts = asyncHandler( async (req, res) => {
    const products = await productModel.find();
    return res.status(200).json({
        success: products ? true : false,
        productsData: products ? products : "Cannot get products"
    })     
});

const updateProduct = asyncHandler( async (req, res) => {
    const { pid } = req.params;
    if(req.body && req.body.title) req.body.slug = slugify(req.body.title, {replacement: '-', lower: true});
    const updatedProduct = await productModel.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : "Cannot update product"
    })
});

const deleteProduct = asyncHandler( async ( req, res) => {
    const { pid } = req.params;
    const deletedProduct = await productModel.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : "Cannot delete product"
    }); 
});

module.exports = {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
}

