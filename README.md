# Candy Bot
Candy Bot is a Discord user app that is focused on providing useful and fun features / commands to discord users.

## Why user apps?
Simply put, traditional bots are limited in the way that you can only use their features inside of a server that they are in. User apps are different and can be used in any server / dm that you are in. However, servers can still choose to block user apps if they wish to do so in which case the app will not be able to send messages in that server with it simply becoming private instead.

## Okay cool but how do I use it?
To use the app, you must first either invite it to a server or add it to your account using the following links: [Server](https://discord.com/oauth2/authorize?client_id=1270311327767855137&integration_type=0&scope=applications.commands) | [User](https://discord.com/oauth2/authorize?client_id=1270311327767855137&integration_type=1&scope=applications.commands)<br/>

Then you can simply just type `/` in any server or dm that you are in and you will be able to use the app's commands. <br/>
<sup>Note: The app will be available anyone in your server will be able to use it but not outside the server</sup>

## Commands
- `/ping` - Checks if the app is online and its latency
- `/help` - Shows a list of all the commands that the app has
- `/rp` - Roleplay commands
  - `/rp kill` - Kills a user

# Future plans
## Context menus ("Apps >" menu)
- Details
- Modify

# Developer stuff
## Self hosting
- Set up a discord bot application and get the token
- Clone the repo
- Run `npm install`
- Fill in .env.example and rename it to .env
- Run index.js through whatever method you want (e.g. `node index.js`)
- Tada! You have your own instance of the bot running

## Contributing
Wow thanks for wanting to contribute! Just open a pull request and I'll take a look at it when I can. If you have any questions, feel free to ask in the issues section.

## License
This project is fairly basic so I don't really care what you do with it. Just don't claim it as your own and we're good. If you want to use it for something, go ahead. If you want to modify it, go ahead. If you want to sell it, don't. This is meant to be free but apart from that I'm chill with most things.