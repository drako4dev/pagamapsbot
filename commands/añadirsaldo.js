const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const balancePath = path.join(dataDir, "balance.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("añadirsaldo")
        .setDescription("Agrega saldo a un usuario")
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("El usuario al que deseas agregar saldo")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("cantidad")
                .setDescription("Cantidad de saldo a agregar")
                .setRequired(true)
        ),

    async execute(interaction) {
        const ownerId = "1057306102326370314";

        // Verifica si el usuario que usa el comando es el autorizado
        if (interaction.user.id !== ownerId) {
            return await interaction.reply({
                content: "❌ No tienes permiso para usar este comando.",
                ephemeral: true,
            });
        }

        const targetUser = interaction.options.getUser("usuario");
        const cantidad = interaction.options.getInteger("cantidad");

        // Crear carpeta si no existe
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
        if (!fs.existsSync(balancePath)) fs.writeFileSync(balancePath, JSON.stringify({}));

        const balanceData = JSON.parse(fs.readFileSync(balancePath, "utf8"));

        // Sumar saldo
        if (!balanceData[targetUser.id]) balanceData[targetUser.id] = 0;
        balanceData[targetUser.id] += cantidad;

        fs.writeFileSync(balancePath, JSON.stringify(balanceData, null, 2));

        const embed = new EmbedBuilder()
            .setTitle("✅ Saldo agregado")
            .setDescription(`Se han agregado **${cantidad}€** al usuario ${targetUser.tag}.`)
            .setColor("#00ff00")
            .setFooter({ text: "PagaMaps", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
