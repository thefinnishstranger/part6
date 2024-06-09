import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, addAnecdote, updateAnecdote } from './requests'
import { NotificationProvider, useNotification } from './components/NotificationContext'
import Notification from './components/Notification'

const AppContent = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const newAnecdoteMutation = useMutation({
    mutationFn: addAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: 'A new anecdote has been added!'
      })
    },
    onError: (error) => {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: `Error: ${error.response.data.error}`
      })
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: 'Anecdote has been updated!'
      })
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    if (content.length < 5) {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: 'Error: Anecdote content must be at least 5 characters long'
      })
      return
    }

    newAnecdoteMutation.mutate({ content, votes: 0 })
    console.log('new anecdote')
  }

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    console.log(anecdote)
  }

  const results = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  console.log(JSON.parse(JSON.stringify(results)))
  
  if (results.isLoading) {
    return <div>
      loading anecdotes...
    </div>
  }

  if (results.error) {
    return <div>
      anecdote service not available due to problems in server
    </div>
  }

  const anecdotes = results.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <div>
        <h3>create new</h3>
        <form onSubmit={onCreate}>
          <input name='anecdote' />
          <button type="submit">create</button>
        </form>
      </div>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

const App = () => (
  <NotificationProvider>
    <AppContent />
  </NotificationProvider>
)

export default App
