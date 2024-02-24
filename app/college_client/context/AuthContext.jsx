import { createContext, useReducer } from "react";

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
};

//* Create context
export const AuthContext = createContext(INITIAL_STATE);

//* Create reducer function
const AuthReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            localStorage.clear();
            return {
                user: null,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('user', JSON.stringify(action.payload));

            return {
                user: action.payload,
                loading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            localStorage.clear();
            return {
                user: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            localStorage.clear();
            return {
                user: null,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
};

//* Create context provider component
// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    // //*storing user in local storage
    // useEffect(() => {
    //     localStorage.setItem('user', JSON.stringify(state.user));
    // }, [state.user]);

    //* Return provider
    return (
        <AuthContext.Provider value={{ user: state.user, loading: state.loading, error: state.error, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}


//* const { loading, error, dispatch } = useContext(AuthContext)
//* dispatch({ type: "LOGIN_START" })