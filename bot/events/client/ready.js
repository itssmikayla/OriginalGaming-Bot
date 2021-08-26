    const Discord = require('discord.js');
    const { MessageEmbed } = require('discord.js');
    const { green_light } = require('../../colours.json');
    const { default_prefix } = require('../../botconfig.json');
    const fs = require('fs');

    module.exports = async bot => {
    console.log("-------------------------");
    console.log("    I AM READY TO GO     ");
    console.log("-------------------------");

    let loginchannel = bot.channels.cache.get('627846724609769491');

    let loginEmbed = new MessageEmbed()
    .setTitle('SUCCESSFULLY LOGGED IN')
    .setDescription('<:agree:782705809142448159> Bot is now online')
    .setColor(green_light);

    loginchannel.send(loginEmbed)

    // giveaways
    setInterval(() => {
        var fileName = 'giveawayData.json';
        var fileData = JSON.parse(fs.readFileSync(fileName).toString());

        Object.keys(fileData).forEach(async key => {
            if (Date.now() > fileData[key].end && fileData[key].stillgoing === true) {

                var winners = []
                var winnerString = ""

                try {
                    const embedSent = await bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).messages.fetch(fileData[key].messageID)

                    const peopleReactedBot = await embedSent.reactions.cache.get("🎉").users.fetch();
                    var peopleReacted = peopleReactedBot.array().filter(u => u.id !== bot.user.id);
                    var index

                } catch (e) {

                    return bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).send(`An unknown error happened during the draw of the giveaway **${fileData[key].item}** : ` + "`" + e + "`")
                }

                if (peopleReacted.length < fileData[key].winnersNumber) {
                    fileData[key].stillgoing = false
                    fs.writeFileSync(fileName, JSON.stringify(fileData, null, '\t'));
                    return bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).send(`Not enough participants to execute the draw of the giveaway **${fileData[key].item}**`);

                } else {
                    var lastIndex = 0

                    for (var z = 0; z < parseInt(fileData[key].winnersNumber); z++) {
                        if(winners.length == parseInt(fileData[key].winnersNumber)) break
                        for (var x = 0; x < peopleReacted.length; x++) {
                            if(winners.length == parseInt(fileData[key].winnersNumber)) break
                            
                            index = Math.floor(Math.random() * peopleReacted.length);

                            if (index == lastIndex) index = Math.floor(Math.random() * peopleReacted.length);
                            if (winners.includes(peopleReacted[index].id)) index = Math.floor(Math.random() * peopleReacted.length);
                            winnerString += "<@" + peopleReacted[index].id + "> "
                        }
                        winners.push(peopleReacted[index].id)
                        lastIndex = index
                    }

                }
                if (!winners) {
                    bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).send(`An unknown error happened during the draw of the giveaway **${fileData[key].item}**`);

                } else {
                    
                    bot.guilds.cache.get(fileData[key].guildID).channels.cache.get(fileData[key].channelID).send(`🎉 **${winnerString}**has won the giveaway **${fileData[key].item}** ! Congratulations ! 🎉`);

                    
                    fileData[key].lastWinners = winners
                    fileData[key].stillgoing = false
                    fs.writeFileSync(fileName, JSON.stringify(fileData, null, '\t'));
                }

            }

        })
    }, 1000);

    // status
    setInterval(function() {
     setTimeout(async() => {
        bot.user.setActivity(`${default_prefix}help | @Ultimate Power`, { type: 'PLAYING'})
        setTimeout(async() => {
            bot.user.setActivity(`DEV - ${bot.users.cache.get(`484448041609199620`).tag}`, { type: 'STREAMING', url: "https://www.twitch.tv/darealadalbert"})
            setTimeout(async() => {
                bot.user.setActivity(`${bot.users.cache.size} users!`, { type: 'LISTENING'})
                setTimeout(async() => {
                    bot.user.setActivity(`${bot.guilds.cache.size} servers!`, { type: 'WATCHING'})
                }, 10000)
            }, 5000)
        }, 10000)
    }, 20000)
    }, 46000)

}