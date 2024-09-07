export const chatCtrl = {}
import { populate } from "dotenv"
import Chat from "../models/chatModel"

chatCtrl.accessChat = async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json("User od Param not sent with request.")
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $element: { $eq: req.user.id } } },
            { users: { $element: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender'
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let chatData = {
            chatName: "Sender",
            isGroupChat: false,
            users: [res.user.id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({ _id: createdChat.id }).populate("users", "-password")

            res.status(200).send(fullChat)
        } catch (err) {

        }
    }
}