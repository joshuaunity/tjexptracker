const Notification = require('../../models/Notification');

// @desc Get Notifications
// @route GET /v1/notifications/user
// @access Private
const getUserNotificationsHandler = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: {
                UserId: req.user.id,
            },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json(notifications);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUserNotificationsHandler,
};