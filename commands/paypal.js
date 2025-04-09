const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("paypal")
        .setDescription("Envía tu correo de PayPal para recibir el pago.")
        .addStringOption(option =>
            option.setName("correo")
                .setDescription("Tu correo de PayPal (debe ser Gmail)")
                .setRequired(true)
        ),

    async execute(interaction) {
        const correo = interaction.options.getString("correo");
        const user = interaction.user;

        // Validación rápida del correo
        if (!correo.endsWith("@gmail.com")) {
            return await interaction.reply({
                content: "❌ El correo debe ser de Gmail.",
                ephemeral: true
            });
        }

        const canalDestino = await interaction.client.channels.fetch("1358888544013254758");
        if (!canalDestino || !canalDestino.isTextBased()) {
            return await interaction.reply({
                content: "❌ No se pudo encontrar el canal de destino.",
                ephemeral: true
            });
        }

        await canalDestino.send(`${correo} [${user.username}]`);

        await interaction.reply({
            content: "✅ Tu correo ha sido enviado correctamente.",
            ephemeral: true
        });
    }
};
