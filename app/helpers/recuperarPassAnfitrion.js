const USUARIO_MAIL = process.env.USUARIO_MAIL
const {transporter} = require ('../../config/mailer')

const enviarCorreoRecuperacionContraseña  = async (email, token) => {
    try {
        // Configura el correo electrónico
        const correoElectronico = {
            from: USUARIO_MAIL,
            to: email,
            subject: 'Recuperar contraseña',
            html: `<p>¡Hola recibimos tu solicitud para restablecer tu contraseña, por favor continua por el enlace</p>
                   <p>Token : ${token} </p>
                   <p><a href="http://localhost:3000/anfitrion/reset-password/${token}">Recuperar contraseña</a></p>`
        };

        // Envía el correo electrónico
        await transporter.sendMail(correoElectronico);
    } catch (error) {
        // Maneja cualquier error que ocurra al enviar el correo electrónico
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {enviarCorreoRecuperacionContraseña }