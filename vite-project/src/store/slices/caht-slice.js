

export const CreateChatSlice = (set, get) => ({
    SelectedChatType: undefined, // Correctly initialize state
    SelectedChatData: undefined, // Correctly initialize state
    SelectedMessages: [], // Correctly initialize state

    SetSelectedChatData: (SelectedChatData) => set({ SelectedChatData }),
    SetSelectedChatType: (SelectedChatType) => set({ SelectedChatType }),
    SetSelectedMessages: (SelectedMessages) => set({ SelectedMessages }),

    CloseChat: () =>
        set({
            SelectedChatData: undefined,
            SelectedChatType: undefined,
            SelectedMessages: [],
        }), // Correctly define the reset method

    addMessage: (message) => {
        const SelectedChatMessages = get().SelectedChatMessages;
        const SelectedChatType = get().SelectedChatType

        set({
            SelectedChatMessages: [
                ...SelectedChatMessages,
                {
                    ...message,
                    recipient:
                        SelectedChatType === "Channel"
                            ? message.recipient
                            : message.recipient._id
                }
            ]
        })
    }
});
