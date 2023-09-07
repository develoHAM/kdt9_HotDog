const Sequelize = require("sequelize");

class qnaUser extends Sequelize.Model {
    static initiate(sequelize) {
        qnaUser.init({
            title: {
                type: Sequelize.STRING(255),
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

// const Sequelize = require('sequelize');

// class qnaUser extends Sequelize.Model {
//   static initiate(sequelize) {
//     qnaUser.init({
//       name: {
//         type: Sequelize.STRING(20),
//         allowNull: false,
//         unique: true,
//       },
//       age: {
//         type: Sequelize.INTEGER.UNSIGNED,
//         allowNull: false,
//       },
//       married: {
//         type: Sequelize.BOOLEAN,
//         allowNull: false,
//       },
//       comment: {
//         type: Sequelize.TEXT,
//         allowNull: true,
//       },
//       created_at: {
//         type: Sequelize.DATE,
//         allowNull: false,
//         defaultValue: Sequelize.NOW,
//       },
//     }, {
//       sequelize,
//       timestamps: false,
//       underscored: false,
//       modelName: 'User',
//       tableName: 'users',
//       paranoid: false,
//       charset: 'utf8',
//       collate: 'utf8_general_ci',
//     });
//   }

//   static associate(db) {
//     db.qnaUser.hasMany(db.qnaComment, { foreignKey: 'commenter', sourceKey: 'id' });
//   }
// };

// module.exports = qnaUser;