var { timer } = require("../model/extra.model");
var { test } = require("../model/test.model");
const fs = require('fs');
const questionFilePath = 'questions.json';

const initalTimer = async(req,res) => {
    const userId  = req.body.userId;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const remainingTime = req.body.remainingTime;

    const existingUser = await timer.findOne({ userId: userId });
    if (existingUser) res.status(400).json({ err: `Page Already Exists` });
    var newTimer = new timer({
        timerId: userId,
        startTime: startTime,
        endTime: endTime,
        remainingTime: remainingTime
    })
    newTimer.save()
            .then(() => res.json(`Saved Successfull`))
            .catch((err) => {
                if (err) {
                    // console.log("There was an error");
                    return res.status(400).json({ error: err });
                }
            });
}
const checkTimer = async(req,res) => {
    const remainingTime = req.body.remainingTime;
    const userId = req.body.userId;
    const currentTimer = await timer.findOne({timerId : userId});
    if(currentTimer){
        // console.log("This is : ",Math.abs(parseInt(currentTimer.remainingTime) - 2 * 60 * 1000 - remainingTime),currentTimer.remainingTime,remainingTime);
        if(Math.abs(parseInt(currentTimer.remainingTime) - 2 * 60 * 1000 - remainingTime) >= 1500){
            res.json({msg : true});
        }
        else{
            res.json({msg : false});
        }
    }
}
const fetchQuestions = (req,res) => {
    fs.readFile(questionFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          res.status(500).send('Error reading questions');
        } else {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        }
      });
}
const saveAns = async(req,res) => {
    const answer = req.body.optedAns;
    const userId = req.body.userId;
    const opted = await test.findOne({userId : userId});
    if(!opted){
        var newTest = new test({
            userId : userId
        })
        newTest.save(); 
    }
    else{
        await test.updateOne({userId : userId},{answer:answer})
    }
    res.status(200).json({msg : "Success"})
}
const getAns = async(req,res) => {
    const userId = req.body.userId;
    const opted = await test.findOne({userId : userId});
    let ans;
    // console.log("Initial",userId) 
    if(!opted){
        var newTest = new test({
            userId : userId
        })
        await newTest.save();
        ans = await test.findOne({userId : userId});
        // console.log("Saving",userId,ans) 
    }
    else{
        ans = await test.findOne({userId : userId});
    }
    res.status(200).json({ans:ans["answer"]});
}
const checkAnsStatus = async(req,res) => {
    const userId = req.body.userId;
    const answer = req.body.optedAns;
    const opted = await test.findOne({userId : userId});
    if(!opted){
        var newTest = new test({
            userId : userId
        })
        newTest.save(); 
    }
    else{
        const ans = await test.findOne({userId : userId});
        const keys = Object.keys(ans["answer"])
        // console.log(answer,ans)
        for(let i = 0;i<keys.length;i++){
            for(let j = 0;j<4;j++){
                if(ans["answer"][keys[i]][j] !== answer[keys[i]][j])res.status(200).json({msg : false});
                // console.log(keys[i],ans["answer"][keys[i]][j],answer[keys[i]][j])
            }
        }
        res.status(200).json({msg : true});
    }
}

module.exports = { checkTimer,initalTimer,fetchQuestions,saveAns,getAns,checkAnsStatus }