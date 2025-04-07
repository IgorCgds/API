import express from 'express'
import {v4 as uuidv4} from 'uuid'
import fs from 'fs'
import { isNumberObject } from 'util/types'

const app = express()

app.use(express.json())

const users = []


if (!fs.existsSync('./users.json')){
    fs.writeFileSync('./users.json', JSON.stringify(users), 'utf-8')
}

app.post('/users', (req, res) => {
    const {nome, idade, email, id} = req.body; // Removi id não utilizado

    // Verificações corrigidas
    const idadeNumber = Number(idade);
    const IsAgeANumber = !isNaN(idadeNumber) && Number.isFinite(idadeNumber);
    const VerifyEmail = email.includes('@') && email.includes('.');
    const VerifyDuplicateEmail = users.some(user => user.email == email);
    const VerifyDuplicateID = users.some(users =>
        users.id == id
    )

    if (VerifyDuplicateEmail){
        return res.status(409).json({error: "Bad Request: Duplicated E-mail"})
        console.log("Este e-mail já está cadastrado.", users.email)
    }

    if (!VerifyEmail){
        return res.status(409).json({error: "Bad Request: Invalid E-mail Format"})
        console.log("Este e-mail é inválido", users.email)
    }
    
    if(VerifyDuplicateID){
        return res.status(409).json({error: "Bad Request: Duplicated ID"})
        console.log("Este ID já está cadastrado", users.id) 
    //OBS: O ID NUNCA ESTARÁ DUPLICADO POIS O ID SERÁ GERADO AUTOMATICAMENTE, MAS ESTA FUNÇÃO É REAPROVEITÁVEL ANYWAY, ENTÃO IREI MANTÊ-LA
    }

    if(!IsAgeANumber){
        return res.status(422).json({error: "Bad Input: Age Is Not A Number"})
        console.log("A idade deve ser um número.")
    }

    if (!VerifyDuplicateID && !VerifyDuplicateEmail && IsAgeANumber && VerifyEmail){ 

        const newuser = {
            id: uuidv4(),
            nome,
            idade,
            email,
        };
    
        let users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));
        users.push(newuser)
    }
    res.send('Ok - vf')
})

app.get('/users', (req, res) => {
    res.json(users)
})

app.listen(3000)