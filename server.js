const Discord = require("discord.js"),
      client = new Discord.Client(),
      profanitylist = require('profanity.json'),
      db = require('./db.js'),
      config = require('./config.js');

client.login(config.clientkey);

{ //variables on start
  var commandVariable = "b";
  var serverid1, serverid2, nsfwChannel, server2emojis;
  var blacklist = ['nigg', 'neger', 'nibba', 'bibba', 'blackie', 'watermelon', 'kfc', 'nibbers'];
  var admins = [];
  var banned = [];
  var emojisArray;
  var guildsArray;
  var irohArray = [
    "Life happens wherever you are, whether you make it or not.",
    "Yes, you have. You struggled. You suffered. But you have always followed your own path. You’ve restored your own honor. And only *you* can restore the honor",
    'You know, destiny is a funny thing. You never know how things are going to work out. But if you keep an open mind and an open heart, I promise you will find your own destiny someday.',
    'We have a chance for a new life here. If you start stirring up trouble, we could lose all the good things that are happening for us.',
    'There’s nothing wrong with a life of peace and prosperity. I suggest you think about what it is that you want from your life, and why.',
    'I’M BEGGING YOU, it’s time for you to look inward and start asking yourself the big question: who are you and what do YOU want?',
    'Are you so busy fighting you cannot see your own ship has set sail?',
    'You sound like my nephew. Always thinking you need to do things on your own without anyone’s support.',
    'There is nothing wrong with letting people who love you, help you. Not that I love you. I just met you.',
    'A man needs his rest.',
    'Sometimes the best way to solve your own problems is to help someone else.',
    'Many things that seem threatening in the dark Become welcoming when we shine light on them.',
    'You are not the man you used to be. You are stronger and wiser and freer than you ever used to be. And now you have come at the crossroads of the destiny. Its time for you to choose. Its time for you to choose good.',
    'Air is the element of freedom. The Air Nomads detached themselves from worldly concerns, and they found peace and freedom. [pause] And they apparently had great senses of humor.',
    'Earth is the element of substance. The people of the Earth Kingdom are diverse and strong. They are persistent and enduring.',
    'Fire is the element of power. The people of the Fire Nation have desire and will, and the energy and drive to achieve what they want.',
    'Water is the element of change. The people of the Water Tribes are capable of adapting to many things. They have a sense of community and love that holds them together through anything.',
    'It is important to draw wisdom from different places. If you take it from only one place it become rigid and stale.',
  ]
  var irohArrayDone = [];
}


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  //get banned users
  db.query("select * from banned", function (error, results, fields) {
    if (error) throw error;
    for (var i in results) {
      banned.push(results[i].userid);
    }
  });

  // get admins
  db.query("select * from admins", function (error, results, fields) {
    if (error) throw error;
    for (var i in results) {
      admins.push(results[i].userid);
    }
  });



  guildsArray = client.guilds.array();



  for (var i in guildsArray) {
    emojisArray += guildsArray[i].emojis.array();
    var query = 'CREATE TABLE if not exists `' + guildsArray[i].id + '` ( ' +
    `id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    emoji VARCHAR(30) NOT NULL UNIQUE,
    uses int(6) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='user data';`;

    db.query(query, function (error, results, fields) {
      if (error) throw error;
    });

    for (var x in guildsArray[i].emojis.array()) {
      var query = 'INSERT ignore INTO `'+ guildsArray[i].id + '`(emoji, uses) VALUES ("'+ guildsArray[i].emojis.array()[x].name + '",0)';
      db.query(query, function (error, results, fields) {
        if (error) throw error;
      });
    }
  }

  for (var i in guildsArray) {
    db.query('insert ignore into servers(serverid) values("' + guildsArray[i].id + '")')
  }

  /*
  var output;

  for (var x in guildArray) {
    output = "";
    for (var y in guildArray[x].emojis.array()) {
      output += guildArray[x].emojis.array()[y].name + ", ";
    }
    console.log(output);
  }*/

  serverid1 = client.guilds.get("149956512809222145");
  serverid2 = client.guilds.get("364155467984797708");
  server2emojis = client.guilds.find("id",'364155467984797708').emojis.array();

  nsfwChannel = client.channels.get("364167626357997568");
  nsfwChannel2 = client.channels.get("364185061152653326");
});

client.on('guildMemberAdd', member =>{
  const channel = member.guild.channels.get('222976879357853696');
  console.log(channel);
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to hell, ${member}`);
});

client.on('message', msg => {
  for (var i in banned) {
    if (msg.author.id == banned[i]) return;
  }

  if(msg.guild == null){
    if(msg.author.id !== "149956737171062785"){
      msg.author.send('fuck off fag');
    } else {
      //client.guilds.find("id", "241920499733495808").channels.array()[0].send("fag");
    }
    return;
  }

  if(msg.author.bot) return;

  for (var i in guildsArray) {
    if(guildsArray[i].id == msg.guild.id){
      for (var y = 0; y < msg.guild.emojis.array().length; y++) {
        if(msg.content.indexOf(":" + msg.guild.emojis.array()[y].name + ":") !== -1){
          var query = 'UPDATE `' + guildsArray[i].id + '` SET `uses`=uses + 1 WHERE emoji="' + msg.guild.emojis.array()[y].name + '"';
          db.query(query, function (error, results, fields) {
            if (error) throw error;
          });
        }
      }
    }
  }

    if (msg.channel  === client.channels.get("364167626357997568")){

      try {
        nsfwChannel2.send(msg.content);
        nsfwChannel2.send(msg.attachments.first().url);
      }
      catch(err) {

      }
    }

    if(msg.content.toLowerCase().indexOf("why is life hard") !== -1){
      //const emoji = serverid1.emojis.find("name", "feelsgladman");
      //msg.reply('It will get better fam ' + emoji);

      if(irohArray && irohArray.length){
      } else {
        irohArray = irohArrayDone;
        irohArrayDone = [];
      }

      var random = Math.floor(Math.random()*irohArray.length);
      msg.reply(irohArray[random]);
      irohArrayDone.push(irohArray[random]);
      irohArray.splice(random, 1);
    }

    if(msg.isMemberMentioned(client.users.get(client.user.id))){
      var stuff = msg.content.replace('<@' + client.user.id + '>', "");
      msg.reply("Stop that " + serverid1.emojis.find("name", "monkas"));
    }

    if (msg.content[0]  === 'b') {

      if(msg.content === 'bsignmeupfam'){
        msg.channel.send('Aint shit for you to sign up.');
      }

      if(msg.content === 'bmusic'){
        // Only try to join the sender's voice channel if they are in one themselves
        if (msg.member.voiceChannel) {
          msg.member.voiceChannel.join()
            .then(connection => { // Connection is an instance of VoiceConnection

            })
            .catch(console.log);
        } else {
          msg.reply('You need to join a voice channel first!');
        }
      }

      if(msg.content.substring(0,"blacklist".length) === 'blacklist'){
        var output = '```';
        for (var i = 0; i < blacklist.length; i++) {
          output += '[' + blacklist[i] + '], ';
        }
        output += '```';
        msg.channel.send(output);
      }

      if(msg.content === 'bNSFW'){
        let role = msg.guild.roles.find("name", "nsfw");

        // Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
        let member = msg.member;

        // or the person who made the command: let member = message.member;

        // Add the role!
        member.addRole(role).catch(console.error);
      }

      //wtf am I doing with my life.
      if(msg.content === 'bprofanity'){
        var output = "";
        for (var i = 0; i < 5; i++) {
          output += profanitylist[Math.floor(Math.random()*profanitylist.length)] + " ";
        }
        msg.reply(output);
      }

      if(msg.content === 'btopemojis'){
        var top = "";
        var worst = "";
        var query = "select emoji, uses from `" + msg.guild.id + "` ORDER BY uses desc limit 10;";
        var query2 = "select emoji, uses from `" + msg.guild.id + "` ORDER BY uses asc limit 10";

        db.query(query+query2, [1,2], function(err, results){
          if(err) throw err;
          for (var i in results[0]) {
            top += msg.guild.emojis.find("name", results[0][i].emoji) + " `" + results[0][i].uses + '` ';
          }
          for (var i in results[1]) {
            worst += msg.guild.emojis.find("name", results[1][i].emoji) + " `" + results[1][i].uses + '` ';
          }
          msg.channel.send({embed: {
            color: 0x00ffff,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL
            },
            description: "It's ya boi from the hoods with them numbers.",
            fields: [{
              name: "Top 10",
              value: top,
            },
            {
              name: "Worst 10",
              value: worst,
            }],
          }});
        })
      }

      if(msg.content === 'bleaveNSFW'){
        let role = msg.guild.roles.find("name", "nsfw");

        // Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
        let member = msg.member;

        // or the person who made the command: let member = message.member;

        // Add the role!
        member.removeRole(role).catch(console.error);
      }

      if(msg.content === 'btest'){
        console.log(admins);
        console.log(banned);
      }

      if(msg.content.substring(0,10) === 'bmememeup '){
        var message = msg.content.substring(10,msg.content.length);
        var output = "";
        for(var i = 0; i < message.length; i++){
          if(i %2){
            output+= message[i];
          } else {
            output+= message[i].toUpperCase();
          }
        }
        msg.channel.send(output);
      }

      { //Help function
        if(msg.content === 'bhelp'){
          msg.channel.send(
            [
              'Massive-Slave is made and hosted by Tenasow.',
              'Current Version: 0.0.1 Alpha',
              '',
              'Commands:',
              '```',
              'bNSFW - you know :^)',
              'bleaveNSFW - :(',
              'blacklist - shows the list of trigger words.',
              'bsignmeupfam - Signs you up? But for what? Mystery!',
              'bmememeup - Mocking spongebob meme',
              "bprofanity - If you're not creative with insults.",
              'why is life hard - For all of you bipolar retards',
              "btopemojis - show top emojis, like what do you fucking expect",
              "badmin - hey man, only the admins will now this one",
              '```',
            ]
          );
        }
      }
    }


    //admin Commands
    // ADMIN COMMANDS
    for (var i in admins) {
      if(msg.author.id == admins[i]){
        if(msg.content === 'badmin'){
          msg.channel.send(
            [
              '```',
              'banned @user - bans the user from the bot',
              'promote @user - makes the user an admin',
              '```',
            ]
          );
        }
        if(msg.content.substring(0,7) === "banned " && msg.isMemberMentioned){
          db.query('insert ignore into banned(userid) values("' + msg.mentions.users.array()[0].id + '")', (error, results)=>{
            if(error){
              throw error;
            } else {
              banned.push(msg.mentions.users.array()[0].id)
            }
          });
        }
        if(msg.content.substring(0,8) === "promote " && msg.isMemberMentioned){
          db.query('insert ignore into admins(userid) values("' + msg.mentions.users.array()[0].id + '")', (error, results)=>{
            if(error){
              throw error;
            } else {
              msg.channel.send("oh " + serverid1.emojis.find("name", "monkas"));
              admins.push(msg.mentions.users.array()[0].id)
            }
          });
        }
      }
    }

    if (msg.content == 'bNSFW') {
      var emoji = serverid1.emojis.find("name", "cmonbruh");
      msg.channel.send("come back when you're older " + emoji);
    }
});

client.on('messageReactionAdd', (msg, user)=>{
  if (msg.me) return;
  if(msg.emoji.guild == null) return;
  for (var i in guildsArray) {
    if(guildsArray[i].id == msg.emoji.guild.id){
      var query = 'UPDATE `' + guildsArray[i].id + '` SET `uses`=uses + 1 WHERE emoji="' + msg.emoji.name + '"';
      db.query(query, function (error, results, fields) {
        if (error) throw error;
      });
    }
  }
});

client.on('messageReactionRemove', (msg, user)=>{
  if (msg.me) return;
  if(msg.emoji.guild == null) return;
  for (var i in guildsArray) {
    if(guildsArray[i].id == msg.emoji.guild.id){
      var query = 'UPDATE `' + guildsArray[i].id + '` SET `uses`=uses - 1 WHERE emoji="' + msg.emoji.name + '"';
      db.query(query, function (error, results, fields) {
        if (error) throw error;
      });
    }
  }
});

client.on('message', (msg)=>{
  // blacklist start
  var string = msg.content.toLowerCase();
  var racistFound = 0;

  for (var i = 0; i < blacklist.length; i++) {
    if (string.indexOf(blacklist[i]) !== -1) {
      racistFound = 1;
    }
  }

  if (racistFound === 1 && msg.author.id !== client.user.id) { // ADD EMOJIS
    var arraything = [];
    for (var i = 0; i < server2emojis.length; i++) {
      arraything.push(i);
    }
    shuffleArray(arraything);
    for (var i = 0; i < 5; i++) {
      msg.react(server2emojis[arraything[i]]);
    }
    racistFound = 0;
  }
});

//shit i stole from the internet. Array randomizing based off fisher-yates algorithm.
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
