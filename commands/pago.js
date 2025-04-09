const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pago")
        .setDescription("Informa que los pagos ya han sido realizados (solo autorizado)."),

    async execute(interaction) {
        const allowedUserId = "1057306102326370314";
        const targetChannelId = "1358891462921814016";

        if (interaction.user.id !== allowedUserId) {
            return interaction.reply({ content: "❌ No tienes permiso para usar este comando.", ephemeral: true });
        }

        const channel = await interaction.client.channels.fetch(targetChannelId);

        if (!channel || !channel.isTextBased()) {
            return interaction.reply({ content: "❌ No se pudo encontrar el canal o no es un canal de texto.", ephemeral: true });
        }

        await channel.send("YA ESTÁN TODOS LOS PAGOS REALIZADOS @everyone");

        await interaction.reply({ content: "✅ Mensaje enviado correctamente.", ephemeral: true });
    }
};
