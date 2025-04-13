require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const { NewMessage } = require("telegram/events");

const keywords= ["SDE", "sde", "SDE 1", "SDE 2",
"Software Development Engineer", "Software Developer", "Software Engineer",
"Software Engineer 1", "Software Engineer 2",
"Frontend Developer", "Front End Developer", "Front-end Developer", "Front End Engineer", "Frontend Engineer", "Front-end Engineer",
"Backend Developer", "Back End Developer", "Back-end Developer", "Backend Engineer", "Back End Engineer", "Back-end Engineer",
"Fullstack Developer", "Full Stack Developer", "Full-stack Developer", "Fullstack Engineer", "Full Stack Engineer", "Full-stack Engineer",
"Web Developer", "Web Engineer", "Application Developer", "React", "React.js", "Reactjs",
"Next", "Nextjs", "Next.js",
"Node", "Node.js", "Nodejs",  "Frontend Intern", "Backend Intern", "Fullstack Intern","MERN",  "Full Stack", "Full Stack Web Developer","MERN Stack","JavaScript", "Java script", "JavaScript Developer", "Java script Developer",
"TypeScript", "Typescript Developer"]

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession('');
let teleConnected = false;
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const Wclient = new Client();
Wclient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    // console.log(qr);
})

Wclient.on('ready', async () => {
    console.log('Client is ready!');
});

const teleConnect = async () => {
    console.log("Connecting...");
    const Tclient = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });
    await Tclient.start({
        phoneNumber: async () => await input.text("Enter your phone number: "),
        password: async () => await input.text("Enter your password: "),
        phoneCode: async () => await input.text("Enter the code you received: "),
        onError: (err) => console.log(err),
    }).then(() => { teleConnected = true; });

    console.log("Telegeam logged in successfully");
    console.log(Tclient.session.save());
    Tclient.addEventHandler(async (event) => {
        const msg = event.message.message;
        if (keywords.some(word => msg.includes(word))) {
            await Wclient.sendMessage(process.env.GROUP_ID, msg).then(() => console.log("Message sent to whatsapp group"));
        }
        // console.log("Newi Tele message:", event.message.message);

    }, new NewMessage({}));

};
async function main() {
    await teleConnect();

    if (teleConnected) {
        Wclient.initialize();

    }

}
main();
