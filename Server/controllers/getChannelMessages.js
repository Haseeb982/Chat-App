import Channel from '../models/ChannelModel.js';

const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channels = await Channel.findById(channelId).populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'firstName lastName email_id image color',
      },
    });
    if (!channels) {
      return res.status(400).send('Channel not found.');
    }
    const messages = channels.messages;
    return res.status(201).send({ messages });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('Internal server error');
  }
};

export default getChannelMessages;
