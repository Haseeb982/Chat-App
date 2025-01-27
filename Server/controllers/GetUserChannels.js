import User from '../models/UserModel.js';
import Channel from '../models/ChannelModel.js';
import mongoose from 'mongoose';

const getUserChannel = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userID);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).send({ channels });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal server error');
  }
};

export default getUserChannel;
