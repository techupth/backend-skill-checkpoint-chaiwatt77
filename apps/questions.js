import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const questionRouter = Router();

const collection = db.collection("backendCheckpoint"); // เลือก collection

if(!collection){
  console.log("database collection error")
}

//test // http://localhost:4000/questions // questionRouter.get("/", (req, res)=>{ ต้องไม่ซ้ำ
// questionRouter.get("/", (req, res) => {
//   return res.json("Hello Skill Checkpoint #2");
// });



questionRouter.get("/", async (req, res) => {
  let search = req.query.search
  
  const query = {};

  if(search){
    query.title = new RegExp(search, "i")
  }

  try {
    const result = await collection.find(query).toArray()
    return res.json({ data: result });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

questionRouter.get("/:id", async (req, res) => {
  const objId = new ObjectId(req.params.id);
  const result = await collection.findOne({_id:objId});
  return res.json({
    data: result
 });
});

questionRouter.post("/", async (req, res) => {
  let create_at = new Date();// ใช้กับเพิ่มเวลาหลังบ้าน
  const questionData = {...req.body};
  let like = 0;
  //const result = await collection.insertOne({...questionData});

  const result = await collection.insertOne({...questionData,create_at,like}); // ใช้กับเพิ่มเวลาหลังบ้าน
  return res.json({
    message: "Product has been created successfully"
  });
});

questionRouter.put("/:id", async (req, res) => {
  const objId = new ObjectId(req.params.id);
  const upd = {...req.body}
  await collection.updateOne({_id: objId},{$set:upd});
  return res.json({
    message: "Product has been updated successfully"
 });
});

questionRouter.delete("/:id", async (req, res) => {
  const collectionAnswer = db.collection("answer");
  const qsId = req.params.id

  //ลบคำตอบทั้งหมด อาจจะเพิ่ม ถ้ามีคำตอบถึงมาทำในบล๊อกนี้
  const deleteAll = req.query.deleteAll
    await collectionAnswer.deleteMany({ qsId: qsId });
  //   return res.json({
  //     message: "Product has been All deleted successfully"
  //  });
  //ลบคำตอบทั้งหมด

  const objId = new ObjectId(req.params.id);
  await collection.deleteOne({_id:objId})

  return res.json({
    message: "Product has been deleted successfully"
 });
});


//สร้างคำตอบ ใช้อีก collection นึง
questionRouter.post("/:id/answer", async (req, res) => {
  const collection = db.collection("answer");
  const answer = {...req.body};
  const qsId = req.params.id
  let like = 0;
  let id; //id ของ answer ค่อยใส่เพิ่ม
  let create_at;// ค่อยใส่ทีหลัง

  //console.log(answer.answer)
    //อักษรห้ามเกิน
    if(answer.answer.length>10){
      console.log("ห้ามเกิน 10 ตัว")
      return res.json({
        message: "ห้ามใส่อักษรเกิน 10 ตัว"
      });
    }
    //อักษรห้ามเกิน

  const result = await collection.insertOne({...answer,qsId,like}); 
  return res.json({
    message: "Answer has been created successfully"
  });
});

questionRouter.get("/:id/answer", async (req, res) => {
  const collection = db.collection("answer");
  const qsId = req.params.id
  // console.log(typeof qsId)
  const result = await collection.find({qsId:qsId}).toArray();
    return res.json({ data: result });
});


questionRouter.delete("/:id/answer", async (req, res) => {
  const collection = db.collection("answer");
  const qsId = req.params.id

  //ลบ answer พอกดลบอีกครั้งกลายเป็นสร้าง answer 1 อัน เป็นเพราะ ปุ่มอยู่ใกล้กัน พอกดแล้วการทำงานเลยมีความซ้ำซ้อนกัน(ระยะการถูกกดของปุ่มอาจจะทับซ้อนกัน) พอเอาออกห่างแล้วเป็นปกติ ไม่มีการสร้างเพิ่ม
  //http://localhost:4000/questions/${params.id}/answer?deleteAll=delete`
  // const deleteAll = req.query.deleteAll
  // //console.log(deleteAll)
  // if(deleteAll){
  //   await collection.deleteMany({ qsId: qsId });
  //   return res.json({
  //     message: "Product has been All deleted successfully"
  //  });
  // }
  //ลบ answer ทั้งหมด

  const ansId = new ObjectId(req.query.answerid);
  //await collection.deleteOne({ _id: ansId}); // เช็คแค่ _id
  await collection.deleteOne({ _id: ansId, qsId: qsId }); // เช็คทั้ง _id และ qsId
  return res.json({
    message: "Product has been deleted successfully"
 });
});


//ลบ answer ทั้งหมด พอกดลบอีกครั้งกลายเป็นสร้าง answer 1 อัน เป็นเพราะ ปุ่มอยู่ใกล้กัน พอกดแล้วการทำงานเลยมีความซ้ำซ้อนกัน(ระยะการถูกกดของปุ่มอาจจะทับซ้อนกัน) พอเอาออกห่างแล้วเป็นปกติ ไม่มีการสร้างเพิ่ม
questionRouter.delete("/:id/answer/deleteAll", async (req, res) => {
  const collection = db.collection("answer");
  const qsId = req.params.id

  //console.log(deleteAll)
    await collection.deleteMany({ qsId: qsId });

    return res.json({
      message: "Product has been All deleted successfully"
   });
  //ลบ answer ทั้งหมด

});











questionRouter.get("*", (req, res) => {
  return res.status(404).json("Not found");
});

export default questionRouter;
