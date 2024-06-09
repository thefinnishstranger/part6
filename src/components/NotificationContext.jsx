import { createContext, useReducer, useContext } from "react"

const NotificationContext = createContext()

export const useNotification = () => useContext(NotificationContext)

const initialState = {
    message: ''
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION':
            return { message: action.payload }
        case 'HIDE_NOTIFICATION':
            return { message: '' }
        default:
            return state
    }
}

export const NotificationProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <NotificationContext.Provider value={{ state, dispatch }}>
            {children}
        </NotificationContext.Provider>
    )
}