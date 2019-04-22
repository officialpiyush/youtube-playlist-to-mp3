/* eslint-disable no-console */
const playlistLoader = require("youtube-playlist");
const fs = require("fs");
const cmd = require("node-cmd");
const config = require("../config");

// eslint-disable-next-line prefer-const
let names = [],
    i,
    urls = []; // eslint-disable-line prefer-const

getPlaylist(config.playlist);

function fsThings() {
    if (!fs.existsSync("./mp3")) {
        fs.mkdirSync("./mp3");
        console.log("Folder Created!");
    }
    if (!fs.existsSync("./dl.sh")) {
        fs.writeFileSync("dl.sh", "", err => console.error(err)); //eslint-disable-line
        cmd.run("chmod 777 ./dl.sh");
        console.log("File created!");
    }

    const file = fs.createWriteStream("dl.sh", { flags: "a" });
    for (i = 0; i < urls.length; i++) {
        file.write(
            `\nytdl ${urls[i]} | ffmpeg -i pipe:0 -b:a 192K -vn ./mp3/"${names[i]}.mp3"`
        );
        console.log(`Wrote "${names[i]}"`);
    }
}

async function getPlaylist(url) {
    await playlistLoader(url, "url").then(res =>
        res.data.playlist.forEach(element => {
            urls.push(element);
        })
    );

    await playlistLoader(url, "name").then(res =>
        res.data.playlist.forEach(element => {
            names.push(element);
        })
    );
    
    await names.forEach(name => name.replace("\"" , ""));

    await fsThings();
}
