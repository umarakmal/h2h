import React from 'react'

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <div>
      <footer style={{ fontSize: "13px" }} className="main-footer footer ">
        <center>
          <strong>
            &copy; {year} <b> Cogent</b>.{" "}
          </strong>
          All rights reserved.
          <div className="float-right d-none d-sm-inline-block"></div>
        </center>
      </footer>
    </div>
  )
}

export default Footer