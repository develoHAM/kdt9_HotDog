const Sequelize = require("sequelize");

class qnaWrite extends Sequelize.Model {
    static initiate(sequelize) {
        qnaWrite.init({
            title: {
                type : Sequelize.STRING(255),
                allowNull: false,
                qnique: true,
            }
        })
    }
}