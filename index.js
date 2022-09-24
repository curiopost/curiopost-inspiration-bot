require('dotenv').config()
const INSPIRATION_API = 'https://inspirobot.me/api?generate=true';
const CURIOPOST_CDN = 'https://cdn.curiopost.live';
const CURIOPOST_API = 'https://backend.curiopost.live'
const CURIOPOST_TOKEN = process.env.CURIOPOST_TOKEN;
const TIMEOUT = 3600000;//

const fetch = require("node-fetch");
const FormData = require('form-data');
const request = require('request');


async function getInspiration() {

    try {

const getInspiration = await fetch(INSPIRATION_API, {
    method: 'GET'
})

const data = await getInspiration.text()
return data;
} catch(e) {
    console.error(e)
    }
    

}

async function UploadtoCDN() { 
    try {
    const Inspiration = await getInspiration()
    const form = new FormData();
    form.append('attachment', request(Inspiration));
    const getURL = await fetch(CURIOPOST_CDN+"/upload", {method: 'POST', body: form})
    const data = await getURL.json()

    return data.url
    } catch(e) {
        console.error(e)
    }
        

   
}

async function UploadPost() {
    try {
    const attachment_url = await UploadtoCDN()

    const createPost = await fetch(CURIOPOST_API+"/api/create/post",{
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "token": CURIOPOST_TOKEN
        },
        body: JSON.stringify({
            title: "Inspirational Quote",
            content: "#motivation #inspiration #quotes #inspirationBOT",
            attachment_url: attachment_url,
            topics: ["inspiration", "motivation", "quotes", "#inspirationBOT"],
            mentions: []
        })
    })

    const data = await createPost.json()
    if(data.success) {
        console.log(`Created a post: ${data.url}`)
    } else {
        console.log(data)
    }
} catch(e) {
        console.error(e)
        }
        
}

setInterval(async() => {

    try {

    await UploadPost()
} catch(e) {
console.error(e)
}

}, TIMEOUT)


console.log("Bot has started!")
async function Authenticate() {

    try {
const getUser = await fetch(CURIOPOST_API+"/api/auth/getuser",{
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
        "token": CURIOPOST_TOKEN
    }
})

const data = await getUser.json()
if(!data.success) {
    console.error("Could not authenticate with p!uriopost, please check if your token is valid.")
    process.exit(1)
} else {
    console.log("Successfully authenticated with Curiopost!")
}
} catch(e) {
    console.error(e)
    process.exit(1)
    }
}

Authenticate()



