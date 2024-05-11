const findAndAssignUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).end();
        }
        req.user = user;
        next();
    } catch (e) {
        next(e);
    }
};

module.exports = {findAndAssignUser}