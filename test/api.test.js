const request = require ('supertest')
const should = require('should')
const assert = require('assert');

const app  = require ('../app');


describe('API Petsion', () => {
    // Test para probar los endopoint de usuario
    describe('get  /user / listar todos los usuarios', () => {
      it('debería devolver todos los usuarios', (done) => {
        request(app)
          .get('/user/') // ruta a probar
           .set('Accept' , 'application/json')
           .expect('Content-type', /json/)
           .expect(200, done)
          
          
      });
    });

    describe('get  /user / buscar usuario por id', () => {
        it('debería devolver un usuario por su id', (done) => {
          request(app)
            .get('/user/665e74a3deaf5bac065194dc') //aqui envio la ruta con un id valido
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(200, done)
            
            
        });
    });

    describe('get  /user / buscar usuario por id', () => {
        it('debería devolver un error por id invalido', (done) => {
          request(app)
            .get('/user/noexiste') // aqui envio la ruta con un id invalido
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(500)
             .end((err)=>{
                if(err) return done (err);
                done();
             })
            
            
        });
    });
    describe ("POST /user / register" , () =>{
        it("deberia responder 201", done => {
            request (app)
            .post('/user/register')
            .send({
                username: "pichic6ho6s5",
                password: "password1234",
                name: "John",
                lastname: "Doe",
                email: "pichichs66chichi@example.com",
                dni: "030368554785",
                fechaDeNacimiento: "1990-01-01",
                telefono: "123456789",
                codigoPostal: "12345"
            })
            .set('Accept', 'application/json')
            .expect(201)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    describe("POST /user/login", () => {
        it("deberia responder 200 al usar user y pass validos", done => {
            request(app)
                .post('/user/login')
                .send({
                    username: "pichicho6s5",
                    password: "password1234"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
    
                    // Verificaciones adicionales
                    try {
                        // Verifica que res.body.data exista y sea un objeto
                        should.exist(res.body.data);
                        res.body.data.should.have.property('token').which.is.a.String();
                        res.body.data.should.have.property('user').which.is.an.Object();
                        res.body.data.user.should.have.properties(['name', 'role', 'email']);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
    describe ("POST /user / login" , () =>{
        it("deberia responder 401 al usar contraseña incorrecta", done => {
            request (app)
            .post('/user/login')
            .send({
                username: "pichicho6s5",
                password: "6585485"  
            })
            .set('Accept', 'application/json')
            .expect(401)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    describe ("PUT /user / id:" , () =>{
        it("tiene que responder 401 sin autorizacion", done => {
            request (app)
            .put('/user/665e74a3deaf5bac065194dc')
            .send({
                username: "pichic6ho6s5",
                password: "password1234",
                name: "John",
                lastname: "Doe",
                email: "pichichs66chichi@example.com",
                dni: "030368554785",
                fechaDeNacimiento: "1990-01-01",
                telefono: "123456789",
                codigoPostal: "12345"
            })
            .set('Accept', 'application/json')
            .expect(401)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    describe ("PATCH /user / ID:" , () =>{
        it("tiene que responder 401 sin autorizacion", done => {
            request (app)
            .patch('/user/665e74a3deaf5bac065194dc')
            .send({
                username: "pichic6ho6s5",
                password: "password1234",
                name: "John",
                lastname: "Doe",
                email: "pichichs66chichi@example.com",
                dni: "030368554785",
                fechaDeNacimiento: "1990-01-01",
                telefono: "123456789",
                codigoPostal: "12345"
            })
            .set('Accept', 'application/json')
            .expect(401)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    // Test para probar los endopoint de Anfitrion
    describe('get  /anfitrion / listar todos los anfitriones', () => {
        it('debería devolver todos los anfitriones', (done) => {
          request(app)
            .get('/anfitrion/') 
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(200, done)
            
            
        });
    });
    describe('get  /anfitrion / buscar anfitrion por id', () => {
        it('debería devolver un anfitrion por su id', (done) => {
          request(app)
            .get('/anfitrion/667766731c702995ee9b87b7') // aqui cologo la ruta con un id valido
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(200, done)
            
            
        });
    });
    describe('get  /anfitrion / buscar anfitrion por id', () => {
        it('debería devolver un error por id invalido', (done) => {
          request(app)
            .get('/anfitrion/noexiste') // aqui coloco la ruta con un id invalido
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(500)
             .end((err)=>{
                if(err) return done (err);
                done();
             })
            
            
        });
    })
    describe('POST /anfitrion/login', () => {
        it('debería responder 200 al usar anfitrion y contraseña válidos', (done) => {
            request(app)
                .post('/anfitrion/login')
                .send({
                    username: "Knifucrab",
                    password: "PassPetsion123"
                })
                .set('Accept', 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
    
                    try {
                        assert.ok(res.body.data, 'Se esperaba que res.body.data esté definido');
                        assert.strictEqual(typeof res.body.data.token, 'string', 'Se esperaba que token sea un string');
                        assert.strictEqual(typeof res.body.data.anfitrion, 'object', 'Se esperaba que anfitrion sea un objeto');
                        assert.ok(res.body.data.anfitrion.name, 'Se esperaba que anfitrion tenga la propiedad name');
                        assert.ok(res.body.data.anfitrion.role, 'Se esperaba que anfitrion tenga la propiedad role');
                        assert.ok(res.body.data.anfitrion.email, 'Se esperaba que anfitrion tenga la propiedad email');
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    })
    describe ("POST /anfitrion / register" , () =>{
        it("deberia responder 201", done => {
            request (app)
            .post('/anfitrion/register')
            .send({
                username: "exampleuser",
                password: "securepassword123",
                name: "John",
                lastname: "Doe",
                email: "johndoe@example.com",
                dni: "1234655678",
                fechaDeNacimiento: "1990-01-01",
                telefono: "1234567890",
                direccion: "Main St",
                numeroDireccion: "123",
                codigoPostal: "10001",
                tipoDeVivienda: "casa",
                conPatio: true,
                distintoDueño: false,
                cantidadDeAnimales: 2,
                admitePerro: true,
                admiteGato: false,
                admitAlltypesMascotas: true,
                disponibilidadHoraria: "Fulltime",
                disponibilidadPaseo: true,
                disponibilidadVisita: true,
                disponibilidadAlojamiento: true,
                disponibilidadlunes: true,
                disponibilidadmartes: true,
                disponibilidadmiercoles: true,
                disponibilidadjueves: true,
                disponibilidadviernes: true,
                disponibilidadsabado: true,
                disponibilidaddomingo: true,
                tarifaBase: 50,
                cancelaciones: false
            })
            .set('Accept', 'application/json')
            .expect(201)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    //ahora probaremos los endpoints de mascotas
    describe ("POST /mascota / register" , () =>{
        it("deberia responder 201", done => {
            request (app)
            .post('/mascota/register')
            .send({
                user: "665e74a3deaf5bac065194dc",  
                tipoMascota: "Perro",
                nombre: "Papero",
                edad: 3,
                peso: 20
            })
            .set('Accept', 'application/json')
            .expect(201)
            .end(err => {
                if(err) return done(err);
                done();
            })
        })
    })
    //busca todas las mascotas que tengan asociada el id de un usuario dueño
    describe('POST  /mascota / LISTAR : ', () => {
        it('debería devolver una lista de mascotas por id de usuario', (done) => {
          request(app)
            .post('/mascota/listar')
            .send({
                user: "665e74a3deaf5bac065194dc"
            })
             .set('Accept' , 'application/json')
             .expect('Content-type', /json/)
             .expect(200, done)
            
            
        });
    });
});