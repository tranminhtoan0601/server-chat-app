const router = require("express").Router();
const Converstation = require("../models/Converstation");
const Message = require("../models/Message");

//new converstations

router.post("/", async (req, res) => {
  try {
    const existingConversation = await Converstation.findOne({
      members: {
        $all: [
          req.body.idMemberRoom.senderId,
          req.body.idMemberRoom.receiverId,
        ],
      },
    });
    if (existingConversation) {
      return res.status(200).json(existingConversation);
    } else {
      const newConversation = new Converstation({
        members: [
          req.body.idMemberRoom.senderId,
          req.body.idMemberRoom.receiverId,
        ],
        idSender: req.body.idMemberRoom.receiverId,
      });
      const saveConverstation = await newConversation.save();
      return res.status(200).json(saveConverstation);
    }
  } catch (error) {
    console.log({ error });
    res.status(500).json(err);
  }
});

//get converstaion of userId

router.get("/:userId", async (req, res) => {
  try {
    const converstations = await Converstation.find({
      members: { $in: [req.params.userId] },
    });

    const rs = await Promise.all(
      converstations.map(async (conversation) => {
        const lastMsg = await Message.findOne({
          converstationId: conversation._id,
        })
          .sort({ createdAt: -1 })
          .select("text createdAt");
        const unReadCount = await Message.count({
          converstationId: conversation._id,
          isRead: false,
        });
        const sender = await conversation.members.find(
          (item) => item !== req.params.userId
        );

        conversation.lastMsg = lastMsg;
        conversation.unReadCount = unReadCount;
        conversation.idSender = sender;

        return {
          ...conversation.toJSON(),
          lastMsg: lastMsg,
          unReadCount: unReadCount,
          idSender: sender,
        };
      })
    );
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
