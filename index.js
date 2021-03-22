const { Client } = require('discord.js');
const nat = new Client();
const natcolor = require('chalk');
const config = require('./config.json');

nat.once(`ready`, () => {
    console.log(`${nat.user.tag} is now online.`)
    if (config.autorole.debug) return console.log(natcolor.green `[DEBUG] ` + natcolor.white `The bot is now online and watching new users join!`)
});

nat.on('guildMemberAdd', (member) => {
    if (member.user.bot) return;
    config.autorole.roles.forEach(async(role) => {
        let rr = member.guild.roles.cache.get(role);
        if (!rr && config.autorole.debug) return console.log(natcolor.red `[ERROR] ` + natcolor.white `You have an invalid role in the config. Role is "${role}"`)
        let awaitmsg = await member.roles.add(rr.id).catch(err => {
            if (err && config.autorole.debug) return console.log(natcolor.red `[ERROR] ` + natcolor.white `I was not able to add a role to ${member.user.tag}. This may be because the role is higher then my heighst role`);
        })
        if (awaitmsg === undefined) return;
        console.log(natcolor.green `[DEBUG] ` + natcolor.white `I have added "${rr.id} | ${rr.name}" to ${member.user.tag} | ${member.user.id}`)
    })
})

nat.login(config.token).catch(e => {
    if (e && config.autorole.debug) {
        console.log(natcolor.red `[ERROR]` + natcolor.white ` You have an invalid token in the config.`);
        process.exit()
    } else {
        throw e;
    }
})