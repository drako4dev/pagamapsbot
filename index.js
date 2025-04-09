const { Client, GatewayIntentBits, ActivityType, REST, Routes } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// Cargar comandos Slash y normales
client.slashCommands = new Map();
client.commands = new Map();
const commands = [];
const commandsPath = path.join(__dirname, "commands");

fs.readdirSync(commandsPath).forEach(file => {
    if (file.endsWith(".js")) {
        const command = require(path.join(commandsPath, file));

        // Si es un comando Slash (tiene "data" y "execute")
        if (command.data && command.data.name && command.execute) {
            client.slashCommands.set(command.data.name, command);
            commands.push(command.data.toJSON()); // Guardar para registrar en Discord
        } 
        // Si es un comando normal
        else if (command.name && command.execute) {
            client.commands.set(command.name, command);
        } 
        else {
            console.log(`❌ El comando ${file} no está bien definido.`);
        }
    }
});

// Evento cuando el bot está listo
client.once("ready", async () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    console.log(`✅SI TE HAN VENDIDO ESTO TE HAN TIMAO✅`);

    // Registrar comandos Slash en Discord
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('📌 Registrando comandos Slash...');
        await rest.put(Routes.applicationGuildCommands(config.clientID, config.guildID), { body: commands });
        console.log('✅ Comandos Slash registrados correctamente.');
    } catch (error) {
        console.error('❌ Error al registrar los comandos Slash:', error);
    }
});

// Evento cuando un miembro se une al servidor
client.on('guildMemberAdd', async (member) => {
    if (member.guild.id === config.guildID) {
        const welcomeCommand = client.commands.get("welcome"); // Buscar comando normal
        if (welcomeCommand) {
            try {
                await welcomeCommand.execute(member);
            } catch (error) {
                console.error("❌ Error al ejecutar el comando welcome:", error);
            }
        }
    }
});

// Manejo de comandos Slash
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Error al ejecutar el comando:', error);
        await interaction.reply({ content: 'Hubo un error al ejecutar ese comando.', ephemeral: true });
    }
});

// Evento cuando el bot está listo
client.once("ready", async () => {
    console.log(`✅ Bot conectado como ${client.user.tag}`);
    
    const guild = client.guilds.cache.first(); // Obtiene el primer servidor donde está el bot
    if (!guild) return console.log("❌ No se encontró el servidor.");

    const updatePresence = async () => {
        try {
            const statuses = [
                "Reseña y Gana!!⭐"
            ];

            let index = 0;
            setInterval(() => {
                client.user.setPresence({
                    activities: [{ name: statuses[index], type: ActivityType.Watching }],
                    status: "dnd" // No molestar
                });
                index = (index + 1) % statuses.length;
            }, 5000); // Cambia cada 5 segundos
        } catch (error) {
            console.error("❌ Error al actualizar la presencia:", error);
        }
    };

    updatePresence();
});

// Manejo de comandos de prefijo (ejemplo con !)
client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!") || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;

    try {
        await command.execute(message, args);
    } catch (error) {
        console.error(`❌ Error al ejecutar ${commandName}:`, error);
        message.reply("Hubo un error al ejecutar el comando.");
    }
});

// Iniciar el bot con el token
client.login(config.token);
