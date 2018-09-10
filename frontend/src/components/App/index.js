import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import {initialSocket, leaveSocket, UpdateName, UpdateRoom} from "../../actions/action";
import {loginBroadCast, sendChatSocket, changeNameSocket, changeRoomSocket, SendChat, ChangeName, ChangeRoom} from "../../actions/msgAction";
import socketIOClient from "socket.io-client";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {TextField, Paper, Divider, Typography, Button} from '@material-ui/core';

const styles = theme => ({
    bootstrapInput: {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 12px',
        width: '380px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        '&:focus': {
          borderColor: '#80bdff',
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
      },
      bootstrapFormLabel: {
        fontSize: 18,
      },
      button: {
        margin: theme.spacing.unit,
      },
})

let socket = socketIOClient.connect("http://localhost:4000");

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            room: this.props.chatRoom.room ? this.props.chatRoom.room : "",
            rooms: this.props.chatRoom.rooms ? this.props.chatRoom.rooms : [],
            user: this.props.chatRoom.user ? this.props.chatRoom.user : "",
            users: this.props.msgs.user ? this.props.msgs.user : [],
            input: ""
        }
    }

    componentDidMount() {
        // socket = socketIOClient.connect("http://localhost:4000");
        this.props.initialSocket(socket);

        this.props.loginBroadCast(socket);
        
        socket.on('chatSent', (res) => {
            console.log('chat sent ....');
            this.props.SendChat(res);
        })

        socket.on('nameChanged', (res) => {
            console.log('name changed ...');
            this.props.ChangeName(res);
        })

        socket.on('nameUpdated', (res) => {
            console.log('update name in reducer');
            this.props.UpdateName(res);
        })
        
        socket.on("roomChanged", (res) => {
            console.log('room changed ...');
            this.props.ChangeRoom(res);
        })

        socket.on('roomUpdated', (res) => {
            console.log('update room in reducer');
            this.props.UpdateRoom(res);
        })
    }

    // componentWillUnmount() {
        
    //     // console.log(`this.props.chatRoom: ${JSON.stringify(this.props.chatRoom, null, 2)}`)
    //     this.props.leaveSocket(socket, this.props.chatRoom);
    //     // socket.disconnect(this.props.chatRoom);
    //     // alert("Disconnecting Socket as component will unmount.")
    //     // socket.emit('loggout', {data: this.props.chatRoom})
    // }

    handleInput = (e) => {
        e.preventDefault();
        this.setState({input: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        console.log('handle submit!!!')
        const {chatRoom} = this.props;
        let arr = this.state.input.split(" ");
        if (arr[0] === "/nick") {
            let changedName = this.state.input.slice(6);
            let input = {
                oldName: chatRoom.user,
                newName: changedName,
                room: chatRoom.room
            }
            this.props.changeNameSocket(socket, input)
        } else if (arr[0] === "/join") {
            let changedRoom = this.state.input.slice(6);
            let input = {
                oldRoom: chatRoom.room,
                newRoom: changedRoom,
                user: chatRoom.user
            }
            this.props.changeRoomSocket(socket, input)
        } else {
            console.log(`send messge in APP: ${JSON.stringify(chatRoom, null, 2)}`)
            let input = {
                user: chatRoom.user,
                room: chatRoom.room,
                msg: this.state.input
            }

            this.props.sendChatSocket(socket, input);
        }
        
        this.setState({input: ""});
    }

    render() {
        const {classes, chatRoom, msgs} = this.props;
        console.log(`Props in app component: ${JSON.stringify(this.props, null, 2)}`);
        // console.log(`this.state: ${JSON.stringify(chatRoom, null, 2)}`)
        // console.log(`this.props.chatRoom: ${JSON.stringify(this.props.chatRoom, null, 2)}`)

        return (
            <Fragment>
                <h1>{chatRoom.room}</h1>
                
                {/* { chatRoom &&
                    <div>
                        <p>You are known as {chatRoom.user}</p> 
                    </div>
                        
                } */}


                { msgs.users && 
                    <div>
                        <p>{msgs.users}</p>
                    </div> 
                }

                <div style={{border: "1px solid black"}}>
                    { 
                        msgs.chatMsg.map((msg, idx) => {
                            return <p id={idx}>{msg}</p>
                        })

                    }
                </div>
                

                    {/* <p>Users currently in {chatRoom.room}: {chatRoom.users}</p> */}
                   
                    
                
                <p>rooms: {msgs.rooms}</p>

                <Divider />

                {/* Input form */}
                <div style={{margin: '25px'}}>
                    <TextField
                        placeholder="Send Message"
                        id="bootstrap-input"
                        value = {this.state.input}
                        onChange={this.handleInput}
                        InputProps={{
                        disableUnderline: true,
                        classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput,
                        },
                        }}
                        InputLabelProps={{
                        shrink: true,
                        className: classes.bootstrapFormLabel,
                        }}
                    />

                    <Button variant="contained" color="primary" aria-label="Add" className={classes.button} onClick={this.handleSubmit}>
                        Send
                    </Button>
                </div>
            </Fragment>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        chatRoom: state.reducer,
        msgs: state.msgs
    }
}

const mapDispatchToProps = dispatch => {
    return {
        initialSocket: (socketData) => {
            dispatch(initialSocket(socketData));
        },
        loginBroadCast: (socketData) => {
            dispatch(loginBroadCast(socketData));
        },
        leaveSocket: (socketData, data) => {
            dispatch(leaveSocket(socketData, data))
        },
        sendChatSocket: (socketData, data) => {
            dispatch(sendChatSocket(socketData, data))
        },
        SendChat: (res) => {
            dispatch(SendChat(res))
        },
        changeNameSocket: (socketData, data) => {
            dispatch(changeNameSocket(socketData, data))
        },
        ChangeName: (res) => {
            dispatch(ChangeName(res))
        },
        UpdateName: (res) => {
            dispatch(UpdateName(res))
        },
        changeRoomSocket: (socketData, data) => {
            dispatch(changeRoomSocket(socketData, data))
        },
        ChangeRoom: (res) => {
            dispatch(ChangeRoom(res))
        },
        UpdateRoom: (res) => {
            dispatch(UpdateRoom(res))
        }
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(App));