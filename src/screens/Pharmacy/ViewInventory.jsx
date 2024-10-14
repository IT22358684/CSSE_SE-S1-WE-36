import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions to fetch data
import { db } from '../firebase'; // Firebase configuration
import { Link } from 'react-router-dom';
import NavBar from './pharmacyNav';

function ViewMedicines() {
  const [medicines, setMedicines] = useState([]); // State to store fetched medicines
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch medicines from Firestore when the component mounts
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Medicines')); // Fetch documents from the 'Medicines' collection
        const medicinesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // Map over the documents and extract the data
        setMedicines(medicinesList); // Set the medicines in state
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchMedicines();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div>

    <div className="issued-prescriptions-container">
         <NavBar />
      <h2 className='topic'>Medicine Inventory</h2>
<div className='btnContainer text-end'>
<Link to="/add-medicine" className="btn btn-success mb-3">Add New Medicine</Link>
</div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        medicines.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Expiration Date</th>
                <th>Remaining Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td style={{width: '40%'}}>{medicine.medicineName}</td>
                  <td style={{width: '10%' , textAlign: 'center'}}>{medicine.dosage}</td>
                  <td style={{width: '15%' , textAlign: 'center'}}>{medicine.expirationDate}</td>
                  <td style={{width: '15%' , textAlign: 'center'}}>{medicine.remainingStock}</td>
                  <td style={{width: '20%' , textAlign: 'right'}}>{medicine.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No medicines found in the inventory.</p>
        )
      )}
    </div>
    </div>
  );
}

export default ViewMedicines;
