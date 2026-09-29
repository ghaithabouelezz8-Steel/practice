const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

// Serve static React app from dist
app.use(express.static('dist'))

let notes = [
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
]

const generatedId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(note => Number(note.id)))
    : 0
  return String(maxId + 1)
}

// REMOVED app.get('/', ...) so express.static('dist') serves index.html at root

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  // FIX: Assign to outer 'notes' variable instead of declaring local 'const notes'
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generatedId()
  }

  notes = notes.concat(note)
  response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  const note = notes.find(n => n.id === id)
  if (!note) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = { ...note, important: body.important }
  // FIX: Reassign outer 'notes' array with updated item
  notes = notes.map(n => n.id === id ? updatedNote : n)

  response.json(updatedNote)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

