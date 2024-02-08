const Message = require("../models/message");
const User = require("../models/user");

const sendMessage = async (req, res) => {
  try {
    const message = req.body.message;
    const data = await Message.create({
      message: message,
      userId: req.user.id,
    });
    const user = await User.findOne({where: {id: req.user.id}});
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      newMessage: {data: data, user: user},
    });
  } catch (err) {
    console.log("Error storing message");
    res.status(500).json({success: false, error: err.message});
  }
};

const getMessage = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });
    res.status(200).json({success: true, allMessage: messages});
  } catch (err) {
    res.status(500).json({success: false, error: err.message});
  }
};

const deleteMessage = async (req, res) => {
  const msg = Object.keys(req.body)[0];
  try {
    await Message.destroy({
      where: {message: msg},
    });

    res.status(200).json({success: true});
  } catch (err) {
    res.status(500).json({success: false, error: err.message});
  }
};

module.exports = {
  sendMessage,
  getMessage,
  deleteMessage,
};
