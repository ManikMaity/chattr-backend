import Groq from 'groq-sdk'

import { GROQ_API_KEY } from './variables.js'

const groq = new Groq({
  apiKey: GROQ_API_KEY
})

export default groq
