const msgs = (state = {users: null, chatMsg: []}, action) => {
    switch (action.type) {
        case 'LOGIN_BROADCAST':
            console.log('broadcasting login');
            return {
                ...state,
                users: action.data.users,
                chatMsg: [...state.chatMsg, action.data.msg],
                // room: action.data.room,
                rooms: action.data.rooms,
                // user: action.data.user
            };

        case 'SEND_MESSAGE':
            console.log('send message');
            return {
                ...state,
                chatMsg: [...state.chatMsg, action.data.msg]
            }

        case 'CHANGE_NAME':
            console.log(`change name ${JSON.stringify(action, null, 2)}`);
            // current user
            if (action.data.msg) {
                return {
                    ...state,
                    user: action.data.user,
                    users: action.data.users,
                    chatMsg: [...state.chatMsg, action.data.msg]
                };
            } else {
                // Broad cast
                return {
                    ...state,
                    users: action.data.users
                };
            }
        case 'CHANGE_ROOM':
            return {
                ...state,
                users: action.data.users,
                chatMsg: [...state.chatMsg, action.data.msg],
                rooms: action.data.rooms
            }

        default:
            return state;
        
    }
}

export default msgs;