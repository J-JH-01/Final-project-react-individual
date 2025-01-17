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

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get("state");

        // state 파라미터가 없으면 메인으로 리다이렉트
        // if (!stateParam) {
        //   window.location.href = "http://modeunticket.store/";
        //   return;
        // }

        const state = JSON.parse(atob(decodeURIComponent(stateParam)));

        // 타임스탬프 검증
        if (new Date().getTime() - state.timestamp > 5 * 60 * 1000) {
          localStorage.removeItem("adminAuth");
          localStorage.removeItem("adminToken");
          window.location.href = "http://modeunticket.store/";
          return;
        }

        // API 호출로 관리자 권한 확인
        const response = await fetch(
          "https://adminmodeunticket.store/admin/auth",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberEmail: state.memberEmail,
              memberNo: state.memberNo,
            }),
          }
        );

        // if (!response.ok) {
        //   throw new Error('관리자 권한 확인 실패');
        // }

        const checkData = await response.json();

        // isAdmin 확인 추가
        if (!checkData.isAdmin) {
          throw new Error(checkData.message || "관리자 권한이 없습니다");
        }

        if (!checkData.accessToken) {
          throw new Error("인증 토큰이 없습니다");
        }

        // 인증 성공 시 localStorage 설정
        localStorage.setItem("adminAuth", "true");
        localStorage.setItem("adminToken", checkData.accessToken);
        setIsAdmin(true);

        // URL에서 state 파라미터 제거
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      } catch (error) {
        console.error("관리자 검증 실패:", error);
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminToken");
        //window.location.href = "http://modeunticket.store/";
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAdmin) return null;

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
