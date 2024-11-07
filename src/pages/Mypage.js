import React, { useState, useEffect, useCallback } from "react";
import "../css/Mypage.css";
import axios from "axios";
import CreatePost from "./CreatePost.js";

const Mypage = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [userInfo, setUserInfo] = useState({ username: "", userId: "" });
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempBackgroundImage, setTempBackgroundImage] = useState(null);

  const token = localStorage.getItem("token");

  // 게시글을 가져오는 함수
  const fetchUserPosts = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem("token"); // 토큰 확인
      console.log("Fetching posts for userId:", userId); // 로그인된 사용자의 userId 가져오기
      const response = await axios.get(`http://localhost:3000/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }, // 토큰 포함
        withCredentials: true,
      });
      console.log("Fetched user posts:", response.data); // 확인용 로그
      setUserPosts(response.data);
    } catch (error) {
      console.error("게시글 가져오기 오류:", error);
    }
  }, []);

  // 사용자 정보를 불러오는 함수
  const fetchUserInfo = useCallback(async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/user/profile", { // 프로필 이름 불러오기 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      console.log("Fetched user info:", response.data);

      const { username, _id, profileImage, backgroundImage } = response.data;
      setUserInfo({ username, userId: _id }); // id값으로 접근가능 
      setProfileImage(profileImage);
      setBackgroundImage(backgroundImage);

      fetchUserPosts(_id);
    } catch (error) {
      console.error("사용자 정보 불러오기 오류:", error);
    }
  }, [token, fetchUserPosts]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const handleImageUpload = async (file, type) => {
    const formData = new FormData();
    formData.append(type, file);

    try {
      const endpoint = type === "profile" ? "upload-profile" : "upload-background";
      const response = await axios.post(`http://localhost:3000/profile/${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("이미지 업로드 응답:", response.data);
      return response.data.imageUrl;
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      return null;
    }
  };

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

      await fetchUserInfo();
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
      <div className="myrect" style={{ backgroundImage: `url(${backgroundImage || "default-background-image-url"})` }} />

      <div className="profile-container">
        <img src={profileImage} alt="Profile" className="profile-image" />

        <div className="profile-info">
          <h2>{userInfo.username ? "@" + userInfo.username : "로그인 필요"}</h2>
          <button className="edit-profile-button" onClick={toggleEditMode}>
            {isEditing ? "수정 취소" : "프로필 수정"}
          </button>
        </div>

        <div className="write-section">
          <button onClick={toggleCreatePost} className="write-button">글쓰기</button>
        </div>

        {isCreatingPost && <CreatePost onClose={toggleCreatePost} />}
      </div>

      {isEditing && (
        <div className="edit-section">
          <h3>프로필 사진 변경</h3>
          <input type="file" accept="image/*" name="profile" onChange={(e) => setTempProfileImage(e.target.files[0])} />

          <h3>배경 사진 변경</h3>
          <input type="file" accept="image/*" name="background" onChange={(e) => setTempBackgroundImage(e.target.files[0])} />

          <button onClick={handleSaveImages} className="save-button">저장</button>
        </div>
      )}

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


// import React, { useState, useEffect } from "react";
// import "../css/Mypage.css";
// import axios from "axios";
// import CreatePost from "./CreatePost.js"; // 글 작성 컴포넌트 임포트

// const Mypage = () => {
//   const [userPosts, setUserPosts] = useState([]);
//   const [userInfo, setUserInfo] = useState({ username: "", userId: "" });
//   const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
//   const [backgroundImage, setBackgroundImage] = useState("");
//   const [isEditing, setIsEditing] = useState(false);
//   const [isCreatingPost, setIsCreatingPost] = useState(false);
//   const [tempProfileImage, setTempProfileImage] = useState(null);
//   const [tempBackgroundImage, setTempBackgroundImage] = useState(null);

//   // 사용자의 기본 정보를 서버에서 가져오는 역할을 합니다.
//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     // 토큰이 없으면 로그인 페이지로 리디렉션
//     if (!token) {
//       window.location.href = "/login";
//       return;
//     }

//     const fetchUserInfo = async () => {
//       try {
//         const response = await axios.get("http://localhost:3000/user/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         });
//         console.log("Fetched user info:", response.data);

//         // 불러온 데이터를 컴포넌트 상태로 설정
//         const { username, _id, profileImage, backgroundImage } = response.data;
//         setUserInfo({ username, userId: _id });
//         setProfileImage(profileImage);
//         setBackgroundImage(backgroundImage);

//         // userId가 설정된 후 게시글 데이터를 가져옴
//         fetchUserPosts(_id);
//       } catch (error) {
//         console.error("사용자 정보 불러오기 오류:", error);
//       }
//     };

//     // 게시글 데이터 가져오기 함수
//     const fetchUserPosts = async (userId) => {
//       try {
//         console.log("Fetching posts for userId:", userId);
//         const response = await axios.get(`http://localhost:3000/user/posts/${userId}`, {
//           withCredentials: true,
//         });
//         console.log("Fetched user posts:", response.data);
//         setUserPosts(response.data);
//       } catch (error) {
//         console.error("게시글 가져오기 오류:", error);
//         if (error.response && error.response.status === 404) {
//           console.error("해당 사용자의 게시글을 찾을 수 없습니다.");
//         }
//       }
//     };

//     fetchUserInfo();
//   }, []);
//   // 사용자의 기본 정보를 서버에서 가져오는 역할을 합니다. 
//   // 예를 들어, 사용자 이름, 프로필 이미지, 사용자 ID 등의 정보를 불러옵니다.
//   //userInfo 상태 설정 
// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
  
// //       // 토큰이 없으면 로그인 페이지로 리디렉션
// //       if (!token) {
// //         window.location.href = "/login";
// //         return; // 리디렉션 후 아래 코드가 실행되지 않도록 return
// //       }

// //     const fetchUserInfo = async () => {
// //       try {
// //         const response = await axios.get("http://localhost:3000/user/profile", { // 마이페이지 이름 표시
// //           headers: { Authorization: `Bearer ${token}` },
// //           withCredentials: true,
// //         });
// //         console.log("Fetched user info:", response.data);

// //         // 불러온 데이터를 컴포넌트 상태로 설정
// //         setUserInfo({
// //           username: response.data.username,
// //           userId: response.data._id,
// //           profileImage: response.data.profileImage,
// //           backgroundImage: response.data.backgroundImage
// //         });
// //         setProfileImage(response.data.profileImage);  // 여기서 프로필 이미지 URL 설정
// //         setBackgroundImage(response.data.backgroundImage);  // 여기서 배경 이미지 URL 설정
// //       } catch (error) {
// //         console.error("사용자 정보 불러오기 오류:", error);
// //       }
// //     };
// //     fetchUserInfo();
// //   }, []);
  
  

// // // 사용자 ID(userId)에 해당하는 게시글들을 서버에서 가져옵니다.
// // useEffect(() => {
// //   const fetchUserPosts = async () => {
// //     try {
// //       const response = await axios.get(`http://localhost:3000/user/posts/${userInfo.userId}`, {
// //         withCredentials: true,
// //       });

// //       console.log("Fetched user posts:", response.data); // 게시글 데이터 로그로 확인
// //       setUserPosts(response.data);
// //     } catch (error) {
// //       console.error("게시글 가져오기 오류:", error);
// //       if (error.response && error.response.status === 404) {
// //         console.error("해당 사용자의 게시글을 찾을 수 없습니다.");
// //       }
// //     }
// //   };

// //   if (userInfo.userId) {
// //     console.log("Fetching posts for userId:", userInfo.userId); // userId 확인 로그
// //     fetchUserPosts();
// //   } else {
// //     console.log("사용자 ID를 아직 사용할 수 없습니다. 사용자 정보를 기다리는 중...");
// //   }
// // }, [userInfo.userId]);

// const token = localStorage.getItem("token");

// // 프로필, 배경 이미지 업로드 기능
// const handleImageUpload = async (file, type) => {
// const formData = new FormData(); // 여기에 이미지 파일 추가해서 서버로 전송 
//   formData.append(type, file);

//   // formData.append("image", file);
//   // formData.append("type", type); 

//   try { // 서버로부터 이미지url받아와서 미리보기 이미지 즉시 확인 가능 
//     const endpoint = type === "profile" ? "upload-profile" : "upload-background";
//     const response = await axios.post(`http://localhost:3000/profile/${endpoint}`, formData, {
//       headers: { 
//         'Content-Type': 'multipart/form-data',
//         Authorization: `Bearer ${token}`,
//       },
//       withCredentials: true,
//     });
//     console.log("이미지 업로드 응답:", response.data);
//     console.log("서버에서 받은 이미지 URL:", response.data.imageUrl); // 서버에서 반환된 URL 확인
//     return response.data.imageUrl; // 서버의 URL 반환
//   } catch (error) {
//     console.error("이미지 업로드 오류:", error);
//     return null;
//   }
// };



//   // 프로필 사진 변경 미리보기
//   const handleProfileImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setTempProfileImage(file);
//       setProfileImage(URL.createObjectURL(file)); // 화면에 미리보기용 URL 설정
//       // 이미지 변경됐을 때 호출해서 이미지 즉시 렌더링 
//     }
//   };

//   // 배경 사진 변경 미리보기 
//   const handleBackgroundImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setTempBackgroundImage(file);
//       setBackgroundImage(URL.createObjectURL(file)); // 화면에 미리보기용 URL 설정
//       // 이미지 변경됐을 때 호출해서 이미지 즉시 렌더링 
//     }
//   };

// // 사진 저장버튼 눌렀을 때 호출 
// const handleSaveImages = async () => {
//   try {
//     if (tempProfileImage) { // 상태에 따라 서버에 이미지 업로드 
//       const newProfileImageUrl = await handleImageUpload(tempProfileImage, "profile");
//       if (newProfileImageUrl) {
//         setProfileImage(newProfileImageUrl);
//         setUserInfo(prev => ({ ...prev, profileImage: newProfileImageUrl }));
//       } 
//     }

//     if (tempBackgroundImage) { // 상태에 따라 서버에 이미지 업로드 
//       const newBackgroundImageUrl = await handleImageUpload(tempBackgroundImage, "background");
//       if (newBackgroundImageUrl) {
//         setBackgroundImage(newBackgroundImageUrl);
//         setUserInfo(prev => ({ ...prev, backgroundImage: newBackgroundImageUrl }));
//       } 
//     }

//     // 모든 이미지가 업데이트된 후에 저장 요청을 보냅니다.
//     await axios.put("http://localhost:3000/profile/update-profile", {
//       profileImage: profileImage,
//       backgroundImage: backgroundImage,
//     }, {
//       headers: { Authorization: `Bearer ${token}` },
//       withCredentials: true,
//     });

//     // 이미지 저장 후 최신 사용자 정보 다시 불러오기
//     await fetchUserInfo(); // 업데이트 후 최신 정보 반영

//     setIsEditing(false);
//   } catch (error) {
//     console.error("저장 중 오류:", error);
//   }
// };

//   // // 사진 저장버튼 눌렀을 때 호출 
//   // // 업로드 이미지 db에 저장함 - 서버와 동기화 문제 발생하지 않게 주의
//   // const handleSaveImages = async () => {
//   //   try {
//   //     if (tempProfileImage) { // 상태에 따라 서버에 이미지 업로드 
//   //       const newProfileImageUrl = await handleImageUpload(tempProfileImage, "profile");
//   //       if (newProfileImageUrl) {
//   //         setProfileImage(newProfileImageUrl);
//   //         setUserInfo(prev => ({ ...prev, profileImage: newProfileImageUrl }));
//   //       } 
//   //     }
  
//   //     if (tempBackgroundImage) { // 상태에 따라 서버에 이미지 업로드 
//   //       const newBackgroundImageUrl = await handleImageUpload(tempBackgroundImage, "background");
//   //       if (newBackgroundImageUrl) {
//   //         setBackgroundImage(newBackgroundImageUrl);
//   //         setUserInfo(prev => ({ ...prev, backgroundImage: newBackgroundImageUrl }));
//   //       } 
//   //     }
  
//   //     // 모든 이미지가 업데이트된 후에 저장 요청을 보냅니다.
//   //     // DB에 업데이트 요청
//   //     await axios.put("http://localhost:3000/profile/update-profile", {
//   //       profileImage: profileImage,  // profileImage 상태를 서버로 전송해 사용자 데이터 저장
//   //       backgroundImage: backgroundImage,  // backgroundImage 상태를 서버로 전송해 사용자 데이터 저장
//   //     }, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //       withCredentials: true,
//   //     });
  
//   //     setIsEditing(false);
//   //   } catch (error) {
//   //     console.error("저장 중 오류:", error);
//   //   }
//   // };
  
  

//   const toggleEditMode = () => {
//     setIsEditing(!isEditing);
//   };

//   const toggleCreatePost = () => {
//     setIsCreatingPost(!isCreatingPost);
//   };

//   return (
//     <div className="mybox">
//       {/* 배경 이미지 설정 */}
//       <div
//         className="myrect"
//         style={{ backgroundImage: `url(${backgroundImage || "default-background-image-url"})` }}
//       />

//       <div className="profile-container">
//         {/* 프로필 이미지 설정 */}
//         <img src={profileImage} alt="Profile" className="profile-image" />

//         {/* 사용자 이름 표시 */}
//         <div className="profile-info">
//           <h2>{userInfo.username ? "@" + userInfo.username : "로그인 필요"}</h2>
//           <button className="edit-profile-button" onClick={toggleEditMode}>
//             {isEditing ? "수정 취소" : "프로필 수정"}
//           </button>
//         </div>

//         {/* 글쓰기 버튼 추가 */}
//         <div className="write-section">
//           <button onClick={toggleCreatePost} className="write-button">
//             글쓰기
//           </button>
//         </div>

//         {/* 글 작성 폼 표시 */}
//         {isCreatingPost && <CreatePost onClose={toggleCreatePost} />}
//       </div>

//       {isEditing && (
//         <div className="edit-section">
//           <h3>프로필 사진 변경</h3>
//           <input type="file" accept="image/*" name="profile" onChange={handleProfileImageChange} />

//           <h3>배경 사진 변경</h3>
//           <input type="file" accept="image/*" name="background" onChange={handleBackgroundImageChange} />

//           <button onClick={handleSaveImages} className="save-button">
//             저장
//           </button>
//         </div>
//       )}

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
