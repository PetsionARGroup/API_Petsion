const {transporter} = require ('../../config/mailer')
const USUARIO_MAIL = process.env.USUARIO_MAIL

const enviarCorreoReserva = async (email ) => {
    try {
        // Configura el correo electrónico
        const correoElectronico = {
            from: USUARIO_MAIL,
            to: email,
            subject: 'Reserva creada exitosamente',
            html: `<p>Hola, tu reserva fue rechazada , por favor selecciona un nuevo cuidador. Lamentamos las molestias! </p>`
        };
        // Envía el correo electrónico
        await transporter.sendMail(correoElectronico);
    } catch (error) {
        // Maneja cualquier error que ocurra al enviar el correo electrónico
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {enviarCorreoReserva}