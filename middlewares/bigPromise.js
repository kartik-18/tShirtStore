// either we have to use try catch or async await or else use Promise everywhere..

module.exports = (func) => (req, res, next) => 
    Promise.resolve(func(req,res,next)).catch(next); //this is an functional programming

// we treaded func here as a variable we took func and passed it on.