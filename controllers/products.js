
const getAllProducts = async(req,res)=>{
    res.send('get all products')
}


const getSingleProduct = async(req,res)=>{
    res.send('get Single product')
}


const AddProduct = async(req,res)=>{
    res.send('Add product')
}


const UpdateProduct = async(req,res)=>{
    res.send('Update product')
}


const DeleteSingleProduct = async(req,res)=>{
    res.send('delete single product')
}

module.exports = {
    getAllProducts,
    getSingleProduct,
    AddProduct,
    UpdateProduct,
    DeleteSingleProduct
}