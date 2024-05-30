import React, { useEffect, useState } from 'react'
import MainGame from './MainGame'
import LoginNewUser from './LoginNewUser'

const HomePage = ({ socket }) => {
    const [newUser, setNewUser] = useState('')
    const [signedUser, setSignedUser] = useState({})
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        socket.on('users', (users) => {
            const curr_user = []
            for (const { userId, username } of users) {
                const newMessage = { type: 'userStatus', userId, username }
                curr_user.push(newMessage)
            }
            setAllUsers([...allUsers, ...curr_user])
        })

        socket.on('session', ({ userId, username }) => {
            setSignedUser({ userId, username })
        })

        socket.on('user connected', ({ userId, username }) => {
            const newMessage = { type: 'userStatus', userId, username }
            setAllUsers([...allUsers, newMessage])
        })
    }, [socket, allUsers])

    const logNewUser = () => {
        setSignedUser(newUser)
        socket.auth = { username: newUser }
        socket.connect()
    }

    return (
        <>
            <main className='content'>
                <div className='container mt-3'>
                    {allUsers.length === 6 && <MainGame newUser={newUser} />}
                    {(signedUser.userId && allUsers.length < 6) && <h2> Wait, until others join! </h2>}
                    {!signedUser.userId && <LoginNewUser newUser={newUser} setNewUser={setNewUser} logNewUser={logNewUser} />}
                </div>
            </main>
        </>
    )
}

export default HomePage