import User from "../schemas/userSchema.js";

// 프로필 이미지 업로드
export const uploadProfileImage = async (req, res) => { 
   // profile/upload-profile
  try {
    console.log("프로필 이미지 업로드 요청 수신");
    console.log("업로드된 파일 정보:", req.file); // 파일 정보 확인
    console.log("업로드 요청 사용자 ID:", req.user._id); // 사용자 ID 확인
    
    if (!req.file) {
      console.log("파일이 없음");
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    // const imageUrl = `http://localhost:3000/${req.file.path.replace('uploads/', '')}`;
    // 실제 서버에서 접근 가능한 URL 생성
    const imageUrl = `http://localhost:3000/uploads/profile/${req.file.filename}`; // 경로확인완료 
    // await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl });
    
    console.log("생성된 이미지 URL:", imageUrl); // 이미지 URL 확인
    
    const updateResult = await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl }, { new: true });
    console.log("DB 업데이트 결과:", updateResult); // DB 업데이트 결과 확인
        
    if (!updateResult) {
      console.log("DB 업데이트 실패");
      return res.status(500).json({ message: "DB 업데이트 실패" });
    }
    
    // 정상적으로 이미지 URL을 반환
    res.json({ imageUrl });
  } catch (error) {
    console.error("프로필 이미지 업로드 오류:", error);
    res.status(500).json({ message: "프로필 이미지 업로드 오류", error: error.message });
  }
};

// 배경 이미지 업로드
export const uploadBackgroundImage = async (req, res) => {
  try {
    console.log("배경 이미지 업로드 요청 수신");
    console.log("업로드된 파일 정보:", req.file); // 파일 정보 확인
    console.log("업로드 요청 사용자 ID:", req.user._id); // 사용자 ID 확인
    
    if (!req.file) {
      console.log("파일이 없음");
      return res.status(400).json({ message: '파일이 없습니다.' });
    }

    const imageUrl = `http://localhost:3000/uploads/background/${req.file.filename}`; // 경로확인완료
    console.log("생성된 이미지 URL:", imageUrl); // 이미지 URL 확인

    const updateResult = await User.findByIdAndUpdate(req.user._id, { backgroundImage: imageUrl }, { new: true });
    console.log("DB 업데이트 결과:", updateResult); // DB 업데이트 결과 확인

    if (!updateResult) {
      console.log("DB 업데이트 실패");
      return res.status(500).json({ message: "DB 업데이트 실패" });
    }
    // 정상적으로 이미지 URL을 반환
    res.json({ imageUrl });
  } catch (error) {
    console.error("배경 이미지 업로드 오류:", error);
    res.status(500).json({ message: "배경 이미지 업로드 오류", error: error.message });
  }
};

// 프로필 정보 조회
export const getProfileInfo = async (req, res) => {
  // profile/info
  try {
    console.log("프로필 정보 조회 요청 수신");
    const user = await User.findById(req.user._id).select("username profileImage backgroundImage");
    console.log("조회된 사용자 정보:", user); // 조회된 사용자 정보 확인

    if (!user) {
      console.log("사용자 없음");
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json({
      username: user.username,
      profileImage: user.profileImage,
      backgroundImage: user.backgroundImage,
    });
  } catch (error) {
    console.error("프로필 정보 조회 오류:", error);
    res.status(500).json({ message: "프로필 정보 조회 오류", error: error.message });
  }
};

// 프로필 업데이트 (예: 프로필 이미지, 배경 이미지) - 수정 용도 
export const updateProfile = async (req, res) => {
  const { profileImage, backgroundImage } = req.body;
  console.log("프로필 업데이트 요청 수신");
  console.log("요청 데이터:", req.body); // 요청 데이터 확인
  console.log("업데이트 요청 사용자 ID:", req.user._id); // 사용자 ID 확인

  try {
    const user = await User.findById(req.user._id);
    console.log("조회된 사용자:", user); // 조회된 사용자 정보 확인

    if (!user) {
      console.log("사용자 없음");
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 프로필 정보 업데이트
    if (profileImage) user.profileImage = profileImage;
    if (backgroundImage) user.backgroundImage = backgroundImage;
    const savedUser = await user.save();
    console.log("프로필 업데이트 후 저장된 사용자 정보:", savedUser); // 저장 후 사용자 정보 확인

    res.json({ profileImage: user.profileImage, backgroundImage: user.backgroundImage });
  } catch (error) {
    console.error("프로필 업데이트 오류:", error);
    res.status(500).json({ message: "프로필 업데이트 오류", error: error.message });
  }
};