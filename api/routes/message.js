const router = require("express").Router();
const Message = require("../models/Message");
const Converstation = require("../models/Converstation");

//add message

router.post("/", async (req, res) => {
  const newMessage = new Message({
    converstationId: req.body.converstationId,
    sender: req.body.sender,
    text: req.body.text,
    user: {
      _id: req.body.sender,
    },
    isRead: false,
    isDeleted: "false",
  });
  try {
    const saveMessage = await newMessage.save();
    res.status(200).json(saveMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get message

router.get("/:converstationId", async (req, res) => {
  const converstation = await Converstation.find({
    _id: req.params.converstationId,
  });
  const idSender = converstation.map((item) => {
    return item.members.find((i) => i !== req.body.idSender);
  });
  try {
    const updateMessage = await Message.updateMany(
      {
        converstationId: req.params.converstationId,
        sender: idSender[0],
      },
      { $set: { isRead: true } }
    );
    const message = await Message.find({
      converstationId: req.params.converstationId,
    });

    res.status(200).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
