const quizdb=require('../Models/quiz.model');

const quizCheck=async (req,res,next)=>{
    const {quizId}=req.params;
    try{
        if(await quizdb.findById(quizId)){
            next()
        }else{
            return res.status(404).json({
                ok:false,
                message:"Data not found"
            })
        }
    }catch(error){
        console.log(error);
        return res.status(404).json({
            ok:false,
            message:"Data not found"
        })
    }
}

module.exports=quizCheck;