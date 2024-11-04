// schemas/postSchema.js
import mongoose from 'mongoose';


const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  images: [String], // 이미지 URL 배열
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);

// // Post에서 author의 username 포함하여 조회
// Post.find()
//   .populate('author', 'username') // author 필드에 username만 포함하여 가져오기
//   .exec((err, posts) => {
//     if (err) console.error(err);
//     console.log(posts); // 각 게시글의 author.username을 포함한 데이터
//   });