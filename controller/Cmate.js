
const get_main = (req, res) => {
    res.render('mate')
}

const get_chat = (req, res) => {

}

const post_chat = (req, res) => {

}

const post_match = (req, res) => {
    console.log('req ====',req.body)
    const {myID, otherID, otherSocketID} = req.body
    res.json({creatorID: myID, invitedID: otherID, invitedSocketID: otherSocketID})
}

module.exports = {
    get_main,
    get_chat,
    post_chat,
    post_match
}