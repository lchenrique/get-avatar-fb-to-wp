const puppeteer = require('puppeteer');
const Fs = require('fs');
const Path = require('path');
const Axios = require('axios');


const avatar = async (user, pass) => {
    let browser = await puppeteer.launch({
        defaultViewport:{width:1400, height:800},
        timeout:50000,
        args: [
            '--headless',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-gpu',
            '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
            '--user-data-dir=/tmp/user_data/',
            '--window-size=1920x1080'
        ],
        headless: false
    });


    const page = await browser.newPage();


    await page.goto('https://www.facebook.com/');
    const isNotloggedin = await page.evaluate(async () => {
        return await document.querySelector('#email')
    })

    if (isNotloggedin) {
        await page.type('#email', user);
        await page.type('#pass', pass);
        await page.click('#u_0_b');
    }

    await page.waitForSelector('[aria-label="Deixe um comentário"]')
    await page.click('[aria-label="Deixe um comentário"]')
    await page.waitForSelector('._1rwk')
    // await page.evaluate(async () => {
    //     const input = await document.querySelector('._1rwk')
    //     console.log(input)
    //     const list = await input.querySelector('ul')
    //     list.querySelector('[aria-label="Publique uma figurinha de avatar"]')

    // })

    await page.waitForSelector('.sp_CaOautnkgPg.sx_546e2d')
    await page.click('.sp_CaOautnkgPg.sx_546e2d')
    
    await page.waitForSelector('._8rlv')

    const imgList = await page.evaluate(() => {
        const avatarContent = document.querySelector('._8rlv')
        const avatarImgs = avatarContent.querySelectorAll('img')
        const imgArray = [...avatarImgs]
        return imgArray.map(({ src }) => ({ fileName: src, emojis: ['✌️'] }))

    })

    // async function downloadImage(url, i) {

    //     const path = Path.resolve(__dirname, 'images', `avatar${i}.webp`)
    //     const writer = Fs.createWriteStream(path)

    //     const response = await Axios({
    //         url,
    //         method: 'GET',
    //         responseType: 'stream'
    //     })

    //     response.data.pipe(writer)

    //     new Promise((resolve, reject) => {
    //         writer.on('finish', resolve)
    //         writer.on('error', reject)
    //     })
    // }

    // imgList.forEach((v, i) => {
    //     downloadImage(v.fileName, i)
    // })

    const stickerConfig = {
        identifier: 'myprojectstickers',
        name: 'MyProject Stickers',
        publisher: 'John Doe',
        trayImageFileName: 'tray_icon.png',
        publisherEmail: 'contact@myproject.com',
        publisherWebsite: 'https://myproject.com',
        privacyPolicyWebsite: 'https://myproject.com/legal',
        licenseAgreementWebsite: 'https://myproject.com/license',
        stickers: imgList
    }


    Fs.writeFile('avatar.json', JSON.stringify(stickerConfig, null, 2), err => {
        if (err) throw new Error('something went wrong')
        console.log('Well done!')
    })



    await browser.close()

    return stickerConfig
}

module.exports = avatar