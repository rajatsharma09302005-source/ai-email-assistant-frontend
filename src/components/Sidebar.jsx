import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="d-flex flex-column bg-white border-end" style={{ width: '220px', minHeight: 'calc(100vh - 56px)' }}>
      <div className="p-3">
        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-dark'}`
              }
            >
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-dark'}`
              }
            >
              <i className="bi bi-inbox me-2"></i>Inbox
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/sent"
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-dark'}`
              }
            >
              <i className="bi bi-send me-2"></i>Sent
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/compose"
              className={({ isActive }) =>
                `nav-link rounded px-3 py-2 ${isActive ? 'bg-primary text-white' : 'text-dark'}`
              }
            >
              <i className="bi bi-pencil-square me-2"></i>Compose
            </NavLink>
          </li>
        </ul>

        <hr />

        <p className="text-muted small fw-semibold px-3 mb-2">AI TOOLS</p>
        <ul className="nav flex-column gap-1">
          <li className="nav-item">
            <NavLink
              to="/compose?mode=improve"
              className="nav-link rounded px-3 py-2 text-dark"
            >
              <i className="bi bi-magic me-2"></i>Improve Email
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/compose?mode=reply"
              className="nav-link rounded px-3 py-2 text-dark"
            >
              <i className="bi bi-reply me-2"></i>Generate Reply
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar