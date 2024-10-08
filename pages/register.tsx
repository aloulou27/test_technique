"use client"; // <-- Assurez-vous que ce fichier est un composant Client

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Register() {
  const { data: session } = useSession();
  const email = session?.user?.email || "";
  let firstName = "";
  let lastName = "";

  // Vérification si l'email est bien au format nom.prenom@example.com
  if (email && email.includes("@") && email.split("@")[0].includes(".")) {
    [firstName, lastName] = email.split("@")[0].split(".");
  }

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    dob: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to get the coordinates of an address
  async function getCoordinates(address) {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
        address
      )}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { latitude, longitude };
    } else {
      throw new Error("Adresse introuvable");
    }
  }

  // Haversine formula to calculate distance between two geographic points
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const address = formData.address;

    try {
      const { latitude, longitude } = await getCoordinates(address);
      const parisLatitude = 48.8566;
      const parisLongitude = 2.3522;

      const distance = calculateDistance(
        latitude,
        longitude,
        parisLatitude,
        parisLongitude
      );

      if (distance <= 50) {
        // The address is valid and within 50 km of Paris
        alert("Adresse valide");
        // Proceed with registration logic here
      } else {
        alert("L'adresse doit être située à moins de 50 km de Paris.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la vérification de l'adresse.");
    }
  };

  return (
    <main>
      <div>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/fonts/icomoon/style.css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <title>Inscription</title>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-md-2">
                <img
                  src="/images/undraw_file_sync_ot38.svg"
                  alt="Image"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6 contents">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h3>Inscription</h3>
                      <p className="mb-4">
                        Veuillez remplir les informations ci-dessous pour vous
                        inscrire.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-control"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-control"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dob">Date de naissance</label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          className="form-control"
                          value={formData.dob}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Adresse</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="form-control"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Numéro de téléphone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        S'inscrire
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
