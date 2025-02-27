import { NavLink, Link } from "react-router-dom";
import { CDBSidebarMenuItem } from "cdbreact";
import "./Cell.scss";

const Cell = (props) => {
  const { children, linkStr, setPage, selectedPage, linkType, disabled } =
    props;
    if (linkStr && linkStr.startsWith('http')) {
      return (
        <a href={linkStr} target="_blank" activeClassName="activeClicked" className={disabled && 'disabled'} disabled={disabled}>
          <CDBSidebarMenuItem
            className="monkey-sidebar-item normal"
          >
            {children}
          </CDBSidebarMenuItem>
        </a>
      )
    } else if (linkType === "ALink") {
    return (
      <a exact to={"/" + linkStr} activeClassName="activeClicked" className={disabled && 'disabled'} disabled={disabled}>
        <CDBSidebarMenuItem
          className={`monkey-sidebar-item ${
            selectedPage.includes(linkStr) ? "selected" : "normal"
          }`}
          onClick={() => setPage(linkStr)}
        >
          {children}
        </CDBSidebarMenuItem>
      </a>
    )
  } else {
    return (
      <NavLink
      exact
      to={"/" + linkStr}
      activeClassName="activeClicked"
      className={disabled && 'disabled'}
      disabled={disabled}
    >
      <CDBSidebarMenuItem
        className={`monkey-sidebar-item ${
          selectedPage.includes(linkStr) ? "selected" : "normal"
        }`}
        onClick={() => setPage(linkStr)}
      >
        {children}
      </CDBSidebarMenuItem>
    </NavLink>
    );
  }
};

export default Cell;