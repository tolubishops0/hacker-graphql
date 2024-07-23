import React from "react";
import { Routes, Route } from "react-router-dom";
import LinkList from "./LinkList";
import CreateLinks from "./CreateLinks";
import Header from "./Header";
import Login from "./Login";
import Search from "./Search";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LinkList />} />
        <Route path="/create" element={<CreateLinks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </>
  );
};

export default App;
