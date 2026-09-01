import { useEffect, useState } from "react";
import axios from "axios";

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMedicines();
  }, []);

  async function getMedicines() {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/medicine-master/medicines/"
      );

      setMedicines(response.data);
    } catch (error) {
      console.error(error);
      setError("Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <h3 className="text-center mt-5">Loading medicines...</h3>;
  }

  if (error) {
    return <h3 className="text-danger text-center mt-5">{error}</h3>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Medicine List</h2>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Generic Name</th>
            <th>Dosage Form</th>
            <th>Strength</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.id}>
              <td>{medicine.id}</td>
              <td>{medicine.name}</td>
              <td>{medicine.generic_name}</td>
              <td>{medicine.dosage_form}</td>
              <td>{medicine.strength}</td>
              <td>{medicine.manufacturer}</td>
              <td>₹ {medicine.price}</td>

              <td>
                {medicine.is_active ? "Active" : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MedicineList;