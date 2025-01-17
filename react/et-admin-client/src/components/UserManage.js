import React, { useEffect, useState } from "react";
import { axiosApi } from "../api/axoisAPI";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// 페이지네이션 스타일 컴포넌트
const PaginationContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 30px;
  padding: 20px 0;
`;

const PageButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${(props) => (props.active ? "#ff7f27" : "#e0e0e0")};
  border-radius: 4px;
  background-color: ${(props) => (props.active ? "#ff7f27" : "white")};
  color: ${(props) => (props.active ? "white" : "#333")};
  font-size: 14px;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  transition: all 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.active ? "#ff7f27" : "#fff3e0")};
    border-color: #ff7f27;
    color: ${(props) => (props.active ? "white" : "#ff7f27")};
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const ArrowButton = styled(PageButton)`
  width: 32px;
  font-size: 12px;
  font-weight: bold;
`;

const TitleContainer = styled.div`
  width: fit-content;
  margin: 20px auto;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff7f27 0%, #ff9f5b 100%);
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(255, 127, 39, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;

  h4 {
    margin: 0;
    font-size: 24px;
    color: white;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
  }

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  table-layout: auto;
`;

const TableHeader = styled.th`
  padding: 15px;
  background-color: #ff7f27;
  color: white;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  vertical-align: middle;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #fff3e0;
  }
  cursor: pointer;
  border-bottom: 1px solid #eeeeee;
  height: 50px;
`;

const TableCell = styled.td`
  padding: 12px 15px;
  color: #333;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
`;

// 페이지네이션 컴포넌트
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pageRange = 5;
  const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  const endPage = Math.min(totalPages, startPage + pageRange - 1);

  if (totalItems === 0) return null;

  return (
    <PaginationContainer>
      <ArrowButton onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        {"<<"}
      </ArrowButton>
      <ArrowButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </ArrowButton>

      {[...Array(endPage - startPage + 1)].map((_, index) => {
        const pageNumber = startPage + index;
        return (
          <PageButton
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            active={currentPage === pageNumber}
          >
            {pageNumber}
          </PageButton>
        );
      })}

      <ArrowButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </ArrowButton>
      <ArrowButton
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </ArrowButton>
    </PaginationContainer>
  );
};

// ShowMember 컴포넌트
const ShowMember = ({
  memberList,
  currentPage,
  itemsPerPage,
  onPageChange,
}) => {
  const navigate = useNavigate();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = memberList.slice(indexOfFirstItem, indexOfLastItem);

  // 전체 목록 기준 번호 생성 함수
  const getListNumber = (index) => {
    return indexOfFirstItem + index + 1;
  };

  return (
    <section>
      {memberList.length === 0 ? (
        <p>회원이 없습니다.</p>
      ) : (
        <>
          <TableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <TableHeader style={{ width: "10%" }}>번호</TableHeader>
                  <TableHeader style={{ width: "25%" }}>회원 이름</TableHeader>
                  <TableHeader style={{ width: "40%" }}>회원 주소</TableHeader>
                  <TableHeader style={{ width: "25%" }}>전화번호</TableHeader>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((member, index) => (
                  <TableRow
                    key={member.memberNo}
                    onClick={() => navigate(`/member/${member.memberNo}`)}
                  >
                    <TableCell>{getListNumber(index)}</TableCell>
                    <TableCell>{member.memberNickname}</TableCell>
                    <TableCell>{member.memberAddress}</TableCell>
                    <TableCell>{member.memberTel}</TableCell>
                  </TableRow>
                ))}
              </tbody>
            </StyledTable>
          </TableContainer>
          <Pagination
            totalItems={memberList.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
};

// 메인 UserManage 컴포넌트
export default function UserManage() {
  const [selectedValue, setSelectedValue] = useState("회원이름");
  const [inputValue, setInputValue] = useState("");
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const options = [
    { id: 1, label: "회원이름" },
    { id: 2, label: "주소" },
    { id: 3, label: "전화번호" },
  ];

  const getShowMemberList = async () => {
    try {
      const resp = await axiosApi.get("/member/showMemberList");
      if (resp.status === 200) {
        setMemberList(resp.data);
      }
    } catch (error) {
      console.log("회원 : " + error);
    }
  };

  useEffect(() => {
    getShowMemberList();
  }, []);

  useEffect(() => {
    if (memberList != null) {
      setLoading(false);
    }
  }, [memberList]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue || inputValue.trim() === "") {
      alert("검색어를 입력해주세요");
      return;
    }

    const formData = {
      selectedValue: selectedValue,
      inputValue: inputValue,
    };

    try {
      const resp = await axiosApi.post(
        "/member/searchShowMemberList",
        formData
      );

      if (resp.status === 200) {
        const getData = resp.data;
        setMemberList(getData);
        setCurrentPage(1); // 검색 후 첫 페이지로 이동
      } else {
        throw new Error("서버 요청 실패");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="menu-box">
      <TitleContainer
        onClick={() => {
          getShowMemberList();
          setCurrentPage(1);
          setInputValue("");
          setSelectedValue("회원이름");
        }}
      >
        <h4>유저관리</h4>
      </TitleContainer>

      <div>
        <form>
          <select value={selectedValue} onChange={handleChange}>
            {options.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <i
            className="fas fa-search search-icon"
            onClick={handleSubmit}
            style={{ cursor: "pointer" }}
          />
        </form>
      </div>

      <div className="main-table-container" style={{ textAlign: "center" }}>
        <ShowMember
          memberList={memberList}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
