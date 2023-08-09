import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuth, signout } from "./component/auth/helpers";
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
const Header = () => {
  const navigate = useNavigate();
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <div>
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              className="nav-link"
              data-widget="pushmenu"
              to="#"
              role="button"
            >
              <i className="fas fa-bars" />
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto"><li style={{ fontWeight: 500, fontSize: '.9rem' }}>Happy To Help</li></ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown">

            <Link className="nav-link" data-toggle="dropdown" to="#" aria-expanded>
              <Chip
                avatar={<Avatar style={{ backgroundColor: ' #007bff', color: 'white' }} alt={isAuth() ? isAuth().result1.EmployeeName : null} src="/static/images/avatar/1.jpg" />}
                label={isAuth() ? isAuth().result1.EmployeeName : null}
                style={{ cursor: 'pointer', fontWeight: 400 }}
                variant="outlined"
              />
            </Link>
            <div className="dropdown-menu dropdown-menu-lg" style={{ minWidth: '100%' }}>
              {isAuth() && (
                <Grid item xs>
                  <Item label="Logout" className="nav-link"
                    style={{ cursor: "pointer", color: "black" }}
                    onClick={() => {
                      signout(() => {
                        navigate("/");
                      })
                    }}
                    variant="outlined"
                  >Logout</Item>
                </Grid>
              )}


            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
