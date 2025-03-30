"use client";
import { useEffect, useState } from "react";
import { IconTrash, IconEye } from "@tabler/icons-react";
import axios from "axios";
import { toast } from "sonner";
import SidebarComponent from "../../components/layout/Sidebar";
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documents"); // adjust API
      setDocuments(response.data);
    } catch (err) {
      toast.error("Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      toast.success("Document deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarComponent></SidebarComponent>
      <div className="min-w-4xl h-100 mt-32 mx-auto  p-4 bg-white shadow-lg rounded-xl">
        <h2 className="text-4xl font-semibold mb-6 text-blue-600 montserrat-font-medium">
          Your Documents
        </h2>

        {documents.length === 0 ? (
          <div>
            <p className="text-gray-600 montserrat-font-medium">No documents uploaded yet.</p>
            <button className="rounded-2xl bg-blue-500 px-2 py-1 montserrat-font-medium text-lg mt-2 cursor-pointer text-white" onClick={() => router.push("/upload")}>
              Upload
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc._id}
                className="border p-4 rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    Type: {doc.documentType} | Uploaded:{" "}
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-green-600">
                    {doc.status === "processed" ? "Processed" : "Pending"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IconTrash size={20} />
                  </button>
                  {/* You can add a modal or view page here */}
                  <button className="text-blue-500 hover:text-blue-700">
                    <IconEye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
