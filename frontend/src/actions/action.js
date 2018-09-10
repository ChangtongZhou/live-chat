// let userId = 1;

export const EnterRoom = (res) => ({
    type: "ENTER_ROOM",
    data: res
})

export const UpdateName = (res) => ({
    type: "UPDATE_NAME",
    data: res
})

export const UpdateRoom = (res) => ({
    type: "UPDATE_ROOM",
    data: res
})


export const LeaveRoom = (res) => ({
    type: "LEAVE_ROOM",
    data: res
})

/***************************************************************************************** */
/*                                  Action using - Sockets							       */
/***************************************************************************************** */

export const initialSocket = (socket) => {
    return (dispatch) => {
        socket.emit('login');
        socket.on('userAdded', res => {
            console.log(`res in initialSocket in action: ${JSON.stringify(res, null, 2)}`);
            dispatch(EnterRoom(res));
        })
    }
}


export const leaveSocket = (socket, input) => {
    return (dispatch) => {
        // socket.emit('loggout', input);
        // socket.on('userDeleted', res => {
        //     console.log(`res in leaveSocket in action: ${JSON.stringify(res, null, 2)}`);
        //     dispatch(LeaveRoom(res));
        // })
    }
}

