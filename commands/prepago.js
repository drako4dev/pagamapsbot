const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prepago")
        .setDescription("Envía un recordatorio de pago a todos los canales que empiecen con ticket."),
    
    async execute(interaction) {
        const allowedUserId = "1057306102326370314";

        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
        }

        await interaction.deferReply({ ephemeral: true });

        const guild = interaction.guild;

        const canalesTicket = guild.channels.cache.filter(c =>
            c.type === 0 && // Texto
            c.name.startsWith("ticket")
        );

        if (canalesTicket.size === 0) {
            return interaction.editReply("❌ No se encontraron canales que empiecen con 'ticket'.");
        }

        const mensaje = `Buenas, envía tu PayPal para ser pagado con el comando /paypal.\nSi antes de mañana no lo tengo, tu pago no será enviado.\n||@here||`;

        let enviados = 0;

        for (const [id, canal] of canalesTicket) {
            try {
                await canal.send(mensaje);
                enviados++;
            } catch (error) {
                console.error(`❌ Error al enviar mensaje en ${canal.name}:`, error);
            }
        }

        await interaction.editReply(`✅ Mensaje enviado en **${enviados}** canal(es) de ticket.`);
    }
};
