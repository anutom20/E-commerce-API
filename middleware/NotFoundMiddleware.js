
const notFound = (req,res)=>{
    res.status(404).send('<h1>this route does not exist</h1>')
}

module.exports = notFound