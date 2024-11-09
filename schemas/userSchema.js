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
	},
	profileImage: String, // 여기에 profileImage 필드 추가
  	backgroundImage: String, // 여기에 backgroundImage 필드 추가
});

// // `findByToken` 메서드를 `userSchema.statics`에 추가
userSchema.statics.findByToken = async function (token) {
	const User = this;

	try {
	  // 토큰을 검증하고 디코딩하여 사용자 ID를 얻음
	  const decoded = jwt.verify(token, process.env.JWT_SECRET);
	  return User.findOne({ _id: decoded.userId });
	} catch (error) {
	  return null; // 토큰이 유효하지 않으면 null을 반환
	}
};   


// 비밀번호 해싱 (유저 정보 저장 전에 수행)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 비밀번호가 일치하는지 확인하는 메서드
userSchema.methods.comparePassword = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = async function() {
	const token = jwt.sign(this._id.toHexString(), "secretToken");
	this.token = token;
	await this.save();
	return this;
};

// User 모델을 export
export default model('User', userSchema);
