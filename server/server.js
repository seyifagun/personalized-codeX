import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config()

const configuration = new Configuration({
    apiKey : process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors()); //allows server to be called on the frontend
app.use(express.json()); //allows us pass json from frontend to backend

app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from CodeX',
    })
});

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model : "text-davinci-003",
            prompt : `${prompt}`,
            temperature : 0,
            max_tokens : 3000, //length of response
            top_p : 1, 
            frequency_penalty : 0.5, //not repeat similar answers often
            presence_penalty:0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch(error){
        console.log('print out issue: ', error);
        res.status(500).send(error || 'Something went wrong somewhere!')
    }
});

app.listen(5000, () => console.log('Server is running on port http://localhost:5000 ')); // run server