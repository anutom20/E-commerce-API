const productModel = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')

const getAllProducts = async(req,res)=>{

    try{

        const {name,color,brand,numericFilters, sort, fields} = req.query
        const queryObject = {}
   
        if(name){
            queryObject.name = {$regex:name, $options:'i'} 
        } 
        if(color) queryObject.color = color
        if(brand) queryObject.brand = brand
   
        if(numericFilters){
           const operatorMap = {
               '>':'$gt',
               '>=':'$gte',
               '=':'$eq',
               '<':'$lt',
               '<=':'$lte',
           }
           const regEx = /\b(>|>=|=|<|<=)\b/g
           let filters = numericFilters.replace(
               regEx,
               (match)=> `-${operatorMap[match]}-`
           )

           let valObj = {}
           filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-')
            valObj[operator] = Number(value)
            queryObject[field] = valObj 
             
           })
            
           
        }
   
        let result = productModel.find(queryObject)
        if(sort){
           const sortList = sort.split(',').join(' ')
           result = result.sort(sortList)
        }
   
        if(fields){
           const fieldsList = fields.split(',').join(' ')
           result = result.select(fieldsList)
        }
   
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page-1) * 10
   
        result = result.skip(skip).limit(limit)
        
        const products = await result
        res.status(StatusCodes.OK).json({products,count : products.length})
         
       
    }
     
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
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
        console.log(req.body)
        res.status(StatusCodes.CREATED).json({product})
    }
    catch(error){
        console.log(error)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:error.message})
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