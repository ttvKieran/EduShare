const Course = require("../../models/courses.model");

module.exports.getCourseDetail = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findOne({_id: courseId, deleted: false});
        
        res.status(200).json({
            success: true,
            data: {
                course
            }
        });
    } catch (error) {
        res.status(500).json({message: error});
    }  
}