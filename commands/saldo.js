const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const balancePath = path.join(dataDir, "balance.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("saldo")
        .setDescription("Muestra tu saldo actual"),

    async execute(interaction) {
        const userId = interaction.user.id;

        // Asegurarse de que la carpeta `data` existe
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        // Asegurarse de que el archivo balance.json existe
        if (!fs.existsSync(balancePath)) {
            fs.writeFileSync(balancePath, JSON.stringify({}));
        }

        // Leer los datos de saldo
        const balanceData = JSON.parse(fs.readFileSync(balancePath, "utf8"));

        // Si el usuario no tiene saldo, se le asigna 0
        const saldo = balanceData[userId] || 0;

        // Crear embed de respuesta
        const embed = new EmbedBuilder()
            .setTitle("💰 Tu Saldo")
            .setDescription(`Tienes **${saldo}€** disponibles en tu cuenta.`)
            .setColor("#00FF00")
            .setFooter({ text: "QUALITY | SHOP", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
