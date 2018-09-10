// let initialState = new Map();
// initialState.set("Lobby", []);

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'ENTER_ROOM':
            // console.log(`reducer state data: ${JSON.stringify(action.data, null, 2)}`);
            return {
                ...state,
                room: action.data.room,
                rooms: action.data.rooms,
                user: action.data.user, 
                users: action.data.users
            };
        case 'UPDATE_NAME':
            return {
                ...state,
                user: action.data.user
            }
        
        case 'UPDATE_ROOM':
            return {
                ...state,
                room: action.data.room,
                rooms: action.data.rooms
            }
        case 'LEAVE_ROOM':
            // console.log(`reducer LEAVE_ROOM: ${JSON.stringify(action.data, null, 2)}`);
            // return {
            //     room: action.data.room,
            //     rooms: action.data.rooms,
            //     user: action.data.user, 
            //     users: action.data.users
            // };
            // let userList = state.get(action.room);
            // userList.splice(userList.indexOf(action.name), 1);
            // state.set(action.room, userList);
            // return {
            //     msg: action.data.msg,
            //     room: action.data.room,
            //     rooms: action.data.rooms,
            //     user: action.data.user, 
            //     users: action.data.users
            // };
        case 'CHANGE_USER_NAME':
            // let users = state.get(action.room);
            // let index = users.indexOf(action.oldName);
            // users.splice(index, 1, action.newName);
            // state.set(action.room, users);
            // return state;
            
        case 'SWITCH_ROOM':
            // if new room doesn't exist in state
            // if(!state.has(action.new_room)) {
            //     state.set(action.new_room, []);
            // }
            // // delete current user from old room
            // let prevUsers = state.get(action.old_room);
            // prevUsers.splice(prevUsers.indexOf(action.name), 1);
            // state.set(action.old_room, prevUsers);

            // // add current user into new room
            // state.set(action.new_room, [...state.get(action.new_room), action.name]);
            // return state;
        default:
            return state;
        
    }
}

export default reducer;