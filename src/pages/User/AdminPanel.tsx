import "./AdminPanel.css";
import "../../index.css";
import {
  User,
  // User as ImportedUser,
  columns,
} from "../../components/user/columns";
import PointTable from "../../components/user/PointTable.tsx";

import React, { FormEvent, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  getAllUserProfileWithPoints,
  getUserProfileByName,
} from "@/api/userProfileApi.ts";
import { useSearchParams } from "react-router-dom";
import { getUserRoles } from "@/api/rolePermissionApi.ts";
import { useRoleListStore } from "@/stores/useRoleListStore.ts";

const AdminPanel: React.FC = () => {
  const setRoles = useRoleListStore((state) => state.setRoles);
  const [searchParams, setSearchParams] = useSearchParams();
  const [userProfileData, setUserProfileData] = useState<User[]>([]);
  const [searchedName, setSearchedName] = React.useState("");
  const [isSearchedNameSubmitted, setSearchedNameSubmitted] =
    React.useState(false);

  const pageNo = Number(searchParams.get("page_no")) || 1;

  const userProfileWithPointsQuery = useQuery({
    queryKey: ["userProfileWithPoints", pageNo],
    queryFn: async () => {
      const data = await getAllUserProfileWithPoints({ page_no: pageNo });

      console.log("data ", data);

      setUserProfileData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    // retry: 0,
  });

  const getUserProfileByNameQuery = useQuery({
    queryKey: ["userProfileWithPoints", searchedName],
    queryFn: async () => {
      console.log("searched name ", searchedName);

      const data = await getUserProfileByName({ searched_name: searchedName });

      console.log("data ", data);
      setUserProfileData(data);
      return data;
    },
    refetchOnWindowFocus: false,
    retry: 0,
    enabled: isSearchedNameSubmitted,
  });

  useQuery({
    queryKey: ["userRoles"],
    queryFn: async () => {
      const data = await getUserRoles();

      console.log("user roles ", data);
      setRoles(data);

      return data;
    },
    refetchOnWindowFocus: false,
    // retry: 0,
  });

  console.log("userProfileWithPoints data: ", userProfileWithPointsQuery.data);

  useEffect(() => {
    // Retrieve tokens from sessionStorage
    const idToken = sessionStorage.getItem("id_token");
    const accessToken = sessionStorage.getItem("access_token");

    // Retrieve the API headers from sessionStorage
    const userHeaders = JSON.parse(
      sessionStorage.getItem("user_headers") ?? "{}"
    );

    // Console log the tokens
    console.log("ID Token:", idToken);
    console.log("Access Token:", accessToken);
    console.log("userHeaders:", userHeaders);
  }, []); // Empty dependency array means this effect runs once on mount

  const handlePrevPageClick = () => {
    // setPageNo((prev) => prev - 1);

    setSearchParams({ page_no: (pageNo - 1).toString() });
  };
  const handleNextPageClick = () => {
    // setPageNo((next) => next + 1);
    setSearchParams({ page_no: (pageNo + 1).toString() });
  };

  const handleSearchNameSubmit = (event: FormEvent) => {
    event.preventDefault();
    console.log("entereddd ", searchedName);

    if (searchedName !== "") {
      setSearchedNameSubmitted(true);
    } else {
      setSearchedNameSubmitted(false);
    }

    setSearchedName("");
  };

  const handleResetSearch = () => {
    userProfileWithPointsQuery.refetch();
  };

  useEffect(() => {
    // Refetch data when searchParams change
    userProfileWithPointsQuery.refetch();
  }, [searchParams]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        setSearchedNameSubmitted(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (isSearchedNameSubmitted) {
      getUserProfileByNameQuery.refetch();
      setSearchedNameSubmitted(false); // Reset the flag after triggering the query
    }
  }, [isSearchedNameSubmitted, getUserProfileByNameQuery]);

  return (
    <div className="adminPageContainer">
      <div className="table-container">
        <h1 style={{ textAlign: "left", margin: "5px" }}>User </h1>
        {userProfileWithPointsQuery.isLoading ? (
          "Loading User Profiles..."
        ) : (
          <PointTable
            columns={columns}
            data={userProfileData ?? []}
            searchedName={searchedName}
            setSearchedName={setSearchedName}
            handlePrevPage={handlePrevPageClick}
            handleNextPage={handleNextPageClick}
            handleSearchNameSubmit={handleSearchNameSubmit}
            handleResetSearch={handleResetSearch}
          />
        )}
      </div>
    </div>
  );
};

//Task is to see if you can console log the items in the form

export default AdminPanel;
