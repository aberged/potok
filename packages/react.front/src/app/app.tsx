import { Route, Routes, Link } from 'react-router-dom';
import { Users } from './users';
import { Groups } from './groups';

export function App() {
  return (
    <div>
      <div role="navigation">
        <ul>
          <li><Link to="/">Users</Link></li>
          <li><Link to="/groups">Groups</Link></li>
        </ul>
      </div>
      <Routes>
        <Route path="/" element={<Users/>} />
        <Route path="/groups" element={<Groups/>} />
      </Routes>
    </div>
  );
}

export default App;
