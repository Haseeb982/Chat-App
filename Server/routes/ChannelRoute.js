import { Router } from 'express';
import { VerifyToken } from '../middleware/authMiddleware.js';
import createChannel from '../controllers/ChannelController.js';
import getUserChannel from '../controllers/GetUserChannels.js';
import getChannelMessages from '../controllers/getChannelMessages.js';

const channelRoute = Router();

channelRoute.post('/create-channel', VerifyToken, createChannel);
channelRoute.get('/get-user-channels', VerifyToken, getUserChannel);
channelRoute.get(
  '/get-channel-messages/:channelId',
  VerifyToken,
  getChannelMessages
);

export default channelRoute;
