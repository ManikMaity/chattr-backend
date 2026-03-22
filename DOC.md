#### New npm packages

- `http-status-codes` - This package is used to return status codes for the API responses.
- `eslint` - eslint is a tool for identifying and reporting on patterns found in JavaScript. [Atricle to Setup](https://medium.com/@sindhujad6/setting-up-eslint-and-prettier-in-a-node-js-project-f2577ee2126f).
- `prettier` - prettier is a code formatter.
- `"simple-import-sort` - This is a pulugin for eslint to sort imports.
- In production we have two environments, development and production.
- So we can setup our database according to the environment in db.config.js.
- [RoboHash](https://robohash.org/) - This is a website which generates avatar images from text for you.

- Add the token to collection variables in postman in script tab beside the Body scrite the following code:

```js
var jsonData = pm.response.json()
var token = jsonData.data.token
pm.collectionVariables.set('slack_token', token)
```

- This will add the token to the collection variables so that we can use it in the next request.

### Message model

```js

const messageSchema = new mongoose.Schema({
    text: String,
    user : {
        type : ObjectId,
        ref : 'User'
    },
    channel : ObjectId,
    likes : [{
        user : ObjectId,
        likeType : String
    }],
    replies : [{
        ObjectId,
        ref : 'Message'
    }],
    seenBy : [{
        user : {
            type : ObjectId,
            ref : 'User'
        },
        seenAt : Date
        seen : Boolean
    }]

}, {timestamps : true})
```

## Setup nodemailer

- NodeMailer is a package for sending emails.
- `npm install nodemailer`
- [Atricle to Setup](https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628)
- [Create App Password For Gmail Link](https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4PjZPv_RFzLvDpJpgNezLLlTZ-eKcC011hXQB6Mh7gjQFn1dLrq76bIrxMqjz4JbJ6YTbapvSKegaX1_YU3qxI-yUuzG_4l33osM5Z6PusG9P2bQyQ)

## How to setup redis queue in project

- In `Ubuntu terminal` run `redis-server` - This will start the redis server
- Install `npm install ioredis` and `npm install bull`
- In `env` file add `RADIS_HOST = localhost` and `REDIS_PORT = 6379`
- Make a `queues` folder in `src` folder and make a `mail.queue.js` file in that folder
- Configure the `bull` in `mail.queue.js` file

```js
import Queue from 'bull'

import { RADIS_HOST, RADIS_PORT } from '../config/variables.js'

export default new Queue('mailQueue', {
  redis: {
    host: RADIS_HOST,
    port: RADIS_PORT
  }
})
```

- To use it make a `producers` folder in `src` and make a `mailQueue.producer.js` file

```js
import mailQueue from '../queues/mail.queue.js'
export const addEmailToQueue = async (emailData) => {
  try {
    await mailQueue.add(emailData)
    console.log('Email added to queue')
  } catch (err) {
    console.log('Add email to queue error', err)
  }
}
```

- Now we can add mail to queue.

```js
export async function addMemberToWorkSpace(req, res) {
  // all code
  const respose = await workspaceRepo.addMemberToWorkspace(
    workspaceId,
    memberId,
    role
  )
  addEmailToQueue(createJoinWorkspaceMail(workspace.name, user.email))
  return respose
}
```

- Now make a comumer for the queue.
- Make a `processors` folder in `src` and make a `mail.processor.js` file

```js
import transporter from '../config/mail.config.js'
import mailQueue from '../queues/mail.queue.js'

mailQueue.process(async (job) => {
  const { emailData } = job.data
  try {
    const respose = await transporter.sendMail(emailData)
    console.log('Email sent successfully', respose)
  } catch (err) {
    console.log('Email processing error', err)
  }
})
```

- Now import the processor in `mailQueue.producer.js`

```js
// ./producers/mailQueue.producer.js
import '../processors/mail.processor.js'
```

## Web Socket
