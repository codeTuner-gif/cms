import React, { useState, useEffect } from "react";
import {
  gellAllreviewersBeforDate,
  getalltracks,
  getallreviewersbytrack,
} from "../services/ConferenceServices";
import { createReviewers } from "../services/ConferenceServices";
import { useNavigate } from "react-router-dom";
import homeIcon from "../assets/home36.png";

function ReviewersRegistration() {
  const [oldmembers, setOldmembers] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [country, setCountry] = useState("");
  const [mobile, setMobile] = useState("");
  const [googleScholarId, setGoogleScholarId] = useState("");
  const [orcidId, setOrcidId] = useState("");
  const [reviewers, setReviewers] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState({ id: "", name: "" });
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [conference_name, setConference_name] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTrackName, setSelectedTrackName] = useState("");
  const [existingreviewers, setExistingreviewers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]);

  const [data, SetData] = useState(true);

  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!selectedTrack.id) {
    //   alert("select track first");
    //   return;
    // }
    const formData = {
      name,
      email,
      affiliation,
      country,
      mobile,
      googleScholarId,
      orcidId,
    };

    const isEmailExist = reviewers.some(
      (reviewer) => reviewer.email === formData.email
    );

    if (isEmailExist) {
      alert("Email already exists! Please use a different email.");
      return;
    }
    setReviewers([...reviewers, formData]);

    // if (isEditing) {
    //   // Edit mode - Update reviewer details
    //   setReviewers(
    //     reviewers.map((reviewer) =>
    //       reviewer.email === email ? { ...reviewer, ...formData } : reviewer
    //     )
    //   );
    //   setIsEditing(false); // Reset after editing
    // } else {
    //   // Add new reviewer

    // }

    // Clear form data
    // clearForm();
  };

  // const clearForm = () => {
  //   setName("");
  //   setEmail("");
  //   setAffiliation("");
  //   setCountry("");
  //   setMobile("");
  //   setGoogleScholarId("");
  //   setOrcidId("");
  // };

  useEffect(() => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      getalltracks(conference_id)
        .then((res) => {
          setTracks(res.data.tracks);
          setConference_name(res.data.conferenceName);
          SetData(false);
        })
        .catch((err) => {});
    } else {
      setShowPopup(true);
    }
  }, []);

  const handleTrackChange = (event) => {
    const selectedTrackId = event.target.value;
    const selectedTrack = tracks.find((track) => track._id === selectedTrackId);
    setSelectedTrack({ id: selectedTrack._id, name: selectedTrack.track_name });
    getallreviewersbytrack(selectedTrackId)
      .then((res) => {
        setExistingreviewers(res.data);
      })
      .catch((err) => {});
  };

  const finalsave = () => {
    // if (!selectedTrack.id) {
    //   alert("select track first");
    //   return;
    // }
    const transformedData = {
      reviewers: reviewers.map((item) => ({
        name: item.name,
        affiliation: item.affiliation,
        country: item.country,
        mobile: item.mobile,
        email: item.email,
        tracks: selectedTracks
      })),
    };
    // console.log(selectedTrack.id);
    // console.log(selectedTracks); 
    console.log(transformedData);

    createReviewers(transformedData, selectedTrack.id)
      .then((Response) => {
        // Clear form data
        setName("");
        setEmail("");
        setAffiliation("");
        setCountry("");
        setMobile("");
        setGoogleScholarId("");
        setOrcidId("");

        // Update existing reviewers with new data from the response
        if (Response.data && Response.data.reviewers) {
          // Use functional state update to ensure the existing state is captured correctly
          setExistingreviewers((prevReviewers) => [
            ...prevReviewers,
            ...Response.data.reviewers,
          ]);
        }

        // Clear the reviewers state (form data)
        setReviewers([]);
        handleSuccess();

        console.log("Reviewers added successfully:", Response.data);
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          alert(err.response.data.errors[0].error);
        }
      });
   };

  const finalEdit = () => {
    const formData = {
      id,
      name,
      email,
      affiliation,
      country,
      mobile,
      googleScholarId,
      orcidId,
    };
    console.log(formData);
    // console.log(members._id);
    // Update the reviewers state with the edited data
    setReviewers(
      reviewers.map((reviewer) =>
        reviewer.email === email ? { ...reviewer, ...formData } : reviewer
      )
    );
    setIsEditing(false); // Reset after editing
  };

  const handleRedirect = () => {
    // history.push('/another-page'); // Change '/another-page' to the actual path you want to redirect to
    navigate("/select-conference");
  };

  // Function to show success message
  const handleSuccess = () => {
    setSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000); // 3000ms = 3 seconds
  };

  const getoldreviewers = () => {
    const conference_id = sessionStorage.getItem("con");
    if (conference_id) {
      gellAllreviewersBeforDate(conference_id)
        .then((res) => {
          setOldmembers(res.data);
        })
        .catch((err) => {});
    }
  };

  const handleAddClick = () => {
    if (!selectedTrack.id) {
      alert("select track first");
      return;
    }
    const selectedMembers = oldmembers.filter((member) =>
      selectedRows.includes(member._id)
    );

    const duplicateMembers = selectedMembers.filter((member) =>
      reviewers.some((existingMember) => existingMember._id === member._id)
    );

    if (duplicateMembers.length > 0) {
      window.alert("Some of the selected members are already added.");
    } else {
      setReviewers((prevMembers) => [...prevMembers, ...selectedMembers]);
      console.log(selectedMembers); // or process the selected members as needed
    }
    setSelectedRows([]);
  };

  const handleRowClick = (member) => {
    setId(member._id);
    setName(member.name);
    setEmail(member.email);
    setAffiliation(member.affiliation || "");
    setCountry(member.country || "");
    setMobile(member.mobile || "");
    setGoogleScholarId(member.googleScholarId || "");
    setOrcidId(member.orcidId || "");
    setIsEditing(true);
  };

  const handleRowClick2 = (member) => {
    if (selectedRows.includes(member._id)) {
      setSelectedRows(selectedRows.filter((id) => id !== member._id));
    } else {
      setSelectedRows([...selectedRows, member._id]);
    }
  };

  const deleteEach = (email) => {
    setReviewers(reviewers.filter((member) => member.email !== email));
    //console.log(email);
  };

  const handleTrackSelect = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedTracks((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedTracks((prevSelected) =>
        prevSelected.filter((id) => id !== value)
      );
    }
  };

  const redirectToHome = () => {
    navigate("/select-conference"); //redirection by home icon
  };

  const toSentenceCase = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="w-full h-full border border-3 shadow-sm p-3 mb-5 bg-body-tertiary rounded overflow-auto bg-slate-50">
      {/* Home Icon and Title in One Line */}
      <div className="relative flex items-center">
        <img
          src={homeIcon}
          alt="Home"
          className="cursor-pointer w-8 h-8"
          onClick={redirectToHome}
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 text-4xl">
          <u>Include the Reviewers</u>
        </div>
      </div>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-4">
              Conference ID Missing
            </h2>
            <p className="mb-4">Please select a conference to proceed.</p>
            <button
              onClick={handleRedirect}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Go to Conference Selection
            </button>
          </div>
        </div>
      )}
      {data ? (
        <div>Loading..</div>
      ) : (
        <>
          <div className="md:flex justify-between">
            <div className="m-2 md:m-4">
              <h2 className="text-xl md:text-2xl text font-semibold text-black">
                Conference Name : {toSentenceCase(conference_name)}
              </h2>
            </div>
            <div>
              <label
                htmlFor="expectedSubmissions"
                className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
              >
                <span className="text-xs font-medium text-gray-700">
                  Select Track
                </span>
                <select
                  id="expectedSubmissions"
                  name="expectedSubmissions"
                  className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                  value={selectedTrack.id}
                  onChange={handleTrackChange}
                  required
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {tracks.map((track) => (
                    <option key={track._id} value={track._id}>
                      {toSentenceCase(track.track_name)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div>
            {/* row1 */}
            <form onSubmit={handleSubmit}>
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Name<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Email<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
              </div>

              {/* row2 */}
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                <div className="flex-1">
                  <label
                    htmlFor="affiliation"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Affiliation<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="affiliation"
                      name="affiliation"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="country"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Country<span style={{ color: "red" }}>*</span>
                    </span>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="mobile"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Mobile
                    </span>
                    <input
                      type="text"
                      id="mobile"
                      name="mobile"
                      className="mt-1 w-full border-none p- 0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      // required
                    />
                  </label>
                </div>
              </div>

              {/* row3 */}
              <div className="p-3 space-y-4 md:space-y-0 md:space-x-4 md:flex">
                <div className="flex-1">
                  <label
                    htmlFor="googleScholarId"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      Google Scholar ID
                      {/* <span style={{ color: 'red' }}>*</span> */}
                    </span>
                    <input
                      type="text"
                      id="googleScholarId"
                      name="googleScholarId"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={googleScholarId}
                      onChange={(e) => setGoogleScholarId(e.target.value)}
                      // required
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="orcidId"
                    className="block overflow-hidden rounded-md border border-gray-200 px-3 py-2 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
                  >
                    <span className="text-xs font-medium text-gray-700">
                      ORCID ID
                      {/* <span style={{ color: 'red' }}>*</span> */}
                    </span>
                    <input
                      type="text"
                      id="orcidId"
                      name="orcidId"
                      className="mt-1 w-full border-none p-0 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      value={orcidId}
                      onChange={(e) => setOrcidId(e.target.value)}
                      // required
                    />
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">
                  Select Tracks for Reviewers:
                </h3>
                <div className="flex flex-wrap space-x-4 mt-2">
                  {tracks.map((track) => (
                    <div key={track._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={track._id}
                        value={track._id}
                        checked={selectedTracks.includes(track._id)}
                        onChange={handleTrackSelect}
                        className="mr-2"
                      />
                      <label htmlFor={track._id} className="text-gray-700">
                        {toSentenceCase(track.track_name)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center mt-3">
                {isEditing ? (
                  <button
                    className="inline-block rounded border border-indigo-600 bg-slate-300 px-7 py-2 text-sm font-medium text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="button"
                    onClick={finalEdit}
                  >
                    Edit
                  </button>
                ) : (
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                  >
                    Add
                  </button>
                )}
              </div>
            </form>
          </div>
          {/* ----------Old Reviewrs--------- */}
          <div className="w-full h-auto md:flex">
            <div className="mt-4 w-full h-96 border border-3 shadow-sm">
              <div className="text-center text-xl font-semibold">
                <h2>Reviewers List</h2>
              </div>

              {/* for old members table */}
              <div className="mt-2  w-full h-72 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {oldmembers.map((member) => (
                      <tr
                        key={member.id}
                        onClick={() => {
                          handleRowClick(member);
                          handleRowClick2(member);
                        }}
                        className={`cursor-pointer ${
                          selectedRows.includes(member._id) ? "bg-gray-200" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(member.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* for button */}
              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={getoldreviewers}
                  >
                    Reviewers List
                  </button>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={handleAddClick}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>

            {/* -----------------Reviewers----------------- */}
            <div className="mt-4 w-full h-96 border border-3 shadow-sm">
              <div className="text-center text-xl font-semibold">
                <h2>Reviewers For {toSentenceCase(selectedTrack.name)} </h2>
              </div>
              {success && (
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
                  <span className="font-medium">Success!</span> Reviewers Added
                  successfully!
                </div>
              )}

              <div className="mt-2  w-full h-72 overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      ></th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {existingreviewers.map((reviewer) => (
                      <tr
                        key={reviewer.email}
                        onClick={() => handleRowClick(reviewer)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(reviewer.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reviewer.email}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          // onClick={() => removeCommittee(committee.id)}
                          className="text-red-600 hover:text-red-900"
                          onClick={()=>deleteEach(reviewer.email)}
                          >
                          ✖
                        </button>
                        </td> */}
                      </tr>
                    ))}

                    {/* ---------------------------- */}
                    {reviewers.map((reviewer) => (
                      <tr key={reviewer.email}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {toSentenceCase(reviewer.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {reviewer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            // onClick={() => removeCommittee(committee.id)}
                            className="text-red-600 hover:text-red-900"
                            onClick={() => deleteEach(reviewer.email)}
                          >
                            ✖
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-center gap-3">
                <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={finalsave}
                  >
                    Save
                  </button>
                </div>
                {/* <div className="flex items-center justify-center mt-3">
                  <button
                    className="inline-block rounded border border-indigo-600 bg-indigo-600 px-7 py-2 text-sm font-medium  bg-slate-300 text-black hover:bg-slate-500 hover:text-white focus:outline-none focus:ring active:text-indigo-500"
                    type="submit"
                    onClick={() => {
                      setReviewers([]);
                    }}
                  >
                    Close
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewersRegistration;
