const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const balancePath = path.join(dataDir, "balance.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("versaldo")
        .setDescription("Muestra el saldo de otro usuario (solo para el owner)")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("El usuario del que deseas ver el saldo")
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

        // Crear carpeta y archivo si no existen
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, JSON.stringify({}));

        const balanceData = JSON.parse(fs.readFileSync(balancePath, "utf8"));
        const saldo = balanceData[targetUser.id] || 0;

        const embed = new EmbedBuilder()
            .setTitle("💰 Saldo del usuario")
            .setDescription(`**${targetUser.tag}** tiene **${saldo}€**.`)
            .setColor("#ffffff")
            .setFooter({ text: "QUALITY | SHOP", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
