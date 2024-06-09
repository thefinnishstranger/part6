import { useNotification } from "./NotificationContext"
import { useEffect } from "react"

const Notification = () => {
  const { state, dispatch } = useNotification()

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' })
    }, 5000)

    return () => clearTimeout(timer)
  }, [state.message])

  if (!state.message) return null

  return (
    <div style={style}>
      {state.message}
    </div> 
  )
}

export default Notification
