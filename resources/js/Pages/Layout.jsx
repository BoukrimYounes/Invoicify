import React from "react";
import { Head } from "@inertiajs/react";

function Layout({ children }) {
  return (
    <>
      {/* Shared head tags (title, meta, etc.) */}
      <Head>
        <title>My App</title>
      </Head>
      
      {/* This replaces Outlet - children will be your page content */}
      {children}
    </>
  );
}

export default Layout;