module.exports = {
    name: 'ban',
    description: 'This command bans a member!',
    execute(message, args) {
        const member = message.mentions.users.first();
        if (message.member.permissions.has('BAN_MEMBERS')) {
            if (member) {
                const memberTarger = message.guild.members.cache.get(member.id);
                memberTarger.ban();
                message.channel.send(member.toString() + '  has been baned, sir!');
            }
            else {
                message.channel.send('Errrrror');
            }
        }
        else {
            message.channel.send('Sorry, but you don\'t have the \"Ban Members\" permission');
        }
    }
}