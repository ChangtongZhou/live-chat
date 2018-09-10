const Login = (res) => ({
    type: "LOGIN_BROADCAST",
    data: res
})

export const SendChat = (res) => ({
    type: "SEND_MESSAGE",
    data: res
})

export const ChangeName = (res) => ({
    type: "CHANGE_NAME",
    data: res
})

export const ChangeRoom = (res) => ({
    type: "CHANGE_ROOM",
    data: res
})


////////////////////////////////////// Socket Logics ///////////////////////////////////
export const loginBroadCast = (socket) => {
    return (dispatch) => {
        socket.on("loginMsg", res => {
            // console.log(`res in loginBroadCast in msgAction: ${JSON.stringify(res, null, 2)}`);
            dispatch(Login(res));
        })
        
    }
}


export const sendChatSocket = (socket, input) => {
    return (dispatch) => {
        socket.emit("sendChat", input);
    }
}

export const changeNameSocket = (socket, input) => {
    return (dispatch) => {
        socket.emit("changeName", input)
    }
}

export const changeRoomSocket = (socket, input) => {
    console.log(`changeRoomSocket: ${JSON.stringify(input, null, 2)}`)
    return (dispatch) => {
        socket.emit("changeRoom", input)
    }
}