const Feedback = require("../../models/feedbacks.model");

module.exports.getAllFeedback = async (req, res) => {
    try {
        const {documentId} = req.params;
        const {page, limit} = req.query;
        const skip = (page - 1) * limit;
        // console.log(documentId, page, limit, skip);
        const feedbacks = await Feedback.find({documentId: documentId, deleted: false, isParent: true})
        // .populate({
        //     path: 'reply.feedbackId'
        // })
        .sort({createdAt: -1})
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        
        const total = await Feedback.countDocuments({documentId: documentId, deleted: false, isParent: true});
        res.status(200).json({
            success: true,
            data: {
                feedbacks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total/limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({message: error});
    }  
}

module.exports.createFeedback = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { parentId } = req.query;
        const { comment, position } = req.body;
        const reviewerId = req.user._id;
        const name = req.user.fullName;
        console.log(req);
        const feedback = {
            comment,
            documentId,
            reviewer: {
                reviewerId: reviewerId,
                position: position || 'student',
                name: name
            },
            isParent: (parentId ? false : true)
        }
        const newFeedback = new Feedback(feedback);
        await newFeedback.save();
        if(parentId){
            const reply = {
                feedbackId: newFeedback._id
            }
            await Feedback.updateOne({_id: parentId}, {$push: {reply: reply}});
        }
        res.status(201).json({
            success: true,
            data: newFeedback
        })
    } catch (error) {
        res.status(500).json({message: error});
    }
}

module.exports.getRelies = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        const feedback = await Feedback.find({_id: feedbackId, deleted: false})
        .populate({
            path: "reply.feedbackId"
        })
        const replies = feedback[0].reply;
        console.log(feedback);
        res.status(201).json({
            success: true,
            data: replies
        })
    } catch (error) {
        res.status(500).json({message: error});
    }
}