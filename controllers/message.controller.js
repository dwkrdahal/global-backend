import Message from "../models/message.model.js";

class messageController {
  createMessage = async (req, res, next) => {
    try {
      const { message, projectId } = req.body;
      const files = req.files;
      let sender;
      let senderName;
      let senderEmail;
      let senderPhone;

      // If logged in
      if (req.user) {
        sender = req.user._id;
        senderName = req.user.fullName;
        senderEmail = req.user.email;
      } else {
        senderName = req.body.senderName;
        senderEmail = req.body.senderEmail;
        senderPhone = req.body.senderPhone
      }

      let images = null
      let attachments = null
      // prepare image and file
      if (files) {
        images = files
          .filter((file) => file.mimetype.startsWith("image/"))
          .map((file) => ({ url: file.path, caption: file.originalname }));
        attachments = files
          .filter((file) => !file.mimetype.startsWith("image/"))
          .map((file) => ({ url: file.path, name: file.originalname }));
      }
      //creste new message
      const newMessage = new Message({
        sender,
        senderName,
        senderEmail,
        senderPhone,
        message,
        projectId,
        images,
        files: attachments,
      });

      const savedMessage = await newMessage.save();

      res.status(201).json({
        result: savedMessage,
        status: true,
        msg: "message sent successfully",
      });
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: false,
        msg: `${error.name}: ${error?.message}`,
      });
    }
  };

  getAllMessages = async (req, res, next) => {
    try {
      const messages = await Message.find();

      if (!messages) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "No message found",
        });
      }

      res.status(200).json({
        result: messages,
        status: true,
        msg: "all messages fetched",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error fetching messages",
      });
    }
  };

  getMessageById = async (req, res, next) => {
    try {
      const messageId = req.params.id;

      const message = await Message.findById(messageId);

      if (!message) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "message not found",
        });
      }

      res.status(200).json({
        result: message,
        status: true,
        msg: "message fetched successfully",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error while getting message",
      });
    }
  };

  respondToMessage = async (req, res, next) => {
    try {
      const messageId = req.params.id;
      const { response, isResolved } = req.body;
      const responder = req.user._id;

      //input validation
      if (!response) {
        return res.status(400).json({
          result: null,
          status: false,
          msg: "response is required",
        });
      }

      const updatedMessage = await Message.findByIdAndUpdate(
        messageId,
        {
          $push: {
            responses: {
              user: responder,
              message: response,
              createAt: Date.now(),
            },
          },
          $set: {
            isResolved: isResolved || false,
          },
        },
        { new: true }
      );

      if (!updatedMessage) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "no message found",
        });
      }

      res.status(200).json({
        result: updatedMessage,
        status: true,
        msg: "response successfully sent",
      });
    } catch (error) {
      console.log(error);
      next({
        result: error,
        status: false,
        msg: "error responding ",
      });
    }
  };

  deleteMessage = async (req, res, next) => {
    try {
      const messageId = req.params.id;

      const message = await Message.findByIdAndDelete(messageId);

      if (!message) {
        return res.status(404).jaon({
          result: null,
          status: false,
          msg: "message not found",
        });
      }
      res.status(200).json({
        result: message,
        status: true,
        msg: "message deleted successfully",
      });
    } catch (error) {
      next({
        result: error,
        status: false,
        msg: "error deleting message",
      });
    }
  };

  deleteAllMessage = async (req, res, next) => {
    try {
      const result = await Message.deleteMany({});

      if (result.deletedCount === 0) {
        return res.status(404).json({
          result: null,
          status: false,
          msg: "message not found to delete",
        });
      }

      res.status(200).json({
        result: result,
        status: true,
        msg: `${result.deletedCount} messages deleted`,
      });
    } catch (error) {
      next({
        reuslt: error,
        status: false,
        msg: "error deleting all messages",
      });
    }
  };
}

export default messageController;
