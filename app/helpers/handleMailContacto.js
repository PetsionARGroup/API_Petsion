const USUARIO_MAIL = process.env.USUARIO_MAIL
const {transporter} = require ('../../config/mailer')

const enviarCorreoContacto = async (email , mensaje) => {
    try {
        // Configura el correo electrónico
        const correoElectronico = {
            from: USUARIO_MAIL,
            to: email,
            subject: 'Consulta creada exitosamente',
            html: `<p>¡Hola, registramos tu consulta en breve alguien de nuestro equipo se pondra en contacto contigo </p>`
        };
        const correoNotificacion = {
            from: USUARIO_MAIL,
            to: USUARIO_MAIL,
            subject: `Consulta de ${email}`,
            html: `<p>¡Tienes una nueva consulta activa de ${email} </p>
            <p>mensaje : 
            ${mensaje}</p>`
        };
        // Envía el correo electrónico
        await transporter.sendMail(correoElectronico);
        await transporter.sendMail(correoNotificacion);
    } catch (error) {
        // Maneja cualquier error que ocurra al enviar el correo electrónico
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {enviarCorreoContacto}