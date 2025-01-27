import mongoose from 'mongoose';
import Message from '../models/MessageModels.js';

const getContactsForDMList = async (req, res, next) => {
  try {
    console.log('Start backend process');

    const { userID } = req;
    if (!userID) {
      return res.status(400).json({ error: 'Missing userID in the request.' });
    }

    const userId = new mongoose.Types.ObjectId(userID);
    console.log('Backend userID:', userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          lastMessageTime: { $first: '$timestamp' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contactInfo',
        },
      },
      {
        $unwind: {
          path: '$contactInfo',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: '$contactInfo.email',
          firstName: '$contactInfo.firstName',
          lastName: '$contactInfo.lastName',
          image: '$contactInfo.image',
          color: '$contactInfo.color',
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

 

    console.log('Backend contacts:', contacts);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error('Error in getContactsForDMList:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default getContactsForDMList;
