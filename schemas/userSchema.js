import mongoose from 'mongoose'; // mongoose를 import
import bcrypt from 'bcryptjs'; // bcrypt 모듈을 사용하여 비밀번호 해싱

const { Schema, model } = mongoose; // mongoose에서 Schema와 model을 가져옴

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	}
});

// 비밀번호 해싱 (유저 정보 저장 전에 수행)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 비밀번호가 일치하는지 확인하는 메서드
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// User 모델을 export
export default model('User', userSchema);

// const userSchema = new Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	}
// });
// // 간단하게 username, email, password 3가지 항목만 받음

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });
// // 이벤트 리스너를 등록
// // save 이벤트가 실행되었을 때 해싱작업을 진행하며, 
// // 수정되지 않았을 경우 해싱을 할 필요가 없기 때문에 한 번 걸러주는 작업을 해줍니다.
// // salt는 해싱과정에서 요구되는 랜덤 값으로, 
// // 파라미터 값이 커질수록 salt값이 복잡해져 보안성이 높아집니다. 
// // 하지만 그만큼 해싱과정이 오래걸리는 단점이 있죠
// // 그리고 다음 동작인 save로 넘겨줍니다.

// userSchema.methods.matchPassword = async (enteredPassword) => {
//     return await bcrypt.compare(enteredPassword, this.password);
// };
// // 비밀번호가 일치하는지 확인하는 메서드도 등록

// export default model('UserSchema', userSchema);
// // 마지막으로 모델로 감싸고 export