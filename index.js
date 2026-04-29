const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = "!";
const TOKEN = "MTQ5ODg4NDg2NjM4NzczODc3NQ.Ggd2aD.TTHs8AnYxVkfus40SRb3Gm_niLAvauk1uZM088";
const CARGO_ADD = "1498882263906258944";
const CARGO_REMOVE = "1498882095416873021";
const CANAL_PERMITIDO = "1499006024508772464";

// 🔹 BOT ONLINE
client.on("clientReady", () => {
    console.log(`Logado como ${client.user.tag}`);
});

// 🔹 COMANDO
client.on("messageCreate", async (message) => {"1498882263906258944";
    if (message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const comando = args.shift().toLowerCase();

    if (comando === "liberar") {

        // ❌ Canal errado
        if (message.channel.id !== CANAL_PERMITIDO) {
            return message.reply("❌ Use este comando no canal correto!");
        }

        const nick = args[0];
        const codigo = args[1];

        if (!nick || !codigo) {
            return message.reply("Use: !liberar Nome_Sobrenome Código");
        }

        if (codigo.length !== 4) {
            return message.reply("❌ Código inválido!");
        }

        if (!fs.existsSync("./LiberadosWl")) {
            fs.mkdirSync("./LiberadosWl");
        }

        const caminho = `./LiberadosWl/${nick}.ini`;

        // ❌ Já liberado
        if (fs.existsSync(caminho)) {
            return message.reply("❌ Esse nick já foi liberado!");
        }

        // 📁 Criar arquivo
        fs.writeFileSync(caminho, `Nome=${nick}\nCodigo=${codigo}`);

        // 🔥 Remover código usado
        delete codigos[codigo];
        fs.writeFileSync("./codigos.json", JSON.stringify(codigos, null, 2));

        const membro = message.member;

        // 🔻 Remove cargo antigo
        if (membro.roles.cache.has(CARGO_REMOVE)) {
            await membro.roles.remove(CARGO_REMOVE);
        }

        // 🔺 Adiciona novo cargo
        await membro.roles.add(CARGO_ADD);

        // 🕒 Data e hora
        const agora = new Date();
        const hora = agora.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
        const data = agora.toLocaleDateString("pt-BR");

        // 🧾 Avatar do usuário
        const avatar = message.author.displayAvatarURL({ dynamic: true });

        // 🎉 EMBED BONITA
        const embed = new EmbedBuilder()
            .setTitle("🎉 WHITELIST APROVADA")
            .setColor("#00ff88")
            .setThumbnail(avatar)
            .setDescription("Sua conta foi liberada com sucesso 🚀")
            .addFields(
                { name: "👤 Nick", value: `\`${nick}\``, inline: true },
                { name: "🔑 Código", value: `\`${codigo}\``, inline: true },
                { name: "⏰ Horário", value: `\`${hora} - ${data}\``, inline: false },
                { name: "📌 Status", value: "```diff\n+ Conta liberada\n```", inline: false }
            )
            .setFooter({ text: `Liberado por ${message.author.username}` })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
});

client.login(TOKEN);
