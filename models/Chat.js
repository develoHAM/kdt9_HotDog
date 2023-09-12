const ChatModel = (sequelize, Sequelize) => {
    return sequelize.define('chat', {
        id: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        roomid: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: false,
        },
        senderid: {
            type: Sequelize.DataTypes.STRING(20),
            allowNull: false,
        },
        content: {
            type: Sequelize.DataTypes.TEXT
        }
    })
}

module.exports = ChatModel;
