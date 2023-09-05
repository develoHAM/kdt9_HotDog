const Sequelize = require("sequelize");

class qnaComment extends Sequelize.Model {
    static initiate(sequelize) {
        qnaComment.init({
            comment: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.NOW,
            },
        }, {
            sequelize,
            timestamps: false,
            modelName: 'qnaComment',
            tableName: 'qnaComments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }
    static associate(db) {
        db.qnaComment.belongsTo(db.qnaUser, { foreignKey: 'commenter', targetKey: 'id' });
      }
};

module.exports = qnaComment;