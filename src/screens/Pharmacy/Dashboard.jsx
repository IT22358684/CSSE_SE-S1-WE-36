import React, { useState } from 'react';
import { getDocs, collection, query, where, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Nav from './pharmacyNav';
import './phStyle.css';

function Dashboard() {
  const [healthCardNumber, setHealthCardNumber] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalPayment, setTotalPayment] = useState(null); // State to hold total payment

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const q = query(collection(db, 'Patients'), where('healthCardNumber', '==', healthCardNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setPatientData(data); // Store entire patient data
        setShowModal(true);
      } else {
        setPatientData(null);
        alert('No data found for this health card number');
      }
    } catch (error) {
      console.error('Error fetching patient details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShowModal(false);

  // Function to handle issuing the medication
  const handleIssue = async () => {
    if (!patientData) return;

    const issuedData = {
      name: patientData.Name,
      gender: patientData.gender,
      healthCardNumber: patientData.healthCardNumber,
      date: new Date().toISOString().split('T')[0],
      medications: patientData.medications || [],
      totalPayment: totalPayment, // Include total payment
    };

    try {
      await addDoc(collection(db, 'IssuedMedications'), issuedData);
      alert('Medication issued successfully!');
      handleClose();
      setTotalPayment(null); // Reset total payment after issuing
    } catch (error) {
      console.error('Error issuing medication:', error);
      alert('Failed to issue medication.');
    }
  };


// Function to calculate the payment
const calculatePayment = async () => {
  if (!patientData || !patientData.medications || patientData.medications.length === 0) {
    alert('No medications found for this patient.');
    return;
  }

  let total = 0; // Initialize total payment

  for (const prescribedMedication of patientData.medications) {
    // Assuming medications can be an array of objects
    if (Array.isArray(prescribedMedication.medications)) {
      for (const medication of prescribedMedication.medications) {
        const medicineName = medication.label;
        const prescribedDosage = parseFloat(medication.dosage); // Dosage prescribed

        // Fetch the medicine data from Firestore
        const medicineQuery = query(collection(db, 'Medicines'), where('medicineName', '==', medicineName));
        const medicineSnapshot = await getDocs(medicineQuery);

        if (!medicineSnapshot.empty) {
          const medicineData = medicineSnapshot.docs[0].data();
          const price = parseFloat(medicineData.price); // Get the price of the medicine
          const dosage = parseFloat(medicineData.dosage); // Get the dosage of the medicine

          if (isNaN(price) || isNaN(dosage)) {
            alert('Invalid medicine data retrieved.');
            return;
          }

          // Calculate the payment for this medication
          const payment = (price / dosage) * prescribedDosage;
          total += payment; // Add to total payment
        } else {
          alert(`No medicine found with the name: ${medicineName}`);
        }
      }
    } else {
      // Handle the case where medications is a single object instead of an array
      const medication = prescribedMedication.medications;
      const medicineName = medication.label;
      const prescribedDosage = parseFloat(medication.dosage);

      const medicineQuery = query(collection(db, 'Medicines'), where('medicineName', '==', medicineName));
      const medicineSnapshot = await getDocs(medicineQuery);

      if (!medicineSnapshot.empty) {
        const medicineData = medicineSnapshot.docs[0].data();
        const price = parseFloat(medicineData.price); // Get the price of the medicine
        const dosage = parseFloat(medicineData.dosage); // Get the dosage of the medicine

        if (isNaN(price) || isNaN(dosage)) {
          alert('Invalid medicine data retrieved.');
          return;
        }

        // Calculate the payment for this medication
        const payment = (price / dosage) * prescribedDosage;
        total += payment; // Add to total payment
      } else {
        alert(`No medicine found with the name: ${medicineName}`);
      }
    }
  }

  setTotalPayment(total.toFixed(2)); // Set total payment and fix to 2 decimal points
};

  return (
    <div>
      
      <Nav/>
      <div className='dashboardBg'>

      {/* Form for entering health card number */}
      <div className="searchbar" style={{ padding: '60px', paddingTop: '250px' }}>
        <form className="d-flex" role="search" onSubmit={handleSearch}>
          <input
            className="form-control"
            type="search"
            placeholder="Enter health card number..."
            aria-label="Search"
            id="patienID"
            name="patienID"
            value={healthCardNumber}
            onChange={(e) => setHealthCardNumber(e.target.value)}
            style={{ width: '700px' , padding: '10px'}}
          />
          <button className="searchbtn" type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
        </form>
      </div>

      {/* Modal to display fetched patient details */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Medication Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <p>Loading...</p>
          ) : (
            patientData && (
              <div className="medications-container">
                <h4>Patient Details</h4>
                <div className="medications-detailItem">
                  <span className="medications-label">Name:</span>
                  <span className="medications-value">{patientData.Name}</span>
                </div>
                <div className="medications-detailItem">
                  <span className="medications-label">Age:</span>
                  <span className="medications-value">{patientData.Age}</span>
                </div>
                <div className="medications-detailItem">
                  <span className="medications-label">Gender:</span>
                  <span className="medications-value">{patientData.gender}</span>
                </div>
                <div className="medications-detailItem">
                  <span className="medications-label">Health Card Number:</span>
                  <span className="medications-value">{patientData.healthCardNumber}</span>
                </div>

                
              </div>
            )
          )}
          {patientData && (
            <div className="calculate-payment text-center mt-4">
              <Button variant="success" onClick={calculatePayment}>
                Calculate Payment
              </Button>
              {totalPayment !== null && (
                <div className="mt-3">
                  <h5>Total Payment: ${totalPayment}</h5>
                </div>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleIssue}>Issue</Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
}

export default Dashboard;
