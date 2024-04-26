const { response } = require('express');
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
    const queries = { ...req.query };
    // Tách các trường đặt biệt khỏi query
    const excludeFields = ["limit", "sort", "page", "fields"];
    excludeFields.forEach(el => delete queries[el]);

    // Format lại các operators cho đúng cú pháp của mongoose DB
    let queryString = JSON.stringify(queries);
    replacedQueryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEl => `$${matchedEl}`);
    const formatedQueries = JSON.parse(replacedQueryString); // chuyển thành obj
    
    // Filtering
    if(queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' }; // "regex" : tìm tất cả sp chỉ cần có 1 từ giống, "i" : ko phân biệt hoa thường
    let queryCommand = productModel.find(formatedQueries); // đang trong trạng thái pending

    // Sorting
    if(req.query.sort) {
        const sortBy = req.body.sort.split(',').join(' '); // split: chuỗi string -> array dựa theo dấu gì đó | join: ngược lại vs split
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if(req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1; // + : chuyển string => number
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS // limit : số obj được lấy về trong 1 lần gọi API
    const skip = (page - 1) * limit; // skip : số obj đc bỏ qua 
    queryCommand.skip(skip).limit(limit);

    // Run Query
    // Số lượng sp thoả điều kiện (counts) !== số lượng sp trả về 1 lần gọi API
    queryCommand.exec(async (err, response) => {
        if (err) throw new Error(err.message);
        const counts = await productModel.find(formatedQueries).countDocuments();
        return res.status(200).json({
            counts,
            success: response ? true : false,
            products: response ? response : "Cannot get products"
            
        });
    });     
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

