const productModel = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

const getAllProducts = async(req,res)=>{

    try{
        const product = await productModel.find({})
        res.status(StatusCodes.OK).json({prod: product,count : product.length})
    }
    catch(error){
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong, please try again!"})
    }
    

}


const getSingleProduct = async(req,res)=>{
    const productId = req.params.id
    const product = await productModel.findOne({_id:productId})
    if(!product) throw new NotFoundError(`No product with id : ${productId}`)
    res.status(StatusCodes.OK).json(product)   
    
}


const AddProduct = async(req,res)=>{
    try{
        const product = await productModel.create(req.body)
        res.status(StatusCodes.CREATED).json({product})
    }
    catch(error){
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Something went wrong, please try again!"})
    }
}


const UpdateProduct = async(req,res)=>{
    const productId = req.params.id
    const {name, price} = req.body
    if(name == '' || !price){
        throw new BadRequestError('name and price cannot be empty')
    }
    const product = await productModel.findByIdAndUpdate({_id:productId}, req.body, {new:true, runValidators:true})
    if(!product) throw new NotFoundError(`No product with id : ${productId}`)
    res.status(StatusCodes.OK).json(product)   
    

}


const DeleteSingleProduct = async(req,res)=>{

    const productId = req.params.id
    const product = await productModel.findByIdAndRemove(productId)
    if(!product) throw new NotFoundError(`No product with id : ${productId}`)
    res.status(StatusCodes.OK).json({message : `Item with product id : ${productId} deleted successfully!`})   
    
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    AddProduct,
    UpdateProduct,
    DeleteSingleProduct
}