import React, { useEffect, useState } from 'react';
import { getDocs, collection } from 'firebase/firestore'; // Firestore functions
import { db } from '../firebase'; // Firebase configuration
import NavBar from './pharmacyNav';

function IssuedPrescriptions() {
    const [issuedPrescriptions, setIssuedPrescriptions] = useState([]); // State to store issued prescription data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch issued prescriptions from Firestore
    useEffect(() => {
        const fetchIssuedPrescriptions = async () => {
            setLoading(true);
            try {
                // Get all documents from "IssuedMedications" collection
                const querySnapshot = await getDocs(collection(db, 'IssuedMedications'));
                const prescriptions = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Capture document ID
                    ...doc.data() // Spread the document data
                }));
                setIssuedPrescriptions(prescriptions);
            } catch (error) {
                console.error('Error fetching issued prescriptions:', error);
            } finally {
                setLoading(false); // Stop loading once the fetch is complete
            }
        };

        fetchIssuedPrescriptions(); // Trigger fetch on component mount
    }, []);

    return (
        <div>
            <NavBar />

            <div className="issued-prescriptions-container">

                <h2 className='topic'>Issued Prescriptions</h2>

                

                {loading ? (
                    <p>Loading issued prescriptions...</p>
                ) : issuedPrescriptions.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Health Card Number</th>
                                <th>Date Issued</th>
                                <th>Medications</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issuedPrescriptions.map((prescription) => (
                                <tr key={prescription.id}>
                                    <td>{prescription.name}</td>
                                    <td>{prescription.gender}</td>
                                    <td>{prescription.healthCardNumber}</td>
                                    <td>{prescription.date}</td>
                                    <td>
                                        {/* Loop through the outer 'medications' array */}
                                        {prescription.medications && Array.isArray(prescription.medications) ? (
                                            <ul>
                                                {prescription.medications.map((medRecord, idx) => (
                                                    <li key={idx}>
                                                        <strong>Date:</strong> {medRecord.date}
                                                        <ul>
                                                            {/* Check if 'medications' is an array */}
                                                            {medRecord.medications && Array.isArray(medRecord.medications) ? (
                                                                medRecord.medications.map((medication, medIdx) => (
                                                                    <li key={medIdx}>
                                                                        {medication.label} - {medication.dosage}
                                                                    </li>
                                                                ))
                                                            ) : medRecord.medications ? (
                                                                // If it's a single object (not an array), display it
                                                                <li>
                                                                    {medRecord.medications.label} - {medRecord.medications.dosage}
                                                                </li>
                                                            ) : (
                                                                // If no medications are found
                                                                <li>No medications listed.</li>
                                                            )}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No medications found.</p> // Handle case when medications are missing or not an array
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No issued prescriptions found.</p>
                )}
            </div>
        </div>
    );
}

export default IssuedPrescriptions;
