'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('email_quota_tracking', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: 'Date for daily tracking (UTC midnight)',
        index: true,
      },
      daily_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Emails sent today (resets at UTC midnight)',
      },
      monthly_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: 'Emails sent this month (resets on 1st UTC)',
      },
      month_year: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Format: YYYY-MM for monthly tracking',
        index: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Ensure one row per date
    await queryInterface.addIndex('email_quota_tracking', ['date'], {
      unique: true,
      name: 'idx_email_quota_unique_date',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('email_quota_tracking');
  },
};
