export const chatCtrl = {}
import { Chat } from "../models/chatModel.js"
import { User } from "../models/userModel.js"

chatCtrl.accessChat = async (req, res) => {
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json("User od Param not sent with request.")
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name pic email'
    })

    if (isChat.length > 0) {
        res.send(isChat[0])
    } else {
        let chatData = {
            chatName: "Sender",
            isGroupChat: false,
            users: [req.user.id, userId]
        }
        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({ _id: createdChat.id }).populate("users", "-password")

            res.status(200).send(fullChat)
        } catch (err) {
            console.log(err)
            res.status(500).json({ errors: 'Something went wrong.', err })
        }
    }
}

chatCtrl.fetchChat = async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email'
                })
                res.status(200).send(results)
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong.', err })
    }
}

chatCtrl.createGroupChat = async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json("Fill all the details")
    }

    let users = JSON.parse(req.body.users)
    if (users.length < 2) {
        return res.status(400).json("More Then 2 users are required to form the group chat")
    }

    users.push(req.user.id)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.id
        })

        const fullGroupChat = await Chat.findById(groupChat._id).populate("users", "-password").populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)
    } catch (err) {
        console.log(err)
        res.status(500).json({ errors: 'Something went wrong.', err })
    }
}