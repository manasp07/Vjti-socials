import User from "../models/User";
const name = req.query.name;
const user = await User.findOne({ name }).exec();
if (!user) {
    res.status(404).json({ message: 'User not found' });
} else {
    res.json(user);
}


