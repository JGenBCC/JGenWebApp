"use client";
import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, updateDoc, query, where, documentId } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseApp, db, storage } from "../../lib/firebase/clientApp";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { compressImage } from "../utils";
import AppLayout from "../components/AppLayout";  // Use AppLayout for proper sidebar toggle
import CustomImage from "../../components/CustomImage";
// ...existing imports...

export default function UpdateUserDetailsForm() {
    const { user, loading } = useAuth();
    const [displayName, setDisplayName] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [placeOfStay, setPlaceOfStay] = useState("");
    const [education, setEducation] = useState("");
    const [collegeOrCompany, setCollegeOrCompany] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [docId, setDocId] = useState<string>("");
    const [photoURL, setPhotoURL] = useState("");
    const [originalData, setOriginalData] = useState<any>({});

    useEffect(() => {
        if (loading || !user || !user.userDocId) return;
        async function fetchUser() {
            const q = query(collection(db, "users"), where(documentId(), "==", user.userDocId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                setDocId(userDoc.id);
                const data = userDoc.data();
                setDisplayName(data.displayName || "");
                setPhone(data.phone ? data.phone.replace(/^\+91/, "") : "");
                setDob(data.dob || "");
                setGender(data.gender || "");
                setPlaceOfStay(data.placeOfStay || "");
                setEducation(data.education || "");
                setCollegeOrCompany(data.collegeOrCompany || "");
                setPhotoURL(data.photoURL || "");
                setOriginalData({
                    displayName: data.displayName || "",
                    phone: data.phone ? data.phone.replace(/^\+91/, "") : "",
                    dob: data.dob || "",
                    gender: data.gender || "",
                    placeOfStay: data.placeOfStay || "",
                    education: data.education || "",
                    collegeOrCompany: data.collegeOrCompany || "",
                    photoURL: data.photoURL || ""
                });
            }
        }
        fetchUser();
    }, [user?.userDocId, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !photo &&
            displayName === originalData.displayName &&
            phone === originalData.phone &&
            dob === originalData.dob &&
            gender === originalData.gender &&
            placeOfStay === originalData.placeOfStay &&
            education === originalData.education &&
            collegeOrCompany === originalData.collegeOrCompany
        ) {
            console.log("No changes detected. Update skipped.");
            return;
        }

        const updatedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
        const storagePhone = phone.startsWith("+91") ? phone.substring(3) : phone;

        try {
            let newPhotoURL: string | null = null;
            const updatePayload: any = {
                displayName,
                phone: updatedPhone,
                dob,
                gender,
                placeOfStay,
                education,
                collegeOrCompany
            };
            if (photo) {
                const compressedPhoto = await compressImage(photo, 0.7, 1024) as Blob;
                const storageRef = ref(storage, `UserProfilePhotos/${storagePhone}`);
                await uploadBytes(storageRef, compressedPhoto);
                newPhotoURL = await getDownloadURL(storageRef);
                updatePayload.photoURL = newPhotoURL;
            }
            if (user?.userDocId) {
                await updateDoc(doc(db, "users", user.userDocId), updatePayload);
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
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    return (
        <AppLayout pageTitle="Update User Details">
            <div className="background-screen">
                <form onSubmit={handleSubmit} className="user-form">
                    {/* ...existing form fields... */}
                    <label className="form-field">
                        Display Name:
                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Phone Number:
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Date of Birth:
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Gender:
                        <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Place of Stay in Coimbatore:
                        <input type="text" value={placeOfStay} onChange={(e) => setPlaceOfStay(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Education / Profession Details:
                        <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        College / Company Name:
                        <input type="text" value={collegeOrCompany} onChange={(e) => setCollegeOrCompany(e.target.value)} required />
                        {/* ...existing code... */}
                    </label>
                    <label className="form-field">
                        Photo:
                        <input type="file" onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)} />
                        {/* ...existing code... */}
                    </label>
                    {photoURL && (
                        <div className="user-photo-container">
                            <CustomImage
                                src={photoURL}
                                alt={`${displayName}'s photo`}
                                className="user-photo"
                                width={100}
                                height={100}
                            />
                        </div>
                    )}
                    <button type="submit">Update</button>
                </form>
            </div>
        </AppLayout>
    );
}
