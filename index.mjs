import express from 'express';
import { TNL } from 'tnl-midjourney-api';
import fetch from 'node-fetch';
import { Mutex } from 'async-mutex'
const app = express()
const port = process.env.PORT || 3000;

const mutex = new Mutex(); // Créer un nouveau Mutex

app.use(express.static('public'));

app.get('/generateImage', async (req, res) => {
    const release = await mutex.acquire(); // Acquérir le verrou
    
    try {
        const TNL_API_KEY = '294b6137-9401-48c3-9b1f-2ef553684bef';
        const tnl = new TNL(TNL_API_KEY);

        const {prompt, imgUrl} = req.query

        if(prompt != "" && imgUrl != ""){
            const response = await tnl.img2img(prompt, imgUrl);
            const messageId = response.messageId;
            res.json({
                messageId: messageId,
                success: true
            })
        }
        else{
            res.json({
                messageId: null,
                success: false
            })
        }

    } finally {
        release(); // Libérer le verrou
    }
})

app.get('/getImage', async (req, res) => {
    const check = await fetch(`https://api.thenextleg.io/v2/message/${req.query.id}?expireMins=2`, {
        method:'GET',
        headers: {
            'Authorization':'Bearer 294b6137-9401-48c3-9b1f-2ef553684bef'
        }
    })
    const result = await check.json()
    res.json(result)
})

app.get("/test", (req, res) => {
    res.send("tst")
})

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`)
});
