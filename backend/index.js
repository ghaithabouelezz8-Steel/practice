const express = require('express')
const cors = require('cors')
const mongoose =require('mongoose')
require('dotenv').config()
const app = express()
const Note =require('./models/note')

app.use(express.json())
app.use(cors())

// Serve static React app from dist
app.use(express.static('dist'))


const errorHandler=(error,request,response,next)=>{
  console.error(error.message)
  if(error.name==='CastError')
    return response.status(400).send({error:'malformated id '})
  else if(error.name==='ValidationError')
    return response.status(400).json({error:error.message})
  next(error)
}

const unknownEndpoints=(request,response)=>{
  response.status(404).send({error:'unkown endpoint'})
}



/*let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]*/

const generatedId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => Number(note.id)))
    : 0
  return String(maxId + 1)
}



// REMOVED app.get('/', ...) so express.static('dist') serves index.html at root

app.get('/api/notes', (request, response,next) => {
  Note.find({}).then(notes=>{response.json(notes)})
 .catch(error=>next(error))
})

app.get('/api/notes/:id', (request, response , next) => {
  /*const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
}*/
Note.findById(request.params.id)
.then(note=>{
  if(note)
    response.json(note)

else
  response.status(404).end()

})
.catch(error=>next(error)
  /*console.log(error)
  response.status(400).send({error:'id malformatted'})*/
)

})

app.delete('/api/notes/:id', (request, response,next) => {
  const id = request.params.id
Note.findByIdAndDelete(id)
.then(note=>response.status(204).end())
.catch(error=>next(error))
})


app.post('/api/notes', (request, response , next) => {
  const body = request.body


  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
   
  })
note.save().then(
  result=>{
    response.json(result)
  }
  
)
.catch(error=>next(error))
  
})

app.put('/api/notes/:id', (request, response , next) => {
  const id = request.params.id
  //const important = request.body.important
 // const content = request.body.content
   const{content , important}=request.body
  

  Note.findById(id).then(note=>
    {if (!note) {
    return response.status(404).end()
  }

note.content=content
note.important=important

  return note.save()
  .then(updatedNote=>{
response.json(updatedNote)
  })
})
.catch(error=>next(error))})

app.use(unknownEndpoints)
app.use(errorHandler)

const PORT = process.env.PORT 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))



