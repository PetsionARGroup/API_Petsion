const httpError =(res, err) =>{
    console.log(err)
    res.status(500)
    res.send({error: ' Algo ocurrio'})
}
const unauthorizedError =(res, message) =>{
    console.log(message);
    res.status(401).send({error: 'No autorizado'});
}
const httpErrors = (res, statusCode, errorMessage) => {
    console.log(errorMessage);
    res.status(statusCode);
    res.send({ error: errorMessage });
};


module.exports= {httpError , unauthorizedError,httpErrors}