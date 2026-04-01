const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/message.model");

// 1. GET /message/:userID
router.get("/:userID", async (req, res) => {
  try {
    const currentUser = new mongoose.Types.ObjectId(req.user.id);
    const otherUser = new mongoose.Types.ObjectId(req.params.userID);

    const messages = await Message.find({
      $or: [
        { from: currentUser, to: otherUser },
        { from: otherUser, to: currentUser },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST /message
router.post("/", async (req, res) => {
  try {
    const mongoose = require("mongoose");

    const currentUser = new mongoose.Types.ObjectId(req.user.id);
    const { to, text, filePath } = req.body;

    let messageContent;

    if (filePath) {
      messageContent = {
        type: "file",
        text: filePath, 
      };
    }
    
    else {
      messageContent = {
        type: "text",
        text: text,
      };
    }

    const message = await Message.create({
      from: currentUser,
      to: new mongoose.Types.ObjectId(to),
      messageContent,
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. GET /message
router.get("/", async (req, res) => {
  try {
    const currentUser = new mongoose.Types.ObjectId(req.user.id);

    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { from: currentUser },
            { to: currentUser },
          ],
        },
      },
      {
        $addFields: {
          otherUser: {
            $cond: [
              { $eq: ["$from", currentUser] },
              "$to",
              "$from",
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$otherUser",
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
    ]);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;