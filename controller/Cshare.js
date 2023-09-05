const get_main = (req,res) => {
    res.render('share')
}

const get_shareCommit = (req,res) => {
    res.render('/shareCommit')
}

module.exports = {
    get_shareCommit,
    get_main
}