const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const balancePath = path.join(dataDir, "balance.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quitarsaldo")
        .setDescription("Quita saldo a un usuario")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("El usuario al que deseas quitar saldo")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("cantidad")
                .setDescription("Cantidad de saldo a quitar")
                .setRequired(true)
        ),

    async execute(interaction) {
        const ownerId = "1057306102326370314";

        if (interaction.user.id !== ownerId) {
            return await interaction.reply({
                content: "❌ No tienes permiso para usar este comando.",
                ephemeral: true,
            });
        }

        const targetUser = interaction.options.getUser("usuario");
        const cantidad = interaction.options.getInteger("cantidad");

        // Crear carpeta y archivo si no existen
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, JSON.stringify({}));

        const balanceData = JSON.parse(fs.readFileSync(balancePath, "utf8"));

        // Inicializar si no existe
        if (!balanceData[targetUser.id]) balanceData[targetUser.id] = 0;

        // Evitar que quede saldo negativo
        balanceData[targetUser.id] = Math.max(0, balanceData[targetUser.id] - cantidad);

        fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));

        const embed = new EmbedBuilder()
            .setTitle("💸 Saldo retirado")
            .setDescription(`Se han quitado **${cantidad}€** al usuario ${targetUser.tag}.`)
            .setColor("#ff0000")
            .setFooter({ text: "QUALITY | SHOP", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
