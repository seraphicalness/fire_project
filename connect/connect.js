import mongoose from "mongoose";

const password ="PgvyFN3SQniRHjCB"; // 여러분의 mongoDB 비밀번호
const connectURL = `mongodb+srv://Nahee:${password}@nahee.3th65.mongodb.net/`; // MondgoDB URL

const connect = () =>{
	if (process.env.NODE_ENV !== 'production') {
		mongoose.set('debug', true)
	}

	mongoose.connect(connectURL, {
		dbName: "datas"
	}).then(()=>{  // 연결 성공하면 실행 
		console.log('Connected to MongoDB')
	}).catch((err)=> {  // 연결 실패하면 실행 
		console.log('fail to connect MongoDB')
		console.error(err);
	})
}

export default connect;