import User from '../models/UserModel.js';
import Channel from '../models/ChannelModel.js';

const createChannel = async (req, res, next) => {
  try {
    const { userID } = req;
    const { name, members } = req.body;
    const admin = await User.findById(userID);

    if (!admin) {
      return res.status(400).send('Admin user not found');
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.send(400).send('Some members are not valid users.');
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userID,
    });

    await newChannel.save();
    return res.status(201).send({ channels: newChannel });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal server error');
  }
};

export default createChannel;
