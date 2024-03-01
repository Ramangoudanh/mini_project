import { useSelector } from 'react-redux';
import React, { useState, useRef,useEffect } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from 'firebase/storage';
  import { app } from '../firebase';
export default function EmailForm() {

  const [senderEmail, setSenderEmail] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [complaint, setComplaint] = useState('');
  const [category, setCategory] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [image, setImage] = useState(null);
  const [link,setLink] =useState('www.google.com');

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        
      },
      (error) => {
        
      },
      (snapshot) => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setLink(downloadURL)
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle form submission, for example, sending the data to an API
    const formData = {
     uuid: currentUser.uuid,
      senderEmail,
      complaint,
      complaint_proof:link,
      issue_category:category
  };

  try {
      const response = await fetch("/api/complaint/addcomplaint", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
      });

      if (!response.ok) {
          throw new Error("Failed to submit complaint.");
      }

      console.log("Complaint submitted successfully!");
      // You might want to do something after a successful submission, like showing a success message to the user.
  } catch (error) {
      console.error("Error submitting complaint:", error.message);
      // Handle the error, perhaps show an error message to the user.
  }

    console.log({
      senderEmail,
      receiverEmail,
      complaint,
      category
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Compose Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">Sender Email</label>
          <input
            type="email"
            id="senderEmail"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            placeholder="Enter sender email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="receiverEmail" className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
          <input
            type="email"
            id="receiverEmail"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            placeholder="Enter receiver email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-1">Complaint</label>
          <textarea
            id="complaint"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            rows="4"
            placeholder="Enter your complaint"
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            id="category"
            className="w-full border rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            <option value="Technical">Technical</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Billing">Billing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <input
          type='file'
          ref={fileRef}
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />

        <br/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Send Email</button>
      </form>
    </div>
  );
}
