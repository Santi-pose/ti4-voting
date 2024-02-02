
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { VotingContext } from './votingContext'
import QRCode from "react-qr-code";
import Papa from 'papaparse';
import Select from 'react-select'
import Collapsible from 'react-collapsible';

const BackgroundContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    background-image: url("/background.webp");
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: auto;

    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const SuperBaseContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
`

const BaseContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(128, 128, 128, 0.5);
    border-radius: 25px;
    width: 100%;
` 

const Title = styled.h1`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 3.5em;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const VotingInputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    border-style: solid;
`

const LoginInput = styled.input`
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 1em;
    width: 100%;
    text-align: center; 
`


const VotingButton = styled.button`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    display: flex;
    align-items: center;
    margin-left: 10px;
`

const AdminButton = styled(VotingButton)`
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 24px;
    display: flex;
    align-items: center;
    margin-left: 10px;
`

const VoteUserContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    width: 100%;
    border-style: solid;
    border-color: ${(props) => {
        //console.log("Render box" + props.state)
            switch (props.state) {
                case "voted":
                    return 'green';
                case "skip":
                    return 'yellow';
                default:
                    return 'black';
            }
        }
    };
`

const VoteUserTotalVotes = styled.h1`
    display: flex;
    align-items: center;
    width: 20%;
    border-style: solid;
    margin: 0 0 0 0;
    font-size: 1em;
`

const VoteUserName = styled.h1`
    display: flex;
    font-size: 1em;
    align-items: center;
    width: 30%;
    margin: 0 0 0 0;
    min-width: 80px;
    margin-right: 10px;
`

const VoteUserVotes = styled.h1`
    display: flex;
    align-items: center;
    width: 20%;
    border-style: solid;
    font-size: 1em;
    margin: 0 0 0 0;
`

const CollapsibleContainer = styled.div`
    background-color: white;
`

const UserNameContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 33%;
`

const FactionLogo = styled.img`
    margin-right: 10px;
    max-width: 40px;
`

const icons = {
    "Barony": "/Barony.webp",
    "Argent": "/ArgentFactionSymbol.webp",
    "Arborec": "/Arborec.webp",
    "Cabal": "/CabalFactionSymbol.webp",
    "Empyrean": "/EmpyreanFactionSymbol.webp",
    "Ghosts of creus": "/Ghosts.webp",
    "Hacan": "/Hacan.webp",
    "Jol-Nar": "/Jol-Nar.webp",
    "Keleres": "/KeleresFactionSymbol.webp",
    "L1Z1X": "/L1Z1X.webp",
    "Mahact": "/MahactFactionSymbol.webp",
    "Mentak": "/Mentak.webp",
    "Muaat": "/Muaat.webp",
    "Naalu": "/Naalu.webp",
    "NaazRokha": "/NaazRokhaFactionSymbol.webp",
    "Nekro": "/Nekro.webp",
    "Nomad": "/NomadFactionSheet.webp",
    "Saar": "/Saar.webp",
    "Sardakk": "/Sardakk.webp",
    "Sol": "/Sol.webp",
    "Ul": "/UlFactionSymbol.webp",
    "Winnu": "/Winnu.webp",
    "Xxcha": "/Xxcha.webp",
    "Yin": "/Yin.webp",
    "Yssaril": "/Yssaril.webp",
}
        
   

function Voting({ userName, admin }) {

    const users = useContext(VotingContext);
    
    const [cantVotes, setCantVotes] = useState(0);
    const [cantMaxVotes, setCantMaxVotes] = useState(0);
    const [selectedUser, setSelectedUser] = useState("");
    const [politics, setPolitics] = useState({})
    const [politicsOptions, setPoliticsOptions] = useState([])

    const [loading, setLoading] = useState(true);

    const vote = (afavor) => {
        setCantMaxVotes(cantMaxVotes - cantVotes);
        setCantVotes(0);
        setSelectedUser("none")
        var request = { name: userName, votes: cantVotes, afavor, selectedUser }
        //console.log("Sending votes ", request)
        axios.post("http://" + window.location.hostname +":3001/v1/vote", request ).then((response) => {
            console.log(response.data);
        });
    }

    const reset = () => {
        var request = {}
        axios.post("http://" + window.location.hostname +":3001/v1/reset", request).then((response) => {
            console.log(response.data);
        });
    }

    const next = () => {
        var request = {}
        axios.post("http://" + window.location.hostname +":3001/v1/next", request).then((response) => {
            console.log(response.data);
        });
    }

    const skip = () => {
        axios.post("http://" + window.location.hostname +":3001/v1/skip", { name: userName }).then((response) => {
            console.log(response.data);
        });
    }

    const remove = (toDelete) => {
        axios.post("http://" + window.location.hostname +":3001/v1/remove", { name: userName, toDelete }).then((response) => {
            console.log(response.data);
        });
    }

    const sendPolitic = (value) => {
        axios.post("http://" + window.location.hostname + ":3001/v1/politic", { name: value }).then((response) => {
            console.log(response.data);
        });
    }

    const updateMaxVotes = (maxVotes) => {
        setCantMaxVotes(maxVotes);
        var request = { name: userName, maxVotes: maxVotes }
        console.log("Sending max votes ", request)
        axios.post("http://" + window.location.hostname +":3001/v1/maxVotes", request).then((response) => {
            console.log(response.data);
        });
    }

    const renderVotes = () => {
        //console.log("rendegin users " + JSON.stringify(users))
        return Object.keys(users.users).map((user) => {
           // console.log("User state " + JSON.stringify( users.users[user].state))
            return <VoteUserContainer state={users.users[user].state}>
                <UserNameContainer>
                    <FactionLogo src={icons[users.users[user].faction]}></FactionLogo>
                    <VoteUserName>{user}</VoteUserName>
                </UserNameContainer>
                <VoteUserTotalVotes>{users.users[user].maxVotes}</VoteUserTotalVotes>
                <VoteUserVotes>{users.users[user].votes}</VoteUserVotes>
                <VoteUserVotes>{users.users[user].ami}</VoteUserVotes>
                {admin &&
                    <AdminButton onClick={() => remove(user)}>R</AdminButton>
                }
            </VoteUserContainer>
        })
    }

    const renderSelectable = () => {
        return Object.keys(users.users).map((user) => {
            //console.log("User state " + JSON.stringify(users.users[user].state))
            return  <option value={user}>{user}</option>
        })
    }

    const updateSelectedCard = (card) => {
        //console.log("Selected card = " + JSON.stringify(politics[card.value]))
        sendPolitic(card.value)
        //setSelectedCard(politics[card.value])
    }

    const fetchData = async () => {
        const response = await fetch('/politics-cards.csv');
        const reader = response.body.getReader();
        const result = await reader.read();
        const text = new TextDecoder('utf-8').decode(result.value);

        Papa.parse(text, {
            header: true,
            complete: (result) => {
                const auxPolitics = {}
                setPoliticsOptions(result.data.map(entry => {
                    //console.log(JSON.stringify(entry))
                    auxPolitics[entry.Card] = {
                        Card: entry.Card,
                        Status: entry.Status,
                        Text: entry.Text.replaceAll('||', ',')
                    };
                    return { value: entry.Card, label: entry.Card }
                }))
                //console.log(" set politics: " + JSON.stringify(auxPolitics))   
                setPolitics(auxPolitics);
                setLoading(false);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            },
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <BackgroundContainer>
            <SuperBaseContainer>
                {admin &&
                    <div style={{ display: "flex", height: "auto", margineft: "20", maxWidth: 200, width: "100%" }}>
                        <QRCode
                            size={256}
                            style={{ height: "auto", maxWidth: "300%", width: "300%" }}
                            value={"http://" + window.location.hostname + ":3000/"}
                            viewBox={`0 0 256 256`}
                        />
                    </div>
                }

                <BaseContainer>
                    <Title>Agenda</Title>
                    {admin &&
                        <>
                        <Select options={politicsOptions} onChange={updateSelectedCard} />
                        </>
                    }
                    {!admin &&
                        <>
                            total votes<LoginInput type="number" min="0" max="5000" step="1" value={cantMaxVotes} onChange={(event) => { updateMaxVotes(event.target.value) }} />
                        </>
                    }
                    {!loading && users.selectedCard &&
                        <CollapsibleContainer>
                            <Collapsible trigger={politics[users.selectedCard].Card} >
                                <p>
                                    {politics[users.selectedCard].Status}
                                </p>
                                <p>
                                    {politics[users.selectedCard].Text}
                                </p>
                            </Collapsible>
                        </CollapsibleContainer>
                    }
                    <VoteUserContainer>
                        <VoteUserName>FAVOR: {users.results.afavor}</VoteUserName>
                        <VoteUserTotalVotes>CONTRA: {users.results.encontra}</VoteUserTotalVotes>
                    </VoteUserContainer>
                    <VoteUserContainer>
                        <VoteUserName>NOMBRE</VoteUserName>
                        <VoteUserTotalVotes>MAX</VoteUserTotalVotes>
                        <VoteUserVotes>USADOS</VoteUserVotes>
                        <VoteUserVotes>RECIVIDOS</VoteUserVotes>
                    </VoteUserContainer>
                    {renderVotes()}

                    {!admin &&
                        <>
                            <LoginInput type="number" min="0" max="5000" step="1" value={cantVotes} onChange={(event) => { setCantVotes(event.target.value) }} />
                            <select onChange={(event) => { setSelectedUser(event.target.value) }} value={selectedUser} >
                                <option value="none">--Please choose an option--</option>
                                {renderSelectable()}
                            </select>
                            <VotingInputContainer>
                                <VotingButton onClick={() => vote(1)}>A FAVOR</VotingButton>
                                <VotingButton onClick={() => vote(0)}>ENCONTRA</VotingButton>
                                <VotingButton onClick={() => skip()}>SKIP</VotingButton>
                            </VotingInputContainer>
                        </>
                    }

                    {admin &&
                        <>
                            <VotingInputContainer>
                                <VotingButton onClick={() => reset()}>RESET</VotingButton>
                                <VotingButton onClick={() => next()}>NEXT</VotingButton>
                            </VotingInputContainer>
                        </>
                    }
                </BaseContainer>
             </SuperBaseContainer>
           
        </BackgroundContainer>
    );
}

export default Voting;
