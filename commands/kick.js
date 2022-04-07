module.exports = {
    name: 'kick',
    description: 'This command kicks a member!',
    execute(message, args) {
        const member = message.mentions.users.first();
        if (message.member.permissions.has('KICK_MEMBERS')) {
            if (member) {
                const memberTarger = message.guild.members.cache.get(member.id);
                memberTarger.kick();
                message.channel.send(member.toString() + '  has been kicked, sir!');
            }
            else {
                message.channel.send('Errrrror');
            }
        }
        else {
            message.channel.send('Sorry, but you don\'t have the \"Kick Members\" permission');
        }
    }
}