const httpError =(res, err) =>{
    console.log(err)
    res.status(500)
    res.send({error: ' Algo ocurrio'})
}
const unauthorizedError =(res, message) =>{
    console.log(message);
    res.status(401).send({error: 'No autorizado'});
}

module.exports= {httpError , unauthorizedError}