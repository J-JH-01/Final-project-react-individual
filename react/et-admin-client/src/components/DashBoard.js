import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/DashBoard.css";
import UserManage from "./UserManage.js";
import PerformanceManage from "./PerformanceManage.js";
import BookedSeatDetail from "./BookedSeatDetail.js";
import BookedSeatManage from "./BookedSeatManage.js";
import SeatSelection from "./SeatSelection.js";
import AnnouncementManage from "./AnnouncementManage.js";
import ManagerEnroll from "./ManagerEnroll.js";
import UserManageDetail from "./UserManageDetail.js";
import AnnouncementDetail from "./AnnouncementDetail.js";
import PerformanceNew from "./PerformanceNew.js";
import PerformanceDetail from "./PerformanceDetail.js";
import Quill from "./Quill.jsx";
import InquiryManage from "./InquiryManage.js";
import InquiryDetail from "./InquiryDetail.js";
import MainPage from "./MainPage.js";
import styled, { keyframes } from "styled-components";
import { axiosApi } from "../api/axoisAPI";
import { NavLink, Route, Routes } from "react-router";
import ManagerEnrollDetail from "./ManagerEnrollDetail.js";



// react-router-dom 이용한 라우팅 방법
// react-router-dom : React 애플리케이션에서 라우팅을 구현하기 위해 사용하는 라이브러리
// 라우팅(router) : 사용자가 요청한 URL 경로에 따라 적절한 페이지 or 리소스 제공하는 과정
export default function DashBoard() {


// 스타일드 컴포넌트 정의
const StyledNavLink = styled(NavLink)`
text-decoration: none;
color: inherit;
font-size: 2rem;
transition: transform 0.3s ease; /* 호버 시 부드럽게 커지는 효과 */

&:hover {
  transform: scale(1.2); /* 글자가 커짐 */
}
`;

const Title = styled.h1`
text-align: center;
margin: 20px 0;
font-family: "Arial", sans-serif;
`;

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        console.log("인증 프로세스 시작");
        
        // 리프레시 토큰으로 새 액세스 토큰 요청
        console.log("리프레시 토큰 요청 시작");
        const response = await axiosApi.post(
          "/admin/refresh",
          {},
          {
            withCredentials: true,
          }
        );
        console.log("리프레시 토큰 응답:", response);
 
        const newAccessToken = response.data.accessToken;
        console.log("새 액세스 토큰 존재 여부:", !!newAccessToken);
 
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          console.log("액세스 토큰 저장됨");
 
          // 토큰에서 이메일 추출
          const payload = JSON.parse(atob(newAccessToken.split(".")[1]));
          console.log("토큰에서 추출한 페이로드:", payload);
 
          // memberEmail로 관리자 권한 확인 API 호출
          console.log("관리자 권한 확인 요청 시작");
          const adminCheckResponse = await axiosApi.get("/admin/check", {
            params: {
              memberEmail: payload.memberEmail,
              memberNo: payload.memberNo,
            },
          });
          console.log("관리자 권한 확인 응답:", adminCheckResponse);
 
          if (adminCheckResponse.data.isAdmin) {
            console.log("관리자 권한 확인됨");
            setIsAdmin(true);
          } else {
            console.log("관리자 권한 없음, 리다이렉트");
            //window.location.href = "http://localhost:80";
          }
        } else {
          console.log("액세스 토큰 없음, 리다이렉트");
         //window.location.href = "http://localhost:80";
        }
      } catch (error) {
        console.error("인증 실패 상세:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            baseURL: error.config?.baseURL
          }
        });
        //window.location.href = "http://localhost:80";
      }
    };
 
    verifyAdmin();
  }, [navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="dash-board-container">
      <Title className="dash-board-title">
      <StyledNavLink to="/">관리자 페이지</StyledNavLink>
    </Title>

      <div className="main-show-container">
        {/* 라우터 탭 */}
        <div className="router-tab-box">
          <NavLink to="/UserManage">유저관리</NavLink>
          <NavLink to="/PerformanceManage">공연장 관리</NavLink>
          <NavLink to="/BookedSeatManage">예매 좌석 관리</NavLink>
          <NavLink to="/AnnouncementManage">공지사항 관리</NavLink>
          <NavLink to="/InquiryManage">문의 내역 관리</NavLink>
          <NavLink to="/ManagerEnroll">업체계정 신청</NavLink>
        </div>

        {/* 라우터 콘텐츠 */}
        <div className="main-content">
          <Routes>

            <Route path="/" element={<MainPage />} />
            <Route path="/UserManage" element={<UserManage />} />
            <Route path="/PerformanceManage" element={<PerformanceManage />} />
            <Route path="/BookedSeatManage" element={<BookedSeatManage />} />
            <Route
              path="/AnnouncementManage"
              element={<AnnouncementManage />}
            />
            <Route path="/ManagerEnroll" element={<ManagerEnroll />} />
            <Route path="/member/:memberNo" element={<UserManageDetail />} />
            <Route
              path="/announcement/:announceNo"
              element={<AnnouncementDetail />}
            />
            <Route
              path="/manager/:concertManagerNo"
              element={<ManagerEnrollDetail />}
            />
            <Route
              path="/performance/:mt10ID"
              element={<PerformanceDetail />}
            />
            <Route path="/inquiry/:inquiryNo" element={<InquiryDetail />} />
            <Route path="/PerformanceNew" element={<PerformanceNew />} />
            <Route
              path="/seatManage/detail/:mt20id"
              element={<BookedSeatDetail />}
            />
            <Route path="/seatManage/bookingSeat" element={<SeatSelection />} />
            <Route path="/quill" element={<Quill />} />
            <Route path="/InquiryManage" element={<InquiryManage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
