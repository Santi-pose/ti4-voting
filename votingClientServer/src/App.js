
import { React, useState, useContext } from 'react';
import styled from 'styled-components';
import Login from './Login';
import Voting from './voting';
import { VotingContext } from './votingContext'
import useWebSocket from "react-use-websocket"

const BaseContainer = styled.div`
    background-image: url("/background.webp");
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
`;

const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: #BF4F74;
`;

const WS_URL = "ws://" + window.location.hostname+":3002"

function App() {
    let [userName, setUserName] = useState("");
    const [userId, setUserId] = useState('');
    const [users, setUsers] = useState({});
    const [admin, setAdmin] = useState(false);

    useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: (e) => {
            console.log("message: " + e.data);
            var connectionObject = JSON.parse(e.data)
            if (connectionObject.userId != null) {
                console.log("connectionObject.userId: " + connectionObject.userId);
                setUserId(connectionObject.userId);
            }

            if (connectionObject.users != null) {
                console.log("Se actualizan los users " + JSON.stringify(connectionObject.users));
                setUsers(connectionObject.users);
            }
        }
    });

    function handleState(userName, votes) {
        if (userName == "a369b338cdb0") {
            setAdmin(true);
        }
        setUserName(userName);
        setUsers(votes);
    }

    //useEffect(() => {
    //    setUserId(userId);
    //}, [userId]);

   // useWebSocket(WS_URL, {
   //     onOpen: () => {
   //         console.log('WebSocket connection established.');
   //     },
   //     onMessage: (e) => {
   //         console.log("message: " + e.data);
   //         var connectionObject = JSON.parse(e.data)
   //         if (connectionObject.userId != null) {
   //             console.log("connectionObject.userId: " + connectionObject.userId);
   //             setUserId(connectionObject.userId);
   //         }
   //
   //         if (e.data.users != null) {
   //             console.log("Se actualizan los users");
   //             //setUsers(e.data.users);
   //         }
   //     }
   // });

    return (
        <BaseContainer>
            <VotingContext.Provider value={users}>
                {userName == "" ? <Login change={handleState} userId={userId} /> : <Voting userName={userName} admin={admin} ></Voting>}
            </VotingContext.Provider>
        </BaseContainer>
    );
}

export default App;
