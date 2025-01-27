export const CreateChatSlice = (set, get) => ({
  SelectedChatType: undefined,
  SelectedChatData: undefined,
  SelectedChatMessages: [],
  SelectedDirectMessagesContact: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  channels: [],

  SetChannel: (channels) => set({ channels }),
  SetisUploading: (isUploading) => set({ isUploading }),
  SetisDownloading: (isDownloading) => set({ isDownloading }),
  SetfileUploadProgress: (fileUploadProgress) => set({ fileUploadProgress }),
  SetfileDownloadProgress: (fileDownloadProgress) =>
    set({ fileDownloadProgress }),

  SetSelectedChatData: (SelectedChatData) => set({ SelectedChatData }),
  SetSelectedChatType: (SelectedChatType) => set({ SelectedChatType }),
  SetSelectedMessages: (SelectedMessages) => set({ SelectedMessages }),
  SetSelectedChatMessages: (SelectedChatMessages) =>
    set({ SelectedChatMessages }),
  SetSelectedDirectMessagesContact: (SelectedDirectMessagesContact) =>
    set({ SelectedDirectMessagesContact }),

  addChannel: (channel) => {
    const channels = get().channels;
    set({ channels: [channel, ...channels] });
  },

  CloseChat: () =>
    set({
      SelectedChatData: undefined,
      SelectedChatType: undefined,
      SelectedMessages: [],
    }), 
  addMessage: (message) => {
    const SelectedChatMessages = get().SelectedChatMessages;
    const SelectedChatType = get().SelectedChatType;

    set({
      SelectedChatMessages: [
        ...SelectedChatMessages,
        {
          ...message,
          recipient:
            SelectedChatType === 'channel'
              ? message.recipient
              : message.recipient._id,
        },
      ],
    });
  },
  addChannelInChannelList: (message) => {
    const channels = get().channels;
    const data = channels.find((channel) => channel._id === message.channelId);
    const index = channels.findIndex(
      (channel) => channel._id === message.channelId
    );

    if (index !== -1) {
    
      channels.splice(index, 1);
      if (data) channels.unshift(data); 
    }
  },

  addContactsInDMContacts: (message) => {
    const dmContacts = get().directMessagesContacts; 
    console.log(get().directMessagesContacts); 

    const userId = get().userInfo.id;

    const fromId =
      message.sender._id === userId
        ? message.recipient._id
        : message.sender._id;
    const fromData =
      message.sender._id === userId ? message.recipient : message.sender;

    const data = dmContacts.find((contact) => contact._id === fromId);
    const index = dmContacts.findIndex((contact) => contact._id === fromId);

    if (index !== -1) {
      dmContacts.splice(index, 1);
      if (data) dmContacts.unshift(data); 
    } else {
      dmContacts.unshift(fromData);
    }

    set({ directMessagesContacts: dmContacts }); 
  },
});
