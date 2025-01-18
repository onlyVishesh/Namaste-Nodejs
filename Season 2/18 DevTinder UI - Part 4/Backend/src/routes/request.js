const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const { userRole } = require("../middlewares/role");
const requestRouter = express.Router();

//* To send interested or ignored request to user profile
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const fromUserId = loggedInUser._id;
      const { status, toUserId } = req.params;

      //* Checking if toUserId exist in user database
      if (mongoose.Types.ObjectId.isValid(toUserId)) {
        const isToUserExist = await User.findById(toUserId);
        if (!isToUserExist) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid user ID" });
        }
      } else {
        return res
          .status(400)
          .json({ success: false, error: "Invalid user ID" });
      }

      //* checking if toUserId === fromUserId
      if (fromUserId.equals(toUserId)) {
        return res.status(400).json({
          success: false,
          error: "You Could not send request to yourself",
        });
      }

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ success: false, error: `invalid status type ${status}` });
      }

      //* checking if there is existing connectionRequest
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request already exist" });
      }

      //* if user connection does not exist create a new connection
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();

      if (status === "interested") {
        res
          .status(200)
          .json({ success: true, message: "Connection request Send" });
      } else if (status === "ignored") {
        res.status(200).json({ success: true, message: "User ignored" });
      } else {
        res.status(400).json({ success: false, error: "Invalid request type" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

//* To view all the request send
requestRouter.get("/request/send", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;
    //* finding all the connection with interested status send form logged in user
    const totalRequests = await ConnectionRequest.countDocuments({
      $or: [
        {
          fromUserId: loggedInUser._id,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
          ],
        },
        {
          toUserId: loggedInUser._id,
          $or: [{ status: "accepted" }],
        },
      ],
    });

    const requestSent = await ConnectionRequest.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
          ],
        },
        {
          toUserId: loggedInUser._id,
          $or: [{ status: "accepted" }],
        },
      ],
    })
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: requestSent,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To view all the request received
requestRouter.get("/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    // Get pagination parameters with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Fetch total count of matching requests for pagination
    const totalRequests = await ConnectionRequest.countDocuments({
      toUserId: loggedInUser._id,
      $or: [{ status: "interested" }],
    });

    // Fetch paginated and sorted data
    const requestSent = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      $or: [{ status: "interested" }],
    })
      .sort({ createdAt: -1 }) // Sort by time (most recent first)
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with the fetched data and pagination info
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: requestSent,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

requestRouter.get("/request/followers/:userId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { userId } = req.params;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    // Fetch total count of matching requests for pagination
    const request = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          fromUserId: userId,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
            { status: "ignored" },
          ],
        },
        {
          toUserId: userId,
          fromUserId: loggedInUser._id,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
            { status: "ignored" },
          ],
        },
      ],
    });

    if (request.length === 0)
      return res.status(400).json({
        success: false,
        message: "No request found",
        user: false,
        request,
      });
    // Respond with the fetched data and pagination info
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: true,
      request,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

requestRouter.get("/request/followers", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    // Get pagination parameters with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Fetch total count of matching requests for pagination
    const totalRequests = await ConnectionRequest.countDocuments({
      $or: [
        {
          toUserId: loggedInUser._id,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
          ],
        },
        {
          fromUserId: loggedInUser._id,
          $or: [{ status: "accepted" }],
        },
      ],
    });

    // Fetch paginated and sorted data
    const requestSent = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          $or: [
            { status: "interested" },
            { status: "accepted" },
            { status: "rejected" },
          ],
        },
        {
          fromUserId: loggedInUser._id,
          $or: [{ status: "accepted" }],
        },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by time (most recent first)
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with the fetched data and pagination info
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: requestSent,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To view all the request accepted
requestRouter.get("/request/accepted", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    // Get pagination parameters with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Fetch total count of matching requests for pagination
    const totalRequests = await ConnectionRequest.countDocuments({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      status: "accepted",
    });

    // Fetch paginated and sorted data
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      status: "accepted",
    })
      .sort({ createdAt: -1 }) // Sort by time (most recent first)
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with the fetched data and pagination info
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: connections,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To view all the request rejected
requestRouter.get("/request/rejected", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }

    // Get pagination parameters with validation
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));

    // Fetch total count of matching requests for pagination
    const totalRequests = await ConnectionRequest.countDocuments({
      toUserId: loggedInUser,
      status: "rejected",
    });

    // Fetch paginated and sorted data
    const connections = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "rejected",
    })
      .sort({ createdAt: -1 }) // Sort by time (most recent first)
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    // Respond with the fetched data and pagination info
    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: connections,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To view all the ignored profiles
requestRouter.get("/request/ignored", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Please login again." });
    }
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;
    //* finding all the connection with ignored status send form logged in user
    const totalRequests = await ConnectionRequest.countDocuments({
      fromUserId: loggedInUser._id,
      status: "ignored",
    });
    const requestIgnored = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "ignored",
    })
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Requests fetched successfully",
      user: requestIgnored,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//* To delete a ignored profiles if send by loggedInUser and change status to interested it send by other
requestRouter.delete(
  "/request/review/ignored/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      // Find the connection request with the given requestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "ignored",
      });

      if (!connectionRequest) {
        return res.status(400).json({
          success: false,
          error: "Connection request does not exist or is not ignored",
        });
      }

      if (
        connectionRequest.toUserId.toString() === loggedInUser._id.toString()
      ) {
        // If the logged-in user is the toUserId, update the status to 'interested'
        connectionRequest.status = "interested";
        await connectionRequest.save();
        return res.status(200).json({
          success: true,
          message: "Connection request deleted",
        });
      } else {
        // If the logged-in user is not the toUserId, delete the connection request
        const { deletedCount } = await ConnectionRequest.deleteOne({
          _id: requestId,
        });

        if (deletedCount >= 1) {
          return res
            .status(200)
            .json({ success: true, message: "Connection request deleted" });
        } else {
          return res.status(400).json({
            success: false,
            error: "Failed to delete connection request",
          });
        }
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

//* To remove connection by potentially swap users or set the status to "interested"
requestRouter.patch(
  "/request/review/removeConnection/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      // Check if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      // Find the connection request with "ignored" status
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "accepted",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request not found" });
      }

      // Check if the logged-in user is the "fromUserId"
      if (
        connectionRequest.fromUserId.toString() === loggedInUser._id.toString()
      ) {
        // Swap the "fromUserId" and "toUserId"
        const temp = connectionRequest.fromUserId;
        connectionRequest.fromUserId = connectionRequest.toUserId;
        connectionRequest.toUserId = temp;
      }

      // Change the status to "interested"
      connectionRequest.status = "interested";

      // Save the updated connection request
      await connectionRequest.save();

      res.status(200).json({
        success: true,
        message: "Connection Removed",
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

requestRouter.patch(
  "/request/review/rejectRequest/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      //* checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request does not exist" });
      }

      //* updating new status
      connectionRequest.status = "rejected";

      await connectionRequest.save();

      return res
        .status(200)
        .json({ success: true, message: "Connection request rejected" });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

requestRouter.patch(
  "/request/review/removeRejected/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      //* checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "rejected",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request does not exist" });
      }

      //* updating new status
      connectionRequest.status = "interested";

      await connectionRequest.save();

      return res
        .status(200)
        .json({
          success: true,
          message: "Connection request moved to interested",
        });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

//* To accepted, rejected or ignored request send to logged in user
requestRouter.patch(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { status, requestId } = req.params;

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      const allowedStatus = ["accepted", "rejected", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ success: false, error: `invalid status type ${status}` });
      }

      //* checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ success: false, error: "Connection request does not exist" });
      }

      //* updating new status
      connectionRequest.status = status;

      await connectionRequest.save();

      if (status === "accepted") {
        res
          .status(200)
          .json({ success: true, message: "Connection request accepted" });
      } else if (status === "rejected") {
        res
          .status(200)
          .json({ success: true, message: "Connection request rejected" });
      } else if (status === "ignored") {
        res
          .status(200)
          .json({ success: true, message: "Connection request ignored" });
      } else {
        res.status(400).json({ success: false, error: "Invalid request type" });
      }
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

//* To delete interested request
requestRouter.delete(
  "/request/review/retrieved/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      //* checking if requestId is valid
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({ error: "Invalid request ID" });
      }

      //* checking if there is connectionRequest with status interested
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        fromUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ error: "Connection request does not exist" });
      }

      //* deleting interested request
      const { deletedCount } = await connectionRequest.deleteOne({
        _id: requestId,
      });

      if (deletedCount >= 1) {
        res
          .status(200)
          .json({ message: "Connection request has been retrieved" });
      } else {
        res
          .status(400)
          .json({ error: "Connection request could not retrieved" });
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* To view all the connections
requestRouter.get("/request/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res
        .status(401)
        .json({ success: false, error: "Unauthorized. Please login again." });
    }
    const page =
      parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
    let limit =
      parseInt(req.query.limit) > 50
        ? 50
        : parseInt(req.query.limit) < 1
        ? 1
        : parseInt(req.query.limit) || 10;

    //* finding all the connections
    const totalRequests = await ConnectionRequest.countDocuments({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    });
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId toUserId", [
        "firstName",
        "lastName",
        "username",
        "avatar",
        "about",
        "skills",
        "gender",
        "status",
      ])
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "connection fetched",
      user: connections,
      pagination: {
        total: totalRequests,
        page,
        limit,
        totalPages: Math.ceil(totalRequests / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

//* To delete connection and convert to interested
requestRouter.patch(
  "/request/review/accepted/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized. Please login again." });
      }

      const { requestId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid request ID" });
      }

      //* Find the connection request by ID
      const connectionRequest = await ConnectionRequest.findById(requestId);

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ success: false, error: "Connection request does not exist" });
      }

      //* Check if the logged-in user is involved in the connection request
      const { fromUserId, toUserId } = connectionRequest;

      //* Determine if the logged-in user is the sender or receiver
      if (loggedInUser._id.equals(fromUserId)) {
        // Logged-in user is the sender; switch roles
        connectionRequest.fromUserId = toUserId;
        connectionRequest.toUserId = fromUserId;
      }

      //* Set the status to "interested"
      connectionRequest.status = "interested";

      //* Save the updated connection request
      await connectionRequest.save();

      return res.status(200).json({
        success: true,
        message: "Connection request updated successfully",
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
);

//* To get the count of all status
requestRouter.get(
  "/moderator/requests/totalRequests/:status",
  userAuth,
  userRole("admin", "moderator"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { status } = req.params;
      //* Ensure `status` is valid
      if (
        !["all", "interested", "ignored", "accepted", "rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({ error: "Invalid status." });
      }
      //* finding all the connection with interested status
      let totalRequest;
      if (status === "all")
        totalRequest = await ConnectionRequest.countDocuments();
      else totalRequest = await ConnectionRequest.countDocuments({ status });

      res.status(200).json({ message: "Data retrieved", totalRequest });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* to get the request of overall user according to status
requestRouter.get(
  "/admin/requests/:status",
  userAuth,
  userRole("admin"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }

      const { status } = req.params;
      //* Ensure `status` is valid
      if (
        !["all", "interested", "ignored", "accepted", "rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({ error: "Invalid status." });
      }

      const page =
        parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
      let limit =
        parseInt(req.query.limit) > 50
          ? 50
          : parseInt(req.query.limit) < 1
          ? 1
          : parseInt(req.query.limit) || 10;
      //* finding all the connection with status
      let requests;
      if (status === "all")
        requests = await ConnectionRequest.find()
          .populate("fromUserId toUserId", [
            "firstName",
            "lastName",
            "username",
            "avatar",
            "about",
            "skills",
            "gender",
            "status",
          ])
          .skip((page - 1) * limit)
          .limit(limit);
      else {
        requests = await ConnectionRequest.find({
          status,
        })
          .populate("fromUserId toUserId", [
            "firstName",
            "lastName",
            "username",
            "avatar",
            "about",
            "skills",
            "gender",
            "status",
          ])
          .skip((page - 1) * limit)
          .limit(limit);
      }

      res.status(200).json({ message: "Data retrieved", requests });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//* to get the request of one user
requestRouter.get(
  "/admin/user/requests/:userId",
  userAuth,
  userRole("admin"),
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      if (!loggedInUser) {
        return res
          .status(401)
          .json({ error: "Unauthorized. Please login again." });
      }
      const { userId } = req.params;
      //* Checking if userId exist in user database
      if (mongoose.Types.ObjectId.isValid(userId)) {
        const isUserExist = await User.findById(userId);
        if (!isUserExist) {
          return res.status(400).json({ error: "Invalid user ID" });
        }
      } else {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const page =
        parseInt(req.query.page) < 1 ? 1 : parseInt(req.query.page) || 1;
      let limit =
        parseInt(req.query.limit) > 50
          ? 50
          : parseInt(req.query.limit) < 1
          ? 1
          : parseInt(req.query.limit) || 10;

      //* finding all the connection with status
      const userRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: userId }, { toUserId: userId }],
      })
        .populate("fromUserId toUserId", [
          "firstName",
          "lastName",
          "username",
          "avatar",
          "about",
          "skills",
          "gender",
          "status",
        ])
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(200).json({ message: "Data retrieved", userRequests });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

module.exports = requestRouter;
