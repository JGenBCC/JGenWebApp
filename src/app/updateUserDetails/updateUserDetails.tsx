"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, query, where, documentId } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp, db, storage } from "../../lib/firebase/clientApp";
import { Header } from "../components";
import { useAuth } from "../../context/AuthContext"; // new import

export default function UpdateUserDetailsForm() {
    // New states for current user and additional users state
    const [users, setUsers] = useState<User[]>([]);
    const { user, loading } = useAuth();

    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [placeOfStay, setPlaceOfStay] = useState("");
    const [education, setEducation] = useState("");
    const [collegeOrCompany, setCollegeOrCompany] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [userType, setUserType] = useState("regular");
    const [docId, setDocId] = useState<string>("");

    useEffect(() => {
        if (loading || !user || !user.userDocId) return; // ensure user info is ready
        async function fetchUser() {
            const q = query(collection(db, "users"), where(documentId(), "==", user.userDocId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setDocId(userDoc.id);
                const data = userDoc.data();
                setDisplayName(data.displayName || "");
                setPhone(data.phone ? data.phone.replace(/^\+91/, "") : ""); // removed +91 prefix
                setDob(data.dob || "");
                setGender(data.gender || "");
                setPlaceOfStay(data.placeOfStay || "");
                setEducation(data.education || "");
                setCollegeOrCompany(data.collegeOrCompany || "");
            }
        }
        fetchUser();
    }, [user?.userDocId, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let photoURL: string | null = null;
            const updatePayload: any = {
                displayName,
                phone,
                dob,
                gender,
                placeOfStay,
                education,
                collegeOrCompany,
                userType
            };
            if (photo) {
                const storageRef = ref(storage, `UserProfilePhotos/${phone}`);
                await uploadBytes(storageRef, photo);
                photoURL = await getDownloadURL(storageRef);
                updatePayload.photo = photoURL;
            }
            if (docId) {
                await updateDoc(doc(db, "users", docId), updatePayload);
                console.log("Document successfully updated!");
            } else {
                console.error("User document not found!");
            }
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
            console.error("Error updating document: ", error);
        }
    };

    return (
        <div lang="en" className="light-theme">
            <main className="content" style={{ backgroundImage: 'url("/path/to/background-image.jpg")', backgroundSize: 'cover' }}>
                <div className="dots" />
                <Header />
                <div className="background-screen">
                    <h1 className="heading">Update User Details</h1>
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
                        <button type="submit">Update</button>
                    </form>
                </div>
                <div className="bottom-gradient" />
            </main>
        </div>
    );
}
