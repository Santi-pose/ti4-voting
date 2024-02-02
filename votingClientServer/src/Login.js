
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Select from 'react-select'

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

const BaseContainer = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: rgba(128, 128, 128, 0.5);
    border-radius: 25px;
` 

const LoginLabel = styled.h1`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 1.5em;
    text-align: center;
    color: white;
`;

const LoginScreen = styled.div`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 2em;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;`

const Title = styled.h1`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 4.5em;
    text-align: center;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const LoginInput = styled.input`
    margin-top: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 2em;
    width: 100%;
`

const LoginButton = styled.button`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    display: flex;
    align-items: center;
`

const LoginAsAdminButton = styled.button`
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 24px;
    display: flex;
    align-items: center;
`


function Login({ change, userId }) {

    const [user, setUser] = useState('');
    const [faction, setFaction] = useState('');

    const icons = [
        "Arborec", "Argent", "Barony", "Cabal", "Empyrean", "Ghosts of creus", "Hacan",
        "Jol-Nar", "Keleres", "L1Z1X", "Mahact", "Mentak", "Muaat", "Naalu",
        "NaazRokha","Nekro", "Nomad","Saar","Sardakk","Sol","Ul","Winnu","Xxcha","Yin","Yssaril"
    ]

    const factions = icons.map(item => { return { value: item, label: item }})

    const loginUser = (user) => {

        var request = { name: user, userId: userId, faction: faction.value }
        console.log("Mandando ", request)

        axios.post("http://" + window.location.hostname +":3001/v1/login", request).then((response) => {
            console.log(response.status, response.data);
            change(user, response.data);
        });
    }

    const loginAdmin = (user) => {

        var request = { name: user, userId: userId }
        console.log("Mandando ", request)

        axios.post("http://" + window.location.hostname +":3001/v1/admin", request).then((response) => {
            console.log(response.status, response.data);
            change(user, response.data);
        });
    }

    return (
        <BackgroundContainer>
            <BaseContainer>
                <Title>Agenda</Title>
                <LoginScreen>
                    <LoginLabel>Name (4 to 8 characters):</LoginLabel>
                    <LoginInput type="text" id="name" name="name" required minlength="4" maxlength="8" size="10" onChange={(event) => { console.log(event.target.value); setUser(event.target.value) } } />
                    <>
                        <Select options={factions} onChange={setFaction} />
                    </>
                    <LoginButton onClick={() => loginUser(user)}>LOGIN</LoginButton>
                    <LoginAsAdminButton onClick={() => loginAdmin("a369b338cdb0")}>ADMIN</LoginAsAdminButton>
                </LoginScreen>
            </BaseContainer>
        </BackgroundContainer>
    );
}

export default Login;
