const qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

const client = new Client({
    authStrategy: new LocalAuth(),
});

const GENERAL_MESSAGE = `

🌟 Want to start your own online business?

🌟 Already sell on the internet?

🌟 Want to own an online store?

🔥 Boost your sales now with *Shopriqa*.

Sign up now to get started and be notified of the launch.

www.shopriqa.com

 `;

client.on("qr", (qr) => {
    // Generate and scan this code with your phone
    console.log("QR RECEIVED", qr);
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("Client is ready!");
    fetchGroups(client);
});

async function fetchGroups(client) {
    try {
        const allChats = await client.getChats();
        // console.log(allChats);
        allChats.forEach((chat) => {
            if (chat.isGroup) {
                analyze_group(chat.groupMetadata.id._serialized);
                console.log("Sleeping for 10 secs 😴😴");
                sleep(1000 * 10).then(() => {
                    // Do something after the sleep!
                });
            }
        });
    } catch (e) {
        console.error(e);
    }
}

client.on("message", (msg) => {
    // console.log("MESSAGE RECEIVED", msg);

    if (msg.body == "!ping") {
        msg.reply("pong");
    }
});

client.on("disconnected", (reason) => {
    console.log("Client was logged out", reason);
});

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function analyze_group(id) {
    let group = await client.getChatById(id);
    console.log("🤖 Analyzing ", group.name);
    console.log(
        group.name + " has " + group.groupMetadata.participants.length + " members"
    );

    // Ehmerfx Forex training
    if (group.name === 'Ehmerfx Forex training') {
        console.log("Skipping Ehmerfx Forex training");
    } else {
        // console.log("Shopriqa good to go.");
        let participants = group.groupMetadata.participants;

        participants.forEach((participant, count) => {
            // console.log("participant => ", participant.id);
            let number = participant.id._serialized;
            console.log("🚥Sending to ", number);

            // attach image and caption
            const img64 = fs.readFileSync("./flyer.jpeg", 'base64');
            const mediaMsg = new MessageMedia("image/jpeg", img64, { caption: '' });

            client
                .sendMessage(number, GENERAL_MESSAGE, {
                    media: mediaMsg,
                })
                .then((response) => {
                    console.log("✅ Sent to ", number, " 🚀");
                })
                .catch((err) => {
                    console.log("❌ Unable to send a message to ", number);
                    // console.log(err);
                })
                .finally(() => {
                    count += 1;
                    console.log(
                        "🧵 To go => ",
                        group.groupMetadata.participants.length - count,
                        " 🎡"
                    );
                    console.log("Sleeping for 1.5 secs 😴😴");
                    sleep(1500).then(() => {
                        // Do something after the sleep!
                    });
                });
        });
    }
}

client.initialize();