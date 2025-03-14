"use client";

import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp, db, storage } from "../../lib/firebase/clientApp";
import { Header } from "../components";

export default function AddUserForm() {
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [placeOfStay, setPlaceOfStay] = useState("");
    const [education, setEducation] = useState("");
    const [collegeOrCompany, setCollegeOrCompany] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [userType, setUserType] = useState("regular");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        let photoURL = null;
        if (photo) {
            const storageRef = ref(storage, `UserProfilePhotos/${phone}`);
            await uploadBytes(storageRef, photo);
            photoURL = await getDownloadURL(storageRef);
        }
        await addDoc(collection(db, "users"), {
          displayName,
          phone,
          dob,
          gender,
          placeOfStay,
          education,
          collegeOrCompany,
          photo: photoURL,
          userType
        });
        console.log("Document successfully written!");
        // Clear form fields
        setDisplayName("");
        setPhone("");
        setDob("");
        setGender("");
        setPlaceOfStay("");
        setEducation("");
        setCollegeOrCompany("");
        setPhoto(null);
        setUserType("regular");
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };

    return (
        <div lang="en" className="light-theme">
            <main className="content">
                

                <div className="background-screen">
                    <h1 className="heading">User Information</h1>
                    <form onSubmit={handleSubmit} className="user-form">
                        <label className="form-field">
                            Display Name:
                            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Phone Number:
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Date of Birth:
                            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Gender:
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Place of Stay in Coimbatore:
                            <input type="text" value={placeOfStay} onChange={(e) => setPlaceOfStay(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Education / Profession Details:
                            <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            College / Company Name:
                            <input type="text" value={collegeOrCompany} onChange={(e) => setCollegeOrCompany(e.target.value)} required />
                            <br /><br /><br />
                        </label>
                        <label className="form-field">
                            Photo:
                            <input type="file" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} required />
                            <br /><br /><br />
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div className="bottom-gradient" />
            </main>
        </div>
    );
}
