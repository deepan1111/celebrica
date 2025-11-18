// src/pages/admin/ManageContacts.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  Mail,
  Trash2,
  Search,
  Calendar,
  User,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";

export default function ManageContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    // Filter contacts based on search term
    const filtered = contacts.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const contactsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContacts(contactsList);
      setFilteredContacts(contactsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact message?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "contacts", contactId));
      setContacts(contacts.filter((contact) => contact.id !== contactId));
      toast.success("Contact deleted successfully");
      setSelectedContact(null);
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Failed to delete contact");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Manage Contacts</h1>
                <p className="text-blue-100 mt-1">
                  View and manage customer inquiries
                </p>
              </div>
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-lg">
              <p className="text-sm">Total Messages</p>
              <p className="text-2xl font-bold">{contacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Mail size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm ? "No contacts found" : "No contact messages yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Customer inquiries will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contacts List */}
            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${
                    selectedContact?.id === contact.id
                      ? "ring-2 ring-blue-500 border-blue-500"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    <span>{formatDate(contact.timestamp)}</span>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="lg:sticky lg:top-8 h-fit">
              {selectedContact ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Message Details
                    </h2>
                    <button
                      onClick={() => handleDelete(selectedContact.id)}
                      className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          Full Name
                        </span>
                      </div>
                      <p className="text-gray-800 ml-6">
                        {selectedContact.firstName} {selectedContact.lastName}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          Email Address
                        </span>
                      </div>
                      <p className="text-gray-800 ml-6">
                        {selectedContact.email}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          Received On
                        </span>
                      </div>
                      <p className="text-gray-800 ml-6">
                        {formatDate(selectedContact.timestamp)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare size={18} className="text-blue-600" />
                        <span className="font-semibold text-gray-700">
                          Message
                        </span>
                      </div>
                      <p className="text-gray-800 ml-6 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>

                    <div className="pt-4">
                      <a
                        href={`mailto:${selectedContact.email}?subject=Re: Your inquiry&body=Hello ${selectedContact.firstName},`}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        <Mail size={18} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a Contact
                  </h3>
                  <p className="text-gray-500">
                    Click on a contact message to view full details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}