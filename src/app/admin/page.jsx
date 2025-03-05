'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { NavbarDemo } from '../components/Navbar';
import Auth from '../components/Auth';

const Page = () => {
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Handles successful authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // Function to fetch messages from the API
  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/get_message', {
        headers: { "Cache-Control": "no-cache" } // Prevent caching
      });
      setMessages(response.data); // Update state with latest messages
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Function to delete a message
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete_message/${id}`);
      fetchMessages(); // Refetch messages after deletion
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  // Fetch messages when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages();
    }
  }, [isAuthenticated]);

  return (
    <>
      {!isAuthenticated ? (
        <Auth onSuccess={handleAuthSuccess} />
      ) : (
        <>
          <NavbarDemo />
          <section className="mx-auto w-full max-w-7xl px-4 py-4 mt-20">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="mt-1 text-sm text-gray-700">
                  This is a list of all messages. You can view and manage messages here.
                </p>
              </div>
              {/* Refresh Button */}
              <button
                onClick={fetchMessages}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Refresh Messages
              </button>
            </div>
            <div className="mt-6 flex flex-col">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden md:rounded-lg">
                    <table className="min-w-full divide-y divide-zinc-800">
                      <thead className="bg-transparent">
                        <tr>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-slate-300">Id</th>
                          <th className="px-12 py-3.5 text-left text-sm font-normal text-slate-300">Message</th>
                          <th className="px-4 py-3.5 text-left text-sm font-normal text-slate-300">Date</th>
                          <th className="relative px-4 py-3.5">
                            <span className="sr-only">Delete</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800 bg-transparent">
                        {messages.map((message) => (
                          <tr key={message._id}>
                            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-slate-300">
                              {message._id}
                            </td>
                            <td className="whitespace-nowrap px-12 py-4 text-sm text-slate-300">
                              {message.message}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-300">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-medium">
                              <button
                                onClick={() => handleDelete(message._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Page;