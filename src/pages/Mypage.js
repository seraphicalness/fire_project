import React, { useState, useEffect } from "react";
import "../css/Mypage.css";
import axios from "axios";
import CreatePost from "./CreatePost.js"; // 글 작성 컴포넌트 임포트

const Mypage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "", userId: "" });
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempBackgroundImage, setTempBackgroundImage] = useState(null);

  // 사용자의 기본 정보를 서버에서 가져오는 역할을 합니다. 
  // 예를 들어, 사용자 이름, 프로필 이미지, 사용자 ID 등의 정보를 불러옵니다.
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/profile", { // 마이페이지 이름 표시
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        console.log("Fetched user info:", response.data);
        setUserInfo({
          username: response.data.username,
          userId: response.data._id,
          profileImage: response.data.profileImage,
          backgroundImage: response.data.backgroundImage
        });
        setProfileImage(response.data.profileImage);
        setBackgroundImage(response.data.backgroundImage);
      } catch (error) {
        console.error("사용자 정보 불러오기 오류:", error);
      }
    };
    fetchUserInfo();
  }, []);
  
  

// 사용자 ID(userId)에 해당하는 게시글들을 서버에서 가져옵니다.
useEffect(() => {
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/posts/user/${userInfo.userId}`, {
        withCredentials: true,
      });

      console.log("Fetched user posts:", response.data); // 게시글 데이터 로그로 확인
      setUserPosts(response.data);
    } catch (error) {
      console.error("게시글 가져오기 오류:", error);
      if (error.response && error.response.status === 404) {
        console.error("해당 사용자의 게시글을 찾을 수 없습니다.");
      }
    }
  };

  if (userInfo.userId) {
    console.log("Fetching posts for userId:", userInfo.userId); // userId 확인 로그
    fetchUserPosts();
  } else {
    console.log("사용자 ID를 아직 사용할 수 없습니다. 사용자 정보를 기다리는 중...");
  }
}, [userInfo.userId]);

const token = localStorage.getItem("token");

const handleImageUpload = async (file, type) => {
  const formData = new FormData();
  formData.append(type, file);  // "profile" 또는 "background"로 설정
  // formData.append('image', file);
  // formData.append('type', type);

  try {
    const endpoint = type === "profile" ? "upload-profile" : "upload-background";
    const response = await axios.post(`http://localhost:3000/profile/${endpoint}`, formData, {
      // 프로필 배경 사진 들어가는 url 
      headers: { 
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`, // 토큰 추가
      },
      withCredentials: true,
    });
    console.log("이미지 업로드 응답:", response.data); // 응답 확인
    return response.data.imageUrl;
  } catch (error) {
    console.error("이미지 업로드 오류:", error);
    return null;
  }
};



  // 프로필 사진 변경
  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTempProfileImage(file);
      setProfileImage(URL.createObjectURL(file)); // 화면에 미리보기용 URL 설정
    }
  };

  // 배경 사진 변경 
  const handleBackgroundImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setTempBackgroundImage(file);
      setBackgroundImage(URL.createObjectURL(file)); // 화면에 미리보기용 URL 설정
    }
  };

  // 사진 저장 
  const handleSaveImages = async () => {
    try {
      if (tempProfileImage) {
        const newProfileImageUrl = await handleImageUpload(tempProfileImage, "profile");
        if (newProfileImageUrl) {
          setProfileImage(newProfileImageUrl);
          setUserInfo(prev => ({ ...prev, profileImage: newProfileImageUrl }));
        }
      }
  
      if (tempBackgroundImage) {
        const newBackgroundImageUrl = await handleImageUpload(tempBackgroundImage, "background");
        if (newBackgroundImageUrl) {
          setBackgroundImage(newBackgroundImageUrl);
          setUserInfo(prev => ({ ...prev, backgroundImage: newBackgroundImageUrl }));
        }
      }
  
      // 모든 이미지가 업데이트된 후에 저장 요청을 보냅니다.
      await axios.put("http://localhost:3000/profile/update-profile", {
        profileImage: profileImage,
        backgroundImage: backgroundImage,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
  
      setIsEditing(false);
    } catch (error) {
      console.error("저장 중 오류:", error);
    }
  };
  
  

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const toggleCreatePost = () => {
    setIsCreatingPost(!isCreatingPost);
  };

  return (
    <div className="mybox">
      {/* 배경 이미지 설정 */}
      <div
        className="myrect"
        style={{ backgroundImage: `url(${backgroundImage || "default-background-image-url"})` }}
      />

      <div className="profile-container">
        {/* 프로필 이미지 설정 */}
        <img src={profileImage} alt="Profile" className="profile-image" />

        {/* 사용자 이름 표시 */}
        <div className="profile-info">
          <h2>{userInfo.username ? "@" + userInfo.username : "로그인 필요"}</h2>
          <button className="edit-profile-button" onClick={toggleEditMode}>
            {isEditing ? "수정 취소" : "프로필 수정"}
          </button>
        </div>

        {/* 글쓰기 버튼 추가 */}
        <div className="write-section">
          <button onClick={toggleCreatePost} className="write-button">
            글쓰기
          </button>
        </div>

        {/* 글 작성 폼 표시 */}
        {isCreatingPost && <CreatePost onClose={toggleCreatePost} />}
      </div>

      {isEditing && (
        <div className="edit-section">
          <h3>프로필 사진 변경</h3>
          <input type="file" accept="image/*" onChange={handleProfileImageChange} />

          <h3>배경 사진 변경</h3>
          <input type="file" accept="image/*" onChange={handleBackgroundImageChange} />

          <button onClick={handleSaveImages} className="save-button">
            저장
          </button>
        </div>
      )}

      {/* 사용자 게시글 정사각형 그리드 레이아웃 */}
      <div className="user-posts">
        {userPosts.length > 0 ? (
          userPosts.map((post) =>
            post.images.map((image, index) => (
              <div key={index} className="post-item">
                <img src={image} alt="User Post" className="post-image" />
              </div>
            ))
          )
        ) : (
          <p>게시물이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default Mypage;



// import React, { useState, useEffect, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import "../css/Mypage.css";
// import axios from "axios";
// import CreatePost from "./CreatePost.js";

// const Mypage = () => {
//   const { username } = useParams();  // URL에서 username 파라미터 가져오기
//   const [userPosts, setUserPosts] = useState([]);
//   const [userInfo, setUserInfo] = useState({ username: "", userId: "" });
//   const [profileImage] = useState("https://via.placeholder.com/100");
//   const [backgroundImage] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [isCreatingPost, setIsCreatingPost] = useState(false);

//   const fetchUserInfo = async () => {
//     if (!username) return;

//     try {
//       const response = await axios.get(`http://localhost:3000/users/${username}`);
//       const { _id, username: fetchedUsername } = response.data;
//       setUserInfo({ username: fetchedUsername, userId: _id });
//     } catch (error) {
//       console.error("사용자 정보 가져오기 오류:", error);
//     }
//   };

//   const fetchUserPosts = useCallback(async () => {
//     // const username = userInfo.username;
//     console.log("userInfo.username:", username); // userId가 있는지 확인
//     if (!username) return; // userId가 없는 경우 함수 중지

//     try {
//         const response = await axios.get(`http://localhost:3000/posts/user/${username}`);

//         const { _id, username: fetchedUsername } = response.data;
//         setUserInfo({ username: fetchedUsername, userId: _id });

//         console.log("Fetched user posts:", response.data); // 데이터 확인
//         setUserPosts(response.data);
//     } catch (error) {
//         console.error("게시글 가져오기 오류:", error);
//     }
// }, [username]);


// useEffect(() => {
//   const storedUserInfo = localStorage.getItem("userInfo");
//   if (storedUserInfo) {
//     const parsedInfo = JSON.parse(storedUserInfo);

//     // userId가 없으면 서버에서 사용자 정보 가져오기
//     if (!parsedInfo.userId) {
//       fetchUserInfo();
//     } else {
//       setUserInfo(parsedInfo); // 로컬 스토리지에서 userInfo가 있을 경우 그대로 설정
//     }
//   } else {
//     fetchUserInfo(); // 로컬 스토리지에 없을 경우 fetchUserInfo 호출
//   }
// }, []);

// useEffect(() => {
//   fetchUserPosts();
// }, [fetchUserPosts]);

// const toggleEditMode = () => {
//   setIsEditing(!isEditing);
// };

// const toggleCreatePost = () => {
//   setIsCreatingPost(!isCreatingPost);
// };

//   return (
//     <div className="mybox">
//       <div className="myrect" style={{ backgroundImage: `url(${backgroundImage || "default-background-image-url"})` }} />
//         <div className="profile-container">
//           <img src={profileImage} alt="Profile" className="profile-image" />
//             <div className="profile-info">
//             <h2>{userInfo.username ? "@" + userInfo.username : "로그인 필요"}</h2>
//             <button className="edit-profile-button" onClick={toggleEditMode}>
//               {isEditing ? "수정 완료" : "프로필 수정"}
//             </button>
//             </div>
//           <button onClick={toggleCreatePost} className="write-button">글쓰기</button>
//         </div>

//       {isCreatingPost && <CreatePost onClose={toggleCreatePost} />}

//       {/* 사용자 게시글 정사각형 그리드 레이아웃 */} 
//       <div className="user-posts">
//         {userPosts.length > 0 ? (
//           userPosts.map((post) =>
//             post.images.map((image, index) => (
//               <div key={index} className="post-item">
//                 <img src={image} alt="User Post" className="post-image" />
//               </div>
//             ))
//           )
//         ) : (
//           <p>게시물이 없습니다.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Mypage;
