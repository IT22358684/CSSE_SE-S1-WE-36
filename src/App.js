import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Dashboard from './screens/Pharmacy/Dashboard';
import ViewPrescriptions from './screens/Pharmacy/ViewPrescriptons';
import AddMedicine from './screens/Pharmacy/AddMedicine';
import ViewInventory from './screens/Pharmacy/ViewInventory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="ViewPrescriptions" element={<ViewPrescriptions />} />
        <Route path="ViewInventory" element={<ViewInventory />} />
        <Route path="add-medicine" element={<AddMedicine />} />
      </Routes>
    </Router>
  );
}

export default App;
