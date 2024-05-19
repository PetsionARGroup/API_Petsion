const USUARIO_MAIL = process.env.USUARIO_MAIL
const {transporter} = require ('../../config/mailer')

const enviarCorreoConfirmacionAnfitrion = async (email, token) => {
    try {
        // Configura el correo electrónico
        const correoElectronico = {
            from: USUARIO_MAIL,
            to: email,
            subject: 'Confirmación de cuenta',
            html: `<p>¡Gracias por registrarte! Por favor haz clic en el siguiente enlace para confirmar tu cuenta:</p>
                   <p><a href="https://api-petsion.onrender.com/anfitrion/confirmar/${token}">Confirmar cuenta</a></p>`
        };

        // Envía el correo electrónico
        await transporter.sendMail(correoElectronico);
    } catch (error) {
        // Maneja cualquier error que ocurra al enviar el correo electrónico
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {enviarCorreoConfirmacionAnfitrion}