const router = require("express").Router();
const Converstation = require("../models/Converstation");
const Message = require("../models/Message");
const User = require("../models/User");
const addHours = require("date-fns/addHours");
const { ObjectId } = require("mongodb");
const cfsign = require("aws-cloudfront-sign");
const path = require("path");

//new converstations
router.post("/", async (req, res) => {
  try {
    const existingConversation = await Converstation.findOne({
      members: {
        $all: [req.body.senderId, req.body.receiverId],
      },
    });
    if (existingConversation) {
      return res.status(200).json(existingConversation);
    } else {
      const newConversation = new Converstation({
        members: [req.body.senderId, req.body.receiverId],
      });
      const saveConverstation = await newConversation.save();
      return res.status(200).json(saveConverstation);
    }
  } catch (error) {
    res.status(500).json(err);
  }
});

//get converstaion of userId
router.get("/:userId", async (req, res) => {
  try {
    const converstations = await Converstation.find({
      members: { $in: [req.params.userId] },
    }).populate({
      path: "members",
      model: User,
    });

    const SignedUrl = (unsigned) => {
      if (!unsigned) {
        return unsigned;
      }
      const signingParams = {
        keypairId: process.env.cloudfrontPublicKeyId,
        privateKeyPath: path.join(__dirname, "private_key.pem"),
        expireTime: new Date().getTime() + 999999999,
      };
      return cfsign.getSignedUrl(unsigned, signingParams);
    };

    const rs = await Promise.all(
      converstations.map(async (conversation) => {
        const lastMsg = await Message.findOne({
          converstationId: conversation._id,
        })
          .sort({ createdAt: -1 })
          .select("text createdAt isRead sender");
        const unReadCount = await Message.count({
          converstationId: conversation._id,
          isRead: false,
        });
        conversation.lastMsg = lastMsg;
        conversation.unReadCount = unReadCount;
        const urlAvatar = conversation.members.map((item) => {
          const ulrImg = SignedUrl(item?.profileImage || "");
          return { profileImage: ulrImg, userId: item._id };
        });
        return {
          ...conversation.toJSON(),
          lastMsg: lastMsg,
          unReadCount: unReadCount,
          profileImage: urlAvatar,
        };
      })
    );
    res.status(200).json(rs);
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a conversation

router.delete("/:converstationId", async (req, res) => {
  try {
    const converstation = await Converstation.findOneAndDelete({
      _id: new ObjectId(req.params.converstationId),
    });
    res.status(200).json(converstation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
