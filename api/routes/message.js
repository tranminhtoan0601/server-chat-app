const router = require("express").Router();
const Message = require("../models/Message");

//add message

router.post("/", async (req, res) => {
  const newMessage = new Message({
    converstationId: req.body.converstationId,
    sender: req.body.sender,
    text: req.body.text,
    user: {
      _id: req.body.sender,
    },
    isRead: "false",
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
  try {
    const message = await Message.find({
      converstationId: req.params.converstationId,
    });
    const updateMessage = await Message.findOneAndUpdate(
      {
        converstationId: req.params.converstationId,
      },
      {
        isRead: "true",
      }
    );
    res.status(200).json(updateMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
