import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import CreateConference from './components/ConferenceCreation';
import SelectConference from './components/ConferenceSelection';
import ReviewerInvitation from './components/ReviewInvitetion';
import AllotPaper from './components/AllotPaper';
import ReviewFormat from './components/ReviewFormat';
import Report from './components/Report';
import Committee from './components/Committee';
import MemberRegistration from './components/MemberRegistration';
import TrackRegistration from './components/TrackRegistration';
import PaperDetails from './components/PaperDetails';
import Listpapers_report from './components/Listpapers_report';
import Authorwisepapers from './components/Authorwisepapers';
import Trackwisepapers from './components/Trackwisepapers';
import List_committee_members from './components/List_committee_members';
import Papers_status_last_upload_date from './components/Papers_status_last_upload_date';
import Listoffirstauthors from './components/Listoffirstauthors';
import Listofreviewers from './components/Listofreviewers';
import Tpcmembers from './components/Tpcmembers';
import Paper_sent_copy_right from './components/Paper_sent_copy_right';
import Papers_with_reviewers from './components/Papers_with_reviewers';
import Listofallauthors from './components/Listofallauthors';
import Paper_allot_reviewer_report from './components/Paper_allot_reviewer_report';
import ReviewersRegistration from './components/ReviewersRegistration';
import AuthorRegistration from './components/AuthorRegistration';
import ReviewPaper from './components/ReviewPaper';
import ListCommittee from './components/ListCommittee';
import Listofallmembers from './components/Listofallmembers';
import CommitteewiseMembers from './components/CommitteewiseMembers';
import Reviewerwisepapers from './components/Reviewerwisepapers';
import Paperswithplagiarism from './components/Paperswithplagiarism';
import Papercopyright from './components/Papercopyright';
import DecisionWiseListOfPapers from './components/DecisionWiseListOfPapers';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/authors-registration"
          element={<AuthorRegistration />}
        />
        <Route
          path="/review-format"
          element={<ReviewPaper />}
        />
        <Route
          path="/*"
          element={
            <div className="flex">
              <Sidebar />
              <div className="h-screen flex-1 p-7">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/create-conference" element={<CreateConference />} />
                  <Route path="/select-conference" element={<SelectConference />} />
                  <Route path="/committee" element={<Committee />} />
                  <Route path="/members" element={<MemberRegistration />} />
                  <Route path="/tracks" element={<TrackRegistration />} />
                  <Route path="/reviewers-registration" element={<ReviewersRegistration />} />
                  <Route path="/reviewer-invitation" element={<ReviewerInvitation />} />
                  <Route path="/allot-paper" element={<AllotPaper />} />
                  <Route path="/review-format" element={<ReviewFormat />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/listofpapers" element={<Listpapers_report />} />
                  <Route path="/authorwisepapers" element={<Authorwisepapers />} />
                  <Route path="/trackwisepapers" element={<Trackwisepapers />} />
                  <Route path="/paperdetails" element={<PaperDetails />} />
                  <Route path="/list_committee_members" element={<List_committee_members />} />
                  <Route path="/papers_status_last_upload_date" element={<Papers_status_last_upload_date />} />
                  <Route path="/listoffirstauthors" element={<Listoffirstauthors />} />
                  <Route path="/listofreviewers" element={<Listofreviewers />} />
                  <Route path="/tpcmembers" element={<Tpcmembers />} />
                  <Route path="/paper_sent_copy_right" element={<Paper_sent_copy_right />} />
                  <Route path="/papers_with_reviewers" element={<Papers_with_reviewers />} />
                  <Route path="/listofallauthors" element={<Listofallauthors />} />
                  <Route path="/paper_allot_reviewer_report" element={<Paper_allot_reviewer_report />} />
                  <Route path="/listcommittee" element={<ListCommittee />} />
                  <Route path="/listofallmembers" element={<Listofallmembers />} />
                  <Route path="/CommitteewiseMembers" element={<CommitteewiseMembers />} />
                  <Route path="/Reviewerwisepapers" element={<Reviewerwisepapers />} />
                  <Route path="/Paperswithplagiarism" element={<Paperswithplagiarism />} />
                  <Route path="/Papercopyright" element={<Papercopyright />} />
                  <Route path="/DecisionWiseListOfPapers" element={<DecisionWiseListOfPapers />} />
                  <Route path="/Login" element={<Login />} />
                  <Route path="/Register" element={<Register />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;