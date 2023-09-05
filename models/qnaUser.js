const Sequelize = require("sequelize");

class qnaUser extends Sequelize.Model {
    static initiate(sequelize) {
        qnaUser.init({
            name: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            }, 
            comment: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        },{
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: "qnaUser",
            tableName: "qnaUsers",
            paranoid: false,
            charset: "utf8",
            collate: "utf8_general_ci",
        })
    }
    static associate(db) {
        db.qnaUser.hasMany(db.qnaComment, { foreignKey: "commenter", sourceKey: "id"});
    };
};

module.exports = qnaUser;