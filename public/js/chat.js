const socket = io()
let conversationDetails = {}
let finalMessage;
socket.on('message', async (inputmessage) => {
    const key = inputmessage.toUser + "-" + inputmessage.sender;
    if (!conversationDetails[key]) {
        const conversationData = await fetch(`http://localhost:3000/conversation/${inputmessage.sender}`);
        const conversation = await conversationData.json()

        conversationDetails[key] = conversation.find((con) => {
            if (con.members.includes(inputmessage.toUser.toString())) {
                return true;
            }
        })
        let id;
        if (!conversationDetails[key]) {
            const postdata = {
                "members": [inputmessage.toUser.toString(), inputmessage.sender.toString()],
            }
            const postoptions =
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify(postdata) // body data type must match "Content-Type" header
            }
            const postedData = await fetch(`http://localhost:3000/conversation`, postoptions);
            const postedDetails = await postedData.json()
            id = postedDetails._id
        }
        if (!id) {
            id = conversationDetails[key]._id
        }
        const messagesData = await fetch(`http://localhost:3000/message/${id}`);
        const messages = await messagesData.json()
        const finalMessageArray = messages.map((msg) => {
            return msg.message;
        })
        finalMessage = finalMessageArray.join(',\n')
    }
    finalMessage = finalMessage + ",\n" + inputmessage.message;
    document.getElementById('demo').innerHTML = finalMessage;


    const postdata = {
        "sender": inputmessage.sender,
        "message": inputmessage.message,
        "conversationId": conversationDetails[key]._id,
    }
    const postoptions =
    {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(postdata) // body data type must match "Content-Type" header
    }
    const response = await fetch('http://localhost:3000/message', postoptions);
    console.log("done")
})


socket.on('newConnection', (inputmessage) => {
    document.getElementById('socket').innerHTML = inputmessage
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    const message = e.target.elements.message.value
    if (message.length > 0) {
        socket.emit('sendMessage', message, (error) => {
            if (error) {
                alert(error)
            }
        })
    }
})