// Conference selction page
import React, { useEffect, useState } from "react";
import { getAllConference } from "../services/ConferenceServices";
import {
  getConferenceById,
  editConference,
} from "../services/ConferenceServices";

function ConferenceSelection() {
  const [conferences, setConference] = useState([]);
  const [selectedconference, setSelectedConference] = useState([]);
  const [temp, setTemp] = useState();
  const [data, SetData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    getAllConference()
      .then((Response) => {
        setConference(Response.data);
        SetData(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getConferenceById(conference_id)
        .then((Response) => {
          setSelectedConference(Response.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setTemp(0);
  }, [temp]);

  const handleConferenceChange = (event) => {
    const selectedConferenceId = event.target.value;
    //console.log(selectedConferenceId);
    sessionStorage.setItem("con", selectedConferenceId);
    const selected = conferences.find(
      (con) => con._id === selectedConferenceId
    );
    setSelectedConference(selected || {});
    // alert("conference set successfully done");
    // getSelectedConference();
    setTemp(1);
  };
  // const getSelectedConference=()=>{
  //   const conference_id=sessionStorage.getItem('con');
  //   console.log(conference_id);
  //   if (conference_id) {
  //     getConferenceByid(conference_id).then((Response)=>{
  //       Setselectedconference(Response.data);
  //     }).catch((err)=>{
  //        console.log(err);
  //     })
  //     //throw new Error('Conference ID not found in session storage.');
  //   }

  // };

  const toggleEdit = () => {
    if (isEditing) {
      // Save changes to the conference
      delete selectedconference.tracks;
      delete selectedconference.author_works;
      delete selectedconference.committee;
      editConference(selectedconference._id, selectedconference)
        .then(() => {
          setUpdateMessage("Conference updated successfully!");
          setIsEditing(!isEditing);
          setTimeout(() => {
            setUpdateMessage("");
          }, 2000); // hide the message after 2 seconds
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIsEditing(!isEditing);
      console.log(selectedconference);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedConference((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="w-full h-full border-3 shadow-sm p-3 mb-5 bg-slate-50 rounded-lg overflow-auto">
      {data ? (
        <div>Loading..</div>
      ) : (
        <div className="flex flex-col md:flex-row">
          {/* Column 1 */}
          <div className="md:w-1/4 w-full p-4 h-full overflow-auto mt-4">
            <div>
              <label
                htmlFor="expectedSubmissions"
                className="block overflow-hidden rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Select Conference
                </span>
                <select
                  id="expectedSubmissions"
                  name="expectedSubmissions"
                  onChange={handleConferenceChange}
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  defaultValue="" // Ensure proper default selection
                >
                  <option value="" selected>
                    Select an option
                  </option>
                  {conferences.map((con) => (
                    <option key={con._id} value={con._id}>
                      {con.conference_title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <button
            onClick={toggleEdit}
            className="fixed bottom-10 left-46 inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
          >
            {isEditing ? "Save" : "Edit"}
          </button>

          {/* Column 2 */}
          <div className="md:w-3/4 w-full bg-white p-4 border border-zinc-700 rounded h-full mt-4">
            <div className="flex items-center justify-center text-4xl mb-4">
              <u>Complete / Edit the Conference Details</u>
            </div>
            <form className="space-y-6 m-3 p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="conferenceTitle"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Conference Title
                    </span>
                    <input
                      type="text"
                      id="conferenceTitle"
                      name="conference_title"
                      value={selectedconference.conference_title}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="shortName"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Short Name
                    </span>
                    <input
                      type="text"
                      id="shortName"
                      name="short_name"
                      value={selectedconference.short_name}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="website"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Website
                    </span>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={selectedconference.website}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="venue"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Venue
                    </span>
                    <input
                      type="text"
                      id="venue"
                      name="venue"
                      value={selectedconference.venue}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Address
                    </span>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={selectedconference.address}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="place"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Place
                    </span>
                    <input
                      type="text"
                      id="place"
                      name="place"
                      value={selectedconference.place}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      State
                    </span>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={selectedconference.state}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Country
                    </span>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={selectedconference.country}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      From Date
                    </span>
                    <input
                      type="date"
                      id="fromDate"
                      name="from_date"
                      value={
                        selectedconference.from_date
                          ? selectedconference.from_date.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="toDate"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      To Date
                    </span>
                    <input
                      type="date"
                      id="toDate"
                      name="to_date"
                      value={
                        selectedconference.to_date
                          ? selectedconference.to_date.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="dateOfCallForPaper"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Date Of Call For Paper
                    </span>
                    <input
                      type="date"
                      id="dateOfCallForPaper"
                      name="date_of_call_for_paper"
                      value={
                        selectedconference.date_of_call_for_paper
                          ? selectedconference.date_of_call_for_paper.split(
                              "T"
                            )[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="lastDateForSubmission"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Last Date For Submission Paper
                    </span>
                    <input
                      type="date"
                      id="lastDateForSubmission"
                      name="last_date_paper_sub"
                      value={
                        selectedconference.last_date_paper_sub
                          ? selectedconference.last_date_paper_sub.split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="expectedSubmissions"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      How Many Submissions Do You Expect
                    </span>
                    <input
                      id="expectedSubmissions"
                      name="number_of_papers"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                      value={selectedconference.number_of_papers}
                      onChange={handleInputChange} // Update the input on change
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="plagiarismCheck"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Plagiarism Website
                    </span>
                    <input
                      type="text"
                      id="plagiarismCheck"
                      name="plagiarismWebsite"
                      value={selectedconference.plagiarismWebsite}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
                <div>
                  <label
                    htmlFor="copyRightCheck"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Copyright Website
                    </span>
                    <input
                      type="text"
                      id="copyRightCheck"
                      name="copyrightWebsite"
                      value={selectedconference.copyrightWebsite}
                      onChange={handleInputChange} // Update the input on change
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
            </form>
            <div>
              {updateMessage && (
                <div
                  className="flex items-center justify-center p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-4.293-3.707a1 1 0 00-1.414 0L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l5-5a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="font-medium">Success!</span> {updateMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConferenceSelection;
